PB.S3 = (function(){
    const {piece, setPart} = PB.Book;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const TAU = Math.PI*2;
    const SCRUB_DURATION = 4.8;
    const POUR_DURATION = 2.6;
    const CURTAIN_WIDTH = 450;
    const CURTAIN_HALF_WIDTH = 214;
    const CURTAIN_GATHERED_WIDTH = 46;
    const round = value => Number(value.toFixed(3));
    const attribute = (node, name, value) => {
        const text = String(value);
        if(node.getAttribute(name) !== text) node.setAttribute(name, text);
    };

    function mount(spread){
        const {L, R} = spread;
        Object.assign(spread, {
            buildFrom: .10, layeredReveal: true, waitForCover: true
        });
        for(const [side, x] of [[L,0],[R,800]]){
            side.page.insertBefore(PB.svgUse('s3-print',x,800,1000,'print'), side.shadows);
        }
        const buildings = [];
        const add = (side, name, x, y, options = {}) => {
            const paper = piece(side, 's3-'+name, {x, y, ...options});
            if(options.build){
                const [width,height] = PB.ART.size['s3-'+name];
                const facade = PB.svgUse('s3-'+name,options.vx||0,options.vw||width,height,'s3-settled-facade');
                facade.style.display = 'none';
                paper.node.append(facade);
                buildings.push({facade, assembly: paper.node.querySelector('.paper-assembly')});
            }
            return paper;
        };
        function flattenBuildings(isSettled){
            for(const {facade,assembly} of buildings){
                facade.style.display = isSettled ? '' : 'none';
                assembly.style.display = isSettled ? 'none' : '';
            }
        }
        for(const [side,vx,anchor] of [[L,0,1],[R,750,0]]){
            const sky = add(side,'sky',0,-413,{vx,vw:750,anchor,lead:.99,shadow:false});
            if(side === L){
                const snow = PB.svgEl('svg');
                snow.setAttribute('viewBox','0 0 750 450');
                snow.innerHTML = Array.from({length:18},(_,i)=>
                    `<path d="M${24+i%6*115} ${12+Math.floor(i/6)*108+i%3*14}l4 5-4 5-4-5Z" fill="#F0EEE0" opacity="${.85-i%6*.10}"/>`).join('');
                PB.el('s3-snow',sky.node).append(snow);
            }
        }
        add(L,'chimney',-655,-323,{lead:.94,build:[0,80,200,336,472],shadow:false});
        add(L,'bath-back',-432,-218,{lead:.92,build:[0,68,153,318,410]});
        add(L,'bath-side',-717,-218,{anchor:0,yaw:Math.PI/2,lead:.87,build:[0,79,190,312]});
        for(const [side,vx,anchor] of [[L,0,1],[R,195,0]]){
            add(side,'corridor',0,-155,{vx,vw:195,anchor,lead:.83,
                build:[0,65,122,215,304],buildDelay:.04});
        }
        add(R,'tea-back',432,-218,{lead:.88,build:[0,83,138,279,370],buildDelay:.04});
        add(R,'tea-side',712,-218,{anchor:0,yaw:Math.PI/2,lead:.83,build:[0,70,175,285]});
        add(R,'bamboo',643,-297,{lead:.90,scale:.95,shadow:false});
        add(R,'canopy',432,-63,{flat:true,dz:286,lead:.64});
        add(R,'canopy-edge',432,-61,{dz:259,lead:.58});
        add(R,'post',166,-60,{lead:.63});
        add(R,'post',701,-60,{lead:.63});
        const cage = add(R,'cage',122,-135,{parts:true,dz:153,lead:.48,
            label:'轻点画眉鸟笼，听一声鸟鸣'});

        add(L,'lockers',-180,-78,{lead:.58});
        add(L,'pool-water',-510,203,{flat:true,dz:65,lead:.56});
        add(L,'pool-side',-657,18,{anchor:0,yaw:Math.PI/2,lead:.51});
        add(L,'pool-side',-363,18,{anchor:0,yaw:Math.PI/2,lead:.51});
        const bathers = add(L,'bathers',-510,100,{dz:66,lead:.40,
            label:'听泡澡的大哥聊一会儿'});
        add(L,'pool-front',-510,205,{lead:.36});
        const scrubber = add(L,'scrubber',-249,359,{parts:true,lead:.40,scale:.81,
            label:'请师傅搓澡，搓两下拍一下'});
        const scrubberWidth=PB.ART.size['s3-scrubber'][0]*scrubber.scale;
        const curtain = add(L,'curtains',-247,407,{parts:true,dz:4,lead:.25,shadow:false,
            label:'拖动浴帘向两侧拉开或向中间合拢，也可点击开合'});
        const curtainPanels = ['left','right'].map(name=>{
            const panel=curtain.node.querySelector(`[data-part="${name}"]`);
            return {
                name,
                fabric:panel.querySelector('.s3-curtain-fabric'),
                folds:panel.querySelector('.s3-curtain-folds'),
                highlights:panel.querySelector('.s3-curtain-highlights'),
                seams:panel.querySelector('.s3-curtain-seams'),
                letter:panel.querySelector('.s3-curtain-letter'),
                hooks:[...panel.querySelectorAll('.s3-curtain-hook')]
            };
        });
        add(L,'basin',-658,365,{lead:.22});
        const bathSteam = add(L,'steam',-480,110,{dz:150,lead:.31,shadow:false});

        add(R,'stove',244,-8,{lead:.51});
        const stoveSteam = add(R,'steam',251,-5,{scale:.38,dz:168,lead:.36,shadow:false});
        for(const [i,steam] of [bathSteam,stoveSteam].entries()){
            steam.node.classList.add('s3-atmosphere');
            const artwork=steam.node.firstElementChild;
            const vapor=PB.el('s3-vapor',steam.node);
            vapor.style.animationDelay=-i*2.3+'s';
            vapor.append(artwork);
        }
        add(R,'chair',621,98,{lead:.39,scale:.92,yaw:-.16});
        const guest = add(R,'guest',451,147,{lead:.30,
            label:'听茶客说说今日的清闲'});
        add(R,'table-top',495,243,{flat:true,dz:91,lead:.36});
        add(R,'table-front',495,245,{lead:.32});
        add(R,'chair',392,315,{lead:.27,scale:.86,yaw:.19});
        // The cup and spout share one vertical paper plane, so tea lands exactly.
        const tea = add(R,'tea-service',334,219,{parts:true,lead:.30,
            label:'请茶博士用长嘴铜壶添茶'});
        const ear = add(R,'ear-scene',618,341,{parts:true,lead:.24,scale:.88,
            label:'请采耳师轻敲音叉'});
        const cat = add(R,'cat',433,351,{parts:true,lead:.14,scale:.86,
            label:'轻点竹椅下的橘猫'});
        const steamPaths = [...tea.node.querySelectorAll('.s3-tea-stream'),
            ...tea.casts.flatMap(cast=>[...cast.querySelectorAll('.s3-tea-stream')])];

        const state = {
            isCurtainOpen:false, curtain:0, curtainTarget:0, curtainSpeed:0,
            scrubTime:-1, scrubHits:0, scrubRuns:0,
            pourTime:-1, pourRuns:0, hasPoured:false, hasPourSound:false,
            earTime:-1, cageTime:-1, catTime:-1, isDirty:true
        };
        const sounds = new Set();
        function playSound(stop){
            if(stop){
                sounds.add(stop);
                for(const sound of sounds){
                    if(sound.finished) sounds.delete(sound);
                }
            }
        }
        function stopSounds(){
            for(const stop of sounds) stop();
            sounds.clear();
        }
        const canAct = () => spread.ready && PB.Book.getTheta() > 150;
        const curtainDrag = createCurtainDrag(curtain.node, {
            isReady:canAct,
            getValue:()=>PB.clamp(state.curtain,0,1),
            change(value){
                if(value < state.curtain) state.scrubTime = -1;
                state.curtain = state.curtainTarget = value;
                state.isCurtainOpen = value > .001;
                state.curtainSpeed = 0;
                state.isDirty = true;
                PB.UI.dismissHint(curtain.node);
            }
        });
        function openCurtain(isOpen){
            curtainDrag.cancel();
            state.isCurtainOpen = isOpen;
            state.curtainTarget = isOpen ? 1 : 0;
            if(!isOpen) state.scrubTime = -1;
            if(reducedMotion.matches){
                state.curtain = isOpen ? 1 : 0;
                state.curtainSpeed = 0;
            }
            state.isDirty = true;
        }
        function toggleCurtain(event){
            if(!canAct()) return;
            if(event?.currentTarget === curtain.node &&
                curtainDrag.consumeClick(event)) return;
            openCurtain(!state.isCurtainOpen);
            PB.UI.dismissHint(curtain.node);
            PB.UI.showBubble(state.isCurtainOpen ? '热汤泡一泡，浑身都松快。' : '把热乎气儿留在里面。',curtain.node);
        }
        function scrub(){
            if(!canAct() || state.scrubTime >= 0) return;
            openCurtain(true);
            state.scrubTime = reducedMotion.matches ? -1 : 0;
            state.scrubHits = reducedMotion.matches ? 3 : 0;
            state.scrubRuns++;
            if(reducedMotion.matches) playSound(audioSynth.playSlap());
            state.isDirty = true;
            PB.UI.dismissHint(curtain.node);
            PB.UI.showBubble('老弟，这力道得劲不？整完再磕个冻梨！',scrubber.node,4200);
        }
        function pour(){
            if(!canAct() || state.pourTime >= 0) return;
            state.pourRuns++;
            state.pourTime = reducedMotion.matches ? -1 : 0;
            state.hasPoured = reducedMotion.matches;
            state.hasPourSound = false;
            if(reducedMotion.matches) playSound(audioSynth.playTeaPour(.35));
            state.isDirty = true;
            PB.UI.dismissHint(tea.node);
            PB.UI.showBubble('坐稳喽，给您续一盏热茶。',tea.node);
        }
        function tendEar(){
            if(!canAct() || state.earTime >= 0) return;
            state.earTime = reducedMotion.matches ? -1 : 0;
            state.isDirty = true;
            playSound(audioSynth.playTuningFork(1.8));
            PB.UI.dismissHint(ear.node);
            PB.UI.showBubble('眯一觉，巴适得板！',ear.node);
        }
        function ringCage(){
            if(!canAct() || state.cageTime >= 0) return;
            state.cageTime = reducedMotion.matches ? -1 : 0;
            state.isDirty = true;
            playSound(audioSynth.playBirdChirp());
            PB.UI.showBubble('一声画眉，把午后叫得更慢了。',cage.node);
        }
        function stretchCat(){
            if(!canAct() || state.catTime >= 0) return;
            state.catTime = reducedMotion.matches ? -1 : 0;
            state.isDirty = true;
            PB.UI.showBubble('茶还烫着，我先伸个懒腰。',cat.node);
        }
        const actions = [
            ['浴帘','拉开或合拢浴帘',toggleCurtain,curtain],
            ['搓澡','请师傅搓澡',scrub,scrubber],
            ['添茶','请茶博士添茶',pour,tea],
            ['采耳','听采耳音叉',tendEar,ear]
        ];
        for(const [,,action,paper] of actions) paper.node.addEventListener('click',action);
        cage.node.addEventListener('click',ringCage);
        cat.node.addEventListener('click',stretchCat);
        bathers.node.addEventListener('click',()=>{
            if(canAct()) PB.UI.showBubble('外头下雪，里头唠嗑，这就叫舒坦！',bathers.node);
        });
        guest.node.addEventListener('click',()=>{
            if(canAct()) PB.UI.showBubble('一碗茶坐半晌，日子慢慢过。',guest.node);
        });
        const tools = PB.$('#s3-tools');
        tools.addEventListener('pointerdown',event=>event.stopPropagation());
        const buttons = actions.map(([text,label,action])=>{
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = text;
            button.setAttribute('aria-label',label);
            button.disabled = true;
            button.addEventListener('click',action);
            tools.append(button);
            return button;
        });
        for(const control of [curtain.node,buttons[0]]){
            control.addEventListener('keydown',event=>{
                if(!canAct()) return;
                const direction={ArrowLeft:-.1,ArrowRight:.1}[event.key];
                if(direction === undefined && event.key !== 'Home' && event.key !== 'End') return;
                event.preventDefault();
                curtainDrag.cancel();
                const target=event.key === 'Home' ? 0 : event.key === 'End' ? 1 :
                    PB.clamp(state.curtainTarget+direction,0,1);
                state.curtainTarget=target;
                state.isCurtainOpen=target>.001;
                if(target<state.curtain) state.scrubTime=-1;
                if(reducedMotion.matches) state.curtain=target;
                state.curtainSpeed=0;
                state.isDirty=true;
                PB.UI.dismissHint(curtain.node);
            });
        }
        PB.UI.createHint(curtain.node,'拖动帘边 · 开合','s3');
        PB.UI.createHint(tea.node,'轻点 · 添茶','s3');
        PB.UI.createHint(ear.node,'轻点 · 采耳','s3');
        let wasReady = false;

        function settleMotion(){
            curtainDrag.cancel();
            state.curtain = state.curtainTarget;
            state.curtainSpeed = 0;
            if(state.scrubTime >= 0) state.scrubHits = 3;
            if(state.pourTime >= 0) state.hasPoured = true;
            state.scrubTime = state.pourTime = state.earTime = state.cageTime = state.catTime = -1;
            state.isDirty = true;
            stopSounds();
        }
        function deactivate(){
            curtainDrag.cancel();
            stopSounds();
            Object.assign(state, {
                isCurtainOpen:false,curtain:0,curtainTarget:0,curtainSpeed:0,
                scrubTime:-1,scrubHits:0,pourTime:-1,hasPoured:false,hasPourSound:false,
                earTime:-1,cageTime:-1,catTime:-1,isDirty:true
            });
            tools.hidden = true;
            buttons.forEach(button=>{button.disabled=true;});
            flattenBuildings(false);
            wasReady = false;
            render();
        }
        let storyPour = null;
        spread.controls = {
            setPour(angle, fill) {
                storyPour = {angle, fill};
                state.hasPoured = fill > .05;
                renderTea();
            }
        };
        spread.onDeactivate = deactivate;
        reducedMotion.addEventListener('change',()=>{
            if(reducedMotion.matches) settleMotion();
        });
        document.addEventListener('visibilitychange',()=>{
            if(document.hidden){settleMotion();}
        });

        function step(dt){
            if(!canAct() || document.hidden) return;
            const target = state.curtainTarget;
            if(Math.abs(target-state.curtain)+Math.abs(state.curtainSpeed) > .0001){
                state.curtainSpeed += (160*(target-state.curtain)-25*state.curtainSpeed)*dt;
                state.curtain += state.curtainSpeed*dt;
                if(Math.abs(target-state.curtain)+Math.abs(state.curtainSpeed) < .002){
                    state.curtain=target; state.curtainSpeed=0;
                }
                state.isDirty = true;
            }
            if(state.scrubTime >= 0){
                state.scrubTime += dt;
                const hits = Math.min(3,Math.floor(state.scrubTime/(SCRUB_DURATION/3)));
                if(hits > state.scrubHits){
                    playSound(audioSynth.playSlap());
                    state.scrubHits = hits;
                }
                if(state.scrubTime >= SCRUB_DURATION) state.scrubTime = -1;
                state.isDirty = true;
            }
            if(state.pourTime >= 0){
                state.pourTime += dt;
                if(state.pourTime >= .55 && !state.hasPourSound){
                    playSound(audioSynth.playTeaPour(1.35));
                    state.hasPourSound = true;
                }
                if(state.pourTime >= .85) state.hasPoured = true;
                if(state.pourTime >= POUR_DURATION) state.pourTime = -1;
                state.isDirty = true;
            }
            for(const [name,duration] of [['earTime',1.8],['cageTime',3.2],['catTime',1.5]]){
                if(state[name] < 0) continue;
                state[name] += dt;
                if(state[name] >= duration) state[name] = -1;
                state.isDirty = true;
            }
        }

        function renderArm(){
            const t = state.scrubTime;
            const phase = Math.max(0,t)*TAU/0.8;
            const easedPhase = phase+.32*Math.sin(phase);
            const blend = t < 0 ? 0 : Math.min(1,t/.3,(SCRUB_DURATION-t)/.3);
            const handX = 216+blend*3.5*Math.cos(easedPhase);
            const handY = 110.5+blend*1.2*Math.sin(easedPhase);
            const shoulderX=160, shoulderY=62, upper=34, lower=44;
            const dx=handX-shoulderX, dy=handY-shoulderY;
            const distance=Math.min(upper+lower-.01,Math.hypot(dx,dy));
            // Use the lower elbow solution for the right arm nearest the viewer.
            const a=Math.atan2(dy,dx)+Math.acos(PB.clamp(
                (upper*upper+distance*distance-lower*lower)/(2*upper*distance),-1,1));
            const elbowX=shoulderX+upper*Math.cos(a);
            const elbowY=shoulderY+upper*Math.sin(a);
            const b=Math.atan2(handY-elbowY,handX-elbowX);
            setPart(scrubber,'upper-arm',{transform:`rotate(${round(a*180/Math.PI)}deg)`});
            setPart(scrubber,'forearm',{
                transform:`translate(${round((elbowX-194)*scrubber.scale)}px,${round((elbowY-62)*scrubber.scale)}px) rotate(${round(b*180/Math.PI)}deg)`
            });
            // Keep the palm and pad nearly parallel to the customer's back.
            setPart(scrubber,'scrub-hand',{
                transform:`rotate(${round(-b*180/Math.PI+blend*4*Math.sin(easedPhase))}deg)`
            });
            attribute(scrubber.node,'data-hand-x',round(elbowX+lower*Math.cos(b)));
            attribute(scrubber.node,'data-hand-y',round(elbowY+lower*Math.sin(b)));
        }

        function renderTea(){
            const t = state.pourTime;
            const lean = storyPour ? storyPour.angle * 8 : t < 0 ? 0 : t < .2 ? -PB.smooth(t/.2)*4 :
                t < .55 ? PB.lerp(-4,8,PB.smooth((t-.2)/.35)) :
                t < 1.9 ? 8 : 8*(1-PB.smooth((t-1.9)/.7));
            const angle = storyPour ? storyPour.angle * 10 : t < 0 ? 0 : 10*PB.smooth(PB.clamp((t-.2)/.4,0,1))*
                (1-PB.smooth(PB.clamp((t-1.9)/.7,0,1)));
            setPart(tea,'body',{transform:`rotate(${round(lean)}deg)`});
            const radians=angle*Math.PI/180;
            const bodyAngle=lean*Math.PI/180;
            const offsetX=70+15*Math.cos(bodyAngle)+147*Math.sin(bodyAngle)-
                (104-19*Math.cos(radians)+40*Math.sin(radians));
            const offsetY=213+15*Math.sin(bodyAngle)-147*Math.cos(bodyAngle)-
                (106-19*Math.sin(radians)-40*Math.cos(radians));
            setPart(tea,'pot',{transform:`translate(${round(offsetX)}px,${round(offsetY)}px) rotate(${round(angle)}deg)`});
            // Follow the pot and its attached arm, while the cup stays on the table.
            const x=104+offsetX+157*Math.cos(radians)+32*Math.sin(radians);
            const y=106+offsetY+157*Math.sin(radians)-32*Math.cos(radians);
            const progress = storyPour ? PB.clamp((storyPour.angle - .2) * 2, 0, 1) :
                t >= .55 && t < 1.98 ? PB.clamp((t-.55)/.30,0,1) : 0;
            const path=`M${round(x)} ${round(y)}Q${round((x+327)/2+8)} ${round(y+3)} 327 122`;
            for(const node of steamPaths){
                attribute(node,'d',path);
                attribute(node,'pathLength','1');
                attribute(node,'stroke-dasharray','1');
                attribute(node,'stroke-dashoffset',round(1-progress));
                attribute(node,'opacity',progress>0 ? .9 : 0);
            }
            setPart(tea,'cup-steam',{
                opacity:state.hasPoured ? '.8' : '0',
                transform:!reducedMotion.matches && t>=.85 ? `translateY(${round(-Math.min(8,(t-.85)*5))}px)` : 'translateY(0px)'
            });
            attribute(tea.node,'data-spout-x',round(x));
            attribute(tea.node,'data-spout-y',round(y));
            attribute(tea.node,'data-pour-stage',t<0?(state.hasPoured?'filled':'idle'):t<.2?'prepare':t<.55?'tilt':t<1.98?'pour':'return');
        }

        let renderedCurtain = -1;
        function renderCurtain(){
            const progress=round(PB.clamp(state.curtain,0,1));
            if(progress !== renderedCurtain){
                const width=CURTAIN_HALF_WIDTH-
                    progress*(CURTAIN_HALF_WIDTH-CURTAIN_GATHERED_WIDTH);
                for(const {name,fabric,folds:foldPaths,highlights:highlightPaths,seams:seamPath,letter,hooks} of curtainPanels){
                    const left=name==='left'?13:437-width;
                    const right=left+width;
                    const foldWidth=width/8;
                    const hem=Array.from({length:9},(_,i)=>
                        `${round(left+i*foldWidth)} ${i%2?254:250}`);
                    const shape=`M${round(left)} 26H${round(right)}L${hem.slice().reverse().join(' ')}Z`;
                    const folds=Array.from({length:8},(_,i)=>{
                        const x=round(left+(i+.28)*foldWidth);
                        return `M${x} 37q-2 103 0 209`;
                    }).join('');
                    const highlights=Array.from({length:8},(_,i)=>{
                        const x=round(left+(i+.72)*foldWidth);
                        return `M${x} 38q2 104 0 209`;
                    }).join('');
                    const seams=`M${round(left)} 38H${round(right)}M${hem.join(' ')}`;
                    setPart(curtain,name,{clipPath:
                        `inset(0px ${round(CURTAIN_WIDTH-right-8)}px 0px ${round(left-8)}px)`});
                    attribute(fabric,'d',shape);
                    attribute(foldPaths,'d',folds);
                    attribute(foldPaths,'opacity',round(.35+progress*.45));
                    attribute(highlightPaths,'d',highlights);
                    attribute(seamPath,'d',seams);
                    attribute(letter,'x',round(left+width/2));
                    attribute(letter,'opacity',round(.75*(1-PB.smooth(progress))));
                    hooks.forEach((hook,i)=>attribute(hook,'transform',
                        `translate(${round(left+8+i*(width-16)/7)} 0)`));
                }
                // Clip the paper scene to the opening so the SVG layers cannot
                // show through the fabric while the camera or the curtains move.
                const opening=2*(CURTAIN_HALF_WIDTH-width);
                const inset=Math.max(0,(1-opening/scrubberWidth)*50);
                scrubber.node.style.clipPath=inset>0?`inset(-8px ${inset}% -8px)`:'';
                scrubber.node.toggleAttribute('data-curtain-closed',progress===0);
                for(const cast of scrubber.casts) cast.style.visibility=progress===0?'hidden':'';
                attribute(curtain.node,'data-progress',progress);
                attribute(curtain.node,'aria-label',
                    `浴帘已拉开 ${Math.round(progress*100)}%，拖动或点击开合`);
                renderedCurtain=progress;
            }
            attribute(curtain.node,'aria-expanded',state.isCurtainOpen);
            attribute(curtain.node,'data-open',state.isCurtainOpen);
            attribute(buttons[0],'aria-expanded',state.isCurtainOpen);
        }
        function render(){
            if(!state.isDirty) return;
            renderCurtain();
            renderArm();
            renderTea();
            const fork = state.earTime < 0 ? 0 : Math.sin(state.earTime*96)*1.4*Math.exp(-state.earTime*2.2);
            setPart(ear,'fork',{transform:`translateX(${round(fork)}px)`});
            setPart(ear,'feather',{transform:`rotate(${round(fork*.8)}deg)`});
            const sway=state.cageTime<0?0:Math.sin(state.cageTime*8)*9*Math.exp(-state.cageTime*1.6);
            setPart(cage,'cage',{transform:`rotate(${round(sway)}deg)`});
            const stretch=state.catTime<0?0:Math.sin(state.catTime/1.5*Math.PI);
            setPart(cat,'paws',{transform:`translateX(${round(stretch*6)}px)`});
            setPart(cat,'tail',{transform:`rotate(${round(stretch*12)}deg)`});
            attribute(scrubber.node,'data-busy',state.scrubTime>=0);
            attribute(scrubber.node,'data-hits',state.scrubHits);
            attribute(scrubber.node,'data-runs',state.scrubRuns);
            attribute(tea.node,'data-busy',state.pourTime>=0);
            attribute(tea.node,'data-runs',state.pourRuns);
            attribute(ear.node,'data-busy',state.earTime>=0);
            attribute(cage.node,'data-busy',state.cageTime>=0);
            attribute(cat.node,'data-busy',state.catTime>=0);
            for(const paper of [scrubber,tea,ear]){
                attribute(paper.node,'aria-busy',paper.node.dataset.busy);
            }
            state.isDirty = false;
        }
        PB.physicsLoop.add({step,render(){
            if(state.isDirty && (L.present || R.present)) render();
        }});
        PB.rafLoop.add(()=>{
            const ready = canAct();
            if(ready === wasReady) return;
            wasReady = ready;
            flattenBuildings(ready);
            tools.hidden = !ready;
            buttons.forEach(button=>{button.disabled=!ready;});
            PB.UI.invalidateLayout();
        });
        render();
    }

    function createCurtainDrag(node, actions){
        const guides=[0,CURTAIN_WIDTH].map(x=>{
            const guide=PB.el('s3-curtain-guide',node,1,1);
            guide.style.left=x+'px';
            guide.style.top='95px';
            guide.setAttribute('aria-hidden','true');
            return guide;
        });
        let gesture=null;
        let suppressClick=false;
        function cancel(restore=false){
            if(!gesture) return;
            const previous=gesture;
            gesture=null;
            suppressClick=previous.hasMoved || restore;
            node.classList.remove('s3-curtain-dragging');
            attribute(node,'data-dragging',false);
            if(node.hasPointerCapture(previous.id)) node.releasePointerCapture(previous.id);
            if(restore) actions.change(previous.value);
        }
        node.addEventListener('pointerdown',event=>{
            if(!actions.isReady() || gesture || event.button!==0 || !event.isPrimary) return;
            const [left,right]=guides.map(guide=>guide.getBoundingClientRect());
            const dx=right.x-left.x,dy=right.y-left.y;
            const lengthSquared=dx*dx+dy*dy;
            if(lengthSquared<4) return;
            const side=event.target.closest('[data-part]')?.dataset.part;
            if(side!=='left' && side!=='right') return;
            suppressClick=false;
            gesture={id:event.pointerId,x:event.clientX,y:event.clientY,dx,dy,
                lengthSquared,value:actions.getValue(),direction:side==='left'?-1:1,hasMoved:false};
            node.setPointerCapture(event.pointerId);
            node.classList.add('s3-curtain-dragging');
            attribute(node,'data-dragging',true);
            event.preventDefault();
            event.stopPropagation();
        });
        node.addEventListener('pointermove',event=>{
            if(event.pointerId!==gesture?.id) return;
            if(!actions.isReady()){cancel(true);return;}
            const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
            if(!gesture.hasMoved && Math.hypot(dx,dy)<4) return;
            gesture.hasMoved=true;
            const distance=(dx*gesture.dx+dy*gesture.dy)/gesture.lengthSquared;
            const progress=gesture.value+gesture.direction*distance*
                CURTAIN_WIDTH/(CURTAIN_HALF_WIDTH-CURTAIN_GATHERED_WIDTH);
            actions.change(PB.clamp(progress,0,1));
            event.preventDefault();
        });
        node.addEventListener('pointerup',event=>{
            if(event.pointerId===gesture?.id) cancel();
        });
        node.addEventListener('pointercancel',()=>cancel(true));
        node.addEventListener('lostpointercapture',()=>cancel(true));
        for(const type of ['blur','resize']) window.addEventListener(type,()=>cancel(true));
        return {
            cancel,
            consumeClick(event){
                if(event.detail===0 || !suppressClick) return false;
                suppressClick=false;
                return true;
            }
        };
    }
    return {mount};
})();
