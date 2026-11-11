// Web Audio API 程序化音效合成

class AudioSynthesizer {
    constructor() {
        this.context=null;
        this.enabled=false;
        this.masterGain=null;
    }

    init() {
        if(!this.context) {
            this.context=new(window.AudioContext || window.webkitAudioContext)();
            this.masterGain=this.context.createGain();
            this.masterGain.gain.value=0.3;
            this.masterGain.connect(this.context.destination);
        }
        if(this.context.state === 'suspended') this.context.resume();
    }

    toggle() {
        this.enabled=!this.enabled;
        if(this.enabled) this.init();
        if(this.masterGain){
            this.masterGain.gain.cancelScheduledValues(this.context.currentTime);
            this.masterGain.gain.setValueAtTime(
                this.enabled ? 0.3 : 0, this.context.currentTime
            );
        }
        return this.enabled;
    }

    // 钟声（正弦波+衰减包络）
    playBell(freq=220, duration=2) {
        if(!this.enabled) return;
        this.init();

        const osc=this.context.createOscillator();
        const gain=this.context.createGain();

        osc.type='sine';
        osc.frequency.setValueAtTime(freq, this.context.currentTime);

        gain.gain.setValueAtTime(0.4, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime+duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.context.currentTime+duration);
    }

    // 轮渡汽笛（低频正弦波）
    playWhistle(duration=1.5) {
        if(!this.enabled) return;
        this.init();

        const osc=this.context.createOscillator();
        const gain=this.context.createGain();

        osc.type='sine';
        osc.frequency.setValueAtTime(180, this.context.currentTime);
        osc.frequency.linearRampToValueAtTime(160, this.context.currentTime+duration);

        gain.gain.setValueAtTime(0.3, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime+duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.context.currentTime+duration);
    }

    // 滋啦烤肉声（白噪音+带通滤波）
    playSizzle(duration=0.8) {
        if(!this.enabled) return;
        this.init();

        const bufferSize=this.context.sampleRate*duration;
        const buffer=this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data=buffer.getChannelData(0);

        for(let i=0; i<bufferSize; i++) {
            data[i]=Math.random()*2-1;
        }

        const source=this.context.createBufferSource();
        source.buffer=buffer;

        const filter=this.context.createBiquadFilter();
        filter.type='bandpass';
        filter.frequency.value=3000;
        filter.Q.value=1;

        const gain=this.context.createGain();
        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime+duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start();
    }

    // 摇橹水声（低频噪音+摇摆包络）
    playOarSplash() {
        if(!this.enabled) return;
        this.init();

        const bufferSize=this.context.sampleRate*0.6;
        const buffer=this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data=buffer.getChannelData(0);

        for(let i=0; i<bufferSize; i++) {
            data[i]=(Math.random()*2-1)*Math.exp(-i/bufferSize*8);
        }

        const source=this.context.createBufferSource();
        source.buffer=buffer;

        const filter=this.context.createBiquadFilter();
        filter.type='lowpass';
        filter.frequency.value=600;

        const gain=this.context.createGain();
        gain.gain.value=0.15;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start();
    }

    // 斩骨声（脉冲+短衰减）
    playChop() {
        if(!this.enabled) return;
        this.init();

        const bufferSize=this.context.sampleRate*0.15;
        const buffer=this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data=buffer.getChannelData(0);

        for(let i=0; i<bufferSize; i++) {
            data[i]=(Math.random()*2-1)*Math.exp(-i/1000);
        }

        const source=this.context.createBufferSource();
        source.buffer=buffer;

        const filter=this.context.createBiquadFilter();
        filter.type='highpass';
        filter.frequency.value=800;

        const gain=this.context.createGain();
        gain.gain.value=0.25;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start();
    }

    // 拍背声（短脉冲）
    playSlap() {
        if(!this.enabled) return null;
        this.init();

        const bufferSize=this.context.sampleRate*0.08;
        const buffer=this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data=buffer.getChannelData(0);

        for(let i=0; i<bufferSize; i++) {
            data[i]=(Math.random()*2-1)*Math.exp(-i/500);
        }

        const source=this.context.createBufferSource();
        source.buffer=buffer;

        const gain=this.context.createGain();
        gain.gain.value=0.2;

        source.connect(gain);
        gain.connect(this.masterGain);

        source.start();
        return this.trackSound([source], [gain]);
    }

    // 音叉声（高频正弦波+泛音）
    playTuningFork(duration=2) {
        if(!this.enabled) return null;
        this.init();

        const freqs=[440, 880, 1320]; // 基频+泛音
        const oscs=[];
        const gains=[];

        freqs.forEach((freq, i) => {
            const osc=this.context.createOscillator();
            const gain=this.context.createGain();

            osc.type='sine';
            osc.frequency.value=freq;

            const amp=0.15/(i+1);
            gain.gain.setValueAtTime(amp, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime+duration);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start();
            osc.stop(this.context.currentTime+duration);
            oscs.push(osc);
            gains.push(gain);
        });
        return this.trackSound(oscs, gains);
    }

    // A callable handle owns only this sound; older callers can ignore it.
    trackSound(sources, nodes) {
        let remaining = sources.length;
        const stop = () => {
            if(stop.finished) return;
            stop.finished = true;
            for(const source of sources) {
                try { source.stop(); } catch(error) {
                    if(error.name !== 'InvalidStateError') throw error;
                }
                source.disconnect();
            }
            for(const node of nodes) node.disconnect();
        };
        stop.finished = false;
        for(const source of sources) {
            source.addEventListener('ended', () => {
                remaining--;
                if(remaining === 0) stop();
            }, {once: true});
        }
        return stop;
    }

    playTeaPour(duration = 1.35) {
        if(!this.enabled) return null;
        this.init();
        const size = Math.ceil(this.context.sampleRate*duration);
        const buffer = this.context.createBuffer(1, size, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < size; i++) {
            const t = i/this.context.sampleRate;
            data[i] = (Math.random()*2-1)*(.55+.45*Math.sin(t*37)**2);
        }
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        const filter = this.context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1600;
        filter.Q.value = .65;
        const gain = this.context.createGain();
        const now = this.context.currentTime;
        gain.gain.setValueAtTime(.001, now);
        gain.gain.linearRampToValueAtTime(.16, now+.06);
        gain.gain.setValueAtTime(.16, now+Math.max(.07,duration-.12));
        gain.gain.exponentialRampToValueAtTime(.001, now+duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
        return this.trackSound([source], [filter, gain]);
    }

    playBirdChirp() {
        if(!this.enabled) return null;
        this.init();
        const sources = [], nodes = [];
        const now = this.context.currentTime;
        for(let i = 0; i < 3; i++) {
            const source = this.context.createOscillator();
            const gain = this.context.createGain();
            const start = now+i*.21;
            source.frequency.setValueAtTime(1900+i*220, start);
            source.frequency.exponentialRampToValueAtTime(3400-i*180, start+.065);
            source.frequency.exponentialRampToValueAtTime(1700, start+.15);
            gain.gain.setValueAtTime(.001, start);
            gain.gain.exponentialRampToValueAtTime(.075, start+.018);
            gain.gain.exponentialRampToValueAtTime(.001, start+.16);
            source.connect(gain);
            gain.connect(this.masterGain);
            source.start(start);
            source.stop(start+.17);
            sources.push(source);
            nodes.push(gain);
        }
        return this.trackSound(sources, nodes);
    }

    // 爆米花巨响（低频脉冲+噪音爆炸）
    playPopcornBang() {
        if(!this.enabled) return;
        this.init();

        // 低频脉冲
        const osc=this.context.createOscillator();
        const oscGain=this.context.createGain();
        osc.type='sine';
        osc.frequency.setValueAtTime(80, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.context.currentTime+0.3);
        oscGain.gain.setValueAtTime(0.6, this.context.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime+0.3);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();
        osc.stop(this.context.currentTime+0.3);

        // 白噪音爆炸
        const bufferSize=this.context.sampleRate*0.4;
        const buffer=this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data=buffer.getChannelData(0);

        for(let i=0; i<bufferSize; i++) {
            data[i]=(Math.random()*2-1)*Math.exp(-i/bufferSize*10);
        }

        const source=this.context.createBufferSource();
        source.buffer=buffer;

        const filter=this.context.createBiquadFilter();
        filter.type='bandpass';
        filter.frequency.value=2000;
        filter.Q.value=0.5;

        const gain=this.context.createGain();
        gain.gain.value=0.4;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start();
    }

    // 缝纫机声（快速脉冲）
    playSewingMachine(duration=2) {
        if(!this.enabled) return;
        this.init();

        const pulseRate=8; // 每秒8次
        const pulses=Math.floor(duration*pulseRate);

        for(let i=0; i<pulses; i++) {
            const time=this.context.currentTime+i/pulseRate;

            const osc=this.context.createOscillator();
            const gain=this.context.createGain();

            osc.type='square';
            osc.frequency.value=150;

            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time+0.05);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time+0.05);
        }
    }
}

const audioSynth=new AudioSynthesizer();
