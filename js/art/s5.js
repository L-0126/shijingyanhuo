// Fifth spread, cut as separate layers of the same paper diorama.
PB.ART.register('s5', () => {
    const {sym, rect, txt, person} = PB.ART;
    const ink = '#24222d';
    const repeat = (count, draw) => Array.from({length:count}, (_, i) => draw(i)).join('');
    const round = x => Number(x.toFixed(1));
    const line = (x1,y1,x2,y2) => `M${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}`;

    const westBank = 'M0 0H1600V163C1464 161 1371 187 1288 202S1121 251 1033 290C933 334 958 506 875 581C705 685 540 659 418 649S174 642 0 735Z';
    const eastBank = 'M1600 522C1487 550 1361 580 1258 662C1140 754 1227 804 1088 865Q955 924 811 1000H1600Z';
    sym('s5-print', 1600, 1000, `
        <defs>
            <linearGradient id="s5-water" x2=".87" y2="1">
                <stop stop-color="#172737"/><stop offset=".54" stop-color="#294b61"/>
                <stop offset="1" stop-color="#365d6e"/>
            </linearGradient>
            <linearGradient id="s5-paving" x2="0" y2="1">
                <stop stop-color="#58444a"/><stop offset=".43" stop-color="#93776a"/>
                <stop offset="1" stop-color="#c2a486"/>
            </linearGradient>
            <linearGradient id="s5-timber" x2="1" y2="1">
                <stop stop-color="#9e6947"/><stop offset=".52" stop-color="#684138"/><stop offset="1" stop-color="#3c2a32"/>
            </linearGradient>
            <radialGradient id="s5-quay-light">
                <stop stop-color="#ffe1a4" stop-opacity=".66"/><stop offset="1" stop-color="#df9c59" stop-opacity="0"/>
            </radialGradient>
            <clipPath id="s5-water-clip"><path d="M0 0H1600V1000H0Z ${westBank} ${eastBank}" clip-rule="evenodd"/></clipPath>
            <clipPath id="s5-bank-clip"><path d="${westBank} ${eastBank}"/></clipPath>
        </defs>
        <rect width="1600" height="1000" fill="url(#s5-water)"/>
        <path d="${westBank} ${eastBank}" fill="url(#s5-paving)" stroke="#e2bc89" stroke-width="7"/>
        <g clip-path="url(#s5-water-clip)" fill="none">
            <path d="${westBank} ${eastBank}" stroke="#93bdc6" stroke-width="23" opacity=".18"/>
            ${repeat(122, i => {
                const x = (i*173)%1600;
                const y = 450+(i*71)%550;
                return `<path d="M${x} ${y}q18 ${i%3-1} ${22+(i*29)%91} -1" stroke="${i%5===0?'#9fbebd':'#577c8d'}" opacity="${.17+(i%6)*.07}" stroke-width="${i%4===0?4:2}"/>`;
            })}
            ${repeat(138, i => {
                const x = 92+(i*107)%689;
                const y = 609+(i*59)%300;
                return `<path d="M${x} ${y}h${8+(i*19)%44}" stroke="${['#fbc075','#d28c63','#edddaa','#698f9e'][i%4]}"
                    opacity="${round((1-(y-600)/390)*(.29+(i%7)*.07))}" stroke-width="${i%4+1}"/>`;
            })}
            ${repeat(56, i => {
                const cluster = i%7;
                const x = 153+cluster*87+(i*31)%55;
                const y = 660+(i*29)%151;
                const opacity = .46-(y-660)*.0019;
                return `<path d="M${x} ${y}h${10+i%27}" stroke="${i%4===0?'#ffe4b1':'#e1a470'}"
                    opacity="${round(opacity)}" stroke-width="${i%3+3}"/>`;
            })}
            ${repeat(36, i => {
                const x = 895+(i*103)%658;
                const y = 402+(i*49)%340;
                return `<path d="M${x} ${y}h${11+i%29}" stroke="${i%3?'#af7160':'#ced3b2'}" opacity=".5" stroke-width="3"/>`;
            })}
        </g>
        <g clip-path="url(#s5-bank-clip)" fill="none" stroke="#453b42" stroke-width="2" opacity=".42">
            ${repeat(21,i=>`<path d="M0 ${i*54}H1600"/>`)}
            ${repeat(42,i=>`<path d="M${i*39} 0l${(i-21)*5} 1000"/>`)}
        </g>
        <path d="M1558 540C1459 564 1366 591 1277 670S1229 803 1101 876L892 997
                 M0 712Q163 628 424 634T875 570" stroke="#ebc894" stroke-width="3" fill="none" opacity=".78"/>
        <ellipse cx="1364" cy="819" rx="193" ry="151" fill="url(#s5-quay-light)"/>
        <g fill="#9c7959" stroke="#e1b78a" stroke-width="3">
            <path d="M475 627h40v98h-40Z"/>
            <path d="M1148 787h100v27h-100Z"/>
        </g>
        <g fill="none" stroke="#5b4640" stroke-width="3">
            ${repeat(8, i => `<path d="M478 ${635+i*11}h34"/>`)}
            ${repeat(8, i => `<path d="M${1155+i*12} 790v21"/>`)}
            <path d="M1244 800l50-17m-43 8 3 10m7-14 3 10m7-13 3 10m7-13 3 10"/>
        </g>
    `);

    const skyline = (x, width, count, base, height, tone) => repeat(count, i => {
        const step = width/count;
        const bx = round(x+i*step);
        const w = round(step*(.48+(i*7)%5*.1));
        const h = 27+(i*73)%height;
        const top = base-h;
        return `<path d="M${bx} ${base}V${top+6}h${round(w*.21)}v-6h${round(w*.58)}v6h${round(w*.21)}v${h-6}Z" fill="${tone}"/>` +
            repeat(Math.floor(h/12)-1, row => repeat(2+(i%2), col => {
                if((i+row*3+col*5)%7<3) return '';
                return rect(round(bx+4+col*w*.23),top+12+row*11,2.8,3.1,(i+col)%4===0?'#dfb17d':'#90a6a7','opacity=".65"');
            }));
    });

    sym('s5-sky', 1490, 550, `
        <defs>
            <linearGradient id="s5-evening" x2="0" y2="1">
                <stop stop-color="#131b30"/><stop offset=".67" stop-color="#28384d"/><stop offset="1" stop-color="#586373"/>
            </linearGradient>
        </defs>
        <path d="M0 143Q44 118 94 118L163 78 235 85 307 47 384 56 462 22 537 38
            621 15 729 31 823 4 917 35 1015 19 1084 43 1147 39 1229 73
            1290 66 1387 105 1444 118 1490 163V550H0Z" fill="url(#s5-evening)"/>
        <path d="M28 240Q230 161 487 177M872 184q256-39 548 50" fill="none" stroke="#7894a6" stroke-width="2" opacity=".21"/>
        ${repeat(39,i=>`<circle cx="${48+(i*263)%1390}" cy="${102+(i*47)%170}" r="${i%7===0?2.1:1.15}" fill="#e9d5ad" opacity="${.21+i%5*.1}"/>`)}
        <circle cx="1271" cy="146" r="34" fill="#ecdbb6" opacity=".09"/>
        <circle cx="1271" cy="146" r="21" fill="#f5dfb3"/>
        <path d="M0 431 115 344 191 374 319 311 417 348 551 284 700 348
                 789 331 900 377 1047 303 1139 322 1237 288 1363 353 1490 300V550H0Z" fill="#314256"/>
        <path d="M0 469l108-55 104 28 76-47 137 26 139-32 82 32 102-22
                 142 50 132-53 175 38 153-45 140 33v128H0Z" fill="#29374a"/>
        ${skyline(28,1430,59,482,107,'#374a60')}
        ${skyline(61,1375,38,523,132,'#263649')}
        <path d="M0 523Q311 513 517 526T916 529q215 8 574-16v37H0Z" fill="#263c50"/>
        <path d="M0 525Q330 516 517 529t399 2q190 8 574-16" fill="none" stroke="#bd9a78" stroke-width="3" opacity=".68"/>
        ${repeat(39,i=>`<path d="M${(i*127)%1473} ${529+i%6*3}h${8+i%17}" stroke="#acb6ae" opacity=".33" stroke-width="2"/>`)}
    `);

    function cableBridge(w, towers, distance = false){
        const deck = x => 252 - x*.079;
        const truss = repeat(Math.floor(w/29), i => {
            const x = i*29;
            return line(x, deck(x),x+14.5,deck(x+14.5)+20) +
                line(x+14.5,deck(x+14.5)+20,x+29,deck(x+29));
        });
        return `
            <path d="${line(0,deck(0),w,deck(w))}" stroke="${distance?'#5f4549':'#382c37'}" stroke-width="22"/>
            ${towers.map(x => {
                const y = deck(x);
                const cap = y-(distance?118:171);
                return `
                    <g fill="none" stroke="${distance?'#c39d84':'#e2ba95'}" stroke-width="${distance?1.7:2.1}" opacity=".79">
                        ${repeat(7,i=> {
                            const reach = 72+i*18;
                            const tie = cap+45-i*5;
                            return `<path d="${line(Math.max(9,x-reach),deck(Math.max(9,x-reach))-3,x,tie)}
                                ${line(Math.min(w-9,x+reach),deck(Math.min(w-9,x+reach))-3,x,tie)}"/>`;
                        })}
                    </g>
                    <path d="M${x-11} 370Q${x-32} ${y+22} ${x-21} ${y-36}
                        L${x-5} ${cap}Q${x} ${cap-5} ${x+5} ${cap}
                        L${x+19} ${y-37}Q${x+31} ${y+22} ${x+10} 370Z" fill="${distance?'#92777a':'#b09b94'}"/>
                    <path d="M${x} ${cap+9}L${x+10} ${y-41}Q${x+20} ${y+17} ${x+3} 361H${x-2}
                        Q${x-11} ${y+11} ${x-7} ${y-35}Z" fill="${distance?'#3a3b4c':'#354350'}"/>
                    <path d="M${x-11} 367Q${x-32} ${y+22} ${x-21} ${y-36}L${x-5} ${cap+2}"
                        fill="none" stroke="${distance?'#be9880':'#e5c6a2'}" stroke-width="3"/>
                `;
            }).join('')}
            <path d="${line(0,deck(0)+2,w,deck(w)+2)}" stroke="${distance?'#9b655d':'#ba5949'}" stroke-width="9"/>
            <path d="${truss}" fill="none" stroke="${distance?'#9b655d':'#b65d50'}" stroke-width="5" stroke-linejoin="round"/>
            <path d="${line(0,deck(0)+22,w,deck(w)+22)}" stroke="${distance?'#bd7969':'#d18b67'}" stroke-width="5"/>
            <path d="${line(0,deck(0)-4,w,deck(w)-4)}" stroke="#ffe3a4" stroke-width="3"/>
            ${repeat(Math.floor(w/26),i=>{
                const x=12+i*26, y=deck(x)-5;
                return `<path d="M${x} ${round(y)}v-9l4-1" fill="none" stroke="#f9d9a0" stroke-width="1.65"/>`;
            })}
        `;
    }

    sym('s5-bridge', 760, 374, `
        ${cableBridge(760,[481])}
        <path d="M478 44h7" stroke="#f7a781" stroke-width="3" stroke-linecap="round"/>
    `);
    sym('s5-east-bridge', 620, 374, cableBridge(620,[165,432],true));

    function rail(x,y,w){
        return `<path d="M${x} ${y}h${w}m-${w} 13h${w}" stroke="#c79463" stroke-width="3"/>
            <path d="${repeat(Math.floor(w/13),i=>`M${x+6+i*13} ${y}v13`)}" stroke="#d2a46d" stroke-width="2"/>`;
    }

    function eaves(x,w,y,h){
        const d = `M${x-13} ${y-6}Q${x+3} ${y+6} ${x+29} ${y-3}
            L${x+58} ${y-h}H${x+w-58}L${x+w-29} ${y-3}Q${x+w-3} ${y+6} ${x+w+13} ${y-6}
            Q${x+w+4} ${y+10} ${x+w-25} ${y+10}H${x+25}Q${x-5} ${y+10} ${x-13} ${y-6}Z`;
        return `
            <path d="${d}" fill="#282631"/>
            <path d="${repeat(Math.floor((w-40)/9),i => {
                const bx=x+23+i*9;
                const tx=x+55+(w-110)*(bx-x-23)/(w-45);
                return line(tx,y-h+4,bx,y+3);
            })}" stroke="#64504a" stroke-width="2.4"/>
            <path d="M${x+57} ${y-h}h${w-114}M${x-11} ${y-4}Q${x+3} ${y+7} ${x+30} ${y+6}
                H${x+w-30}Q${x+w-3} ${y+7} ${x+w+11} ${y-4}" stroke="#f6c47b" stroke-width="3.6" fill="none"/>
        `;
    }

    function lantern(x,y,s=1){
        return `<g transform="translate(${x} ${y}) scale(${s})">
            <path d="M0 -13V13" stroke="#d78a5b" stroke-width="1.6"/>
            <ellipse rx="7.5" ry="6.4" fill="#b83834"/><ellipse rx="4" ry="5.5" fill="#f36c49"/>
            <path d="M-4 4h8" stroke="#f6bf6f" stroke-width="2"/>
        </g>`;
    }

    function lattice(x,y,w,h,on){
        return `
            ${rect(x,y,w,h,'#422c31','stroke="#a47854" stroke-width="2"')}
            ${rect(x+3,y+3,w-6,h-6,on?'#e7ad65':'#634645')}
            <path d="M${x+3} ${y+h*.54}h${w-6}M${x+w*.5} ${y+3}v${h-6}" stroke="#744c3e" stroke-width="2.4"/>
            <path d="M${x+3} ${y+h-3}h${w-6}" stroke="${on?'#ffcf82':'#9c7355'}" stroke-width="2"/>
        `;
    }

    sym('s5-tower-front', 498, 590, `
        <path d="M34 558V153H79V83H141V39H386V87H431V150H465V553Z" fill="url(#s5-timber)"/>
        <path d="M45 171h404v380H45Z" fill="#795041"/>
        <path d="M26 536H473L456 556H44Z" fill="#5c494a"/>
        <path d="M38 554h424l-11 21H46Z" fill="#493b40"/>
        <path d="M53 539v51m74-61v57m256-50v54m55-51v49m-383-39 67 28m321-29-55 31" stroke="#3d2b31" stroke-width="12"/>
        <path d="M63 481H437V532H63Z" fill="#513239"/>
        ${repeat(9,i=>lattice(76+i*39,492,28,28,i%4!==2))}
        <path d="M55 526h388m-388 5h388" stroke="#e9ae66" stroke-width="2.7"/>
        ${repeat(3, i => {
            const y = 145+i*113;
            const x = [64,43,34][i];
            const w = 498-2*x;
            return `
                <rect x="${x}" y="${y}" width="${w}" height="107" fill="url(#s5-timber)"/>
                <path d="M${x} ${y+8}h${w}m-${w} 84h${w}M96 ${y}v92m152-92v92m155-92v92"
                    stroke="#462c2f" stroke-width="8" fill="none"/>
                ${rail(x+8,y+89,w-16)}
                ${lantern(x+18,y+22,.9)}${lantern(498-x-17,y+25,.9)}
                ${eaves(x+4,w-8,y+105,19)}
            `;
        })}
        <rect x="90" y="94" width="320" height="49" fill="#53363a"/>
        ${repeat(9,i=>lattice(99+i*34,102,25,30,i%3!==0))}
        ${eaves(62,379,147,37)}
        ${eaves(103,304,89,35)}
        ${eaves(159,220,28,21)}
        <path d="M174 35H360V80H174Z" fill="#291c22" stroke="#37262a" stroke-width="2"/>
        <path d="M177 35H357V76H177Z" fill="#592d31" stroke="#e8ad60" stroke-width="3"/>
        <path d="M183 40h168v31H183Z" fill="none" stroke="#a96e4b" stroke-width="1"/>
        ${txt(270,65,28,'#ffe0a2','洪崖洞','letter-spacing="9" font-weight="600"')}
    `);

    sym('s5-tower-side', 154, 590, `
        <path d="M0 554V151H154v396l-17 25H0Z" fill="#523438"/>
        <path d="M0 151H154L133 125H19Z" fill="#302834" stroke="#d1a069" stroke-width="2.8"/>
        <path d="M13 147l17-19m5 19 14-19m9 19 11-19m10 19 9-19m12 19 5-19m13 19 4-19m15 19-3-16"
            stroke="#6f544f" stroke-width="2"/>
        ${repeat(3,i=>{
            const y=146+i*113;
            return `${rect(8,y,141,104,'#67413b')}
                ${repeat(4,j=>lattice(13+j*33,y+25,24,52,(i+j)%3!==0))}
                ${rail(6,y+88,144)}
                <path d="M0 ${y+101}h154l-4 11H0Z" fill="#372b35" stroke="#bb8e62" stroke-width="2"/>
                ${lantern(121,y+16,.8)}`;
        })}
        <path d="M9 549v39m105-35v31" stroke="#3e2c31" stroke-width="13"/>
    `);

    function pavilion(w, floors, step, stairDirection){
        const h = floors*step+54;
        return repeat(floors,i=>{
            const inset = 13+(floors-i-1)*24;
            const x = stairDirection > 0 ? inset : 9;
            const width = w-inset-10;
            const top = 37+i*step;
            const bottom = top+step;
            return `
                <path d="M${x} ${top}h${width}v${step+9}H${x}Z" fill="url(#s5-timber)"/>
                ${repeat(Math.floor((width-9)/33),j=>lattice(x+9+j*33,top+11,24,step-24,(i*3+j)%5!==0))}
                ${rail(x+5,bottom-14,width-11)}
                ${eaves(x,width,top+1,27)}
                ${lantern(x+12,top+17,.86)}${lantern(x+width-13,top+17,.86)}
                <path d="M${x-2} ${bottom}h${width+4}" stroke="#f1b371" stroke-width="2.8"/>
                ${i===floors-1?`<path d="M${x+17} ${bottom}v${h-bottom}m${width-35} -${h-bottom}v${h-bottom}" stroke="#3e2b31" stroke-width="10"/>`:''}
            `;
        });
    }

    sym('s5-wing-west', 370, 358, pavilion(370,4,76,1));
    sym('s5-wing-east', 289, 276, pavilion(289,3,74,-1));
    sym('s5-lower-street', 437, 176, pavilion(437,2,61,1));

    sym('s5-cliff', 950, 157, `
        <path d="M0 150L17 128 63 112 100 91 169 100 226 70 307 73 366 56 454 72 514 43
            620 51 662 40 738 54 815 86 858 91 950 127V157H0Z" fill="#4d454c"/>
        <path d="M15 151 122 104 175 112 253 86 309 89 379 70 462 88 522 60 617 70 668 57
            739 70 813 100 867 106 950 137V157H0Z" fill="#62545a"/>
        <path d="M15 151 122 104 175 112 253 86 309 89 379 70 462 88 522 60 617 70 668 57 739 70 813 100 867 106 950 137"
            stroke="#ab8571" stroke-width="4" fill="none"/>
        <path d="M80 138l50-19 55 9 65-24 68 6 62-20 85 17 56-23 90 7 61-14 63 18
            M239 136l92-16 56 15 66-14 95 7 64-17 74 6 54-10 84 19" fill="none" stroke="#9b7c70" stroke-width="3"/>
        <path d="M123 112l-7 24 13 21m127-57-19 25 15 32m119-66-12 31 19 35m144-94 9 32-15 56
            m159-93 16 35-17 64m124-67-12 27 19 26" fill="none" stroke="#443c44" stroke-width="5"/>
        <path d="M0 151Q210 145 418 151T950 146" fill="none" stroke="#c49b79" stroke-width="4"/>
    `);

    sym('s5-boat', 235, 106, `
        <path d="M2 87H234l-28 17H43Q17 101 2 87Z" fill="#273041" stroke="#c58f70" stroke-width="3"/>
        <path d="M26 52H189l32 14v19H25Z" fill="#ba9c86"/>
        <path d="M52 28h117l23 19H43Z" fill="#d4b291"/>
        <path d="M83 15h57v12H79Z" fill="#425363"/>
        <path d="M117 15V3m1 1 26 3-27 6" stroke="#dca16d" fill="#b85342" stroke-width="2"/>
        ${repeat(9,i=>rect(38+i*18,63,12,11,i%3===0?'#f1bf72':'#476674','rx="1"'))}
        ${repeat(7,i=>rect(54+i*17,33,12,9,'#546976'))}
        <path d="M43 48h157M17 82h211" stroke="#f2c58c" stroke-width="3"/>
        <path d="M31 87h187" stroke="#bf5a4d" stroke-width="4"/>
        <g data-part="passenger" opacity="0">
            <path d="M29 52h17v4H29m3 0v22m11-22v22" fill="none" stroke="#674839" stroke-width="2"/>
            <g transform="translate(38 12) scale(.43)">
                ${person(0,0,{shirt:'#984d3c',pants:'#3a3d4f',seated:true,
                    style:'part',face:'long',eyes:'soft',brows:'straight',
                    mouth:'quiet',nose:'long',look:.8,
                    arms:[[-17,45,-4,90],[17,45,23,94]]})}
            </g>
            <path d="M20 65h12l-1 15h-10Z" fill="#b78450" stroke="#795544"/>
            <path d="M22 65q-1-10 8 0" fill="none" stroke="#f0c58d" stroke-width="1.5"/>
            <path d="M17 82h40" stroke="#f2c58c" stroke-width="3"/>
        </g>
    `);

    sym('s5-steps', 300, 152, `
        <path d="M0 152V127H58V105H113V82H166V59H213V36H254V14H300V152Z" fill="#918083"/>
        <path d="M0 127H58V105H113V82H166V59H213V36H254V14H300"
              fill="none" stroke="#debf9b" stroke-width="8"/>
        <path d="M16 137h37m21-22h30m22-21h34m23-24h23m20-23h24m18-22h25"
              stroke="#69575a" stroke-width="4"/>
    `);

    sym('s5-homecoming', 124, 181, `
        ${person(61,18,{shirt:'#984d3c',pants:'#3a3d4f',legs:57,style:'part',face:'long',
            eyes:'soft',brows:'straight',mouth:'open',nose:'long',look:.8,
            arms:[[-18,44,-24,73],[18,44,35,80]]})}
        <path d="M75 95q20-29 38 0" fill="none" stroke="#f0c58d" stroke-width="4"/>
        <path d="M75 90h42l-4 49H79Z" fill="#b78450"/>
        <path d="M79 103h33m-32 13h31m-29 13h28" stroke="#795544" stroke-width="3"/>
        <path d="M44 61q23 18 38 5" fill="none" stroke="#dec398" stroke-width="7"/>
    `);

    sym('s5-lamp', 103, 227, `
        <path d="M51 220V49q0-32 27-32" fill="none" stroke="#44343b" stroke-width="9"/>
        <path d="M61 34h34l-7 35H69Z" fill="#efb46e" stroke="#614237" stroke-width="5"/>
        <path d="M59 34q18-26 38 0M37 220h29" fill="none" stroke="#614237" stroke-width="7"/>
        <path d="M69 48h19" stroke="#ffe9b0" stroke-width="7"/>
    `);

    sym('s5-harvest', 196, 108, `
        <path d="M9 106 31 11m138 0 17 95M15 34h169" stroke="#613d34" stroke-width="7"/>
        ${repeat(9,i => `<ellipse cx="${28+i*18}" cy="${43+i%3*4}" rx="7" ry="${12+i%3*3}" fill="${i%2?'#b74639':'#e7aa57'}"/>`)}
        <ellipse cx="97" cy="81" rx="80" ry="19" fill="#8e5035"/>
        <ellipse cx="97" cy="76" rx="76" ry="16" fill="#dea457"/>
        ${repeat(12,i => `<path d="M${30+i*11} ${73+i%3*3}l12 4" stroke="${i%3?'#a63f33':'#f7cd68'}" stroke-width="5" stroke-linecap="round"/>`)}
    `);

    const bowl = (x,y) => `<g transform="translate(${x} ${y})">
        <path d="M-13 0H13Q11 10 3 11H-3Q-11 10-13 0Z" fill="#d4c09f"/>
        <ellipse rx="13" ry="5.2" fill="#f4e2bf" stroke="#f8ecd0" stroke-width="1.3"/>
        <ellipse rx="8.4" ry="2.9" fill="#ae593b"/>
        <path d="M-7 0l2-1m4 2 2-2m4 2 2-1" stroke="#7e8b52" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M-9 6q9 4 18 0" fill="none" stroke="#637d78" stroke-width="1.4"/>
    </g>`;
    const cup = (x,y,rot=0) => `<g transform="translate(${x} ${y}) rotate(${rot})">
        <path d="M-6 0H6L4 10Q0 12-4 10Z" fill="#f0d7a6" stroke="#8f654a" stroke-width="1"/>
        <ellipse rx="6" ry="2.6" fill="#fff2ce"/><ellipse rx="4.4" ry="1.5" fill="#b67c50"/>
        <path d="M-3 3l1 5" stroke="#fff2ce" stroke-width="1.3" stroke-linecap="round"/>
    </g>`;

    sym('s5-feast', 354, 194, `
        <g transform="translate(82 24) scale(.85)">
            ${person(0,0,{shirt:'#547e7a',skin:'#d6a680',style:'part',legs:0,
                face:'square',eyes:'narrow',brows:'straight',nose:'broad',mouth:'warm',look:.8,
                arms:[[-18,44,7,71,-20,64],[17,44,42,47,35,64]]})}
            ${cup(45,45,-14)}
            ${PB.ART.grip(42,50,-14,'#d6a680',.54)}
        </g>
        <g transform="translate(268 22) scale(.85)">
            ${person(0,0,{shirt:'#9d5548',skin:'#eac09d',hair:'#3b2a28',style:'bun',dir:-1,legs:0,
                face:'heart',eyes:'bright',brows:'soft',nose:'button',mouth:'wry',detail:'earring',look:.7,
                arms:[[-17,44,-42,51,-32,65],[18,44,-7,76,21,66]]})}
            ${cup(-44,49,15)}
            ${PB.ART.grip(-41,53,15,'#eac09d',.55)}
        </g>
        <path d="M79 128L66 187M275 128l13 59M120 143l-1 36m117-36 2 36" fill="none" stroke="#604138" stroke-width="10" stroke-linecap="round"/>
        <path d="M44 111H311L302 140Q284 171 178 173Q78 171 53 142Z" fill="#854d3e" stroke="#633a33" stroke-width="3"/>
        <path d="M58 142Q105 170 179 169Q252 169 296 144" fill="none" stroke="#ba805e" stroke-width="2"/>
        <ellipse cx="177" cy="111" rx="134" ry="44" fill="#b78256" stroke="#6c4437" stroke-width="4"/>
        <ellipse cx="177" cy="108" rx="128" ry="38" fill="none" stroke="#d6a675" stroke-width="1.7"/>
        <path d="M61 108q21 20 65 22m86 10q44-4 78-23M80 91q14-8 38-8m129 12q19 0 35 9" fill="none" stroke="#79563f" stroke-opacity=".36" stroke-width="1.4" stroke-linecap="round"/>

        <g transform="translate(95 103) rotate(10)">
            <ellipse cy="2" rx="24" ry="10" fill="#765243" opacity=".35"/>
            <ellipse rx="24" ry="10" fill="#e9dbbc" stroke="#f7ebd0" stroke-width="1.7"/>
            ${repeat(5,i=>`<path d="M${-17+i*7} 2q-4-6 3-7l7 5q3 4-4 5Z" fill="${i%2?'#a9534e':'#c37165'}"/>
                <path d="M${-17+i*7} 0l7 3" stroke="#f0b198" stroke-width="1.1" stroke-linecap="round"/>`)}
        </g>
        <g transform="translate(260 102) rotate(-12)">
            <ellipse cy="2" rx="24" ry="10" fill="#765243" opacity=".35"/>
            <ellipse rx="24" ry="10" fill="#e9dbbc" stroke="#f7ebd0" stroke-width="1.7"/>
            ${repeat(5,i=>`<path d="M${-17+i*7} ${3-i%2*2}q-6-6-4-9q8-4 13 4q1 4-9 5Z" fill="${i%2?'#6b874d':'#8e9e57'}"/>
                <path d="M${-19+i*7} -5l7 8" stroke="#c4bc7a" stroke-width="1.1" stroke-linecap="round"/>`)}
        </g>
        ${bowl(67,122)}${bowl(119,133)}${bowl(234,133)}${bowl(288,121)}
        <path d="M135 137l23 5m-24-2 23 5m38-1 26-5m-25 8 26-5" stroke="#69473b" stroke-width="1.6" stroke-linecap="round"/>

        <ellipse cx="176" cy="116" rx="62" ry="15" fill="#55372e" opacity=".35"/>
        <path d="M133 105h86l-6 18q-37 13-74 0Z" fill="#594239" stroke="#48312c" stroke-width="2"/>
        <path d="M163 121q4-9 10-5q0-8 5-10q-1 6 5 8q5-2 9 7q-12 5-29 0Z" fill="#df8a4b"/>
        <path d="M119 84h114q-4 26-17 32q-39 14-78 0q-13-7-19-32Z" fill="#a26844" stroke="#634336" stroke-width="2.5"/>
        <path d="M128 98q22 14 71 14q12-1 24-6m-77 9q31 9 62 0" fill="none" stroke="#e0a36e" stroke-width="2" stroke-linecap="round"/>
        <path d="M133 105q9 8 22 9m8 2q13 2 27 1m13-2 9-3" fill="none" stroke="#754b37" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M122 84q-5-8-17-8q-8 1-6 7q4 7 22 9m109-8q5-8 17-8q8 1 6 7q-4 7-22 9"
              fill="none" stroke="#68473a" stroke-width="6" stroke-linecap="round"/>
        <path d="M120 84q-11-10-20-5m131 5q11-10 20-5" fill="none" stroke="#e7b77e" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="176" cy="83" rx="59" ry="25" fill="#774331" stroke="#edc28d" stroke-width="4.8"/>
        <path d="M123 91q15 16 53 16q34 0 52-14" fill="none" stroke="#ffdfab" stroke-width="1.7" stroke-linecap="round"/>
        <ellipse cx="176" cy="83" rx="53" ry="20.5" fill="#b64533"/>
        <path d="M171 63Q160 68 171 76Q185 83 183 91Q180 99 168 103C142 102 123 93 123 83C123 72 144 64 171 63Z" fill="#efd39d"/>
        <path d="M171 63Q160 68 171 76Q185 83 183 91Q180 99 168 103" fill="none" stroke="#fff0c7" stroke-width="2.5"/>
        <path d="M132 83q13-9 23-8m38-6q16 2 24 9m-15 16q10-1 16-5" fill="none" stroke="#fbd3a0" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M191 76q10 1 12-5q2 7-7 9q-5 1-5-4Zm7 12q9 2 18-4q-2 6-13 8q-6 0-5-4Zm-14 9q7-5 12-3q-5 5-10 6Z" fill="#e97548"/>
        <path d="M201 72l4-2m9 15 4-1m-24 11 4-1" stroke="#8d9457" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M132 84l9-3 6 2-1 6-10 2-4-3Zm19 5l10-2 6 3-3 5-11 1Z" fill="#f5dfab" stroke="#b99968" stroke-width="1"/>
        <path d="M140 73q6-7 13 0l-5 2-1 5h-3l1-5Zm23 5q7-4 11 1l-3 2v5h-3l-1-4Z" fill="#916248"/>
        <path d="M152 97q-5-6 0-9q2 5 7 6q-2 4-7 3m-21-8q-5-2-3-6q5 1 7 4Z" fill="#82945b"/>
        ${repeat(12,i=>`<ellipse cx="${130+(i*29)%95}" cy="${75+(i*7)%22}" rx="${1.2+i%3*.5}" ry=".9" fill="#ffe0a4" opacity=".62"/>`)}
        <path d="M152 70q-17-8-7-19q7-9-3-16m34 30q11-10 1-20q-9-10 0-23m19 42q16-8 9-17q-6-8 1-14"
              fill="none" stroke="#f9e8c9" stroke-width="3.5" opacity=".8" stroke-linecap="round"/>
        <path d="M157 60q-8-5-4-11m38 3q-4-5-1-10" fill="none" stroke="#fff1d8" stroke-width="1.4" opacity=".76" stroke-linecap="round"/>
    `);

    function feastGuest(right){
        const x = right ? 58 : 34, top = 9;
        return `
            <path d="M${x-14} 111l-4 42m35-42 4 42m-35-10h33" stroke="#69483c" stroke-width="5.5" stroke-linecap="round"/>
            <path d="M${x-19} 105q19-5 39 0l3 9q-21 5-44 0Z" fill="#946648"/>
            <path d="M${x-15} 106q15-3 30 0" fill="none" stroke="#c89167" stroke-width="1.5"/>
            ${person(x,top,right ? {shirt:'#927448',pants:'#514b47',style:'recede',hair:'#7e7569',
                face:'long',eyes:'soft',brows:'lifted',nose:'long',mouth:'quiet',mature:true,dir:-1,seated:true,
                arms:[[-17,44,-31,49,-26,64],[17,44,9,84,21,67]]}
                : {shirt:'#66617b',pants:'#3d4a52',skin:'#d6a27a',style:'waves',seated:true,
                face:'round',eyes:'laugh',mouth:'open',nose:'broad',look:.4,
                arms:[[-17,44,-7,84,-22,70],[17,44,32,46,29,63]]})}
            ${cup(x+(right?-34:36),top+(right?48:44),right?-12:10)}
            ${PB.ART.grip(x+(right?-31:32),top+(right?53:49),right?-12:10,right?'#e7ba92':'#d6a27a',.56)}
        `;
    }
    sym('s5-feast-guest-left', 101, 159, feastGuest(false));
    sym('s5-feast-guest-right', 101, 159, feastGuest(true));

    sym('s5-lantern', 39, 55, `
        <path d="M6 13Q8 4 19.5 4T33 13L36 42 19.5 49 3 42Z" fill="#d4764d"/>
        <path d="M12 13h15l3 27-10 4-11-4Z" fill="#ffd48a"/>
        <path d="M5 43q14 9 30 0" stroke="#683a32" stroke-width="4" fill="none"/>
    `);
});
