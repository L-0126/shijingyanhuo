/* 核心工具函数 - 全局命名空间 PB (PopupBook) */
const PB={};
window.PB = PB;
PB.root = document.querySelector('#book-stage');
PB.ui = PB.root.querySelector('#scene-overlay');
PB.paused = false;
PB.frameCount = 0;
PB.animationTime = performance.now();
PB.now = () => PB.animationTime;
PB.viewport = () => ({width: PB.root.clientWidth, height: PB.root.clientHeight});
PB.localRect = element => {
    const bounds = element.getBoundingClientRect();
    const stage = PB.root.getBoundingClientRect();
    return {left: bounds.left - stage.left, top: bounds.top - stage.top,
        width: bounds.width, height: bounds.height,
        right: bounds.right - stage.left, bottom: bounds.bottom - stage.top};
};
PB.setPaused = value => {
    PB.paused = Boolean(value);
    PB.root.classList.toggle('is-paused', PB.paused);
    PB.physicsLoop.last = performance.now();
    PB.physicsLoop.acc = 0;
    if(typeof audioSynth !== 'undefined' && audioSynth.context){
        if(PB.paused || document.hidden) audioSynth.context.suspend();
        else if(audioSynth.enabled) audioSynth.context.resume();
    }
};

PB.clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
PB.lerp=(a,b,t)=>a+(b-a)*t;
PB.ease=(t)=>t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
PB.smooth=(t)=>t*t*(3-2*t);

PB.$=s=>PB.root.querySelector(s) || document.querySelector(s);
PB.$$=s=>PB.root.querySelectorAll(s);

PB.el=(cls,parent,w,h)=>{
    const d=document.createElement('div');
    d.className=cls;
    if(w!=null){
        d.style.width=w+'px';
        d.style.height=h+'px';
    }
    if(parent) parent.appendChild(d);
    return d;
};

PB.NS='http://www.w3.org/2000/svg';
PB.svgUse=(id,vx,vw,h,cls)=>{
    const s=document.createElementNS(PB.NS,'svg');
    s.setAttribute('viewBox',`${vx} 0 ${vw} ${h}`);
    s.setAttribute('preserveAspectRatio','none');
    if(cls) s.setAttribute('class',cls);
    s.innerHTML=`<use href="#${id}"/>`;
    return s;
};

PB.svgEl=(tag)=>document.createElementNS(PB.NS,tag);

/* 固定步长物理循环 */
PB.physicsLoop={
    dt: 1/240,
    acc: 0,
    last: 0,
    items: [],
    add(obj){
        if(!this.items.includes(obj)) this.items.push(obj);
    },
    remove(obj){
        const i=this.items.indexOf(obj);
        if(i>=0) this.items.splice(i,1);
    },
    tick(now){
        if(document.hidden){
            this.last=now;
            this.acc=0;
            return;
        }
        const delta=Math.min((now-this.last)/1000,0.1);
        this.last=now;
        this.acc+=delta;
        while(this.acc>=this.dt){
            for(const obj of this.items){
                if(obj.step) obj.step(this.dt);
            }
            this.acc-=this.dt;
        }
        // Publish moving poses once, before the book projects paper and shadows.
        for(const obj of this.items) obj.render?.();
    }
};

/* 动画帧循环 */
PB.rafLoop={
    callbacks: [],
    running: false,
    lastTime: performance.now(),
    add(fn){
        if(!this.callbacks.includes(fn)) this.callbacks.push(fn);
        if(!this.running){
            this.running=true;
            requestAnimationFrame(t=>this.loop(t));
        }
    },
    loop(now){
        const delta = Math.min(now - this.lastTime, 100);
        this.lastTime = now;
        if(!PB.paused && !document.hidden){
            PB.animationTime += delta;
            PB.physicsLoop.tick(now);
            for(const fn of this.callbacks) fn(PB.animationTime);
            PB.frameCount++;
        }else{
            PB.physicsLoop.last = now;
            PB.physicsLoop.acc = 0;
        }
        requestAnimationFrame(t=>this.loop(t));
    }
};
document.addEventListener('visibilitychange', () => PB.setPaused(PB.paused));
