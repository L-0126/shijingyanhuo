// Progress lives outside mounted spreads so reading and chapter visits resume it.
PB.Story = (() => {
    function createState(chapter) {
        return {chapter, phase: 'intro', progress: 0, choice: 0, round: 0,
            input: 0, velocity: 0, angle: 0, paused: false, elapsed: 0,
            movement: 0, hasGift: false, revision: 0};
    }

    const states = Array.from({length: 5}, (_, index) => createState(index + 1));
    let chapter = 1;
    let lastNotice = 0;
    let lastSound = 0;
    let lastMilestone = -1;
    let enabled = false;
    let needsPaint = false;
    let publishedPhase = '';
    const canTogglePersonView = window.BOOK_EDITION === 'v10';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const primaryPieces = [
        ['s1-chef'], ['s2-boat', 's2-grandma'], ['s3-tea-service', 's3-guest'],
        ['s4-tailor', 's4-sewing'], ['s5-homecoming', 's5-boat', 's5-feast']
    ];

    function getState() {
        return states[chapter - 1];
    }

    function announce() {
        const state = getState();
        publishedPhase = state.chapter + ':' + state.phase + ':' + state.round;
        state.revision++;
        window.dispatchEvent(new CustomEvent('story-change', {
            detail: {...state}
        }));
    }

    function manual() {
        window.dispatchEvent(new Event('story-manual'));
    }

    function select(number) {
        const changed = chapter !== number;
        cancelInput();
        chapter = number;
        lastMilestone = -1;
        render(changed);
        announce();
    }

    function choose(index) {
        manual();
        if(getState().phase !== 'intro') return;
        getState().choice = index;
        announce();
    }

    function storyCamera() {
        return chapter === 2 || chapter === 5 ? 'follow' : 'close';
    }

    function start(fromTour = false) {
        if(!fromTour) manual();
        const state = getState();
        if(state.phase !== 'intro') return;
        state.phase = 'active';
        state.paused = false;
        PB.setPaused(false);
        PB.Camera.setMode(storyCamera());
        render();
        announce();
    }

    function focusPerson() {
        if(!enabled) return;
        if(canTogglePersonView && PB.Camera.getMode() !== 'overview') {
            manual();
            PB.Camera.setMode('overview');
            window.dispatchEvent(new Event('blur-story'));
            return;
        }
        window.dispatchEvent(new Event('focus-story'));
        if(getState().phase === 'intro') start();
        else if(canTogglePersonView) {
            manual();
            PB.Camera.setMode(storyCamera());
        }
    }

    function finish(fromTour = false) {
        if(!fromTour) manual();
        const state = getState();
        if(state.phase !== 'ready') return;
        state.angle = state.input = state.velocity = 0;
        if(chapter === 3 && state.round === 0) {
            state.round = 1;
            state.progress = 0;
            state.phase = 'active';
        } else if(chapter === 5 && !state.hasGift) {
            state.hasGift = true;
        } else {
            state.phase = 'done';
            PB.Camera.setMode(chapter === 2 ? 'close' : 'first');
        }
        render();
        announce();
    }

    function reset(fromTour = false) {
        if(!fromTour) manual();
        states[chapter - 1] = createState(chapter);
        lastMilestone = -1;
        PB.setPaused(false);
        PB.Camera.reset();
        render(true);
        announce();
    }

    function setPaused(value) {
        manual();
        cancelInput();
        getState().paused = value;
        PB.setPaused(value);
        announce();
    }

    function cancelInput() {
        const state = getState();
        state.input = 0;
        state.angle = 0;
        state.movement = 0;
        window.dispatchEvent(new Event('gesture-cancel'));
    }

    function addProgress(amount, fromTour = false) {
        if(!fromTour) manual();
        const state = getState();
        if(state.phase !== 'active' || state.paused) return;
        if(chapter === 2) {
            state.velocity = Math.min(.18, state.velocity + amount * .45);
        } else {
            state.progress = PB.clamp(state.progress + amount, 0, 1);
            state.movement = 1;
        }
        checkCompletion();
        render();
        announce();
    }

    function setInput(value, fromTour = false) {
        if(!fromTour) manual();
        const state = getState();
        if(state.phase !== 'active' || state.paused) return;
        const input = PB.clamp(value, 0, 1);
        if(input === state.input) return;
        state.input = input;
        if(chapter === 3) state.angle = state.input;
        announce();
    }

    function checkCompletion() {
        const state = getState();
        if(state.progress >= 1) {
            state.progress = 1;
            state.phase = 'ready';
            state.input = state.angle = state.velocity = 0;
            state.movement = 0;
        }
    }

    function applyTourFrame(frame, immediate = false) {
        const state = getState();
        const changes = Object.keys(frame).some(key => state[key] !== frame[key]);
        if(!changes && !immediate) return;
        const newBeat = state.phase !== frame.phase || state.round !== frame.round;
        Object.assign(state, frame);
        render(immediate);
        const now = performance.now();
        if(newBeat || immediate || now - lastNotice > 80) {
            lastNotice = now;
            announce();
        }
    }

    function render(immediate = false) {
        if(PB.Engine.getChapter() !== chapter) return;
        const state = getState();
        const controls = PB.Engine.getSpread().controls;
        if(chapter === 1) {
            const chef = PB.Book.getPiece('s1-chef');
            const swing = reduced.matches ? 0 : Math.sin(state.progress * 48) *
                Math.min(1, state.movement);
            PB.Book.setPart(chef, 'noodle-arm', {transform: 'rotate(' + swing * 28 + 'deg)'});
            PB.Book.setPart(chef, 'spoon-arm', {transform: 'rotate(' + swing * 18 + 'deg)'});
            PB.Book.setPart(chef, 'sauce', {opacity: String(state.progress)});
        }
        if(chapter === 2) controls?.setProgress(state.progress, immediate);
        if(chapter === 3) controls?.setPour(state.angle, state.progress);
        if(chapter === 4) controls?.setStitch(state.progress, state.movement);
        if(chapter === 5) controls?.setProgress(state.progress, state.phase === 'done');
        PB.StoryProps.render(state);
        PB.root.dataset.storyPhase = state.phase;
        PB.root.dataset.storyProgress = state.progress.toFixed(3);
        for(const id of primaryPieces[chapter - 1]) {
            const piece = PB.Book.getPiece(id);
            if(piece && !piece.node.dataset.storyBound) {
                piece.node.dataset.storyBound = 'true';
                piece.node.addEventListener('click', event => {
                    if(!enabled) return;
                    event.stopImmediatePropagation();
                    focusPerson();
                }, true);
            }
        }
        const milestone = Math.floor(state.progress * 3);
        if(milestone !== lastMilestone && state.phase !== 'intro') {
            lastMilestone = milestone;
            const piece = PB.Book.getPiece(primaryPieces[chapter - 1][0]);
            const content = CITY_BOOK.chapters[chapter - 1].story;
            const stage = piece?.node.dataset.journeyStage;
            const isCrossing = chapter === 5 && state.phase !== 'done' &&
                ['boarding', 'crossing', 'landing'].includes(stage);
            const dialogue = isCrossing ? '“坐稳咯，到对岸再上台阶。”归家人把篮子放在身边，看两岸灯火慢慢移过。' :
                state.phase === 'done' ? content.ending :
                milestone === 0 ? content.opening : content.middle;
            if(piece) PB.UI.showBubble(dialogue, piece.node);
        }
    }

    PB.physicsLoop.add({step(delta) {
        const state = getState();
        if(!enabled || !PB.Engine.isReady() || state.paused || PB.Tour?.isDrivingStory() ||
            state.phase !== 'active') return;
        state.elapsed += delta;
        if(chapter === 2) {
            state.velocity += (state.input * .25 - state.velocity * 1.25) * delta;
            if(Math.abs(state.velocity) < .00001) state.velocity = 0;
            state.progress += state.velocity * delta;
        } else if(chapter === 3) {
            state.progress += Math.max(0, state.angle - .18) * .28 * delta;
        } else if(chapter === 5) {
            state.progress += state.input * .085 * delta;
        } else {
            state.progress += state.input * .11 * delta;
        }
        state.movement *= Math.exp(-delta * 4);
        if(state.input > 0) state.movement = state.input;
        checkCompletion();
        needsPaint = true;
    }, render() {
        const state = getState();
        const isCoasting = state.chapter === 2 &&
            Math.abs(PB.Engine.getSpread().controls?.getVelocity?.() || 0) > .0001;
        if(!enabled || !PB.Engine.isReady() || (!needsPaint && !isCoasting)) return;
        needsPaint = false;
        render();
        const now = performance.now();
        const phase = state.chapter + ':' + state.phase + ':' + state.round;
        if(now - lastNotice > 80 || phase !== publishedPhase) {
            lastNotice = now;
            announce();
        }
        if(now - lastSound > 450 && state.phase === 'active' &&
            (state.movement > .08 || state.angle > .2)) {
            lastSound = now;
            if(chapter === 1) audioSynth.playSizzle(.12);
            if(chapter === 3) audioSynth.playTeaPour(.35);
            if(chapter === 4) audioSynth.playSewingMachine(.12);
        }
    }});
    document.addEventListener('visibilitychange', cancelInput);
    window.addEventListener('blur', cancelInput);
    window.addEventListener('book-ready', event => {
        if(event.detail.ready && event.detail.chapter === chapter) render(true);
    });
    return {getState, getStates: () => states, select, choose, start, focusPerson, finish, applyTourFrame,
        reset, setPaused, cancelInput, addProgress, setInput,
        setEnabled(value) {enabled = value; if(!value) cancelInput();}};
})();
