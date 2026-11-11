/* 纸艺绘图函数和配色 */
PB.ART=(function(){
    const SYM=[];
    const SIZE={};
    const sym=(id,w,h,body)=>{
        SIZE[id]=[w,h];
        SYM.push(`<g id="${id}">${body}</g>`);
    };

    let seed=11;
    const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;

    /* 五页配色方案 - 每页单一主色调 */
    const PALETTES={
        wuhan: {
            /* 武汉清晨：蓝白天光+豆皮焦黄 */
            bg: '#f5f1e8',
            sky: '#d4e3f0',
            skyDark: '#a8bfd4',
            main: '#d9a441',      // 豆皮焦黄
            mainDark: '#b8862f',
            accent: '#8b6f47',    // 芝麻酱褐
            ink: '#2a2520',
            wood: '#7b5234',
            tile: '#56646b'
        },
        guangzhou: {
            /* 广州上午：骑楼暖黄+蒸笼本色 */
            bg: '#f5f1e8',
            sky: '#f9e9c8',
            skyDark: '#e8d4a6',
            main: '#e8d4a6',      // 竹蒸笼本色
            mainDark: '#c9b888',
            accent: '#f4f0e6',    // 虾饺半透明白
            ink: '#2a2520',
            wood: '#9d7f54',
            tile: '#6b5d4a'
        },
        xibei: {
            /* 西北日暮：戈壁橙红+炭火金黄 */
            bg: '#f5f1e8',
            sky: '#f4a460',
            skyDark: '#d97d42',
            main: '#e86b3c',      // 炭火橙红
            mainDark: '#c84a35',
            accent: '#e8b65f',    // 馕金黄
            ink: '#2a2520',
            wood: '#8b5a3c',
            tile: '#6b4a32'
        },
        dongbei: {
            /* 东北雪夜：红灯笼+雪地冷白 */
            bg: '#f5f1e8',
            sky: '#3a4a5a',
            skyDark: '#2a3542',
            main: '#c84a35',      // 红灯笼
            mainDark: '#a6412f',
            accent: '#d4a574',    // 啤酒琥珀
            ink: '#2a2520',
            wood: '#7b5234',
            tile: '#56646b',
            snow: '#f0f4f8'
        },
        chengdu: {
            /* 成都深夜：红油猩红+竹林深绿 */
            bg: '#f5f1e8',
            sky: '#2a3a2f',
            skyDark: '#1a261f',
            main: '#c8402f',      // 红油猩红
            mainDark: '#a6301f',
            accent: '#3f5a45',    // 竹子深绿
            ink: '#2a2520',
            wood: '#6b4a32',
            tile: '#4a3a2a'
        }
    };

    /* 当前页配色 */
    let C=PALETTES.wuhan;

    function setPalette(name){
        C=PALETTES[name]||PALETTES.wuhan;
    }

    const f=n=>+n.toFixed(1);
    const rect=(x,y,w,h,fill,ex='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${ex}/>`;
    const txt=(x,y,s,fill,str,ex='')=>`<text x="${x}" y="${y}" font-size="${s}" fill="${fill}" text-anchor="middle" ${ex}>${str}</text>`;
    const vtxt=(x,y,s,fill,str,gap)=>[...str].map((ch,i)=>txt(x,y+i*(gap||s*1.12),s,fill,ch)).join('');
    const lift=s=>`<g filter="url(#lift)">${s}</g>`;

    /* 中式瓦顶 */
    function roof(x0,x1,y,h,col,colD){
        col=col||C.tile;
        colD=colD||C.tile;
        const cu=Math.min(18,(x1-x0)*0.09);
        let s=`<path d="M${x0-12} ${y-7} Q${x0+2} ${y+2} ${x0+22} ${y+5} L${x1-22} ${y+5} Q${x1-2} ${y+2} ${x1+12} ${y-7} L${x1-cu} ${y-h} L${x0+cu} ${y-h} Z" fill="${col}"/>`;
        s+=`<g stroke="${colD}" stroke-width="2.2" stroke-linecap="round">`;
        for(let x=x0+cu+4;x<x1-cu-2;x+=8) s+=`<line x1="${x}" y1="${y-h+4}" x2="${x}" y2="${y+2}"/>`;
        s+=`</g>`;
        s+=`<path d="M${x0+cu-4} ${y-h+2} L${x1-cu+4} ${y-h+2} L${x1-cu-2} ${y-h-7} L${x0+cu+2} ${y-h-7} Z" fill="${colD}"/>`;
        s+=`<path d="M${x0+cu+3} ${y-h-7} q-11 -1 -14 -13 q8 3 16 6 Z M${x1-cu-3} ${y-h-7} q11 -1 14 -13 q-8 3 -16 6 Z" fill="${colD}"/>`;
        return s;
    }

    function win(x,y,w,h,o={}){
        let s=rect(x-3,y-3,w+6,h+6,C.wood);
        s+=rect(x,y,w,h,o.lit?'#f4c25c':'#3a2e26');
        s+=`<g stroke="${o.lit?'#c08a3a':C.wood}" stroke-width="2"><line x1="${x+w/2}" y1="${y}" x2="${x+w/2}" y2="${y+h}"/><line x1="${x}" y1="${y+h/2}" x2="${x+w}" y2="${y+h/2}"/></g>`;
        if(o.plant) s+=lift(rect(x-4,y+h+2,w+8,7,'#a77445')+
            `<path d="M${x+4} ${y+h+2} q-3 -14 6 -19 q4 9 1 19 Z M${x+w/2-2} ${y+h+2} q-4 -19 4 -25 q6 11 0 25 Z M${x+w-7} ${y+h+2} q-2 -12 7 -15 q1 9 -3 15 Z" fill="#6f8f55"/>`);
        return s;
    }

    /* 不规则圆团 */
    function blob(cx,cy,rx,ry,fill,n=9,jit=0.2){
        const pts=[];
        for(let i=0;i<n;i++){
            const a=(i/n)*Math.PI*2, k=1-jit+rnd()*jit*2;
            pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);
        }
        const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
        const m0=mid(pts[n-1],pts[0]);
        let d=`M${f(m0[0])} ${f(m0[1])}`;
        for(let i=0;i<n;i++){
            const p=pts[i], m=mid(p,pts[(i+1)%n]);
            d+=` Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
        }
        return `<path d="${d}Z" fill="${fill}"/>`;
    }

    function bricks(w,h,base,mort,size=14){
        let s=rect(0,0,w,h,base)+`<g stroke="${mort}" stroke-width="2">`;
        for(let y=size;y<h;y+=size) s+=`<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
        for(let r=0;r*size<h;r++)
            for(let x=r%2?size:0;x<w;x+=size*2) s+=`<line x1="${x}" y1="${r*size}" x2="${x}" y2="${r*size+size}"/>`;
        return s+'</g>';
    }

    function lantern(cx,cy,top){
        return `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${cy-26}" stroke="${C.ink}" stroke-width="2"/>`+lift(
            rect(cx-9,cy-28,18,6,'#d9a441')+
            `<ellipse cx="${cx}" cy="${cy}" rx="21" ry="24" fill="${C.main}"/>`+
            `<path d="M${cx-10} ${cy-22} Q${cx-16} ${cy} ${cx-10} ${cy+22} M${cx} ${cy-24} V${cy+24} M${cx+10} ${cy-22} Q${cx+16} ${cy} ${cx+10} ${cy+22}" stroke="${C.mainDark}" stroke-width="2" fill="none"/>`+
            rect(cx-9,cy+22,18,6,'#d9a441')+
            `<path d="M${cx-4} ${cy+28} V${cy+44} M${cx} ${cy+28} V${cy+48} M${cx+4} ${cy+28} V${cy+44}" stroke="#d9a441" stroke-width="2"/>`);
    }

    const shape = (d, color, attrs = '') => `<path d="${d}" fill="${color}" ${attrs}/>`;
    const inkLine = (d, color, w, opacity = 1) => shape(d, 'none',
        `stroke="${color}" stroke-width="${w}" stroke-opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round"`);

    // Keep the eyes and chin in a common coordinate space so hats, glasses,
    // and collars can fit several different head shapes.
    const faceOutlines = {
        oval:'M-13 10Q-9 1 1 2Q13 2 14 13L13 21Q12 28 7 32Q2 37-4 34Q-12 31-14 21Z',
        round:'M-14 10Q-9 0 1 1Q13 0 15 12L15 21Q15 29 8 33Q0 37-8 32Q-15 28-15 20Z',
        square:'M-13 8Q-7 1 2 1Q13 1 15 12L15 21L12 29Q9 34 4 35H-4Q-11 34-13 29L-15 22Z',
        long:'M-12 8Q-7 1 2 2Q12 2 13 11L12 20Q11 27 7 32Q4 37-1 36Q-10 34-12 26L-13 18Z',
        heart:'M-15 10Q-10 1 1 1Q12 1 15 10L14 20Q12 25 8 29L3 34Q0 36-4 33L-11 26Q-15 21-15 16Z',
        young:'M-14 10Q-8 1 1 1Q12 0 15 10L16 21Q15 28 9 32Q2 36-6 33Q-14 31-15 24L-15 16Z'
    };
    const haircuts = {
        tied:'M-14 17Q-18 11-15 5Q-10-3 0-3Q12-3 16 7L15 15Q10 14 8 10Q4 10 1 6Q-4 12-11 14L-12 20Z',
        bun:'M-14 17Q-18 11-15 5Q-9-3 0-3Q13-3 16 8L15 14Q7 14 1 6Q-5 12-12 14L-12 19Z',
        waves:'M-14 18Q-20 13-16 7Q-17 1-10 1Q-6-5 0-2Q6-5 10 0Q16 0 17 6Q18 10 14 15Q9 13 8 8Q4 12 1 10Q-4 14-9 12L-12 19Z',
        crop:'M-14 17Q-18 9-12 3Q-8-2 2-2Q14-2 16 7L14 13Q11 13 10 8Q4 11-8 10L-12 18Z',
        part:'M-14 17Q-18 9-13 3Q-6-4 2-2Q12-3 16 5L16 14Q9 13 5 6Q-1 11-9 12L-12 18Z',
        bob:'M-15 19Q-19 10-14 3Q-8-4 2-3Q14-3 17 7L17 20Q15 25 12 24L12 15Q10 14 7 9Q-3 13-12 12L-12 24L-16 23Z',
        recede:'M-14 18Q-17 13-13 7Q-12 2-5 1Q0-1 6 2Q13 2 15 8L15 15L11 14Q13 7 6 5Q3 6 0 5Q-8 4-11 13L-12 19Z'
    };
    const browStyles = {
        soft:'M-8.5 15q3-1.8 5.6-.4m7.1 0q2.8-1.4 5.3 .1',
        straight:'M-9 15l6-.7m7.2 .2 5.6 .1',
        angled:'M-8.5 14q3-.1 6 1.4m6.7-.5q2.5-1.3 5.5-1.4',
        lifted:'M-9 14.5q2.6-3 6-1.2m7.7 .8q2.5-2 5.4 .5'
    };
    const noses = {
        small:'M1 19q.4 2 1.4 3.3q-.4 1-2.4 1',
        long:'M1 18.2q.9 2.9 2.2 5q-.9 1.5-3.5 1.2',
        broad:'M1 19q1.4 1.8 2 3.1q-.6 1.9-3.5 1.7l-1.4-.5',
        button:'M-.4 22.1q1.7-1.2 3.1 .3q-.7 1.4-2.7 1.2'
    };

    function portrait(cx, top, o = {}){
        const skin = o.skin || '#e7ba92', hair = o.hair || '#342d29';
        const shade = '#a76b55', ink = '#493931';
        const cut = o.face || 'oval', style = o.style || 'part';
        const eyeStyle = o.closed ? 'closed' : o.eyes || 'soft';
        const mood = o.mouth || (o.smile ? 'warm' : 'quiet');
        const turn = o.look ?? .45;
        const shift = turn*2.4;
        let s = '';
        if(!o.cap && style==='bun'){
            s += shape('M-9 5q-9 3-12-3q-2-6 3-9q8-5 13 3Z',hair);
            s += inkLine('M-20 0q1-5 7-6','#e8c5a2',1.15,.35);
        }
        if(!o.cap && style==='tied') s += shape('M-11 7q-9 1-10 9q-2 10 4 17q6-3 5-10l3-10Z',hair);
        s += shape('M-12.5 17q-4.2-2.3-5.3 1.1q-.7 4.6 5.2 6.2Z',skin);
        s += shape('M12 17q3.9-1.5 4.9 1.4q.8 3.6-4.6 5.2Z',skin);
        s += shape(faceOutlines[cut],skin);
        s += shape('M-12 19q1 8 6 12q3 2 7 2q-4 2-8-1q-5-3-6-11Z',shade,'opacity=".32"');
        s += inkLine('M-15.5 19q1.4-.6 2 1.1',shade,1.05,.65);
        if(o.cap==='towel'){
            s += shape('M-16 13L-17 3Q-16-4-9-4Q4-7 15-1L16 11Q4 7-13 14Z','#e7e3cf');
            s += inkLine('M-14 4Q3-1 13 2M-13 8Q2 4 14 6','#a1ae9e',1.5);
        }else if(o.cap){
            const crown = o.cap==='flat'
                ? 'M-15 9l1-11q14-5 29 0l1 10q-13-2-31 1Z'
                : o.cap==='tall'
                    ? 'M-14 9l-2-11q-1-4 4-6q3-5 10-3q6-5 12 0q8 1 7 7l-2 12Z'
                    : 'M-14 9q-3-7-1-12q0-5 6-5q6-5 11-2q8-3 13 3q3 4 0 15Z';
            s += shape(crown,'#f3ead7') +
                shape('M-15 5q14-4 31-1l-2 6q-14-3-27 1Z','#c9bda4') +
                inkLine('M-8-4q3-2 5 1m8-3q4 1 4 4','#fff8e8',1.1,.8);
        }else{
            s += shape(haircuts[style],hair);
            s += inkLine(style==='recede'?'M-13 11q3-6 8-7m12 0q4 2 6 5':'M-12 7q4-6 12-7m-9 8q4-3 8-4','#ebd0b3',1.05,.32);
        }

        s += `<g transform="translate(${shift} 0)">`;
        s += inkLine(browStyles[o.brows || 'soft'],hair,o.brows==='straight'?1.38:1.15,.82);
        for(const [x,y,size] of [[-5.6,18.9,1],[6,18.5,1-turn*.27]]){
            s += `<g transform="translate(${x} ${y}) scale(${size} 1)">`;
            if(eyeStyle==='closed' || eyeStyle==='laugh'){
                s += inkLine(eyeStyle==='laugh'?'M-2.6 .5q2.5-3 5.2-.2':'M-2.6-.2q2.6 1.6 5.1-.3',ink,1.1);
            }else{
                const height = eyeStyle==='bright'?1.65:eyeStyle==='narrow'?.75:1.14;
                s += shape(`M-2.7 .1q2.6 ${-2*height} 5.4-.2q-2.5 ${2*height} -5.4 .2Z`,'#fae6cb','opacity=".78"');
                s += `<ellipse cx="${turn*.7}" cy="0" rx="${eyeStyle==='bright'?1.35:1.13}" ry="${height}" fill="${ink}"/>`;
                s += inkLine(`M-2.7 .1q2.6 ${-2*height} 5.4-.2`,ink,.82,.9);
            }
            s += '</g>';
        }
        s += inkLine(noses[o.nose || 'small'],shade,1.05,.84);
        if(mood==='open'){
            s += shape('M-3.1 26q3.4 1.3 7.7-.9q-1.2 4.1-4.2 4.1q-2.4-.2-3.5-3.2Z','#965849');
            s += inkLine('M-1.5 26.7q2.4 .3 4.3-.6','#efc8a8',.7);
        }else{
            const mouth = mood==='warm'?'M-3.3 26.6q3.9 2.2 8-1.1'
                : mood==='wry'?'M-2.8 27.2q3.2 .8 7.4-1.1'
                    : mood==='focus'?'M-2.8 27.2q2.9-.8 6.1-.3':'M-2.5 26.8q2.9 1.15 6.5-.45';
            s += inkLine(mouth,'#8d5747',1.17);
        }
        if(o.detail==='moustache'){
            s += shape('M.7 24.2q-2-1.3-5.6 1.1q2.9 1.3 5.6-.15q3.2 1.1 5.4-.6q-2.9-1.1-5.4-.35Z',hair,'opacity=".85"');
        }else if(o.detail==='freckles'){
            s += '<g fill="#a16d54" opacity=".65"><circle cx="-8.7" cy="22.5" r=".6"/><circle cx="-6.8" cy="23.3" r=".5"/><circle cx="-5.5" cy="22" r=".5"/><circle cx="7" cy="22.1" r=".55"/><circle cx="8.5" cy="23" r=".5"/></g>';
        }
        if(o.mature) s += inkLine('M-9.3 21l1.7 .9m16.5-.6 1.6-1m-13.5 9.4q1 .7 2 .8',shade,.8,.65);
        s += '</g>';
        if(o.detail==='earring') s += '<circle cx="-15" cy="23.8" r="1.65" fill="none" stroke="#ba9159" stroke-width="1.35"/>';
        return `<g transform="translate(${cx} ${top}) scale(${o.dir === -1 ? -1 : 1} 1)">${s}</g>`;
    }

    function shoe(x, y, dir = 1){
        return `<g transform="translate(${x} ${y}) scale(${dir} 1)">` +
            shape('M-6-5Q-1-2 4-5L7-1L13 1Q16 3 13 6H-5Q-8 4-6-5Z','#3e3833') +
            inkLine('M-5 5H13M4 0l4 1','#cbb394',1.1,.67) + '</g>';
    }

    // The implement passes through the center of the closed fingers.
    function grip(x, y, angle = 0, skin = '#e7ba92', size = 1){
        return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})">` +
            shape('M-7 3Q-9 0-6-3L-4-4L-4-7Q-2-9 0-7L0-3Q4-6 6-3L7 3Q7 6 3 7L-3 7Q-7 6-7 3Z',skin) +
            inkLine('M-5 4q5 3 9 0M1-2l3-1m-3 4 4-1','#985b48',.9,.7) +
            inkLine('M-5 0l2-2','#ffdfba',1,.7) + '</g>';
    }

    function person(cx, top, o = {}){
        const skin = o.skin || '#e7ba92', shirt = o.shirt || C.accent, pants = o.pants || '#4a4e5a';
        const dir = o.dir === -1 ? -1 : 1, L = o.legs || 70;
        const shadow = '#2f2625', light = '#ffe6bd';
        let s = '';
        if(o.seated){
            s += `<g transform="scale(${dir} 1)">` +
                shape('M-10 89Q2 87 8 94L23 106Q27 109 25 117L21 138L11 137L13 115L-12 102Z',pants) +
                shape('M-10 89Q2 87 8 94L23 106Q27 109 25 117L21 138L11 137L13 115L-12 102Z',shadow,'opacity=".26"') +
                shoe(17,138) +
                shape('M-5 87Q7 85 16 92L32 103Q40 107 37 116L34 139L22 139L24 116L0 105Q-10 100-5 87Z',pants) +
                inkLine('M5 98q11 5 24 12l-3 22',light,1.3,.38) + shoe(30,140) + '</g>';
        }else if(o.legs !== 0){
            s += shape(`M-16 90L15 91L17 ${105+L*.39}L19 ${98+L}L7 ${100+L}L3 ${111+L*.39}L-2 111L-8 ${107+L*.44}L-12 ${100+L}L-23 ${99+L}L-20 ${104+L*.47}Z`,pants);
            s += inkLine(`M-2 100L-2 111L-8 ${107+L*.44}L-12 ${96+L}M9 112l5 ${L-20}`,light,1.2,.27);
            s += shoe(-17,100+L,dir) + shoe(13,101+L,dir);
        }
        s += shape('M-6 25H7L8 36Q4 43-7 37Z',skin) + shape('M-6 26H7V33L-6 36Z','#af745d','opacity=".57"');
        s += shape('M-7 35Q-12 35-18 39Q-22 43-21 50L-17 71L-20 94Q-7 101 18 95L17 77L20 48Q21 39 8 35Q5 40-1 40Q-6 40-7 35Z',shirt);
        s += shape('M14 39q8 3 6 11l-3 27 1 18q-10 5-22 3l11-6 4-22Z',shadow,'opacity=".19"');
        s += inkLine('M-9 36Q-2 46 10 37M-17 92q14 6 32 0',light,1.5,.47);
        s += o.apron ? shape('M-9 40l2 16h15l3-16 3 1-1 18 6 40q-20 5-39 0l5-41 3-19Z','#efe4cf') +
            shape('M-8 75H9L8 88Q0 93-8 87Z','#d3bfa6') + inkLine('M-7 76H8M-16 96q16 5 32 0','#fffae9',1.3)
            : inkLine('M-13 55q4 4 4 9M-9 84l9 4M7 53h7l-1 9h-6',shadow,1.15,.3);
        const arms = o.arms || [[-17,45,-24,89,-24,66],[17,45,26,90,24,66]];
        s += arms.map(([sx,sy,hx,hy,ex=(sx+hx)/2,ey=(sy+hy)/2]) => {
            const angle = Math.atan2(hy-ey,hx-ex)*180/Math.PI-90;
            return inkLine(`M${sx} ${sy}Q${(sx+ex)/2} ${(sy+ey)/2} ${ex} ${ey}L${hx} ${hy}`,shirt,11) +
                inkLine(`M${sx} ${sy-2}Q${ex} ${ey-2} ${hx} ${hy-2}`,light,1.1,.34) +
                `<g transform="translate(${hx} ${hy}) rotate(${angle})">` +
                inkLine('M-4-3h8',shadow,1.1,.39) +
                shape('M-3-1Q-4 0-4 3L-6 5Q-6 7-4 6L-3 5L-2 8Q1 11 4 7Q6 4 4 0Z',skin) +
                inkLine('M0 6v2m2-3 1 2','#a7614f',.8,.65) + '</g>';
        }).join('');
        return `<g transform="translate(${cx} ${top})">${s}${portrait(o.headX || 0,0,o)}</g>`;
    }

    function steamPuffs(xs,base,rise,scale=1){
        return xs.map((x,i)=>{
            const dur=(3.2+i*0.4).toFixed(1), beg=(-i*1.1).toFixed(1);
            return `<g opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${(i%2?6:-6)*scale} ${-rise}" dur="${dur}s" begin="${beg}s" repeatCount="indefinite"/>`+
                `<animate attributeName="opacity" values="0;.85;.6;0" keyTimes="0;.25;.7;1" dur="${dur}s" begin="${beg}s" repeatCount="indefinite"/>`+
                blob(x,base,20*scale,15*scale,'#fbf6ea',8,0.25)+blob(x+10*scale,base-16*scale,14*scale,11*scale,'#fffaf0',7,0.25)+`</g>`;
        }).join('');
    }

    /* SVG 滤镜 */
    const DEFS=`
        <filter id="paper"><feTurbulence baseFrequency="0.04" numOctaves="5" seed="2"/><feColorMatrix values="0 0 0 0 1, 0 0 0 0 1, 0 0 0 0 1, 0 0 0 -.7 1.1"/><feComposite in="SourceGraphic" operator="in"/><feComposite in2="SourceAlpha" operator="in"/></filter>
        <filter id="lift"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dy="2" result="off"/><feFlood flood-opacity=".25"/><feComposite in2="off" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="die"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".6" intercept=".15"/><feFuncG type="linear" slope=".55" intercept=".12"/><feFuncB type="linear" slope=".5" intercept=".08"/></feComponentTransfer></filter>
        <filter id="sil"><feFlood flood-color="#3b2a1e" flood-opacity=".38"/><feComposite in2="SourceAlpha" operator="in"/></filter>
    `;

    /* 注册跨页构建函数 */
    const spreads={};
    function register(id,fn){
        spreads[id]=fn;
    }

    function build(id){
        if(spreads[id]){
            SYM.length=0;  // 清空之前的
            spreads[id]();
        }
        return {defs: DEFS+SYM.join(''), symbols: SYM.join('')};
    }

    return {
        setPalette,
        roof, win, blob, bricks, lantern, person, portrait, shoe, grip, steamPuffs,
        rect, txt, vtxt, lift, f,
        sym, register, build,
        get size(){ return SIZE; },
        get defs(){ return DEFS+SYM.join(''); },
        get C(){ return C; }
    };
})();
