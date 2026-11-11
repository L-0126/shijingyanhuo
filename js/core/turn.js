// A curved leaf covers each page while the flat artwork underneath changes.
PB.Turn = (function(){
    const {table, L, R, PW, PH, T, setSideVisible} = PB.Book;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    // Share one pace across chapters; cover openings reuse the reveal stage.
    const FOLD = 450, FLIP = 900, PAUSE = 150, RISE = 2700;
    const stripWidth = PW/3;
    const leaf = PB.el('turn-leaf', table);
    leaf.hidden = true;
    leaf.setAttribute('aria-hidden', 'true');
    const strips = [];
    for(let i = 0; i < 3; i++){
        const parent = i === 0 ? leaf : strips[i-1].hinge;
        const hinge = PB.el('turn-hinge', parent);
        hinge.style.left = i === 0 ? '0' : stripWidth + 'px';
        const front = PB.el('turn-face', hinge, stripWidth + 0.6, PH);
        const back = PB.el('turn-face turn-back', hinge, stripWidth + 0.6, PH);
        strips.push({hinge, front, back});
    }

    function loadLeaf(outgoing, incoming, forward){
        const front = forward ? outgoing.R : incoming.R;
        const back = forward ? incoming.L : outgoing.L;
        for(const [i, strip] of strips.entries()){
            for(const [face, side, index] of [
                [strip.front, front, i], [strip.back, back, 2-i]
            ]){
                const blank = incoming.id === 4 && side === incoming.L;
                const print = side.page.querySelector('.print');
                face.replaceChildren();
                if(print && !blank){
                    const artwork = print.cloneNode(true);
                    artwork.style.left = -index*stripWidth + 'px';
                    face.append(artwork);
                }
            }
        }
        leaf.hidden = false;
    }

    function moveLeaf(t, forward){
        const progress = PB.smooth(t);
        const angle = PB.lerp(0, -180, forward ? progress : 1-progress);
        const bend = 16*Math.sin(Math.PI*progress)*(forward ? 1 : -1);
        leaf.style.transform = `translate3d(0,${-PH/2}px,${T+4}px) rotateY(${angle+bend}deg)`;
        strips[1].hinge.style.transform = `rotateY(${-bend}deg)`;
        strips[2].hinge.style.transform = `rotateY(${-bend}deg)`;
        leaf.style.setProperty('--leaf-shade', (0.08 + Math.abs(bend)*.009).toFixed(3));
        L.gutter.style.opacity = String(1 - 0.4*Math.sin(Math.PI*t));
        R.gutter.style.opacity = String(1 + 0.25*Math.sin(Math.PI*t));
    }

    function putSideUnderLeaf(oldSpread, nextSpread, key){
        setSideVisible(oldSpread[key], false);
        setSideVisible(nextSpread[key], true);
    }

    function setProgress(spread, progress, printProgress = progress){
        spread.progress = progress;
        if(spread.id !== 4) return;
        for(const side of [spread.L, spread.R]){
            side.page.style.opacity = PB.smooth(PB.clamp(printProgress*5.2, 0, 1)).toFixed(3);
        }
    }

    function create(initial, getSpread, onChange){
        let current = initial;
        let animation = null;
        let queued = null;
        setSideVisible(current.L, true);
        setSideVisible(current.R, true);

        function setReady(ready){
            if(!ready) current.onDeactivate?.();
            current.ready = ready;
            onChange(current.id, ready);
        }

        function settle(ready = true, progress = 1){
            if(animation?.from && animation.to !== current){
                for(const key of ['L','R']) putSideUnderLeaf(current, animation.to, key);
                current = animation.to;
            }
            animation = null;
            leaf.hidden = true;
            L.gutter.style.opacity = R.gutter.style.opacity = '';
            setProgress(current, progress);
            setReady(ready);
        }

        function start(id, throughCover = false, immediate = false){
            if(animation){
                if(!throughCover){
                    queued = id;
                    return;
                }
                // Direct navigation replaces the pending page immediately.
                // It must not wait for an earlier page paused by reading.
                queued = null;
                settle(false);
            }
            if(id === current.id && !throughCover) return;
            const next = getSpread(id);
            setReady(false);
            const waitForCover = throughCover && !immediate && !reducedMotion.matches &&
                (id === 4 || next.waitForCover);
            if(throughCover || reducedMotion.matches){
                setSideVisible(current.L, false);
                setSideVisible(current.R, false);
                current = next;
                setProgress(current, waitForCover ? 0 : 1);
                setSideVisible(current.L, true);
                setSideVisible(current.R, true);
                setReady(!waitForCover);
                if(waitForCover) animation = {to: current, stage: 'cover'};
                return;
            }
            setProgress(next, 0);
            animation = {from: current, to: next, forward: id > current.id,
                stage: 'fold', since: PB.now()};
        }

        function tick(now){
            if(!animation) return;
            if(reducedMotion.matches){
                settle();
                drainQueue();
                return;
            }
            const turn = animation;
            const elapsed = now - turn.since;
            switch(turn.stage){
                case 'cover':
                    if(PB.Book.getTheta() < 165) return;
                    turn.stage = 'rise';
                    turn.since = now;
                    return;
                case 'fold':
                    setProgress(current, 1 - PB.clamp(elapsed/FOLD, 0, 1), 1);
                    if(elapsed < FOLD) return;
                    loadLeaf(current, turn.to, turn.forward);
                    moveLeaf(0, turn.forward);
                    putSideUnderLeaf(current, turn.to, turn.forward ? 'R' : 'L');
                    turn.stage = 'flip';
                    turn.since = now;
                    return;
                case 'flip':
                    moveLeaf(PB.clamp(elapsed/FLIP, 0, 1), turn.forward);
                    if(elapsed < FLIP) return;
                    putSideUnderLeaf(current, turn.to, turn.forward ? 'L' : 'R');
                    current = turn.to;
                    leaf.hidden = true;
                    L.gutter.style.opacity = R.gutter.style.opacity = '';
                    setReady(false);
                    turn.stage = 'rise';
                    turn.since = now;
                    return;
                case 'rise': {
                    const progress = PB.clamp((elapsed-PAUSE)/RISE, 0, 1);
                    setProgress(current, progress);
                    if(progress < 1) return;
                    settle();
                    drainQueue();
                }
            }
        }

        function drainQueue(){
            const next = queued;
            queued = null;
            if(next !== null) start(next);
        }

        PB.rafLoop.add(tick);
        return {start, close(){
            queued = null;
            if(animation) settle(false, animation.to === current ? current.progress : 0);
            else setReady(false);
        }};
    }

    return {create};
})();
