// Motion is integrated on the same fixed-step clock as the book hinges.
PB.S2 = (function(){
    const DRAG_SMOOTHING = 12;
    const COAST_FRICTION = 7;
    const SCALE_STIFFNESS = 60;
    const SCALE_DAMPING = 2;
    const SCALE_REST_ANGLE = -6;
    const CHOP_DURATION = 1.35;
    const HOME_POSITION = .22;
    const SAIL_DURATION = 6.4;
    const BOAT_SCALE = .74;
    const PATH_SEGMENTS = 256;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const {piece, setPart, setPiecePose} = PB.Book;
    const round = value => Number(value.toFixed(3));

    function mount(spread){
        const {L, R} = spread;
        spread.buildFrom = .12;
        spread.layeredReveal = true;
        spread.waitForCover = true;
        for(const [side, x] of [[L, 0], [R, 800]]){
            side.page.insertBefore(PB.svgUse('s2-print', x, 800, 1000, 'print'), side.shadows);
        }
        const add = (side, name, x, y, options = {}) =>
            piece(side, 's2-' + name, {x, y, ...options});
        for(const [side, vx, vw, anchor] of [[L,0,765,1],[R,765,765,0]]){
            add(side, 'backdrop', 0, -405, {vx, vw, anchor, lead: .98, shadow: false});
        }
        add(L, 'water-houses', -487, -260, {
            lead: .83, scale: 1.14, build: [0, 155, 270, 361]
        });
        add(L, 'house-side', -202, -260, {
            anchor: 0, yaw: -Math.PI/2, lead: .83, scale: 1.14,
            build: [0, 87, 149, 240]
        });
        add(L, 'willow', -680, -149, {lead: .75, scale: .76});
        add(L, 'market-link', -104, -205, {
            scale: .90, lead: .71, build: [0, 91, 177, 253], buildDelay: .16
        });
        add(R, 'arcade-small', 142, -196, {
            scale: .99, lead: .79, build: [0, 56, 155, 236, 339], buildDelay: .08
        });
        add(R, 'arcade-rear', 440, -305, {
            scale: 1.12, lead: .84, build: [0, 87, 150], buildDelay: .04
        });
        add(R, 'arcade-floor', 440, -155, {flat: true, lead: .79});
        for(const x of [210.4, 669.6]){
            add(R, 'arcade-side', x, -155, {
                anchor: 0, yaw: -Math.PI/2, scale: 1.12, lead: .79,
                build: [0, 55, 155, 267, 444], buildDelay: .04
            });
        }
        add(R, 'arcade', 440, -155, {
            scale: 1.12, lead: .79,
            build: [0, 55, 155, 267, 444], buildDelay: .04
        });
        for(const elevation of [177*1.12, 289*1.12]){
            add(R, 'balcony-floor', 440, -103.5, {
                scale: 1.12, flat: true, dz: elevation, lead: .34
            });
            add(R, 'balcony-rail', 440, -103.5, {
                scale: 1.12, dz: elevation, lead: .32
            });
        }
        add(R, 'kapok', 721, -205, {scale: .85, lead: .72});

        // The gutter falls in the bridge's solid eastern abutment.
        for(const y of [-20, 100]){
            add(L, 'bridge', 0, y, {vx: 0, vw: 585, anchor: 1, lead: .62});
            add(R, 'bridge', 0, y, {vx: 585, vw: 65, anchor: 0, lead: .62});
        }
        for(let i = 0; i < 14; i++){
            const x = -562 + i*46;
            const elevation = 35 + 178*(1 - Math.pow(Math.abs(x+260)/325, 1.3));
            add(x < 0 ? L : R, 'bridge-step', x, 100, {
                flat: true, dz: elevation, lead: .62, shadow: false
            });
        }
        add(L, 'stone-lion', -546, 103, {dz: 61, scale: .72, lead: .62});
        add(R, 'stone-lion', 28, 103, {dz: 60, scale: .72, lead: .62});
        const peddler = add(L, 'peddler', -98, 46, {
            dz: 152, scale: .59, lead: .52, label: '听桥头货郎的吆喝'
        });
        add(L, 'quay-steps', -644, 124, {scale: .83, lead: .43, flat: true});
        const grandma = add(L, 'grandma', -687, 25, {
            scale: .79, lead: .37, label: '听阿婆挑菜'
        });
        add(L, 'duck-wake', -465, 193, {flat:true, scale:.77, lead:.24, shadow:false});
        const ducks = add(L, 'ducks', -465, 183, {
            scale: .78, lead: .24, shadow:false, label: '听水里的鸭子叫'
        });
        const neighbor = add(R, 'neighbor', 662, 56, {
            scale: .83, lead: .30, label: '听买菜街坊的闲话'
        });
        add(R, 'produce', 129, 7, {scale: .82, lead: .37});
        const chef = add(R, 'chef', 393, -22, {
            scale: 1.06, lead: .4, parts: true, label: '请烧腊师傅斩料过秤'
        });
        const counter = add(R, 'counter', 433, 74, {
            lead: .35, scale: 1.05, parts: true
        });
        add(R, 'counter-top', 433, 74, {flat: true, dz: 78.75, lead: .35});
        for(const x of [274.975, 591.025]){
            add(R, 'counter-side', x, 74, {
                anchor: 1, yaw: Math.PI/2, lead: .35
            });
        }
        add(R, 'scale-stand', 555, 80, {lead: .35});
        const scale = add(R, 'scale', 555, 80, {
            dz: 118, scale: .92, lead: .35, parts: true,
            label: '看看老式铜盘杆秤'
        });
        const wake = add(L, 'wake', -260, -39, {
            flat: true, lead: .21, scale: .79, shadow: false
        });
        const boat = add(L, 'boat', -260, -60, {
            lead: .25, scale: BOAT_SCALE, parts: true, shadowSides: [L, R],
            shadowArt: 's2-boat-silhouette',
            label: '请船娘摇橹穿桥'
        });

        const path = PB.svgEl('path');
        path.setAttribute('d', 'M-260 -78C-260-12-260 102-248 133' +
            'C-229 188-141 203-57 209S326 218 615 211');
        const length = path.getTotalLength();
        // Sample once; querying SVG geometry during a moving frame can flush layout.
        const route = Array.from({length: PATH_SEGMENTS+1}, (_, i) =>
            path.getPointAtLength(i*length/PATH_SEGMENTS));
        const state = {
            position: HOME_POSITION, target: HOME_POSITION,
            velocity: 0, coast: 0, isDragging: false,
            demoTime: -1, demoStart: 0, demoEnd: 1,
            phase: 0, chopTime: CHOP_DURATION, nextChop: 0,
            hasServed: false, scaleAngle: 0, scaleVelocity: 0,
            scaleTarget: 0, scaleElapsed: 0, splashCooldown: 0,
            isDirty: true
        };
        const tools = PB.$('#s2-tools');
        const anchor = PB.el('drag-anchor', L.g, 0, 0);
        anchor.style.transform = 'translate3d(-325px,472px,45px)';
        let lastLayout = '';
        let lastReady = false;
        let lastValue = '';
        let lastDescription = '';
        let lastHandleTransform = '';
        let renderedBoatPosition;
        const control = createPullTab(tools, {
            isReady: () => spread.ready && PB.Book.getTheta() > 150,
            getValue: () => state.position,
            begin(){
                state.isDragging = true;
                state.demoTime = -1;
                state.coast = 0;
                PB.UI.dismissHint(control.track);
            },
            change(value, direct){
                state.target = value;
                if(direct || reducedMotion.matches){
                    state.position = value;
                    state.velocity = state.coast = 0;
                }
                state.isDirty = true;
                PB.UI.dismissHint(control.track);
            },
            end(cancelled){
                state.isDragging = false;
                if(cancelled){
                    resetBoat();
                }else{
                    state.coast = reducedMotion.matches ? 0 : state.velocity*.3;
                    PB.UI.showBubble('阿婆，刚出水的河虾，鲜得眉毛掉下来哟！', boat.node);
                }
            }
        });

        function resetBoat(){
            state.position = state.target = HOME_POSITION;
            state.velocity = state.coast = 0;
            state.demoTime = -1;
            state.phase = 0;
            state.splashCooldown = 0;
            state.isDirty = true;
        }

        function sailBoat(){
            if(!spread.ready) return;
            control.cancel(false);
            state.isDragging = false;
            state.coast = 0;
            state.demoStart = state.position;
            state.demoEnd = state.position > .5 ? .04 : .96;
            state.demoTime = 0;
            if(reducedMotion.matches){
                state.position = state.target = state.demoEnd;
                state.demoTime = -1;
                state.isDirty = true;
            }
            PB.UI.dismissHint(control.track);
            PB.UI.showBubble('摇出桥洞，沿河去岭南。留意船身怎样越过书缝。', boat.node, 6800);
        }

        function chopGoose(){
            if(!spread.ready || state.chopTime < CHOP_DURATION) return;
            state.chopTime = 0;
            state.nextChop = 0;
            state.hasServed = false;
            state.scaleAngle = state.scaleVelocity = state.scaleTarget = 0;
            state.scaleElapsed = 0;
            state.isDirty = true;
            PB.UI.dismissHint(chef.node);
            PB.UI.showBubble('靓姐，斩半只烧鹅返屋企加餸，秤头够足啦！', chef.node);
            if(reducedMotion.matches){
                state.chopTime = CHOP_DURATION;
                state.hasServed = true;
                state.scaleAngle = state.scaleTarget = SCALE_REST_ANGLE;
                audioSynth.playChop();
            }
        }

        boat.node.addEventListener('click', sailBoat);
        chef.node.addEventListener('click', chopGoose);
        scale.node.addEventListener('click', chopGoose);
        grandma.node.addEventListener('click', () =>
            PB.UI.showBubble('莲蓬要嫩的，再捎一把菜心，回去正好做饭。', grandma.node));
        peddler.node.addEventListener('click', () =>
            PB.UI.showBubble('桥这头是鲜鱼，桥那头是烧腊；慢慢逛，莫着急。', peddler.node));
        neighbor.node.addEventListener('click', () =>
            PB.UI.showBubble('早晨！半只烧鹅，一袋荔枝，今日又有好餸。', neighbor.node));
        ducks.node.addEventListener('click', () => {
            PB.UI.showBubble('嘎嘎——小船过了，我们再游到对岸。', ducks.node);
            audioSynth.playOarSplash();
        });
        PB.UI.createHint(control.track, '拉纸柄 · 穿桥换船', 's2');
        PB.UI.createHint(chef.node, '点师傅 · 斩料过秤', 's2');

        function deactivate(){
            control.cancel(false);
            state.isDragging = false;
            resetBoat();
            state.chopTime = CHOP_DURATION;
            state.nextChop = 3;
            state.hasServed = false;
            state.scaleAngle = state.scaleVelocity = state.scaleTarget = 0;
            tools.hidden = true;
            control.track.tabIndex = -1;
            renderMechanisms();
        }
        spread.controls = {
            setProgress(value, immediate = false) {
                state.demoTime = -1;
                state.coast = 0;
                state.isDragging = true;
                state.target = .06 + PB.clamp(value, 0, 1) * .92;
                if(immediate) state.position = state.target;
                state.isDirty = true;
                renderMechanisms();
            },
            getProgress: () => (state.position - .06) / .92,
            getVelocity: () => state.velocity
        };
        spread.onDeactivate = deactivate;
        reducedMotion.addEventListener('change', () => {
            state.coast = 0;
            state.demoTime = -1;
            state.position = state.target;
            state.scaleAngle = state.scaleTarget;
            state.scaleVelocity = 0;
            state.phase = 0;
            state.chopTime = CHOP_DURATION;
            state.isDirty = true;
        });

        PB.physicsLoop.add({step(dt){
            if(!spread.ready || PB.Book.getTheta() < 150) return;
            if(state.demoTime >= 0){
                state.demoTime = Math.min(SAIL_DURATION, state.demoTime + dt);
                state.target = PB.lerp(state.demoStart, state.demoEnd,
                    PB.smooth(state.demoTime/SAIL_DURATION));
                if(state.demoTime === SAIL_DURATION) state.demoTime = -1;
            }
            if(!state.isDragging && Math.abs(state.coast) > .001){
                state.target = PB.clamp(state.target + state.coast*dt, 0, 1);
                state.coast *= Math.exp(-COAST_FRICTION*dt);
                if(state.target === 0 || state.target === 1) state.coast = 0;
            }else if(!state.isDragging){
                state.coast = 0;
            }
            const previous = state.position;
            state.position += (state.target - previous)*(1 - Math.exp(-DRAG_SMOOTHING*dt));
            if(Math.abs(state.target - state.position) < .00005) state.position = state.target;
            state.velocity = (state.position - previous)/dt;
            if(Math.abs(state.velocity) > .001){
                state.phase += dt*8;
                state.isDirty = true;
            }else if(state.phase){
                state.phase = 0;
                state.isDirty = true;
            }
            state.splashCooldown = Math.max(0, state.splashCooldown - dt);
            if(Math.abs(state.velocity) > .055 && state.splashCooldown === 0){
                audioSynth.playOarSplash();
                state.splashCooldown = .65;
            }
            if(state.chopTime < CHOP_DURATION){
                state.chopTime = Math.min(CHOP_DURATION, state.chopTime + dt);
                const beats = [.20, .44, .68];
                if(state.nextChop < beats.length && state.chopTime >= beats[state.nextChop]){
                    audioSynth.playChop();
                    state.nextChop++;
                }
                if(state.chopTime >= 1.03 && !state.hasServed){
                    state.hasServed = true;
                    state.scaleTarget = SCALE_REST_ANGLE;
                    state.scaleVelocity = 65;
                    state.scaleElapsed = 0;
                }
                state.isDirty = true;
            }
            if(state.scaleAngle !== state.scaleTarget || state.scaleVelocity){
                state.scaleElapsed += dt;
                state.scaleVelocity += (-SCALE_STIFFNESS*(state.scaleAngle-state.scaleTarget) -
                    SCALE_DAMPING*state.scaleVelocity)*dt;
                state.scaleAngle += state.scaleVelocity*dt;
                if(state.scaleElapsed >= 3.6 || reducedMotion.matches){
                    state.scaleAngle = state.scaleTarget;
                    state.scaleVelocity = 0;
                }
                state.isDirty = true;
            }
        }, render(){
            if((L.present || R.present) && state.isDirty) renderMechanisms();
        }});

        function updateBoatPose(){
            if(renderedBoatPosition === state.position) return;
            renderedBoatPosition = state.position;
            const offset = state.position*PATH_SEGMENTS;
            const index = Math.min(PATH_SEGMENTS-1, Math.floor(offset));
            const before = route[index], after = route[index+1];
            const point = {
                x: PB.lerp(before.x, after.x, offset-index),
                y: PB.lerp(before.y, after.y, offset-index)
            };
            // The boat's illustrated broadside stays legible as its course bends.
            const yaw = Math.atan2(after.y-before.y, after.x-before.x)*.12;
            setPiecePose(boat, {x: round(point.x), y: round(point.y), yaw: round(yaw)});
            setPiecePose(wake, {x: round(point.x), y: round(point.y+21), yaw: round(yaw)});
            // Clip in the boat's own frame at world x=0. Only the wood already
            // over the gutter changes, including its moving oar and shadows.
            const width = 300*BOAT_SCALE;
            const seam = PB.clamp(width/2-point.x/Math.cos(yaw), 0, width);
            setPart(boat, 'jiangnan', {
                clipPath: `inset(0 ${round(width-seam)}px 0 0)`,
                display: seam === 0 ? 'none' : ''
            });
            setPart(boat, 'canton', {
                clipPath: `inset(0 0 0 ${round(seam)}px)`,
                display: seam === width ? 'none' : ''
            });
            const hiddenShadows = [point.x-width/2 > 0, point.x+width/2+70 < 0];
            boat.casts.forEach((cast, i) => {
                if(cast.hidden !== hiddenShadows[i]) cast.hidden = hiddenShadows[i];
            });
            const region = seam === width ? 'jiangnan' :
                seam === 0 ? 'canton' : 'crossing';
            if(boat.node.dataset.region !== region) boat.node.dataset.region = region;
            const ratio = String(round(1-seam/width));
            if(boat.node.dataset.cantonRatio !== ratio) boat.node.dataset.cantonRatio = ratio;
            PB.UI.invalidateLayout();
        }

        function renderMechanisms(){
            updateBoatPose();
            const speed = reducedMotion.matches ? 0 : Math.min(1, Math.abs(state.velocity)*3);
            setPart(boat, 'oar', {transform: `rotate(${round(Math.sin(state.phase)*18*speed)}deg)`});
            setPart(boat, 'canton-oar', {transform: `rotate(${round(Math.sin(state.phase)*12*speed)}deg)`});
            for(let i = 0; i < 3; i++){
                const lift = Math.max(0, Math.sin(state.phase-i*1.8))*19*speed;
                setPart(boat, 'fish-'+i, {transform: `translateY(${-round(lift)}px)`});
            }
            boat.wob = 0;
            const time = state.chopTime;
            const cutting = time < .72 && !reducedMotion.matches;
            const phase = (time/.24)%1;
            const lift = cutting ? Math.sin(phase*Math.PI)*30 : 0;
            setPart(chef, 'knife-arm', {transform: `rotate(${round(lift)}deg)`});
            const boardDrop = cutting ? Math.sin(Math.PI*PB.clamp((phase-.76)/.24,0,1))*3 : 0;
            setPart(counter, 'board', {transform: `translateY(${round(boardDrop)}px)`});
            setPart(scale, 'beam', {transform: `rotate(${round(state.scaleAngle)}deg)`});
            const load = state.hasServed
                ? (reducedMotion.matches ? 1 : PB.smooth(PB.clamp(state.scaleElapsed/.34,0,1))) : 0;
            setPart(scale, 'pan', {transform: `translateY(${round(load*4)}px)`});
            setPart(scale, 'weight', {transform: `translateX(${round(load*21)}px)`});
            const falling = time >= .82 && time < 1.03;
            setPart(scale, 'goose', {
                opacity: state.hasServed || falling ? '1' : '0',
                transform: `translateY(${falling?-round((1-(time-.82)/.21)*48):0}px)`
            });
            state.isDirty = false;
        }

        function positionControl(){
            const bounds = PB.localRect(anchor);
            const width = tools.offsetWidth;
            tools.style.left = PB.clamp(bounds.left, width/2+16, PB.viewport().width-width/2-16)+'px';
            tools.style.top = PB.clamp(bounds.top+8, 72, PB.viewport().height-(PB.viewport().width<900?238:165))+'px';
            lastLayout = PB.Book.getCameraRevision();
            lastHandleTransform = '';
            PB.UI.invalidateLayout();
        }

        PB.rafLoop.add(() => {
            const ready = spread.ready && PB.Book.getTheta() > 150;
            if(lastReady !== ready){
                tools.hidden = !ready;
                control.track.tabIndex = ready ? 0 : -1;
                control.track.setAttribute('aria-disabled', String(!ready));
                lastReady = ready;
                lastLayout = '';
            }
            if(!L.present && !R.present) return;
            if(!ready) return;
            if(lastLayout !== PB.Book.getCameraRevision()) positionControl();
            const transform = `translateX(${round(state.position*control.track.clientWidth*.58)}px)`;
            if(lastHandleTransform !== transform){
                control.handle.style.transform = transform;
                lastHandleTransform = transform;
            }
            const value = String(Math.round(state.position*100));
            if(lastValue !== value){
                control.track.setAttribute('aria-valuenow', value);
                lastValue = value;
            }
            const region = boat.node.dataset.region;
            const description = region === 'crossing' ? '船身正逐段越过书缝，变成岭南客船' :
                region === 'canton' ? '岭南木壳客船，已到广州骑楼水岸' :
                state.position < .19 ? '乌篷船正在摇出桥洞' : '乌篷船沿河向书缝驶去';
            if(lastDescription !== description){
                control.track.setAttribute('aria-valuetext', description);
                lastDescription = description;
            }
        });
        renderMechanisms();
    }

    function createPullTab(parent, actions){
        const track = PB.el('pull-tab s2-pull-tab', parent);
        track.setAttribute('role', 'slider');
        track.setAttribute('aria-label', '行船纸柄，左右拖动穿桥，跨页变换船身');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-valuenow', String(HOME_POSITION*100));
        track.tabIndex = -1;
        track.innerHTML = '<span class="pull-caption">江南 · 岭南</span>' +
            '<span class="pull-slot"></span>' +
            '<span class="pull-handle"><i></i><span>摇橹</span></span>';
        let gesture = null;
        let isReleasing = false;

        function cancel(notify = true){
            if(!gesture) return;
            const id = gesture.id;
            gesture = null;
            track.classList.remove('dragging');
            isReleasing = true;
            if(track.hasPointerCapture(id)) track.releasePointerCapture(id);
            isReleasing = false;
            if(notify) actions.end(true);
        }
        track.addEventListener('pointerdown', event => {
            if(!actions.isReady() || gesture || event.button !== 0 || !event.isPrimary) return;
            gesture = {id: event.pointerId, x: event.clientX, value: actions.getValue(), moved: false};
            track.setPointerCapture(event.pointerId);
            track.classList.add('dragging');
            actions.begin();
            event.stopPropagation();
            event.preventDefault();
        });
        track.addEventListener('pointermove', event => {
            if(event.pointerId !== gesture?.id) return;
            if(!actions.isReady()){ cancel(); return; }
            const distance = event.clientX-gesture.x;
            if(Math.abs(distance)>3) gesture.moved = true;
            actions.change(PB.clamp(gesture.value+distance/(track.clientWidth*.58),0,1), false);
        });
        track.addEventListener('pointerup', event => {
            if(event.pointerId !== gesture?.id) return;
            if(!gesture.moved) actions.change(gesture.value>.5?.05:.95, false);
            cancel(false);
            actions.end(false);
        });
        track.addEventListener('pointercancel', () => cancel());
        track.addEventListener('lostpointercapture', () => {
            if(!isReleasing) cancel();
        });
        window.addEventListener('blur', () => cancel());
        window.addEventListener('resize', () => cancel());
        track.addEventListener('keydown', event => {
            if(!actions.isReady()) return;
            const value = actions.getValue();
            const values = {ArrowLeft:value-.1, ArrowDown:value-.1,
                ArrowRight:value+.1, ArrowUp:value+.1, Home:0, End:1};
            if(!(event.key in values)) return;
            event.preventDefault();
            cancel(false);
            actions.begin();
            actions.change(PB.clamp(values[event.key],0,1), true);
            actions.end(false);
        });
        return {track, handle: track.querySelector('.pull-handle'), cancel};
    }

    return {mount};
})();
