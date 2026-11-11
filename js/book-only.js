(() => {
    if(window.BOOK_EDITION !== 'v10') return;

    const body = document.body;
    const panel = document.querySelector('#story-panel');
    const nearProps = document.querySelector('#close-props');
    nearProps.setAttribute('role', 'group');
    nearProps.setAttribute('aria-label', '近处纸件，可拖动或用方向键操作');
    panel.insertAdjacentHTML('afterbegin',
        '<button class="book-note-close" aria-label="收起故事纸签">×</button>');
    const tip = document.createElement('p');
    tip.className = 'book-gesture-tip';
    tip.textContent = '轻点书中人物，也可以从这里接下故事。';
    document.querySelector('#story-dialogue').after(tip);
    let gesture = null;
    let suppressClick = false;
    let previousChapter = PB.Shell.getRoute().chapter;
    let previousPhase = '';
    const intro = document.querySelector('#book-intro');
    const introLaunch = document.querySelector('.intro-launch');
    const introClose = intro.querySelector('.intro-close');
    const reader = intro.querySelector('.intro-content');
    const readingChapters = document.querySelector('#scroll-chapters');
    const articles = document.querySelector('#scroll-articles');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let readingChapter;
    let readingFrame;
    let tourScroll;
    let tourScrollFrame;
    let storyReturnFocus;

    function setIntroOpen(open, focus = false) {
        if(!open && PB.Tour.isReadingAlong()) PB.Tour.manualPause();
        intro.hidden = !open;
        intro.inert = !open;
        body.classList.toggle('book-reading-open', open);
        introLaunch.setAttribute('aria-expanded', String(open));
        if(focus) (open ? introClose : introLaunch).focus({preventScroll: true});
    }

    function markReadingChapter(chapter) {
        readingChapter = chapter;
        for(const link of readingChapters.children) {
            if(Number(link.dataset.chapter) === chapter) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        }
    }

    function readingAnchor(chapter, section) {
        const article = articles.querySelector(`[data-chapter="${chapter}"]`);
        return section !== undefined ?
            article?.querySelector('#section-' + chapter + '-' + CSS.escape(section)) || article : article;
    }

    function readingPosition(anchor, inset = 22) {
        const offset = anchor.getBoundingClientRect().top - reader.getBoundingClientRect().top - inset;
        return PB.clamp(reader.scrollTop + offset, 0, reader.scrollHeight - reader.clientHeight);
    }

    function readAt(chapter, section) {
        const anchor = readingAnchor(chapter, section);
        if(!anchor) return;
        reader.scrollTop = readingPosition(anchor);
        markReadingChapter(chapter);
    }

    function selectFromReader(chapter, replace = false) {
        const route = PB.Shell.getRoute();
        if(route.view === 'scene' && chapter !== route.chapter) {
            PB.Shell.navigate({view: 'scene', chapter}, {keepScroll: true, replace});
        }
    }

    function syncBookToReader() {
        readingFrame = undefined;
        if(intro.hidden || PB.Tour.isReadingAlong() || tourScroll || PB.Shell.getRoute().view !== 'scene' ||
            document.querySelector('dialog[open]')) return;
        const start = reader.getBoundingClientRect().top + Math.min(90, reader.clientHeight / 4);
        const article = [...articles.children].findLast(item =>
            item.getBoundingClientRect().top <= start) || articles.firstElementChild;
        const chapter = Number(article.dataset.chapter);
        if(chapter === readingChapter) return;
        markReadingChapter(chapter);
        selectFromReader(chapter, true);
    }

    function cancelTourScroll() {
        if(tourScrollFrame !== undefined) cancelAnimationFrame(tourScrollFrame);
        tourScrollFrame = undefined;
        tourScroll = undefined;
    }

    function moveTourScroll(now) {
        tourScrollFrame = undefined;
        if(!tourScroll) return;
        if(intro.hidden || !PB.Tour.isReadingAlong() || document.hidden) {
            tourScroll.lastTime = undefined;
            return;
        }
        if(tourScroll.lastTime !== undefined) tourScroll.elapsed += Math.min(now - tourScroll.lastTime, 50);
        tourScroll.lastTime = now;
        const progress = PB.clamp(tourScroll.elapsed / tourScroll.duration, 0, 1);
        reader.scrollTop = PB.lerp(tourScroll.from, tourScroll.to, PB.ease(progress));
        if(progress < 1) tourScrollFrame = requestAnimationFrame(moveTourScroll);
        else tourScroll = undefined;
    }

    function followTourReading({detail: {chapter, section, open, immediate}}) {
        if(open && intro.hidden) setIntroOpen(true);
        if(intro.hidden) return;
        const anchor = readingAnchor(chapter, section);
        if(!anchor) return;
        markReadingChapter(chapter);
        if(immediate || reducedMotion.matches) {
            cancelTourScroll();
            reader.scrollTop = readingPosition(anchor, 0);
            return;
        }
        if(tourScroll?.anchor !== anchor) {
            cancelTourScroll();
            const from = reader.scrollTop;
            const to = readingPosition(anchor, 0);
            const distance = Math.abs(to - from);
            if(distance < 1) return;
            tourScroll = {anchor, from, to, elapsed: 0, duration: Math.min(1100, 580 + distance * .18)};
        }
        if(tourScrollFrame === undefined) tourScrollFrame = requestAnimationFrame(moveTourScroll);
    }

    function pauseReadingTour() {
        cancelTourScroll();
        if(PB.Tour.isReadingAlong()) PB.Tour.manualPause();
    }

    function openRequestedReading() {
        const request = PB.Shell.takeReadingRequest();
        if(!request) return false;
        setIntroOpen(true);
        readAt(request.chapter, request.section);
        selectFromReader(request.chapter, true);
        return true;
    }

    intro.querySelector('.intro-tabs').append(readingChapters);
    reader.append(articles);
    introLaunch.addEventListener('click', () => {
        const {chapter} = PB.Shell.getRoute();
        setIntroOpen(true, true);
        if(readingChapter !== chapter) readAt(chapter);
    });
    introClose.addEventListener('click', () => setIntroOpen(false, true));
    reader.addEventListener('scroll', () => {
        if(readingFrame === undefined) readingFrame = requestAnimationFrame(syncBookToReader);
    }, {passive: true});
    reader.addEventListener('wheel', pauseReadingTour, {passive: true});
    reader.addEventListener('touchmove', pauseReadingTour, {passive: true});
    reader.addEventListener('keydown', event => {
        if(event.target === reader && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
            pauseReadingTour();
        }
    });
    reader.addEventListener('pointerdown', event => {
        if(event.target === reader && event.pointerType === 'mouse') pauseReadingTour();
    });
    readingChapters.addEventListener('click', event => {
        const link = event.target.closest('a[data-chapter]');
        if(!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        pauseReadingTour();
        const chapter = Number(link.dataset.chapter);
        readAt(chapter);
        selectFromReader(chapter);
    });
    intro.addEventListener('click', event => {
        if(event.target.closest('[data-enter-chapter]')) setIntroOpen(false);
    });
    window.addEventListener('show-book-reading', openRequestedReading);
    window.addEventListener('tour-reading', followTourReading);
    window.addEventListener('tour-reading-cancel', cancelTourScroll);
    document.addEventListener('visibilitychange', () => {
        if(!document.hidden && tourScroll && tourScrollFrame === undefined && PB.Tour.isReadingAlong()) {
            tourScrollFrame = requestAnimationFrame(moveTourScroll);
        }
    });
    window.addEventListener('book-ready', ({detail}) => {
        const route = PB.Shell.getRoute();
        if(!intro.hidden && !PB.Tour.isReadingAlong() && route.view === 'scene' &&
            detail.chapter === route.chapter && readingChapter !== detail.chapter) {
            readAt(detail.chapter);
        }
    });

    function setStoryOpen(isOpen, focus = false) {
        if(isOpen && focus && !body.classList.contains('book-story-open')) {
            storyReturnFocus = document.activeElement;
        }
        body.classList.toggle('book-story-open', isOpen);
        if(!focus) return;
        const target = isOpen ? document.querySelector('#story-primary') : storyReturnFocus;
        requestAnimationFrame(() => target?.focus({preventScroll: true}));
    }

    function syncRoute() {
        const route = PB.Shell.getRoute();
        const isScene = route.view === 'scene' ||
            (route.view === 'paper' && !document.querySelector('#experience').hidden);
        body.classList.toggle('book-only', isScene);
        if(!isScene && !intro.hidden) setIntroOpen(false);
        if(!isScene || route.chapter !== previousChapter) {
            setStoryOpen(false);
            stopGesture();
        }
        if(route.view === 'scene' && !intro.hidden && !PB.Tour.isReadingAlong() && readingChapter !== route.chapter) {
            readAt(route.chapter);
        }
        previousChapter = route.chapter;
        PB.Book.fit();
    }

    panel.querySelector('.book-note-close').addEventListener('click', () => setStoryOpen(false, true));
    window.addEventListener('focus-story', () => setStoryOpen(true, true));
    window.addEventListener('blur-story', () => setStoryOpen(false));
    window.addEventListener('camera-change', () => {
        const isFirst = PB.Camera.getMode() === 'first';
        nearProps.tabIndex = isFirst ? 0 : -1;
        nearProps.setAttribute('aria-hidden', String(!isFirst));
    });
    window.addEventListener('keydown', event => {
        if(event.key !== 'Escape' || !body.classList.contains('book-only') ||
            document.querySelector('dialog[open]')) return;
        if(body.classList.contains('book-story-open')) setStoryOpen(false, true);
        else if(!intro.hidden) setIntroOpen(false, true);
        else PB.Camera.setMode('overview');
    });

    window.addEventListener('story-change', event => {
        const state = event.detail;
        const instructions = [
            '在书里的厨师手边绕圈拖动，或按住下方按钮拌面。',
            '在书里的船身上向右拖住摇橹，松手后小船继续滑行。',
            '在书里的茶壶上向右拖动添茶，松手收壶；也可调节倾角。',
            '沿书里的缝纫机向右送布，针脚和飞轮一起动。',
            '拖住书里的归家人沿台阶前行，松手停步。'
        ];
        tip.textContent = state.phase === 'intro' ?
            '轻点书中人物，也可以从这里接下故事。' :
            instructions[state.chapter - 1];
        const phase = state.chapter + ':' + state.phase;
        if(phase !== previousPhase && state.phase === 'ready' &&
            !PB.Tour.getState().isRunning) setStoryOpen(true);
        previousPhase = phase;
    });

    function stopGesture() {
        if(!gesture) return;
        const current = gesture;
        gesture = null;
        if(PB.root.hasPointerCapture(current.id)) {
            PB.root.releasePointerCapture(current.id);
        }
        PB.Story.setInput(0, true);
    }

    PB.root.addEventListener('pointerdown', event => {
        if(!event.isPrimary || event.button !== 0) return;
        suppressClick = false;
        const person = event.target.closest('[data-story-bound]');
        const piece = person ||
            (PB.Camera.getMode() === 'first' && event.target.closest('#close-props'));
        const state = PB.Story.getState();
        if(!body.classList.contains('book-only') || !piece ||
            state.phase !== 'active' || state.paused || !PB.Engine.isReady()) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        PB.Tour.manualPause();
        const bounds = piece.getBoundingClientRect();
        gesture = {id: event.pointerId, x: event.clientX, y: event.clientY,
            person, moved: false,
            previousX: event.clientX, centerX: bounds.x + bounds.width / 2,
            centerY: bounds.y + bounds.height / 2, width: bounds.width};
        gesture.angle = Math.atan2(event.clientY - gesture.centerY,
            event.clientX - gesture.centerX);
        PB.root.setPointerCapture(event.pointerId);
    }, true);

    PB.root.addEventListener('pointermove', event => {
        if(!gesture || event.pointerId !== gesture.id) return;
        const state = PB.Story.getState();
        const distance = Math.hypot(event.clientX - gesture.x,
            event.clientY - gesture.y);
        if(!gesture.moved) {
            if(distance <= 5) return;
            gesture.moved = true;
            setStoryOpen(false);
        }
        if(state.chapter === 1) {
            const angle = Math.atan2(event.clientY - gesture.centerY,
                event.clientX - gesture.centerX);
            let difference = angle - gesture.angle;
            if(difference > Math.PI) difference -= Math.PI * 2;
            if(difference < -Math.PI) difference += Math.PI * 2;
            PB.Story.addProgress(Math.abs(difference) / (Math.PI * 8));
            gesture.angle = angle;
        } else if(state.chapter === 4) {
            if(Math.abs(event.clientY - gesture.y) < 50) {
                const movement = Math.max(0, event.clientX - gesture.previousX);
                PB.Story.addProgress(movement / Math.max(180, gesture.width * 2));
            }
        } else {
            const amount = state.chapter === 5 ? distance : event.clientX - gesture.x;
            PB.Story.setInput(PB.clamp(amount / 100, 0, 1));
        }
        gesture.previousX = event.clientX;
    });
    PB.root.addEventListener('pointerup', event => {
        const current = gesture;
        if(!current || event.pointerId !== current.id) return;
        stopGesture();
        const distance = Math.hypot(event.clientX - current.x, event.clientY - current.y);
        const personTap = current.person && !current.moved && distance <= 5;
        suppressClick = current.moved || personTap;
        if(personTap) PB.Story.focusPerson();
    });
    for(const name of ['pointercancel', 'lostpointercapture']) {
        PB.root.addEventListener(name, event => {
            if(event.pointerId === gesture?.id) stopGesture();
        });
    }
    window.addEventListener('gesture-cancel', stopGesture);
    PB.root.addEventListener('click', event => {
        if(suppressClick && event.detail > 0) {
            suppressClick = false;
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);
    PB.root.addEventListener('keydown', event => {
        if(!event.target.closest('[data-story-bound], #close-props') ||
            !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        const state = PB.Story.getState();
        if(state.phase !== 'active') return;
        if(state.chapter === 3) {
            const direction = ['ArrowLeft', 'ArrowDown'].includes(event.key) ? -1 : 1;
            PB.Story.setInput(state.angle + direction * .15);
        } else PB.Story.addProgress(.065);
    }, true);

    new MutationObserver(syncRoute).observe(body, {
        attributes: true, attributeFilter: ['data-view']
    });
    syncRoute();
    const initialRoute = PB.Shell.getRoute();
    if(!openRequestedReading() && initialRoute.view === 'scene') {
        setIntroOpen(true);
        readAt(initialRoute.chapter);
    }
    // Size the scene after placing the reader, before revealing the first frame.
    PB.Book.fit();
    PB.Book.renderNow();
    body.classList.remove('book-initializing');
    // The initial layout is already settled. Animate subsequent interactions.
    requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('book-reading-motion')));
})();
