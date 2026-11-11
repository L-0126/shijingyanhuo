PB.Tour = (() => {
    const CHAPTER_DURATION = 18;
    const TOTAL_DURATION = CHAPTER_DURATION * CITY_BOOK.chapters.length;
    const BAR = document.querySelector('#tour-bar');
    const CAPTION = BAR.querySelector('#tour-caption');
    const SEEK = BAR.querySelector('#tour-seek');
    const TIME = BAR.querySelector('#tour-time');
    const PAUSE = BAR.querySelector('[data-action="tour-pause"]');
    const actions = [
        [2.5, 7.2, 7.9],
        [3, 14.7, 16],
        [8.6, 15.5, 16.4],
        [2.5, 7.4, 8.1],
        [2.5, 14.9, 16.2]
    ];
    // Section indices follow the subjects on the left and right sides of each spread.
    const sections = [[0, 2], [0, 1], [0, 1], [1, 2], [0, 3]];
    let isRunning = false;
    let isPaused = false;
    let isReplay = false;
    let replayChapter = 1;
    let elapsed = 0;
    let scrubTime = null;
    let previousTime = performance.now();
    let activeChapter = 0;
    let lastReadingCue;

    function duration() {
        return isReplay ? CHAPTER_DURATION : TOTAL_DURATION;
    }

    function chapterAt(time) {
        return isReplay ? replayChapter :
            Math.min(CITY_BOOK.chapters.length, Math.floor(time / CHAPTER_DURATION) + 1);
    }

    function chapterOffset(chapter, time = elapsed) {
        return PB.clamp(time - (isReplay ? 0 : (chapter - 1) * CHAPTER_DURATION), 0, CHAPTER_DURATION);
    }

    function enterChapter(chapter, immediate = false) {
        activeChapter = chapter;
        PB.Shell.navigate({view: 'scene', chapter}, {tour: true, keepScroll: true, replace: true, immediate});
        PB.Story.reset(true);
    }

    function isDrivingStory() {
        return isRunning && !isPaused && scrubTime === null;
    }

    function isReadingAlong() {
        return isDrivingStory() && !isReplay;
    }

    function applyFrame(immediate = false) {
        if(PB.Engine.getChapter() !== activeChapter || !PB.Engine.isReady()) return;
        const offset = chapterOffset(activeChapter);
        const [begin, finish, done] = actions[activeChapter - 1];
        const fraction = PB.clamp((offset - begin) / (finish - begin), 0, 1);
        const phase = offset < begin ? 'intro' : offset < finish ? 'active' : offset < done ? 'ready' : 'done';
        const tea = activeChapter === 3;
        const round = tea && fraction >= .5 ? 1 : 0;
        const progress = tea ? PB.clamp(fraction * 2 - round, 0, 1) : fraction;
        PB.Story.applyTourFrame({
            phase, progress, round, paused: false, input: 0, velocity: 0,
            angle: tea && phase === 'active' ? .76 : 0,
            movement: phase === 'active' ? Math.sin(Math.PI * fraction) : 0,
            hasGift: activeChapter === 5 && offset >= 15.5
        }, immediate);
        PB.Camera.guide(activeChapter, offset, immediate);
    }

    function syncReading(open = false, immediate = false) {
        if(isReplay || !isRunning || PB.Engine.getChapter() !== activeChapter) return;
        const offset = chapterOffset(activeChapter);
        const side = PB.Camera.guideSide(activeChapter, offset);
        const section = sections[activeChapter - 1][side];
        const cue = activeChapter + ':' + section;
        if(cue === lastReadingCue && !open && !immediate) return;
        lastReadingCue = cue;
        window.dispatchEvent(new CustomEvent('tour-reading', {
            detail: {chapter: activeChapter, section, open, immediate}
        }));
    }

    function seekTo(time) {
        if(!isRunning || !Number.isFinite(time)) return;
        scrubTime = null;
        elapsed = PB.clamp(time, 0, duration());
        const chapter = chapterAt(elapsed);
        if(PB.Shell.getRoute().view !== 'scene' || PB.Shell.getRoute().chapter !== chapter ||
            PB.Engine.getChapter() !== chapter || !PB.Engine.isReady()) {
            enterChapter(chapter, true);
        } else activeChapter = chapter;
        if(elapsed >= duration()) isPaused = true;
        applyFrame(true);
        PB.setPaused(isPaused);
        previousTime = performance.now();
        syncReading(true, true);
        render();
    }

    function start(chapter = 1, replay = false) {
        isRunning = true;
        isPaused = false;
        isReplay = replay;
        replayChapter = chapter;
        elapsed = replay ? 0 : (chapter - 1) * CHAPTER_DURATION;
        scrubTime = null;
        lastReadingCue = undefined;
        previousTime = performance.now();
        BAR.hidden = false;
        BAR.setAttribute('aria-label', replay ? '复看本章故事' : '90 秒漫游控制');
        SEEK.max = String(duration());
        document.body.classList.add('has-tour');
        enterChapter(chapter, true);
        applyFrame(true);
        syncReading(true);
        render();
    }

    function stop() {
        isRunning = false;
        isPaused = false;
        scrubTime = null;
        BAR.hidden = true;
        document.body.classList.remove('has-tour');
        window.dispatchEvent(new Event('tour-reading-cancel'));
        PB.Story.cancelInput();
        PB.Camera.releaseGuide();
        PB.setPaused(PB.Story.getState().paused);
    }

    function manualPause() {
        if(!isRunning || isPaused) return;
        isPaused = true;
        scrubTime = null;
        window.dispatchEvent(new Event('tour-reading-cancel'));
        PB.Story.cancelInput();
        PB.Camera.releaseGuide();
        PB.setPaused(false);
        render();
        PB.Shell.showNotice('导览已暂停，现在由你来接着操作。');
    }

    function toggle() {
        if(!isRunning) return;
        if(elapsed >= duration()) {
            isPaused = false;
            seekTo(0);
            return;
        }
        isPaused = !isPaused;
        if(!isPaused && (PB.Shell.getRoute().view !== 'scene' || PB.Shell.getRoute().chapter !== activeChapter)) {
            seekTo(elapsed);
            return;
        }
        PB.setPaused(isPaused);
        previousTime = performance.now();
        if(!isPaused) syncReading(true);
        render();
    }

    function jump(direction) {
        seekTo(elapsed + direction * 6);
    }

    function formatTime(seconds) {
        const whole = Math.floor(seconds);
        return Math.floor(whole / 60) + ':' + String(whole % 60).padStart(2, '0');
    }

    function render() {
        const time = scrubTime ?? elapsed;
        const chapter = scrubTime !== null ? chapterAt(time) :
            isReadingAlong() ? PB.Engine.getChapter() : activeChapter;
        const caption = PB.Camera.guideCaption(chapter, chapterOffset(chapter, time));
        const label = formatTime(time) + ' / ' + formatTime(duration());
        const spoken = Math.floor(time) + ' 秒，共 ' + duration() + ' 秒';
        const pauseLabel = elapsed >= duration() ? '重播' : isPaused ? '继续' : '暂停';
        if(CAPTION.textContent !== caption) CAPTION.textContent = caption;
        if(TIME.textContent !== label) TIME.textContent = label;
        if(SEEK.getAttribute('aria-valuetext') !== spoken) SEEK.setAttribute('aria-valuetext', spoken);
        if(PAUSE.textContent !== pauseLabel) PAUSE.textContent = pauseLabel;
        if(scrubTime === null) SEEK.value = String(time);
    }

    SEEK.addEventListener('input', () => {
        if(!isRunning) return;
        scrubTime = Number(SEEK.value);
        PB.setPaused(true);
        render();
    });
    function commitScrub() {
        if(scrubTime !== null) seekTo(scrubTime);
    }
    SEEK.addEventListener('change', commitScrub);
    SEEK.addEventListener('blur', commitScrub);
    SEEK.addEventListener('pointercancel', commitScrub);

    function tick(now) {
        const delta = PB.clamp((now - previousTime) / 1000, 0, .1);
        previousTime = now;
        if(isDrivingStory() && !document.hidden) {
            elapsed = Math.min(duration(), elapsed + delta);
            const chapter = chapterAt(elapsed);
            if(chapter !== activeChapter) enterChapter(chapter);
            applyFrame();
            syncReading();
            if(elapsed >= duration()) {
                isPaused = true;
                PB.setPaused(true);
            }
            render();
        }
        requestAnimationFrame(tick);
    }

    window.addEventListener('story-manual', manualPause);
    document.addEventListener('visibilitychange', () => {
        previousTime = performance.now();
    });
    requestAnimationFrame(tick);
    return {start, stop, toggle, manualPause, isDrivingStory, isReadingAlong, previous: () => jump(-1),
        next: () => jump(1), replay: chapter => start(chapter, true),
        getState: () => ({isRunning, isPaused, elapsed, activeChapter})};
})();
