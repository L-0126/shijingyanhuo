PB.StoryProps = (() => {
    const mounted = new Map();
    const drawings = [
        `<path d="M18 61q10 48 59 48t58-48" fill="#e5d6b6" stroke="#66543e" stroke-width="3"/><ellipse cx="77" cy="61" rx="59" ry="22" fill="#a87b39" stroke="#e6d6af" stroke-width="7"/><path d="M36 57q22-15 40 0t40 0M33 66q23-15 43 0t40 0" fill="none" stroke="#d6ad54" stroke-width="4"/><g data-part="chili" fill="#a44127" opacity="0"><circle cx="55" cy="54" r="4"/><circle cx="95" cy="65" r="4"/><circle cx="82" cy="50" r="3"/></g><path d="M139 28l39-4 12 85-43 4z" fill="#f0dfb7" stroke="#9c7e53"/><path d="M147 44l27-2m-25 13 27-2m-25 13 27-2m-25 13 27-2" stroke="#aa7b53" stroke-width="2"/>`,
        `<path d="M35 55h118l-12 65H47z" fill="#bb984e" stroke="#66502e" stroke-width="4"/><path d="M49 53q-5-54 45-54t44 54" fill="none" stroke="#99733d" stroke-width="8"/><path d="M52 62q-28-36-2-32 5-37 26-9 13-45 30-13 32-25 31 14 28-6 7 37" fill="#5e7e4c" stroke="#3c613d" stroke-width="3"/><path d="M42 74h103m-100 16h97m-95 17h89M68 63v53m25-53v53m24-53v53" stroke="#d8b86d" stroke-width="3"/>`,
        `<ellipse cx="97" cy="111" rx="73" ry="15" fill="#cfc5a4" stroke="#5f796e" stroke-width="3"/><path d="M35 55q5 56 62 56t62-56" fill="#ebdfc2" stroke="#637a6c" stroke-width="3"/><ellipse cx="97" cy="55" rx="62" ry="20" fill="#d0ad67" stroke="#ebdfc2" stroke-width="8"/><path d="M51 82q45 27 92 0" fill="none" stroke="#789489" stroke-width="6"/><g data-part="steam" opacity="0" stroke="#ecdfbd" stroke-width="3" fill="none"><path d="M82 29q-14-13 0-25m27 25q14-13 0-25"/></g>`,
        `<path d="M18 25l44-18 28 20h32l25-20 43 18-17 96H35z" fill="#688083" stroke="#3d565a" stroke-width="3"/><path data-part="patch" d="M44 62h111v40H44z" fill="#53757b" stroke="#314949" stroke-width="2"/><path data-part="stitches" d="M49 67l8 13m6-13 8 13m6-13 8 13m6-13 8 13m6-13 8 13m6-13 8 13m6-13 8 13" fill="none" stroke="#ebd19a" stroke-width="2"/>`,
        `<path d="M40 35h115v88H40z" fill="#bd9b5f" stroke="#725632" stroke-width="4"/><path d="M57 37q0-40 40-40t40 40" fill="none" stroke="#a47c43" stroke-width="8"/><path d="M49 56h95m-95 20h95m-95 20h95M68 42v73m27-73v73m27-73v73" stroke="#dbc18d" stroke-width="3"/>`
    ];
    const poses = [
        {x: -495, y: 181, dz: 63, scale: .55},
        {x: -240, y: -50, dz: 41, scale: .3},
        {x: 483, y: 238, dz: 96, scale: .24},
        {x: -457, y: 164, dz: 93, scale: .43},
        {x: 564, y: 255, dz: 70, scale: .37}
    ];

    function ensure(chapter) {
        if(mounted.has(chapter)) return mounted.get(chapter);
        const id = 'story-artifact-' + chapter;
        const defs = PB.root.querySelector('svg > defs');
        defs.insertAdjacentHTML('beforeend', `<g id="${id}">${drawings[chapter - 1]}</g>`);
        PB.ART.size[id] = [200, 130];
        const spread = PB.Engine.getSpread();
        const side = chapter === 1 || chapter === 2 || chapter === 4 ? spread.L : spread.R;
        const piece = PB.Book.piece(side, id, {...poses[chapter - 1],
            label: '翻看本章物件札记', parts: true, shadow: false});
        piece.node.addEventListener('click', event => {
            event.stopPropagation();
            PB.Shell.navigate({view: 'paper', chapter, paper: 0});
        });
        mounted.set(chapter, piece);
        return piece;
    }

    function render(state) {
        const piece = ensure(state.chapter);
        let visible = state.phase !== 'intro';
        if(state.chapter === 1) {
            visible = state.phase === 'done';
            PB.Book.setPart(piece, 'chili', {opacity: state.choice ? '1' : '0'});
        }
        if(state.chapter === 2) {
            const boat = PB.Book.getPiece('s2-boat');
            PB.Book.setPiecePose(piece, state.phase === 'done' ?
                {x: 572, y: 166, elevation: 0} :
                {x: boat.x + 38, y: boat.y - 4, elevation: 42});
        }
        if(state.chapter === 3) {
            visible = state.progress > .1 || state.round > 0;
            PB.Book.setPart(piece, 'steam', {opacity: state.progress > .4 ? '.7' : '0'});
        }
        if(state.chapter === 4) {
            PB.Book.setPart(piece, 'patch', {fill: state.choice ? '#9c6b4d' : '#53757b'});
            PB.Book.setPart(piece, 'stitches', {opacity: String(state.progress)});
        }
        if(state.chapter === 5) visible = state.hasGift;
        piece.node.style.opacity = visible ? '1' : '0';
        piece.node.style.pointerEvents = visible ? '' : 'none';
        piece.node.dataset.visible = visible;
        piece.node.tabIndex = visible && PB.Engine.isReady() ? 0 : -1;
        piece.node.setAttribute('aria-hidden', String(!visible));
    }
    return {render};
})();
