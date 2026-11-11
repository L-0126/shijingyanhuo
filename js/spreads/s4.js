PB.S4 = (function(){
    const {piece, setPart, setPiecePose} = PB.Book;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const TAU = Math.PI * 2;
    const WHEEL_DRAG = 1.35;
    const WHEEL_FRICTION = 1.2;
    const MAX_SPEED = 32;
    const CHARGE_DURATION = .72;
    const BURST_DURATION = 2.8;
    const COUNT_INTERVAL = .48;
    const HOP_SCALE = 1.30;
    const HOP_ORIGIN = {x: 18, y: 454};
    const HOP_CELLS = [[116,324],[116,266],[60,208],[172,208],
        [116,150],[60,92],[172,92],[116,34]];
    const NOTES = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
    const round = value => Number(value.toFixed(3));
    const setAttribute = (node, name, value) => {
        if(node.getAttribute(name) !== value) node.setAttribute(name, value);
    };

    function mount(spread){
        const {L, R} = spread;
        spread.buildFrom = .10;
        spread.layeredReveal = true;
        spread.waitForCover = true;
        for(const [side, x] of [[L, 0], [R, 800]]){
            side.page.insertBefore(PB.svgUse('s4-print', x, 800, 1000, 'print'), side.shadows);
        }
        const buildings = [];
        const add = (side, name, x, y, options = {}) => {
            const item = piece(side, 's4-' + name, {x, y, ...options});
            if(options.build){
                const [width, height] = PB.ART.size['s4-'+name];
                const facade = PB.svgUse('s4-'+name, options.vx || 0,
                    options.vw || width, height, 's4-settled-facade');
                facade.style.display = 'none';
                item.node.append(facade);
                buildings.push({facade, assembly: item.node.querySelector('.paper-assembly')});
            }
            return item;
        };
        function flattenBuildings(isSettled){
            for(const building of buildings){
                building.assembly.style.display = isSettled ? 'none' : '';
                building.facade.style.display = isSettled ? '' : 'none';
            }
        }
        for(const [side, vx, anchor] of [[L, 0, 1], [R, 750, 0]]){
            add(side, 'sky', 0, -409, {vx, vw: 750, anchor, lead: .98, shadow: false});
        }
        add(L, 'west-houses', -452, -264, {
            build: [0, 52, 185, 306, 440], lead: .90
        });
        add(L, 'house-side', -172, -264, {
            anchor: 0, yaw: -Math.PI/2, build: [0, 90, 207, 324, 397], lead: .90
        });
        add(R, 'east-houses', 450, -277, {
            build: [0, 54, 177, 305, 440], buildDelay: .05, lead: .87
        });
        add(R, 'house-side', 714, -277, {
            anchor: 0, yaw: -Math.PI/2, build: [0, 90, 207, 324, 397], lead: .87
        });
        add(L, 'inner-lane', 0, -337, {lead: .87, shadow: false});
        const gateCuts = [0, 91, 137, 241, 378];
        for(const y of [-153, -65]){
            for(const [side, vx, anchor] of [[L, 0, 1], [R, 195, 0]]){
                add(side, 'gate', 0, y, {
                    vx, vw: 195, anchor, lead: .77, build: gateCuts,
                    buildDelay: .09
                });
            }
        }
        for(const x of [-104, 104]){
            add(x < 0 ? L : R, 'gate-reveal', x, -65, {
                anchor: 1, yaw: Math.PI/2, lead: .75
            });
        }
        for(const [side, vx, anchor] of [[L, 0, 1], [R, 195, 0]]){
            add(side, 'gate-cap', 0, -65, {
                vx, vw: 195, anchor, flat: true, dz: 256, lead: .65
            });
        }
        add(L, 'wire', 0, -335, {dz: 345, lead: .52, shadow: false});
        const birds = add(R, 'birds', 325, -333, {
            dz: 387, scale: .85, lead: .48, parts: true, shadow: false
        });
        for(const x of [-294, 251]){
            add(x<0?L:R, 'laundry-post', x, -210, {dz: 350, lead: .44});
        }
        const laundry = add(L, 'laundry', -20, -210, {
            dz: 367, lead: .38, parts: true, shadowSides: [L, R]
        });

        add(L, 'shop', -514, -52, {build: [0, 59, 145, 252], lead: .69});
        for(const x of [-679, -349]){
            add(L, 'shop-side', x, -52, {
                anchor: 0, yaw: -Math.PI/2, build: [0, 59, 145, 252], lead: .69
            });
        }
        add(L, 'awning', -514, 22, {flat: true, dz: 247, lead: .42});
        add(L, 'awning-edge', -514, 22, {dz: 224, lead: .41});
        add(L, 'shop-sign', -514, 24, {dz: 185, lead: .39});
        add(L, 'icebox', -643, 64, {lead: .34, scale: .86});
        add(L, 'blackboard', -700, 194, {lead: .17, yaw: .12, scale: .87});
        add(L, 'flask', -288, 186, {lead: .17, scale: .9});

        const tailor = add(L, 'tailor', -506, 87, {
            parts: true, lead: .29, dz: 32, scale: 1.12,
            label: '请裁缝阿婆踩缝纫机'
        });
        const table = add(L, 'table-front', -461, 170, {parts: true, lead: .29});
        for(const x of [-577, -345]){
            add(L, 'table-side', x, 170, {anchor: 1, yaw: Math.PI/2, lead: .29});
        }
        add(L, 'table-top', -461, 170, {flat: true, dz: 88, lead: .29});
        const sewing = add(L, 'sewing', -456, 140, {
            parts: true, dz: 88, lead: .22, label: '转动蝴蝶牌缝纫机'
        });
        const repairer = add(L, 'repairer', -216, 26, {
            lead: .29, label: '听修表老先生讲手艺'
        });
        add(L, 'repair-table', -199, 99, {lead: .27});
        add(L, 'repair-top', -199, 99, {flat: true, dz: 87, lead: .27});
        const clock = add(L, 'clock', -162, 48, {
            dz: 87, parts: true, scale: .75, lead: .24,
            label: '听老座钟与修表人的故事'
        });
        const phone = add(L, 'phone', -643, 63, {
            parts: true, dz: 58, scale: .95, lead: .26,
            label: '拨打王记公用电话'
        });
        const operator = add(R, 'popcorn-man', 254, 34, {
            parts: true, lead: .29, label: '请老伯摇炉爆米花'
        });
        add(R, 'furnace', 394, 120, {lead: .28});
        const boiler = add(R, 'boiler', 414, 105, {
            parts: true, dz: 58, lead: .24, label: '爆米花炉，点击三次加压开炉'
        });
        const children = [[598,211],[699,122],[611,339]].map(([x,y], i) =>
            add(R, 'child-'+i, x, y, {
                parts: true, lead: .18-i*.035, scale: i===1 ? .87 : 1,
                label: ['听捧着搪瓷缸的孩子说话','听捂耳的小孩说话','听背书包的孩子说话'][i]
            }));
        const clouds = [0,1,2].map(i => add(R, 'popcorn-cloud', 502+i*13, 157+i*16, {
            parts: true, lead: .16, scale: [.90,.73,.55][i], dz: 80+i*7,
            yaw: -.10+i*.12, shadowArt: 's4-popcorn-cloud'
        }));
        const kernels = Array.from({length: 12}, (_, i) => {
            const angle = -.9 + i*2.7/11;
            return {
                paper: add(R, 'kernel', 511, 165, {flat: true, lead: .12, dz: 90}),
                x: 511, y: 165, z: 90,
                vx: Math.cos(angle)*(35+i%4*18),
                vy: Math.sin(angle)*(57+i%3*18)+32,
                vz: 145+i%4*18,
                isLanded: false
            };
        });
        const hopscotch = add(R, 'hopscotch', HOP_ORIGIN.x, HOP_ORIGIN.y, {
            flat: true, parts: true, shadow: false, scale: HOP_SCALE, lead: .13,
            label: '跳房子，依次点亮数字与音阶'
        });
        const hopCells = HOP_CELLS.map(([x, y]) => ({
            x: HOP_ORIGIN.x+(x-116)*HOP_SCALE,
            y: HOP_ORIGIN.y+(y-370)*HOP_SCALE
        }));
        const hopStart = {x: hopCells[0].x+80, y: hopCells[0].y+48};
        const hopper = add(R, 'hopper', hopStart.x, hopStart.y, {
            parts: true, scale: .82, lead: .10, shadowSides: [L],
            label: '跟着数字和音阶跳方格，点击开始'
        });
        const state = {
            phase: 0, speed: 0, isDragging: false, stitchDistance: 0,
            step: 0, stageTime: 0, isBusy: false, burstTime: -1,
            pressure: 0, pressureTarget: 0, arms: 0,
            wind: 0, windSpeed: 0, phoneTime: -1, phoneBeat: 0,
            countTime: -1, count: -1, isDirty: true,
            springs: [0,1,2].map(() => ({position: 0, velocity: 0}))
        };
        const tools = PB.$('#s4-tools');
        const anchor = PB.el('drag-anchor', L.g, 0, 0);
        anchor.style.transform = 'translate3d(-580px,410px,45px)';
        const dial = createDial(tools, {
            isReady: () => spread.ready && PB.Book.getTheta() > 150,
            begin(){
                state.isDragging = true;
                state.speed = 0;
                PB.UI.dismissHint(dial.button);
            },
            change(delta, speed){
                state.phase += delta;
                state.stitchDistance += Math.abs(delta);
                state.speed = reducedMotion.matches ? 0 : PB.clamp(speed, -MAX_SPEED, MAX_SPEED);
                state.isDirty = true;
            },
            end(cancelled){
                state.isDragging = false;
                if(cancelled) stopWheel();
            },
            turn: turnWheel,
            stop: stopWheel
        });
        const touchTabs = PB.el('s4-touch-tabs', tools);
        const touchButtons = [
            ['摇炉','摇炉加压，第三次开炉',popCorn],
            ['跳格','跳房子，数字和音阶',countSquares],
            ['传呼','拨响王记公用电话',ringPhone]
        ].map(([text, label, action]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = text;
            button.setAttribute('aria-label', label);
            button.disabled = true;
            button.addEventListener('click', action);
            touchTabs.append(button);
            return button;
        });
        let lastReady = false;
        let lastLayout = -1;
        let previousPointer = null;

        function stopWheel(){
            state.speed = state.stitchDistance = 0;
            state.isDirty = true;
        }

        function turnWheel(direction = 1){
            if(!spread.ready) return;
            dial.cancel(false);
            state.isDragging = false;
            if(reducedMotion.matches){
                state.phase += direction * Math.PI/3;
                audioSynth.playSewingMachine(.125);
            }else{
                state.speed = PB.clamp(state.speed+direction*22, -MAX_SPEED, MAX_SPEED);
            }
            state.isDirty = true;
            PB.UI.dismissHint(dial.button);
            PB.UI.showBubble('针脚要细，日子要慢。一件衣裳，还能再穿好多年。', tailor.node);
        }

        function resetKernels(){
            for(const [i, kernel] of kernels.entries()){
                const angle = -.9+i*2.7/11;
                Object.assign(kernel, {
                    x: 511, y: 165, z: 90, isLanded: false,
                    vx: Math.cos(angle)*(35+i%4*18),
                    vy: Math.sin(angle)*(57+i%3*18)+32,
                    vz: 145+i%4*18
                });
            }
        }

        function popCorn(){
            if(!spread.ready || state.isBusy) return;
            if(state.step === 3){
                state.step = 0;
                state.burstTime = -1;
                for(const spring of state.springs) spring.position = spring.velocity = 0;
                resetKernels();
            }
            state.step++;
            state.stageTime = 0;
            state.isBusy = !reducedMotion.matches;
            state.pressureTarget = state.step === 3 ? 0 : state.step/2;
            state.isDirty = true;
            PB.UI.dismissHint(boiler.node);
            PB.UI.showBubble([
                '', '摇一摇，小火慢慢烘。再添一把劲！',
                '快好喽！小囡捂好耳朵，再点一下就开炉。',
                '嘭！热乎的爆米花，拿搪瓷缸来装！'
            ][state.step], operator.node, 3900);
            if(state.step === 3){
                state.burstTime = 0;
                audioSynth.playPopcornBang();
            }else{
                audioSynth.playSewingMachine(.125);
            }
            if(reducedMotion.matches) settleMotion();
        }

        function settleMotion(){
            stopWheel();
            state.isDragging = false;
            dial.cancel(false);
            state.pressure = state.pressureTarget;
            state.arms = state.step < 3 ? state.step/2 : 0;
            state.isBusy = false;
            state.stageTime = state.step === 3 ? BURST_DURATION : CHARGE_DURATION;
            state.wind = state.windSpeed = 0;
            if(state.step === 3){
                state.burstTime = BURST_DURATION;
                for(const spring of state.springs){
                    spring.position = 1;
                    spring.velocity = 0;
                }
                for(const [i, kernel] of kernels.entries()){
                    kernel.x = 480+(i*37)%220;
                    kernel.y = 200+(i*53)%196;
                    kernel.z = 1;
                    kernel.isLanded = true;
                }
            }
            state.isDirty = true;
        }

        function ringPhone(){
            if(!spread.ready || state.phoneTime >= 0) return;
            state.phoneTime = 0;
            state.phoneBeat = 0;
            state.isDirty = true;
            PB.UI.showBubble('302室张家姆妈，侬屋里厢电话来哉！', phone.node, 4300);
        }

        function countSquares(){
            if(!spread.ready || state.countTime >= 0) return;
            state.countTime = 0;
            state.count = -1;
            state.isDirty = true;
            PB.UI.clearBubble();
            PB.UI.dismissHint(hopper.node);
        }

        tailor.node.addEventListener('click', () => turnWheel());
        sewing.node.addEventListener('click', () => turnWheel());
        operator.node.addEventListener('click', popCorn);
        boiler.node.addEventListener('click', popCorn);
        phone.node.addEventListener('click', ringPhone);
        hopscotch.node.addEventListener('click', countSquares);
        hopper.node.addEventListener('click', countSquares);
        for(const target of [repairer, clock]){
            target.node.addEventListener('click', () => {
                PB.UI.showBubble('表走得准，全靠这些小零件。旧物件，也有长情。', target.node);
                turnClock();
            });
        }
        function turnClock(){
            state.speed = reducedMotion.matches ? 0 : 12;
            state.isDirty = true;
            audioSynth.playBell(660, .16);
        }
        children.forEach((child, i) => child.node.addEventListener('click', () =>
            PB.UI.showBubble([
                '阿伯，我带了玉米！这一缸要装得满满的。',
                '我捂好耳朵啦！好了没有呀？',
                '放学先来这里，香味能飘满整条弄堂。'
            ][i], child.node)));
        PB.UI.createHint(dial.button, '转齿轮 · 缝一针', 's4');
        PB.UI.createHint(boiler.node, '点三次 · 爆米花', 's4');
        PB.UI.createHint(hopper.node, '跳一格 · 听一拍', 's4');

        function deactivate(){
            dial.cancel(false);
            Object.assign(state, {
                phase: 0, speed: 0, isDragging: false, stitchDistance: 0,
                step: 0, stageTime: 0, isBusy: false, burstTime: -1,
                pressure: 0, pressureTarget: 0, arms: 0,
                wind: 0, windSpeed: 0, phoneTime: -1, phoneBeat: 0,
                countTime: -1, count: -1, isDirty: true
            });
            for(const spring of state.springs) spring.position = spring.velocity = 0;
            resetKernels();
            previousPointer = null;
            tools.hidden = true;
            flattenBuildings(false);
            lastReady = false;
            lastLayout = -1;
            dial.button.disabled = true;
            dial.button.tabIndex = -1;
            touchButtons.forEach(button => { button.disabled = true; });
            renderMechanisms();
        }
        spread.controls = {
            setStitch(progress, speed) {
                state.phase = progress * Math.PI * 32;
                state.speed = speed * 25;
                state.isDragging = true;
                renderMechanisms();
            }
        };
        spread.onDeactivate = deactivate;
        reducedMotion.addEventListener('change', () => {
            if(reducedMotion.matches) settleMotion();
        });
        PB.$('#view').addEventListener('pointermove', event => {
            if(!spread.ready || reducedMotion.matches || event.pointerType !== 'mouse' ||
                event.buttons || PB.root.classList.contains('view-dragging')) return;
            if(previousPointer){
                const movement = PB.clamp(event.clientX-previousPointer.x, -30, 30);
                state.windSpeed += movement*.28;
                state.windSpeed = PB.clamp(state.windSpeed, -35, 35);
                state.isDirty = true;
            }
            previousPointer = {x: event.clientX};
        });
        PB.$('#view').addEventListener('pointerleave', () => { previousPointer = null; });

        function stepWheel(dt){
            if(!state.isDragging && state.speed){
                const speed = Math.abs(state.speed);
                const next = Math.max(0, speed-(WHEEL_DRAG*speed+WHEEL_FRICTION)*dt);
                state.speed = next < .04 ? 0 : Math.sign(state.speed)*next;
                const delta = state.speed*dt;
                state.phase = (state.phase+delta)%TAU;
                state.stitchDistance += Math.abs(delta);
                state.isDirty = true;
            }
            if(state.stitchDistance >= TAU){
                state.stitchDistance %= TAU;
                audioSynth.playSewingMachine(.125);
            }
        }

        function stepPopcorn(dt){
            if(state.isBusy){
                state.stageTime += dt;
                if(state.step < 3 && state.stageTime >= CHARGE_DURATION){
                    state.isBusy = false;
                    state.stageTime = CHARGE_DURATION;
                }
                state.isDirty = true;
            }
            const targetArms = state.step < 3 ? state.step/2 : 0;
            for(const [key, target] of [['pressure',state.pressureTarget],['arms',targetArms]]){
                if(state[key] === target) continue;
                state[key] += (target-state[key])*(1-Math.exp(-12*dt));
                if(Math.abs(state[key]-target) < .0001) state[key] = target;
                state.isDirty = true;
            }
            if(state.burstTime < 0 || state.burstTime >= BURST_DURATION) return;
            state.burstTime = Math.min(BURST_DURATION, state.burstTime+dt);
            for(const [i, spring] of state.springs.entries()){
                if(state.burstTime < i*.075) continue;
                const stiffness = [180,220,260][i];
                const damping = [9.4,10.4,11.3][i];
                spring.velocity += (-stiffness*(spring.position-1)-damping*spring.velocity)*dt;
                spring.position += spring.velocity*dt;
                if(state.burstTime === BURST_DURATION){
                    spring.position = 1;
                    spring.velocity = 0;
                }
            }
            for(const kernel of kernels){
                if(kernel.isLanded) continue;
                kernel.vz -= 330*dt;
                kernel.vx *= Math.exp(-.7*dt);
                kernel.vy *= Math.exp(-.7*dt);
                kernel.x += kernel.vx*dt;
                kernel.y += kernel.vy*dt;
                kernel.z += kernel.vz*dt;
                if(kernel.z <= 1){
                    kernel.z = 1;
                    kernel.isLanded = true;
                }
            }
            if(state.burstTime === BURST_DURATION) state.isBusy = false;
            state.isDirty = true;
        }

        function stepDetails(dt){
            if(state.wind || state.windSpeed){
                state.windSpeed += (-38*state.wind-5*state.windSpeed)*dt;
                state.wind += state.windSpeed*dt;
                if(Math.abs(state.wind)+Math.abs(state.windSpeed)<.008){
                    state.wind = state.windSpeed = 0;
                }
                state.isDirty = true;
            }
            if(state.phoneTime >= 0){
                state.phoneTime += dt;
                if(state.phoneBeat < 4 && state.phoneTime >= state.phoneBeat*.22){
                    audioSynth.playBell(state.phoneBeat%2 ? 1160 : 920, .12);
                    state.phoneBeat++;
                }
                if(state.phoneTime > 1) state.phoneTime = -1;
                state.isDirty = true;
            }
            if(state.countTime >= 0){
                state.countTime += dt;
                const count = Math.min(7, Math.floor(state.countTime/COUNT_INTERVAL)-1);
                if(count !== state.count){
                    state.count = count;
                    audioSynth.playBell(NOTES[count], .20);
                }
                state.isDirty = true;
                if(state.countTime >= COUNT_INTERVAL*8+.5){
                    state.countTime = -1;
                    state.isDirty = true;
                }
            }
        }

        PB.physicsLoop.add({
            step(dt){
                if(!spread.ready || PB.Book.getTheta() < 150) return;
                stepWheel(dt);
                stepPopcorn(dt);
                stepDetails(dt);
            },
            render(){
                if(state.isDirty && (L.present || R.present)) renderMechanisms();
            }
        });

        function renderHopper(){
            const time = state.countTime;
            const completed = time < 0 ? state.count+1
                : Math.min(8, Math.floor(time/COUNT_INTERVAL));
            const from = completed ? hopCells[completed-1] : hopStart;
            const to = hopCells[Math.min(completed, 7)];
            const beat = time < 0 ? 0 : (time/COUNT_INTERVAL)%1;
            const progress = time < 0 || completed === 8 || reducedMotion.matches
                ? 0 : PB.clamp((beat-.16)/.84, 0, 1);
            const travel = PB.smooth(progress);
            const lift = Math.sin(progress*Math.PI);
            setPiecePose(hopper, {
                x: round(from.x+(to.x-from.x)*travel),
                y: round(from.y+(to.y-from.y)*travel),
                elevation: round(lift*37)
            });
            const direction = completed%2 ? -1 : 1;
            setPart(hopper, 'left-leg', {transform: `rotate(${round(lift*23*direction)}deg)`});
            setPart(hopper, 'right-leg', {transform: `rotate(${-round(lift*23*direction)}deg)`});
            setPart(hopper, 'left-arm', {transform: `rotate(${round(lift*26)}deg)`});
            setPart(hopper, 'right-arm', {transform: `rotate(${-round(lift*26)}deg)`});
            setAttribute(hopper.node, 'data-square', String(completed));
        }

        function renderMechanisms(){
            const angle = round(state.phase*180/Math.PI);
            const movement = state.speed || state.isDragging ? 1 : 0;
            setPart(sewing, 'wheel', {transform: `rotate(${angle}deg)`});
            const dialTransform = `rotate(${angle}deg)`;
            if(dial.rotor.style.transform !== dialTransform) dial.rotor.style.transform = dialTransform;
            setPart(sewing, 'needle', {transform: `translateY(${round(Math.sin(state.phase)*7*movement)}px)`});
            setPart(table, 'pedal', {transform: `rotate(${round(Math.cos(state.phase)*8*movement)}deg)`});
            setPart(tailor, 'arm', {transform: `rotate(${round(Math.sin(state.phase)*4*movement)}deg)`});
            setPart(clock, 'pendulum', {transform: `rotate(${round(Math.sin(state.phase*.5)*Math.min(1,Math.abs(state.speed)/15)*17)}deg)`});
            const charging = state.isBusy && state.step < 3;
            const shake = charging && !reducedMotion.matches ? Math.sin(state.stageTime*64)*state.step*.6 : 0;
            setPart(boiler, 'drum', {transform: `translateY(${round(shake)}px) rotate(${charging?round(Math.sin(state.stageTime*11)*4):0}deg)`});
            setPart(boiler, 'handle', {transform: `rotate(${charging?round(state.stageTime*480):0}deg)`});
            setPart(operator, 'arm', {transform: `rotate(${charging?round(Math.sin(state.stageTime*11)*15):0}deg)`});
            setPart(boiler, 'gauge', {transform: `rotate(${round(state.pressure*230)}deg)`});
            setPart(boiler, 'latch', {transform: `rotate(${state.step===3?-62:0}deg)`});
            setAttribute(boiler.node, 'data-stage', String(state.step));
            setAttribute(boiler.node, 'data-busy', String(state.isBusy));
            setAttribute(boiler.node, 'aria-label', state.step === 3
                ? '爆米花已开炉，落定后点击可重新加压'
                : `爆米花炉，已加压${state.step}次，${state.step===2?'再点一次开炉':'点击加压'}`);
            const burst = state.burstTime;
            children.forEach((child, i) => {
                const jump = burst >= 0 && burst < .9 && !reducedMotion.matches
                    ? Math.max(0,Math.sin((burst-i*.07)*Math.PI/.7))*24 : 0;
                setPiecePose(child, {elevation: jump-state.arms*7});
                const armLength = round(1-state.arms*.58);
                setPart(child, 'left-arm', {transform: `rotate(${-round(state.arms*142)}deg) scaleY(${armLength})`});
                setPart(child, 'right-arm', {transform: `rotate(${round(state.arms*149)}deg) scaleY(${armLength})`});
            });
            clouds.forEach((cloud, i) => {
                const value = Math.max(.001, state.springs[i].position);
                const fall = PB.clamp((burst-.72-i*.09)/.82, 0, 1);
                const drop = fall*fall;
                const settle = PB.smooth(fall);
                setPiecePose(cloud, {
                    x: 502+i*13+drop*(25-i*6),
                    y: 157+i*16+drop*(127+i*9),
                    elevation: (80+i*7)*(1-drop)+drop
                });
                setPart(cloud, 'bloom', {
                    transform: `scale(${round(value*(1-settle*.54))},${round(value*(1-settle*.80))})`,
                    opacity: burst < 0 ? '0' : '1'
                });
                setAttribute(cloud.node, 'data-landed', String(fall === 1));
            });
            kernels.forEach(kernel => {
                const display = burst < 0 ? 'none' : '';
                if(kernel.paper.node.style.display !== display){
                    kernel.paper.node.style.display = display;
                    kernel.paper.cast.style.display = display;
                }
                setPiecePose(kernel.paper, {x: kernel.x, y: kernel.y, elevation: kernel.z});
            });
            for(let i = 0; i < 5; i++){
                const flight = burst >= 0 && burst < 2.3 && !reducedMotion.matches
                    ? Math.max(0,Math.sin(Math.PI*PB.clamp((burst-i*.055)/1.9,0,1))) : 0;
                setPart(birds, 'bird-'+i, {
                    transform: `translate(${round(flight*(i-2)*19)}px,${-round(flight*(53+i%2*21))}px) rotate(${round(flight*Math.sin(burst*22+i)*13)}deg)`
                });
            }
            for(const [i, name] of ['shirt','sheet','apron'].entries()){
                setPart(laundry, name, {transform: `rotate(${round(state.wind*(1-i*.17))}deg)`});
            }
            setPart(phone, 'receiver', {transform: `rotate(${state.phoneTime<0||reducedMotion.matches?0:round(Math.sin(state.phoneTime*72)*3)}deg)`});
            for(let i = 0; i < 8; i++){
                setPart(hopscotch, 'cell-'+i, {opacity: state.count === i ? '1' : '.78',
                    filter: state.count === i ? 'drop-shadow(0 0 3px #f6d58a)' : 'none',
                    transform: state.count === i && !reducedMotion.matches ? 'scale(1.06)' : 'scale(1)'});
            }
            setAttribute(hopscotch.node, 'data-count', String(state.count+1));
            renderHopper();
            setAttribute(dial.button, 'data-speed', String(round(state.speed)));
            state.isDirty = false;
        }

        PB.rafLoop.add(() => {
            const ready = spread.ready && PB.Book.getTheta() > 150;
            if(ready !== lastReady){
                flattenBuildings(ready);
                tools.hidden = !ready;
                dial.button.disabled = !ready;
                dial.button.tabIndex = ready ? 0 : -1;
                touchButtons.forEach(button => { button.disabled = !ready; });
                lastReady = ready;
                lastLayout = -1;
            }
            if(!ready) return;
            const revision = PB.Book.getCameraRevision();
            if(lastLayout === revision) return;
            const bounds = PB.localRect(anchor);
            tools.style.left = PB.clamp(bounds.left, 64, PB.viewport().width-64)+'px';
            tools.style.top = PB.clamp(bounds.top, 84, PB.viewport().height-(PB.viewport().width<900?226:148))+'px';
            lastLayout = revision;
            PB.UI.invalidateLayout();
        });
        renderMechanisms();
    }

    function createDial(parent, actions){
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 's4-dial';
        button.setAttribute('aria-label', '缝纫齿轮，拖动或方向键拨动，Home 停下');
        button.disabled = true;
        button.tabIndex = -1;
        button.innerHTML = '<span class="s4-dial-rotor" aria-hidden="true">' +
            '<svg viewBox="0 0 100 100"><path d="M42 3h16l2 10 9 4 9-6 11 11-6 9 4 9 10 2v16l-10 2-4 9 6 9-11 11-9-6-9 4-2 10H42l-2-10-9-4-9 6-11-11 6-9-4-9-10-2V42l10-2 4-9-6-9 11-11 9 6 9-4Z" fill="#c1b18c" stroke="#756247" stroke-width="2"/>' +
            '<circle cx="50" cy="50" r="30" fill="#707b6b" stroke="#e4d2a8" stroke-width="3"/>' +
            '<path d="M50 23v54M23 50h54M31 31l38 38M31 69l38-38" stroke="#d3c59c" stroke-width="5"/>' +
            '<circle cx="50" cy="50" r="9" fill="#a69168"/><circle cx="50" cy="20" r="4" fill="#855542"/></svg></span>' +
            '<span class="s4-dial-label">缝一针</span>';
        parent.append(button);
        let gesture = null;
        let suppressClick = false;
        let isReleasing = false;
        const getAngle = event => {
            const box = button.getBoundingClientRect();
            return Math.atan2(event.clientY-(box.top+box.height/2), event.clientX-(box.left+box.width/2));
        };
        function cancel(notify = true){
            if(!gesture) return;
            if(notify) suppressClick = true;
            const id = gesture.id;
            gesture = null;
            button.classList.remove('dragging');
            isReleasing = true;
            if(button.hasPointerCapture(id)) button.releasePointerCapture(id);
            isReleasing = false;
            if(notify) actions.end(true);
        }
        button.addEventListener('pointerdown', event => {
            if(!actions.isReady() || gesture || event.button !== 0 || !event.isPrimary) return;
            suppressClick = false;
            gesture = {id: event.pointerId, angle: getAngle(event), time: event.timeStamp,
                distance: 0};
            button.setPointerCapture(event.pointerId);
            button.classList.add('dragging');
            actions.begin();
            event.stopPropagation();
        });
        button.addEventListener('pointermove', event => {
            if(event.pointerId !== gesture?.id) return;
            if(!actions.isReady()){ cancel(); return; }
            const angle = getAngle(event);
            const delta = Math.atan2(Math.sin(angle-gesture.angle), Math.cos(angle-gesture.angle));
            const dt = Math.max(.008, (event.timeStamp-gesture.time)/1000);
            gesture.distance += Math.abs(delta);
            gesture.angle = angle;
            gesture.time = event.timeStamp;
            actions.change(delta, delta/dt);
        });
        button.addEventListener('pointerup', event => {
            if(event.pointerId !== gesture?.id) return;
            suppressClick = gesture.distance > .09;
            cancel(false);
            actions.end(false);
        });
        button.addEventListener('click', event => {
            if(event.detail !== 0 && suppressClick){ suppressClick = false; return; }
            actions.turn(1);
        });
        button.addEventListener('keydown', event => {
            if(!actions.isReady()) return;
            const direction = {ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1}[event.key];
            if(direction === undefined && event.key !== 'Home') return;
            event.preventDefault();
            suppressClick = true;
            cancel(false);
            actions.end(false);
            if(event.key === 'Home') actions.stop();
            else actions.turn(direction);
        });
        button.addEventListener('pointercancel', () => cancel());
        button.addEventListener('lostpointercapture', () => { if(!isReleasing) cancel(); });
        for(const type of ['blur','resize']) window.addEventListener(type, () => cancel());
        return {button, rotor: button.querySelector('.s4-dial-rotor'), cancel};
    }

    return {mount};
})();
