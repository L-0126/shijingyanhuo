PB.S5 = (function(){
    const {piece} = PB.Book;
    const {person, rect} = PB.ART;
    const stories = [
        ['包饺子', '饺子刚下锅，快洗洗手上来！', 'M37 63q7-14 15 0m6 0q7-14 15 0m5 0q7-14 15 0'],
        ['庆生日', '生日快乐！吹蜡烛前先许个愿。', 'M48 62h33m-30-6h27m-21-1v-8m7 8v-11m7 11v-8'],
        ['弹吉他', '猫在怀里打呼噜，曲子就弹慢一点。', 'M62 58l25-20m-8 8-12 15m-16 3q8-20 21-7t-21 7Z'],
        ['写作业', '慢慢写，写完了就下楼吃饭。', 'M41 61l22 2 22-8v11l-22 7-22-3Z'],
        ['吃麻辣烫', '这碗给你，多加了两勺辣油。', 'M42 62q18 23 38 0Zm8-6 17-19m-9 19 16-21'],
        ['浇兰花', '晚上给兰花浇点水，明早就精神了。', 'M60 72V49q-20-16-14 1l14 5q8-28 18-17l-18 21']
    ];

    function mount(spread){
        const {L, R} = spread;
        spread.buildFrom = .40;
        for(const [side, x] of [[L,0],[R,800]]){
            side.page.insertBefore(PB.svgUse('s5-print',x,800,1000,'print'), side.shadows);
        }
        const add = (side, name, x, y, options = {}) =>
            piece(side, 's5-'+name, {x, y, ...options});
        const sky = add(L, 'sky', 0, -372, {lead: .56, shadow: false});
        add(R, 'east-bridge', 535, -312, {scale: .56, lead: .51, shadow: false, yaw: -.08});
        add(R, 'bridge', 401, -206, {lead: .78, shadow: false, yaw: .04});
        add(L, 'wing-west', -417, -22, {yaw: -.12, lead: .75,
            build: [0, 105, 181, 257, 358], buildDelay: .08});
        add(R, 'wing-east', 141, 36, {yaw: .10, lead: .68,
            build: [0, 103, 177, 276], buildDelay: .13});
        const yaw = .34, towerX = -142, towerY = -65;
        const towerFloors = [0, 157, 260, 373, 486, 590];
        add(R, 'tower-side', towerX+216*Math.cos(yaw), towerY+216*Math.sin(yaw), {
            anchor: 0, yaw: yaw-Math.PI/2, lead: 1, build: towerFloors
        });
        const tower = add(L, 'tower-front', towerX, towerY, {yaw, lead: 1, build: towerFloors});
        add(L, 'lower-street', -298, 64, {yaw: .07, lead: .59,
            build: [0, 90, 176], buildDelay: .04});
        add(L, 'cliff', -281, 126, {yaw: -.02, lead: 1, shadow: false});
        tower.node.removeAttribute('aria-hidden');

        const lightPools = stories.map((_, i) => {
            const glow = PB.el('s5-window-glow', L.page);
            glow.style.left = ((i%2 ? 607 : 479) - Math.floor(i/2)*29) + 'px';
            glow.style.top = (677 + Math.floor(i/2)*66) + 'px';
            return glow;
        });
        const lanterns = PB.el('s5-lanterns', sky.node);
        for(let i = 0; i < 6; i++){
            const lantern = PB.svgUse('s5-lantern', 0, 39, 55);
            lantern.style.left = (9+i*15.5) + '%';
            lantern.style.bottom = (7+(i%3)*4) + '%';
            lantern.style.animationDelay = i*.24 + 's';
            lantern.style.setProperty('--drift', (i%2 ? 36 : -30) + 'px');
            lanterns.append(lantern);
        }
        const message = PB.el('s5-finale-message', PB.ui);
        message.setAttribute('role', 'status');

        function celebrate(){
            if(lanterns.classList.contains('released')) return;
            lanterns.classList.add('released');
            message.textContent = '四方食事，不过一碗人间烟火。';
            audioSynth.playBell(330, 2.4);
        }

        const windows = stories.map(([label, dialogue, detail], i) => {
            const window = document.createElement('button');
            window.type = 'button';
            window.className = 's5-window';
            window.setAttribute('aria-label', '木窗 · '+label);
            window.setAttribute('aria-pressed', 'false');
            window.disabled = true;
            window.style.left = (i%2 ? 263 : 101) + 'px';
            const row = Math.floor(i/2);
            const floor = tower.courses[3-row];
            window.style.top = (155+row*113-floor.top) + 'px';
            const first = person(29,28,{shirt:'#8c4837',legs:0,hair:i===0?'#a18c76':'#382728',
                style:['bun','waves','part','bob','tied','recede'][i],
                face:['round','young','square','heart','oval','long'][i],
                eyes:['laugh','bright','narrow','bright','soft','narrow'][i],
                mouth:['warm','open','quiet','focus','wry','warm'][i]});
            const second = i===2 || i===5 ? '' :
                person(100,37-(i%2)*10,{shirt:'#634041',legs:0,hair:i===0?'#a18c76':'#392b2c',dir:-1,
                    style:i===0?'recede':i===3?'crop':'tied',face:i===0?'long':i===3?'square':'heart',
                    eyes:i===0?'narrow':'soft',mouth:i===1?'warm':'quiet'});
            window.innerHTML = `
                <svg class="s5-window-room" viewBox="0 0 128 78" aria-hidden="true">
                    ${rect(0,0,128,78,'#e9a659')}
                    ${rect(5,5,118,60,'#ffcc83')}
                    <g transform="translate(0 15) scale(1 .73)">${first}${second}</g>
                    <path d="M26 73h79" stroke="#763f31" stroke-width="12"/>
                    <path d="${detail}" fill="none" stroke="#63352c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="s5-shutter s5-shutter-left" aria-hidden="true"></span>
                <span class="s5-shutter s5-shutter-right" aria-hidden="true"></span>
            `;
            floor.node.append(window);
            window.addEventListener('click', () => {
                window.setAttribute('aria-pressed', 'true');
                lightPools[i].classList.add('lit');
                PB.UI.showBubble(dialogue, window);
                audioSynth.playBell(390+i*40, .48);
                if(windows.every(item => item.getAttribute('aria-pressed') === 'true')) celebrate();
            });
            return window;
        });

        add(L, 'steps', -634, 133, {lead: .35, yaw: -.31, scale: .60});
        add(L, 'lamp', -731, 128, {lead: .32, scale: .53});
        add(L, 'harvest', -536, 67, {lead: .43, scale: .53});
        const visitor = add(L, 'homecoming', -583, 133, {
            lead: .16, scale:.61, shadowSides: [R],
            label: '陪归家人走到码头，坐船回家'
        });
        visitor.node.addEventListener('click', () => {
            windows[0].click();
            PB.UI.showBubble('“妈，我回来了！” “饺子刚下锅，快上来！”', visitor.node);
        });
        const feast = add(R, 'feast', 587, 269, {
            lead: .19, scale:.91, yaw:.10, label:'在院坝火锅桌举杯'
        });
        feast.node.addEventListener('click', () => {
            PB.UI.showBubble('锅开咯！红汤烫毛肚，清汤涮青菜。来，碰个杯！', feast.node);
            celebrate();
        });
        add(R, 'feast-guest-left', 455, 314, {lead: .10, scale: .76, yaw:.06});
        add(R, 'feast-guest-right', 725, 315, {lead: .11, scale: .75, yaw: -.15});
        piece(R, 's1-cat', {x: 627, y: 366, scale: .51, lead: .04, yaw:.14});
        const boat = add(L, 'boat', -220, 215, {
            lead: .21, scale: .93, yaw: 0, shadow: false, parts: true,
            label: '乘游轮渡江回家'
        });

        const BOARDING_START = .24;
        const SAILING_START = .30;
        const SAILING_END = .70;
        const LANDING_END = .78;
        const approach = [
            [-583, 133, 0], [-620, 95, 36], [-505, 42, 64],
            [-360, 100, 24], [-305, 132, 0], [-305, 215, 0]
        ];
        const crossing = [
            [-220, 215, 0], [-95, 260, 0], [95, 300, 0], [270, 300, 0]
        ];
        const arrival = [[435, 300, 0], [455, 291, 0], [482, 284, 0]];

        function routePose(route, progress) {
            const offset = PB.clamp(progress, 0, 1) * (route.length - 1);
            const index = Math.min(Math.floor(offset), route.length - 2);
            const from = route[index], to = route[index + 1];
            const ratio = offset - index;
            return {
                x: PB.lerp(from[0], to[0], ratio),
                y: PB.lerp(from[1], to[1], ratio),
                elevation: PB.lerp(from[2], to[2], ratio)
            };
        }

        function updateJourney(progress, complete) {
            const sailing = PB.smooth(PB.clamp(
                (progress - SAILING_START) / (SAILING_END - SAILING_START), 0, 1
            ));
            const boatPose = routePose(crossing, sailing);
            PB.Book.setPiecePose(boat, boatPose);
            let pose;
            let passengerOpacity = 0;
            let stage = 'approach';
            if(progress < BOARDING_START) {
                pose = routePose(approach, progress / BOARDING_START);
            } else if(progress < SAILING_START) {
                stage = 'boarding';
                const fraction = (progress - BOARDING_START) /
                    (SAILING_START - BOARDING_START);
                pose = routePose([
                    approach[approach.length - 1], [-294, 215, 35]
                ], fraction);
                passengerOpacity = PB.smooth(fraction);
            } else if(progress <= SAILING_END) {
                stage = 'crossing';
                pose = {...boatPose, x: boatPose.x - 74, elevation: 35};
                passengerOpacity = 1;
            } else if(progress < LANDING_END) {
                stage = 'landing';
                const fraction = (progress - SAILING_END) /
                    (LANDING_END - SAILING_END);
                pose = routePose([[363, 300, 16], arrival[0]], fraction);
                passengerOpacity = 1 - PB.smooth(fraction);
            } else {
                stage = complete ? 'home' : 'steps';
                pose = routePose(arrival,
                    (progress - LANDING_END) / (1 - LANDING_END));
            }
            PB.Book.setPiecePose(visitor, pose);
            PB.Book.setPart(boat, 'passenger', {opacity: String(passengerOpacity)});
            const visibility = complete ? 0 : 1 - passengerOpacity;
            visitor.node.style.setProperty('--traveler-opacity', visibility);
            visitor.node.classList.add('s5-traveler');
            visitor.node.inert = visibility < .5;
            for(const cast of visitor.casts) {
                cast.classList.toggle('s5-hidden-shadow', passengerOpacity > 0 || complete);
            }
            boat.node.dataset.journeyStage = stage;
            boat.node.dataset.passengerOpacity = String(passengerOpacity);
            visitor.node.dataset.journeyStage = stage;
        }

        spread.controls = {
            setProgress(value, complete) {
                updateJourney(PB.clamp(value, 0, 1), complete);
                for(let i = 0; i < windows.length; i++) {
                    const lit = value > (i + 1) / 8;
                    if(lit && windows[i].getAttribute('aria-pressed') !== 'true') {
                        PB.UI.showBubble(stories[i][1], windows[i]);
                    }
                    windows[i].setAttribute('aria-pressed', String(lit));
                    lightPools[i].classList.toggle('lit', lit);
                }
                if(complete) celebrate();
                else {
                    lanterns.classList.remove('released');
                    message.textContent = '';
                }
            }
        };
        let available;
        PB.rafLoop.add(() => {
            const canOpen = spread.ready && PB.Book.getTheta() > 150;
            if(available === canOpen) return;
            available = canOpen;
            for(const window of windows) window.disabled = !canOpen;
        });
    }

    return {mount};
})();
