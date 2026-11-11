// Page-one layout and mechanisms share the book's fixed-step clock.
PB.S1 = (function(){
    const NOODLE_DURATION = 0.82;
    const LANTERN_STIFFNESS = 40;
    const LANTERN_DAMPING = 3.2;
    const DRAG_SMOOTHING = 12;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const {piece, setPart} = PB.Book;

    function mount(spread){
        const {L, R} = spread;
        spread.buildFrom = .12;
        spread.layeredReveal = true;
        spread.waitForCover = true;
        [L, R].forEach((half, i) => {
            const print = PB.svgUse(
                i ? 's1-print-right' : 's1-print-left', 0, 800, 1000, 'print'
            );
            half.page.insertBefore(print, half.shadows);
        });
        const add = (half, id, x, y, options = {}) =>
            piece(half, 's1-' + id, {x, y, ...options});

        add(L, 'dawn-backdrop', -405, -405, {scale: 1.09, lead: .95});
        add(R, 'night-backdrop', 405, -405, {scale: 1.09, lead: .95});
        add(L, 'hankou-row', -420, -270, {
            lead: .9, build: [0, 66, 180, 296, 438]
        });
        add(R, 'northwest-row', 426, -270, {
            lead: .9, build: [0, 68, 181, 294, 427], buildDelay: .04
        });
        const clock = add(L, 'clock', -666, -257, {
            scale: 1.32, lead: .9, parts: true,
            build: [0, 54, 151, 248, 360], buildDelay: .07,
            label: '敲响江汉关钟声'
        });
        add(L, 'ferry', -285, -224, {scale: .86, lead: .8});
        for(const [side, vx, anchor] of [[L, 0, 1], [R, 320, 0]]){
            add(side, 'arch', 0, -165, {
                vx, vw: 320, anchor, lead: .75,
                build: [0, 89, 179, 440], buildDelay: .13
            });
        }
        const lanterns = [-1, 1].map(side => {
            const lantern = add(side < 0 ? L : R, 'lantern', side*229, -153, {
                scale: 0.85, dz: 207, lead: 0.65, parts: true,
                label: side < 0 ? '轻摇左侧红灯笼' : '轻摇右侧红灯笼'
            });
            lantern.angle = 0;
            lantern.velocity = 0;
            lantern.node.addEventListener('click', () => {
                lantern.velocity = reduce.matches ? 0 : side*105;
                PB.UI.showBubble('灯笼一晃，好日子慢慢亮。', lantern.node);
            });
            return lantern;
        });

        add(L, 'shop-side', -279, -74, {
            yaw: -Math.PI/2, anchor: 0, lead: .65,
            build: [0, 95, 330], buildDelay: .19
        });
        add(L, 'shop', -474, -74, {
            lead: .65, build: [0, 61, 117, 330], buildDelay: .19
        });
        add(L, 'counter-side', -669, 180, {
            yaw: Math.PI/2, anchor: 1, lead: 0.35
        });
        add(L, 'counter-side', -279, 180, {
            yaw: Math.PI/2, anchor: 1, lead: 0.35
        });
        add(L, 'counter-top', -474, 180, {
            flat: true, dz: 118, lead: 0.35
        });
        const chef = add(L, 'chef', -417, 68, {
            scale: 1.1, lead: 0.4, parts: true, label: '请师傅颠一碗热干面'
        });
        add(L, 'counter', -474, 180, {lead: 0.35});
        add(L, 'steam', -493, 184, {
            dz: 104, scale: 0.85, lead: 0.35, parts: true
        });
        const girl = add(L, 'girl', -661, 320, {
            scale: 0.92, lead: 0.2, label: '听听过早姑娘的点单'
        });
        const cat = add(L, 'cat', -509, 346, {
            scale: 0.95, lead: 0.15, parts: true, label: '摸摸橘猫'
        });

        add(R, 'night-stall', 434, -42, {
            lead: .65, build: [0, 53, 112, 338], buildDelay: .19
        });
        add(R, 'night-awning', 434, 35, {
            flat: true, dz: 310, lead: .5
        });
        add(R, 'night-sign', 434, -40, {dz: 210, scale: .94, lead: .5});
        add(R, 'rack', 682, 28, {scale: .88, lead: .5});
        const cook = add(R, 'cook', 424, 101, {
            scale: 1.13, lead: 0.4, parts: true, label: '请大叔扇旺炭火'
        });
        const grill = add(R, 'grill', 434, 204, {lead: 0.35, parts: true});
        add(R, 'grill-side', 244, 204, {
            anchor: 1, yaw: Math.PI/2, lead: .35
        });
        add(R, 'grill-side', 624, 204, {
            anchor: 1, yaw: Math.PI/2, lead: .35
        });
        add(R, 'grill-top', 434, 204, {flat: true, dz: 120, lead: .35});
        const smoke = add(R, 'smoke', 448, 210, {
            dz: 142, lead: 0.35, parts: true
        });
        const friends = add(R, 'friends', 248, 348, {
            lead: 0.2, label: '听听夜宵桌边的闲聊'
        });
        add(R, 'spices', 688, 324, {lead: 0.2});

        let noodleTime = NOODLE_DURATION;
        let basketAngle = 0;
        let basketVelocity = 0;
        let hasBounced = false;
        let clockTime = 4;
        let catTime = 4;
        let fanValue = 0.5;
        let fanTarget = 0.5;
        let wind = 0;
        let fanDemoTime = 2;
        let sizzleCooldown = 0;
        let pendingWhistle = -1;
        let isDirty = true;
        const drag = createPullTab(cook, value => {
            fanTarget = value;
            fanDemoTime = 2;
        });
        spread.onDeactivate = () => {
            drag.cancelDrag();
            fanValue = fanTarget = .5;
            wind = 0;
            fanDemoTime = 2;
            pendingWhistle = -1;
            noodleTime = NOODLE_DURATION;
            drag.tabIndex = -1;
            isDirty = true;
        };
        const dragAnchor = PB.el('drag-anchor', R.g, 0, 0);
        dragAnchor.style.transform = 'translate3d(434px,480px,45px)';
        const tools = PB.$('#scene-tools');
        const handle = drag.querySelector('.pull-handle');
        let dragWidth = drag.clientWidth;
        let lastAnchorLayout = '';
        let lastHandleTransform = '';
        let wasReady = false;
        window.addEventListener('resize', () => {
            dragWidth = drag.clientWidth;
            lastAnchorLayout = '';
        });

        function tossNoodles(){
            if(noodleTime < NOODLE_DURATION) return;
            noodleTime = 0;
            hasBounced = false;
            PB.UI.dismissHint(chef.node);
            PB.UI.showBubble('老板，热干面多放芝麻酱，加勺辣萝卜！', chef.node);
            audioSynth.playOarSplash();
        }
        function fanFire(){
            fanDemoTime = 0;
            PB.UI.dismissHint(drag);
            PB.UI.showBubble('再来二十串肥瘦，辣子多撒！', cook.node);
        }

        chef.node.addEventListener('click', tossNoodles);
        chef.node.addEventListener('pointerenter', event => {
            if(event.buttons === 1) tossNoodles();
        });
        girl.node.addEventListener('click', tossNoodles);
        cook.node.addEventListener('click', fanFire);
        friends.node.addEventListener('click', () =>
            PB.UI.showBubble('烤肉就蒜，越吃越香。今儿不着急！', friends.node));
        cat.node.addEventListener('click', () => {
            catTime = 0;
            PB.UI.showBubble('喵——我也等一口热乎的。', cat.node);
        });
        clock.node.addEventListener('click', () => {
            clockTime = 0;
            pendingWhistle = 0.55;
            PB.UI.dismissHint(clock.node);
            audioSynth.playBell(220, 2.4);
            PB.UI.showBubble('江汉关的钟响了，第一班轮渡也开了。', clock.node);
        });
        PB.UI.createHint(chef.node, '点我颠面');
        PB.UI.createHint(clock.node, '听钟声');
        PB.UI.createHint(drag, '左右拉，扇旺火');

        PB.physicsLoop.add({
            step(dt){
                if(!spread.ready || PB.Book.getTheta() < 150){
                    noodleTime = NOODLE_DURATION;
                    fanDemoTime = 2;
                    fanTarget = 0.5;
                    pendingWhistle = -1;
                }
                if(!L.present && !R.present) return;
                noodleTime = Math.min(NOODLE_DURATION, noodleTime + dt);
                clockTime = Math.min(4, clockTime + dt);
                catTime = Math.min(4, catTime + dt);
                if(pendingWhistle >= 0){
                    pendingWhistle -= dt;
                    if(pendingWhistle < 0) audioSynth.playWhistle(1.5);
                }
                if(noodleTime > 0.29 && !hasBounced){
                    if(noodleTime < NOODLE_DURATION) basketVelocity = 150;
                    hasBounced = true;
                }
                basketVelocity += (-160*basketAngle - 9*basketVelocity)*dt;
                basketAngle += basketVelocity*dt;
                for(const lantern of lanterns){
                    lantern.velocity += (-LANTERN_STIFFNESS*lantern.angle -
                        LANTERN_DAMPING*lantern.velocity)*dt;
                    lantern.angle += lantern.velocity*dt;
                    if(Math.abs(lantern.angle) + Math.abs(lantern.velocity) < 0.001){
                        lantern.angle = lantern.velocity = 0;
                    }
                }
                if(fanDemoTime < 1.25){
                    fanDemoTime += dt;
                    fanTarget = 0.5 + 0.45*Math.sin(fanDemoTime*14);
                }
                const previous = fanValue;
                fanValue += (fanTarget - fanValue)*(1 - Math.exp(-DRAG_SMOOTHING*dt));
                const speed = Math.min(1, Math.abs(fanValue - previous)/dt*0.45);
                wind += (speed - wind)*(1 - Math.exp(-7*dt));
                sizzleCooldown = Math.max(0, sizzleCooldown - dt);
                if(wind > 0.2 && !sizzleCooldown && PB.Book.getTheta() > 150){
                    audioSynth.playSizzle(0.35);
                    sizzleCooldown = 0.28;
                }
                const lanternMoving = lanterns.some(lantern =>
                    Math.abs(lantern.angle) + Math.abs(lantern.velocity) > .001
                );
                if(noodleTime < NOODLE_DURATION || clockTime < 4 || catTime < 4 ||
                    Math.abs(basketAngle) + Math.abs(basketVelocity) > .001 ||
                    lanternMoving || fanDemoTime < 1.25 ||
                    Math.abs(fanTarget - fanValue) > .0002 || wind > .0003 ||
                    sizzleCooldown > 0 || pendingWhistle >= 0){
                    isDirty = true;
                }
            }
        });
        PB.rafLoop.add(() => {
            if(!L.present && !R.present) return;
            if(wasReady !== spread.ready){
                wasReady = spread.ready;
                lastAnchorLayout = '';
                isDirty = true;
            }
            const anchorLayout = PB.Book.getCameraRevision();
            if(spread.ready && lastAnchorLayout !== anchorLayout){
                const bounds = PB.localRect(dragAnchor);
                tools.style.left = PB.clamp(bounds.left, 100, PB.viewport().width - 100) + 'px';
                tools.style.top = Math.min(bounds.top, PB.viewport().height - 220) + 'px';
                lastAnchorLayout = anchorLayout;
                PB.UI.invalidateLayout();
            }
            if(!isDirty) return;
            const phase = noodleTime/NOODLE_DURATION;
            const lift = reduce.matches ? 0 : Math.pow(Math.sin(phase*Math.PI), 1.4);
            setPart(chef, 'noodle-arm', {transform: 'rotate(' + (lift*38).toFixed(2) + 'deg)'});
            setPart(chef, 'basket', {transform: 'rotate(' + (reduce.matches ? 0 : basketAngle).toFixed(2) + 'deg)'});
            setPart(chef, 'spoon-arm', {transform: 'rotate(' + (lift*24).toFixed(2) + 'deg)'});
            setPart(chef, 'sauce', {
                opacity: phase > 0.2 && phase < 0.88 ? '1' : '0',
                strokeDashoffset: String(1 - PB.clamp((phase - 0.2)/0.35, 0, 1))
            });
            const handAngle = reduce.matches ? 0 :
                Math.sin(clockTime*9)*9*Math.exp(-clockTime*1.6);
            setPart(clock, 'hands', {transform: 'rotate(' + handAngle.toFixed(2) + 'deg)'});
            const tailAngle = reduce.matches ? 0 :
                Math.sin(catTime*11)*23*Math.max(0, 1 - catTime/4);
            setPart(cat, 'tail', {transform: 'rotate(' + tailAngle.toFixed(2) + 'deg)'});
            for(const lantern of lanterns){
                setPart(lantern, 'lantern', {
                    transform: 'rotate(' + lantern.angle.toFixed(2) + 'deg)'
                });
            }
            setPart(cook, 'fan', {
                transform: 'rotate(' + ((fanValue - 0.5)*(reduce.matches ? 18 : 66)).toFixed(2) + 'deg)'
            });
            setPart(grill, 'flames', {
                transform: 'scaleY(' + (0.6 + 0.8*wind).toFixed(3) + ')'
            });
            setPart(smoke, 'smoke', {
                transform: 'skewX(' + (-20*wind).toFixed(2) + 'deg)'
            });
            const handleTransform =
                'translateX(' + (fanValue*dragWidth*0.58).toFixed(2) + 'px)';
            if(lastHandleTransform !== handleTransform){
                handle.style.transform = handleTransform;
                lastHandleTransform = handleTransform;
            }
            const value = String(Math.round(fanTarget*100));
            const description = wind > 0.2 ? '炭火旺了' : '炭火慢烤';
            if(drag.getAttribute('aria-valuenow') !== value){
                drag.setAttribute('aria-valuenow', value);
            }
            if(drag.getAttribute('aria-valuetext') !== description){
                drag.setAttribute('aria-valuetext', description);
            }
            const tabIndex = spread.ready && PB.Book.getTheta() > 150 ? 0 : -1;
            if(drag.tabIndex !== tabIndex) drag.tabIndex = tabIndex;
            isDirty = false;
        });
    }

    function createPullTab(cook, onChange){
        // This paper handle lives in screen space so its touch area stays 44px.
        // Its endpoint geometry is measured on each gesture, including resize.
        const track = PB.el('pull-tab', PB.$('#scene-tools'));
        track.setAttribute('role', 'slider');
        track.setAttribute('aria-label', '蒲扇拉条，左右拖动煽旺炭火');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-valuenow', '50');
        track.tabIndex = -1;
        track.innerHTML = '<span class="pull-caption">慢火 · 旺火</span>' +
            '<span class="pull-slot"></span>' +
            '<span class="pull-handle"><i></i><span>拉一拉</span></span>';
        let pointerId = null;
        let startX = 0;
        let startValue = 0.5;
        let hasMoved = false;
        track.cancelDrag = () => {
            const id = pointerId;
            pointerId = null;
            track.classList.remove('dragging');
            if(id !== null && track.hasPointerCapture(id)) track.releasePointerCapture(id);
        };
        const change = value => {
            onChange(PB.clamp(value, 0, 1));
            PB.UI.dismissHint(track);
        };
        track.addEventListener('pointerdown', event => {
            if(pointerId !== null || event.button !== 0 || track.tabIndex < 0) return;
            pointerId = event.pointerId;
            startX = event.clientX;
            startValue = Number(track.getAttribute('aria-valuenow'))/100;
            hasMoved = false;
            track.setPointerCapture(pointerId);
            track.classList.add('dragging');
            event.preventDefault();
            PB.UI.dismissHint(track);
        });
        track.addEventListener('pointermove', event => {
            if(event.pointerId !== pointerId) return;
            const distance = event.clientX - startX;
            if(Math.abs(distance) > 3) hasMoved = true;
            change(startValue + distance/(track.clientWidth*0.58));
        });
        const endDrag = event => {
            if(event.pointerId !== pointerId) return;
            if(!hasMoved && event.type === 'pointerup'){
                change(startValue > 0.5 ? 0 : 1);
            }
            if(track.hasPointerCapture(pointerId)) track.releasePointerCapture(pointerId);
            pointerId = null;
            track.classList.remove('dragging');
            if(event.type === 'pointerup'){
                PB.UI.showBubble('风来了，炭火正旺！再来二十串肥瘦！', cook.node);
            }
        };
        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
        track.addEventListener('lostpointercapture', () => {
            pointerId = null;
            track.classList.remove('dragging');
        });
        track.addEventListener('keydown', event => {
            const value = Number(track.getAttribute('aria-valuenow'))/100;
            const steps = {
                ArrowLeft: value - 0.15, ArrowDown: value - 0.15,
                ArrowRight: value + 0.15, ArrowUp: value + 0.15,
                Home: 0, End: 1
            };
            if(!(event.key in steps)) return;
            event.preventDefault();
            change(steps[event.key]);
        });
        return track;
    }

    return {mount};
})();
