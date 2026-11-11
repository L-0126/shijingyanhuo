(() => {
    const library = PB.svgEl('svg');
    library.setAttribute('width', '0');
    library.setAttribute('height', '0');
    library.setAttribute('aria-hidden', 'true');
    library.style.position = 'absolute';
    library.innerHTML = '<defs></defs>';
    PB.root.prepend(library);
    const defs = library.firstElementChild;
    const scenes = new Map();
    const builders = [PB.S1, PB.S2, PB.S3, PB.S4, PB.S5];
    let chapter = 1;
    let isOpen = false;
    let isReady = false;

    function getSpread(id) {
        if(!scenes.has(id)) {
            const art = PB.ART.build('s' + (id + 1));
            defs.insertAdjacentHTML('beforeend', id === 0 ? art.defs : art.symbols);
            const spread = PB.Book.createSpread(id);
            builders[id].mount(spread);
            scenes.set(id, spread);
        }
        return scenes.get(id);
    }

    function updateChapter(id, ready) {
        chapter = id + 1;
        isReady = ready;
        for(let number = 1; number <= 5; number++) {
            PB.root.classList.toggle('scene-s' + number + '-ready',
                ready && number === chapter);
        }
        PB.Book.setViewInteractionEnabled(isOpen && ready &&
            (!PB.Camera || PB.Camera.getMode() === 'overview'));
        PB.root.dataset.chapter = chapter;
        PB.root.dataset.ready = ready;
        if(!ready) PB.UI.clearBubble();
        window.dispatchEvent(new CustomEvent('book-ready', {
            detail: {chapter, ready}
        }));
    }

    const turn = PB.Turn.create(getSpread(0), getSpread, updateChapter);
    const cover = PB.$('.cover-face');
    cover.setAttribute('role', 'button');
    cover.setAttribute('aria-label', '翻开市井烟火');
    cover.tabIndex = 0;

    function open(number = chapter, animate = true, immediate = false) {
        PB.setPaused(false);
        isOpen = true;
        PB.Book.setTheta(180, animate);
        cover.tabIndex = -1;
        cover.setAttribute('aria-hidden', 'true');
        turn.start(number - 1, true, immediate);
    }

    function select(number, animate = false, immediate = false) {
        if(number < 1 || number > 5) return;
        PB.setPaused(false);
        if(!isOpen) return open(number, animate, immediate);
        if(chapter === number && isReady) return;
        PB.Book.setViewInteractionEnabled(false);
        PB.Book.resetView();
        PB.Book.setTheta(180, false);
        turn.start(number - 1, !animate, immediate);
    }

    function close(animate = false) {
        PB.setPaused(false);
        turn.close();
        isOpen = false;
        PB.Book.resetView();
        PB.Book.setTheta(0, animate);
        cover.tabIndex = 0;
        cover.setAttribute('aria-hidden', 'false');
    }

    cover.addEventListener('click', () => {
        if(!isOpen) window.dispatchEvent(new Event('open-book'));
    });
    cover.addEventListener('keydown', event => {
        if(event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            cover.click();
        }
    });
    PB.Engine = {open, close, select,
        getSpread: () => getSpread(chapter - 1),
        getChapter: () => chapter,
        isReady: () => isReady,
        isOpen: () => isOpen};
    PB.physicsLoop.last = performance.now();
    close();
})();
