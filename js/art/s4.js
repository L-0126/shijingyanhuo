// One continuous lane, cut into architectural planes and moving paper parts.
PB.ART.register('s4', () => {
    const {sym, rect, txt, person, portrait, grip} = PB.ART;
    const paper = '#e8dcc8', brick = '#a1614a', stone = '#8c8378';
    const blue = '#50697c', dusk = '#7a667f', iron = '#323536';
    const repeat = (count, draw) => Array.from({length: count}, (_, i) => draw(i)).join('');
    const part = (name, x, y, body) =>
        `<g data-part="${name}" style="transform-origin:${x}px ${y}px">${body}</g>`;
    const stroke = (d, color = iron, width = 2) =>
        `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

    function masonry(x, y, w, h, color = brick){
        const joints = repeat(Math.floor(h/15), i => `M${x} ${y+i*15}h${w}` +
            repeat(Math.floor(w/35), j => `M${x+j*35+(i%2)*17} ${y+i*15}v15`));
        return rect(x, y, w, h, color) +
            `<path d="${joints}" fill="none" stroke="#dfb598" stroke-width="1" opacity=".38"/>`;
    }

    function windowFrame(x, y, w, h, lit = false){
        return rect(x-6,y-8,w+12,h+17,'#c8b698') + rect(x-2,y-3,w+4,h+6,'#4d4945') +
            rect(x,y,w,h,lit?'#cba277':'#607776') +
            rect(x+3,y+3,w*.42,h*.43,lit?'#e9c690':'#82968b') +
            stroke(`M${x+w/2} ${y}v${h}M${x} ${y+h/2}h${w}`, '#dbc9a4', 3) +
            stroke(`M${x-9} ${y+h+12}h${w+18}`, '#e5d0b0', 5) +
            stroke(`M${x+6} ${y+h-4}v-18m11 18v-18m11 18v-18m11 18v-18`, '#453e39', 2);
    }

    function roof(x, y, w, h){
        return `<path d="M${x-10} ${y+h}l28-${h}h${w-36}l24 ${h}Z" fill="#4d4b4a"/>` +
            stroke(repeat(Math.floor(w/13), i => `M${x+19+i*12} ${y+3}l-7 ${h-3}`), '#8c857a', 1.3) +
            stroke(`M${x-10} ${y+h}h${w+16}M${x+19} ${y}h${w-39}`, '#c9b99b', 5);
    }

    function floorBricks(){
        const unit = 36;
        let seams = '', highlights = '';
        for(let row = -1; row < 4; row++){
            for(let column = -1; column < 4; column++){
                const diagonal = ((column-row)%4+4)%4;
                if(diagonal !== 0 && diagonal !== 3) continue;
                const x = column*unit, y = row*unit;
                const width = diagonal === 0 ? unit*2 : unit;
                const height = diagonal === 0 ? unit : unit*2;
                seams += `M${x} ${y}h${width}v${height}h${-width}Z`;
                highlights += `M${x+3} ${y+height-3}V${y+3}h${width-6}`;
            }
        }
        return `<path d="${seams}" fill="none" stroke="#796d63" stroke-width="1.5" opacity=".42"/>` +
            `<path d="${highlights}" fill="none" stroke="#f1dac1" stroke-width="1" opacity=".5"/>`;
    }

    const gateOutline = 'M16 378V123H0V103H46V78H92Q98 42 145 35L195 4L245 35Q292 42 298 78H344V103H390V123H374V378Z M91 378V197Q91 139 195 137Q299 139 299 197V378Z';
    sym('s4-print', 1600, 1000, `
        <defs>
            <linearGradient id="s4-paving" x2=".8" y2="1"><stop stop-color="#9f8c7f"/><stop offset="1" stop-color="${paper}"/></linearGradient>
            <linearGradient id="s4-evening" x2="0" y2="1"><stop stop-color="${dusk}"/><stop offset=".62" stop-color="#c58e83"/><stop offset="1" stop-color="#ecc295"/></linearGradient>
            <pattern id="s4-brick-floor" width="144" height="144" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                ${floorBricks()}
            </pattern>
            <clipPath id="s4-gate-cut"><path d="${gateOutline}" clip-rule="evenodd"/></clipPath>
            <pattern id="s4-check-cloth" width="15" height="15" patternUnits="userSpaceOnUse"><rect width="15" height="15" fill="#a66757"/><path d="M0 4h15M4 0v15" stroke="#dfbaa0" stroke-width="4"/><path d="M0 11h15M11 0v15" stroke="#594a4b" stroke-width="1"/></pattern>
        </defs>
        ${rect(0,0,1600,1000,'url(#s4-paving)')}
        ${rect(0,0,1600,1000,'url(#s4-brick-floor)')}
        <path d="M655 0H824L1125 1000H787Z" fill="#f8d7a1" opacity=".20"/>
        <path d="M0 478Q420 449 710 475T1600 511" fill="none" stroke="#6a6862" stroke-width="25"/>
        <path d="M0 468Q420 439 710 465T1600 501" fill="none" stroke="#d6c7b2" stroke-width="6"/>
        ${repeat(31,i=>stroke(`M${i*53} ${482+Math.sin(i*.3)*19}l21 1`, '#b2a78f', 3))}
        ${repeat(12,i=>`<path d="M${40+i*131} ${710+i%3*95}l17 2-4 5-10-1Z" fill="#9a8170" opacity=".35"/>`)}
        ${txt(1296,875,44,'#554b47','岁月匠心','letter-spacing="9"')}
        ${txt(1291,930,17,'#74675e','一针一线 · 一巷炊烟','letter-spacing="4"')}
        <rect x="1490" y="835" width="45" height="83" rx="2" fill="none" stroke="${brick}" stroke-width="3"/>
        ${txt(1513,867,25,brick,'肆')}${txt(1513,901,25,brick,'艺')}
    `);

    sym('s4-sky', 1500, 470, `
        <path d="M0 74L120 47 260 32 418 12 620 27 790 3 1055 22 1250 40 1500 88V470H0Z" fill="url(#s4-evening)"/>
        <circle cx="1184" cy="136" r="56" fill="#f0cca0"/>
        ${stroke('M66 139q125-23 242-9m725-61q129 14 250 0M346 191q98-16 174-5', '#efc2a1', 3)}
        ${repeat(15,i=>{
            const x=i*106, h=115+(i*37)%106;
            return `<path d="M${x} 470V${470-h}h15v-12h62v12h25v${h}Z" fill="${i%2?'#827079':'#8e767b'}"/>` +
                repeat(3,j=>rect(x+17+j*23,485-h,10,25,'#ab8c87'));
        })}
    `);

    function townHouse(x, w, h, color, doors = true){
        const y = 440-h;
        return masonry(x+8,y+38,w-16,h-38,color) + roof(x,y,w,42) +
            rect(x+3,y+138,w-6,10,'#c6ad91') + rect(x+3,y+259,w-6,8,'#c6ad91') +
            repeat(2,row=>repeat(2,col=>windowFrame(x+26+col*(w-58)/2,y+58+row*123,48,64,row===0&&col===1))) +
            (doors ? `<path d="M${x+31} 440V${y+299}q0-33 36-33t36 33V440Z" fill="#514a45" stroke="#baa890" stroke-width="8"/>` +
                stroke(`M${x+67} ${y+282}V440`, '#b19b7e', 2) +
                rect(x+120,y+294,w-145,146-(y+294-294),'#5d615d') : '') +
            rect(x+6,430,w-12,10,'#796c60');
    }
    sym('s4-west-houses', 560, 440,
        townHouse(0,193,397,'#9d6956') + townHouse(188,185,440,'#a77359') + townHouse(369,191,380,'#96776a') +
        `<path d="M220 44V9l49-9 52 9v35Z" fill="#bba38a"/>` + windowFrame(254,15,31,29) +
        stroke('M33 302h123M390 324h126', '#c5ac8c', 4));
    sym('s4-east-houses', 528, 440,
        townHouse(0,191,385,'#ac8066') + townHouse(187,179,420,'#aa6f57') + townHouse(361,167,366,'#98776a') +
        `<path d="M224 38V14l44-14 47 14v24Z" fill="#c5af90"/>` + windowFrame(252,12,30,30) +
        `${rect(390,370,103,36,'#dcc2a0')}${txt(441,395,22,'#705149','修 伞 配 匙')}`);
    sym('s4-house-side', 110, 397, masonry(0,0,110,397,'#775b50') +
        repeat(3,i=>windowFrame(26,47+i*117,49,65)) + rect(0,387,110,10,'#6b625a'));
    sym('s4-inner-lane', 233, 231, `
        ${rect(0,0,233,231,'#ab9279')}${masonry(73,65,91,166,'#8b7466')}
        <path d="M0 0l73 65v166H0Z" fill="#77685f"/><path d="M233 0l-69 65v166h69Z" fill="#bc9a7c"/>
        ${windowFrame(97,92,33,48)}${rect(104,176,27,55,'#5b5d51')}
        ${stroke('M10 56l54 39M11 122l52 18M222 59l-48 39M223 124l-49 18', '#d1af8c', 3)}
        <path d="M0 231l83-34h71l79 34Z" fill="#c7ae8b"/>`);

    sym('s4-gate', 390, 378, `
        <path d="${gateOutline}" fill="${brick}" fill-rule="evenodd"/>
        <g clip-path="url(#s4-gate-cut)">${masonry(0,0,390,378,'#aa7259')}</g>
        <path d="M77 378V197Q77 124 195 123Q313 124 313 197V378" fill="none" stroke="#d7c6ab" stroke-width="27"/>
        <path d="M91 378V197Q91 139 195 137Q299 139 299 197V378" fill="none" stroke="#645b51" stroke-width="4"/>
        <path d="M29 376V129M361 376V129" stroke="#d4bfa1" stroke-width="23"/>
        ${rect(7,348,45,30,'#b3a58e')}${rect(338,348,45,30,'#b3a58e')}
        ${rect(0,103,390,15,'#e0c8a4')}${rect(44,79,302,11,'#c7b394')}
        <path d="M87 76Q106 42 148 43L195 13l47 30q43-1 61 33" fill="none" stroke="#e1c9a5" stroke-width="8"/>
        <path d="M117 70q9-19 25-8t-5 15m136-7q-9-19-25-8t5 15" fill="none" stroke="#e4c7a1" stroke-width="3"/>
        ${rect(142,56,106,32,'#cab291')}${txt(195,81,25,'#4c4841','敦仁里','letter-spacing="6"')}
        ${repeat(9,i=>stroke(`M${95+i*25} ${170-Math.sin(i*Math.PI/8)*35}l-3-15`, '#9b8c74', 2))}
        ${txt(48,211,18,'#5a5147','八')}${txt(48,234,16,'#5a5147','号')}
    `);
    sym('s4-gate-reveal', 88, 241, rect(0,0,88,241,'#8b7865') +
        repeat(15,i=>stroke(`M0 ${i*16}h88`, '#b6a48a', 1.5)));
    sym('s4-gate-cap', 390, 88, rect(0,0,390,88,'#a38b73') +
        stroke('M8 6h374v73H8Z', '#d4bea0', 3));

    sym('s4-laundry', 565, 164, `
        ${stroke('M0 12L565 3M0 17L565 8', '#9d8758', 5)}
        ${repeat(11,i=>stroke(`M${18+i*50} 8v12`, '#665b3e', 2))}
        ${part('shirt',112,16,`<path d="M88 27l19-11 21 1 17 10 19 31-19 12-9-19v63H94V51L82 70 65 58Z" fill="url(#s4-check-cloth)" stroke="#6f574c" stroke-width="2"/>${stroke('M117 19v88', '#e6caae', 2)}`)}
        ${part('sheet',282,13,`<path d="M205 15l152-3-3 132-23 6-24-5-29 8-27-7-24 6-18-7Z" fill="#e4d6bd" stroke="#b4a58d" stroke-width="2"/>${stroke('M232 22l4 115M277 20l-6 123M325 19l8 117', '#c7b79d', 2)}`)}
        ${part('apron',443,10,`<path d="M430 13v28l-23 17-8 82q43 12 85-2l-14-82-20-16V13Z" fill="${blue}" stroke="#394e5d" stroke-width="2"/>${rect(426,87,30,24,'#6e8794')}${stroke('M413 64q25 13 54-1', '#9cacaa', 2)}`)}
        ${repeat(6,i=>rect(87+i*65,7,5,14,'#70594a'))}
    `);
    sym('s4-laundry-post', 27, 173,
        stroke('M8 173L17 0', '#8b7953', 6) +
        repeat(7,i=>stroke(`M${12+i*.65} ${i*24}h7`, '#d0b687', 2)));
    sym('s4-wire', 1450, 170, `${stroke('M16 170V0m-16 32h35m-35 13h35M1415 170V17m-21 27h44m-44 12h44', '#645654', 6)}
        ${stroke('M16 31Q710 130 1416 44M16 43Q704 148 1416 55', '#514d50', 1.8)}`);
    sym('s4-birds', 390, 70, repeat(5,i=>part('bird-'+i,35+i*75,40,
        `<ellipse cx="${35+i*75}" cy="40" rx="11" ry="7" fill="#5a4d48"/><circle cx="${43+i*75}" cy="34" r="5" fill="#443d3b"/>
        <path d="M${47+i*75} 33l7 3-7 2M${25+i*75} 41l-12 5 9-10" fill="#66574c"/>
        ${stroke(`M${32+i*75} 44v9m6-9v9`, '#4d4543', 1.5)}`)));

    sym('s4-shop', 330, 252, `${masonry(0,0,330,252,'#997a63')}
        ${rect(15,60,300,178,'#514d43')}${rect(20,66,290,165,'#807861')}
        ${repeat(5,i=>rect(36+i*60,64,5,166,'#c8ad88'))}
        ${stroke('M21 135h290M20 191h292', '#cbb38a', 5)}
        ${repeat(10,i=>`${rect(34+i%5*59,84+Math.floor(i/5)*66,27,37,'#b6bba1','rx="6" opacity=".7"')}
            ${rect(32+i%5*59,82+Math.floor(i/5)*66,31,6,'#d4c49f')}
            ${repeat(5,j=>`<circle cx="${40+i%5*59+j%3*7}" cy="${105+Math.floor(i/5)*66+Math.floor(j/3)*9}" r="4" fill="${['#b35c43','#d5ac60','#ddd3b3'][j%3]}"/>`)}`)}
        ${rect(7,13,316,42,'#3f544e')}${txt(165,43,30,'#ebd5a6','王 记 烟 纸 店')}
        ${rect(2,236,326,16,'#b3916c')}${rect(294,76,31,149,'#c7b593')}
        ${repeat(5,i=>txt(310,98+i*25,17,'#685d49',['糖','果','冷','饮','烟'][i]))}
    `);
    sym('s4-shop-side', 105, 252, masonry(0,0,105,252,'#756759') +
        rect(14,75,75,139,'#bba98b') + txt(52,109,19,'#5b5847','修补衣裳') +
        txt(52,145,19,'#5b5847','缝缝补补') + txt(52,186,16,'#6b6253','一针一线'));
    sym('s4-awning', 366, 98, `${rect(0,0,366,98,'#c1b497')}
        ${repeat(12,i=>rect(i*31,0,13,98,'#768477'))}${stroke('M0 97h366', '#645e4b', 4)}`);
    sym('s4-awning-edge', 366, 28, repeat(12,i=>`<path d="M${i*30.5} 0h30.5v21q-15 13-30.5 0Z" fill="${i%2?'#77877a':'#d0c0a0'}"/>`));
    sym('s4-shop-sign', 226, 40, rect(0,0,226,40,'#3f544e') +
        rect(4,4,218,32,'none','stroke="#b7aa85" stroke-width="1.5"') +
        txt(113,30,25,'#e8d4a5','王 记 烟 纸 店'));
    sym('s4-icebox', 116, 67, `${rect(0,0,116,67,'#bdaf8d')}${rect(5,5,106,9,'#e4d3ad')}
        ${rect(10,21,96,32,'#e0d2ad')}${txt(58,45,23,'#a14a38','光明冰砖')}${stroke('M8 62h101', '#6e6854', 3)}`);
    sym('s4-blackboard', 88, 104, `<path d="M4 104L14 4h60l10 100" fill="none" stroke="#80684b" stroke-width="6"/>
        ${rect(9,8,70,79,'#394c48')}${txt(44,31,17,'#ded5b7','王记传呼')}${txt(44,54,15,'#ded5b7','接电话')}${txt(44,76,17,'#ded5b7','一角')}`);
    sym('s4-flask', 43, 85, `<path d="M12 14h20l5 12v49q-17 10-33 0V27Z" fill="#b4a06e" stroke="#70654c" stroke-width="2"/>
        ${repeat(6,i=>stroke(`M6 ${29+i*8}h29`, '#e2c993', 2))}${stroke('M13 25v50m9-50v52m8-52v48', '#7e714e', 1.5)}
        ${rect(14,4,15,13,'#70624c')}${stroke('M34 28q19 3 4 31', '#7d6c47', 5)}`);

    sym('s4-table-front', 232, 88, `${rect(0,0,232,15,'#a28058')}${rect(3,15,226,21,'#7d6149')}
        ${rect(14,36,9,52,iron)}${rect(208,36,9,52,iron)}
        ${stroke('M18 80h195M24 41l35 35m149-35-35 35', iron, 4)}
        ${part('pedal',115,69,`<path d="M73 65h88l-6 13H79Z" fill="#74716a" stroke="${iron}" stroke-width="3"/>${repeat(6,i=>stroke(`M${84+i*12} 66v11`, iron, 2))}`)}
        ${txt(116,32,14,'#cfb990','蝴 蝶 牌')}`);
    sym('s4-table-side', 79, 88, rect(0,0,79,15,'#b08e62') + rect(0,15,79,19,'#66503e') +
        stroke('M8 34v54M70 34v54M8 73h62', iron, 6));
    sym('s4-table-top', 232, 79, rect(0,0,232,79,'#be9a6a') +
        stroke('M3 3h226v73H3Z', '#dcc391', 2) +
        `<path d="M18 7l71 4 12 66-72-4Z" fill="#91a4a0"/>${stroke('M36 9l11 63', '#d5ddc4', 2)}`);
    sym('s4-sewing', 167, 94, `
        <path d="M14 76h140v12H8Z" fill="${iron}" stroke="#b1a67d" stroke-width="2"/>
        <path d="M37 76V44h-8V22q30-11 57-2l31 13V78H92V43L57 34v42Z" fill="${iron}" stroke="#77766b" stroke-width="2"/>
        ${stroke('M38 28q30-8 51 4m-2 4 14 5v29M20 82h119', '#c5ab62', 2)}
        ${txt(69,31,10,'#d7bd7d','蝴蝶')}${rect(81,4,18,13,'#c8b48c')}${stroke('M90 2v18L43 37', '#e2d5b7', 1.4)}
        ${part('wheel',137,42,`<circle cx="137" cy="42" r="29" fill="#43484a" stroke="#b4afa0" stroke-width="4"/>
            ${repeat(6,i=>`<path d="M137 42l${Math.cos(i*Math.PI/3)*23} ${Math.sin(i*Math.PI/3)*23}" stroke="#b6af97" stroke-width="3"/>`)}<circle cx="137" cy="42" r="6" fill="#b99e66"/>`)}
        ${part('needle',41,55,`${rect(39,40,4,37,'#dedbc4')}${stroke('M38 77h14', '#a19c87', 3)}`)}
    `);
    sym('s4-tailor', 107, 154, `
        ${stroke('M27 111l-4 41m39-41 5 41m-42-13h40', '#73563e', 5)}
        <path d="M20 106q26-7 52 1l-3 8H22Z" fill="#a5805b"/>
        ${person(47,5,{shirt:'#557c78',pants:'#4b5554',hair:'#a6a498',style:'bun',mature:true,
            face:'heart',eyes:'narrow',nose:'small',mouth:'warm',look:0,seated:true,apron:true,arms:[]})}
        <path d="M44 44q-10 13-9 37m19-37q10 12 10 31" fill="none" stroke="#d2a859" stroke-width="2.6"/>
        ${stroke('M35 63l3 1m-4 6 3 1m23-9 3-1m-2 8 4-1','#735740',1.15)}
        <path d="M60 52q8-5 12 4l8 21 12 2-1 9-16-2q-4-1-7-7L59 62Z" fill="#648884"/>
        ${grip(91,84,-52,'#dfb48f',.65)}
        ${part('arm',31,53,`
            <path d="M28 51q6-5 11 1l-2 20q0 4 5 5l24 2-1 11-29-4q-10-1-10-10Z" fill="#557c78"/>
            ${stroke('M31 57l-1 17q1 5 8 6l23 4','#9cb0a0',1.5)}
            <path d="M64 80q7-3 11 0l6 3q2 3-1 4l-9 1-7-2Z" fill="#dfb48f"/>
        `)}
        <path d="M36 22q5-2 11 0v5q-5 4-10 0Zm13 0q5-2 11 0v5q-5 4-10 0ZM47 23h3" stroke="#53483e" stroke-width="1.2" fill="none"/>
    `);
    sym('s4-repairer', 109, 159, `
        ${stroke('M24 110l-5 46m46-44 7 44m-50-13h47','#70573f',5)}
        <path d="M18 105q26-6 54 1l-3 10H20Z" fill="#9d7d58"/>
        ${person(47,3,{shirt:'#977d5d',pants:'#5b5650',hair:'#8b8b82',style:'recede',mature:true,
            face:'long',brows:'angled',eyes:'narrow',nose:'long',mouth:'focus',
            seated:true,arms:[[-16,43,8,75,-20,66],[16,43,35,70,30,61]]})}
        <path d="M31 15q0-15 16-15q15 0 18 11l-7 4q-10-5-27 0Z" fill="#626357"/>
        <path d="M38 12q12-3 23 1l6 3q-8 3-14-1Z" fill="#9d9276"/>
        <circle cx="54" cy="21.5" r="4.6" fill="#d7ccb2" fill-opacity=".52" stroke="#50473b" stroke-width="1.6"/>
        ${stroke('M57 78l10 9m15-13 13-9','#58564e',1.7)}
        ${grip(55,79,34,'#e0b48e',.63)}${grip(82,73,56,'#e0b48e',.6)}
    `);
    sym('s4-repair-table', 143, 87, `${rect(0,0,143,16,'#9c7751')}${rect(7,16,129,27,'#77644f')}
        ${stroke('M16 43v44m112-44v44', '#655642', 7)}${rect(16,23,51,12,'#a78b60')}${rect(75,23,51,12,'#a78b60')}
        <circle cx="41" cy="29" r="2.5" fill="#3b3e38"/><circle cx="100" cy="29" r="2.5" fill="#3b3e38"/>`);
    sym('s4-repair-top', 143, 65, rect(0,0,143,65,'#b2966d') +
        `<path d="M8 9h76v47H8Z" fill="#58736b"/><circle cx="34" cy="31" r="14" fill="#d6c39b" stroke="#686454" stroke-width="3"/>
        ${stroke('M34 21v11l8 4M57 18l18 24m-14-25 16 22', '#e4d3af', 2)}${rect(95,8,40,48,'#6d5946')}${rect(100,14,30,12,'#b49970')}`);
    sym('s4-clock', 71, 117, `<path d="M6 117V30Q6 1 35 1q30 0 30 29v87Z" fill="#73503b" stroke="#b29467" stroke-width="3"/>
        <circle cx="35" cy="34" r="23" fill="#e3d4ab" stroke="#bfa57c" stroke-width="3"/>
        ${repeat(12,i=>`<circle cx="${35+Math.sin(i*Math.PI/6)*18}" cy="${34-Math.cos(i*Math.PI/6)*18}" r="1.4" fill="#675743"/>`)}
        ${stroke('M35 20v15l12 5', '#5b5040', 2)}${rect(19,65,33,42,'#423d35','rx="12"')}
        ${part('pendulum',35,65,`${stroke('M35 65v28','#cbb17a',3)}<circle cx="35" cy="96" r="10" fill="#c6a66e"/>`)}
        ${rect(0,112,71,5,'#ab8e61')}`);
    sym('s4-phone', 90, 60, `<path d="M14 18h60l12 34q-39 13-82 0Z" fill="#a44136" stroke="#632f2b" stroke-width="2"/>
        <ellipse cx="45" cy="37" rx="24" ry="16" fill="#d0aa80" stroke="#683b30" stroke-width="3"/>
        ${repeat(10,i=>`<circle cx="${45+Math.sin(i*Math.PI/5)*18}" cy="${37+Math.cos(i*Math.PI/5)*11}" r="2.6" fill="#6b4a36"/>`)}
        <ellipse cx="45" cy="37" rx="9" ry="6" fill="#e3c29a"/>
        ${part('receiver',45,12,`<path d="M9 17Q5 4 21 2h48q16 2 12 15L66 20l-3-8H28l-4 8Z" fill="#982f2b" stroke="#63312c" stroke-width="3"/>`)}
        ${stroke('M77 17q18 6 8 12t0 10-2 11', '#543c32', 2)}`);

    sym('s4-furnace', 185, 81, `<path d="M30 13h113l21 64H9Z" fill="#9b5a40" stroke="#624637" stroke-width="3"/>
        <ellipse cx="87" cy="14" rx="58" ry="13" fill="#4b453a" stroke="#bc8762" stroke-width="6"/>
        <path d="M61 74V44q24-15 49 0v30Z" fill="#4b3d34"/>
        <path d="M72 69q-13-15 3-22-2 11 6 10 2-11 10-21 15 18 6 33Z" fill="#d58c47"/>
        ${stroke('M20 78h139', '#c18c63', 4)}${stroke('M153 31l31 35', '#61564a', 5)}`);
    sym('s4-boiler', 256, 153, `
        ${stroke('M34 137l17-42m112 42-16-42M28 140h146', '#454944', 7)}
        ${part('drum',109,81,`<path d="M43 44Q98 20 165 44q31 34 0 73-65 24-122-2Q12 83 43 44Z" fill="#363c3b" stroke="#706e60" stroke-width="4"/>
            <ellipse cx="158" cy="81" rx="20" ry="39" fill="#4e5350" stroke="#a69b78" stroke-width="4"/>
            ${stroke('M55 48q45-13 77-4M50 109q40 13 82 1', '#74776a', 3)}
            ${stroke('M72 35v88M121 36v86', '#242c2b', 5)}
            <ellipse cx="49" cy="80" rx="12" ry="32" fill="#51564e"/>`)}
        ${part('handle',33,83,`${stroke('M35 83H5V59', '#c1aa7c', 6)}${stroke('M5 52v18', '#6c5540', 9)}`)}
        ${part('latch',166,82,`${stroke('M167 82l31-21 10-28', '#b2aa8e', 7)}${stroke('M204 33l9-19', '#544a3d', 10)}`)}
        <path d="M191 87h53l6 56h-69Z" fill="#b4a07b" stroke="#796a50" stroke-width="3"/>
        ${stroke('M187 98l57 29m-57-14 57 28', '#d9c397', 2)}
        <circle cx="122" cy="22" r="23" fill="#d5c79f" stroke="#625e4f" stroke-width="5"/>
        <path d="M133 5a20 20 0 0 1 8 22" fill="none" stroke="#b15844" stroke-width="5"/>
        ${repeat(7,i=>stroke(`M${122+Math.sin((i-3)*.65)*17} ${22-Math.cos((i-3)*.65)*17}l${-Math.sin((i-3)*.65)*4} ${Math.cos((i-3)*.65)*4}`, '#6c624d', 1.5))}
        ${part('gauge',122,22,`${stroke('M122 22l-14 8', '#9e4635', 2.5)}<circle cx="122" cy="22" r="3" fill="#6c5d47"/>`)}
    `);
    sym('s4-popcorn-man', 118, 184, `
        ${person(53,9,{shirt:blue,pants:'#5b594d',skin:'#d9ad8b',style:'crop',hair:'#72685d',
            face:'square',nose:'broad',eyes:'soft',brows:'straight',detail:'moustache',mouth:'warm',
            mature:true,arms:[],legs:68})}
        <path d="M34 20q-2-13 11-16q19-5 25 10l-2 7q-17-5-34-1Z" fill="#405564"/>
        ${stroke('M33 19q21-7 40 2','#788b91',3.7)}
        <path d="M40 49l7 9 12-11 4 5-16 17-11-14Z" fill="#bcc0a9"/>
        ${part('arm',36,58,`
            <path d="M30 56q6-6 13-1l-4 21q-1 4 4 7l16 9-6 10-21-12q-7-4-6-12Z" fill="${blue}"/>
            ${stroke('M34 59l-4 19q1 6 7 8l15 9','#8da2a6',1.6)}
            ${grip(56,96,27,'#d9ad8b',.76)}
        `)}
        <path d="M68 53q8-3 14 6l9 22 12-4 4 9-17 8q-6 2-9-5L68 68Z" fill="#5e7a87"/>
        ${stroke('M105 72l-3 76','#594c3b',5)}${stroke('M104 76l-2 62','#a6895f',1.4)}
        ${grip(103,82,9,'#d9ad8b',.74)}
    `);

    for(let i = 0; i < 3; i++){
        const shirt = ['#ac5b44','#7a8977','#a38c5d'][i];
        sym('s4-child-'+i, 91, 128, `${rect(58,35,24,47,'#71644d','rx="5"')}
            <g transform="translate(9 0) scale(.76)">${person(46,3,{shirt,pants:'#53616a',arms:[],legs:52,
                style:['crop','tied','waves'][i],dir:i===1?-1:1,face:['young','heart','round'][i],
                eyes:['bright','narrow','laugh'][i],mouth:['warm','quiet','open'][i],nose:'button',
                detail:i===0?'freckles':undefined,look:i===1?.8:.2})}</g>
            ${stroke('M34 35l8 34', '#d1b88d', 4)}
            ${part('left-arm',30,36,`<path d="M30 36l-6 23 14 10" fill="none" stroke="${shirt}" stroke-width="9" stroke-linecap="round"/><circle cx="38" cy="69" r="4.5" fill="#e9c29b"/>`)}
            ${part('right-arm',59,36,`<path d="M59 36l8 22-13 13" fill="none" stroke="${shirt}" stroke-width="9" stroke-linecap="round"/><circle cx="54" cy="71" r="4.5" fill="#e9c29b"/>`)}
            ${rect(32,74,26,22,'#d9d5bb','rx="4"')}${stroke('M58 78q15-3 7 13h-7', '#babba6', 3)}
            ${stroke('M35 79h18', '#6d877c', 3)}`);
    }
    const cloud = '<path d="M26 112Q0 91 18 70-5 44 24 35 22 9 54 16 67-8 91 8 120-10 135 17 164-2 174 29 208 14 211 49 241 51 224 81 248 108 213 122 196 145 173 133 147 157 125 140 99 163 75 140 40 153 26 129Z"/>';
    sym('s4-popcorn-cloud', 244, 160, part('bloom',122,155,
        cloud.replace('/>', ' fill="#f2e6c9" stroke="#bdae8d" stroke-width="2"/>') +
        repeat(16,i=>`<path d="M${25+i%5*43} ${37+Math.floor(i/5)*33}q-9-12 3-16t14 9q12-2 10 7" fill="none" stroke="#d7c49e" stroke-width="2.5"/>`)));
    sym('s4-kernel', 17, 18, `<path d="M4 16q-7-4-2-9-2-8 6-6 7-4 8 3 6 5-1 8 1 6-6 5Z" fill="#f6e9c9" stroke="#b9a680" stroke-width="1.4"/>
        <path d="M8 9l3 5-5-2Z" fill="#c4a572"/>`);
    sym('s4-hopper', 90, 126, `
        ${part('left-leg',36,77,`<path d="M36 77l-3 21 5 20" fill="none" stroke="#d7b38d" stroke-width="10" stroke-linecap="round"/>
            ${rect(30,109,12,11,'#d8d7c4')}${rect(27,119,17,6,iron,'rx="3"')}`)}
        ${part('right-leg',54,77,`<path d="M54 77l5 21-5 20" fill="none" stroke="#d7b38d" stroke-width="10" stroke-linecap="round"/>
            ${rect(49,109,12,11,'#d8d7c4')}${rect(48,119,17,6,iron,'rx="3"')}`)}
        ${part('left-arm',29,43,`<path d="M29 43L19 61 9 54" fill="none" stroke="#d7c9a9" stroke-width="10" stroke-linecap="round"/><circle cx="8" cy="53" r="5" fill="#e9c29b"/>`)}
        ${part('right-arm',61,43,`<path d="M61 43l11 18 10-8" fill="none" stroke="#d7c9a9" stroke-width="10" stroke-linecap="round"/><circle cx="82" cy="52" r="5" fill="#e9c29b"/>`)}
        <path d="M29 38q16-8 32 0l4 43H25Z" fill="${blue}"/>
        <path d="M30 38l14 12 15-12" fill="#eee1c6"/>
        <path d="M35 40l10 6 10-6-7 14 2 13-8-9Z" fill="#a24f3f"/>
        ${stroke('M30 75h30', '#758693', 2)}
        <path d="M35 29q-9-2-12 10q8 2 14-4m19-4q9-3 12 7q-8 3-14-3" fill="#393a36"/>
        ${portrait(45,5,{style:'bob',face:'young',eyes:'bright',brows:'lifted',mouth:'open',nose:'button',look:.05})}
        ${stroke('M27 34l6 2m25 0 6-2','#a95742',2.6)}
    `);
    sym('s4-hopscotch', 232, 360, repeat(8,i=>{
        const cells = [[88,242],[88,184],[32,126],[144,126],[88,68],[32,10],[144,10],[88,-48]];
        const [x, y] = cells[i];
        return part('cell-'+i,x+28,y+82,`<path d="M${x} ${y+54}l55-1 2 56-56 2Z" fill="#777467" fill-opacity=".24" stroke="#f2e8d3" stroke-width="3"/>
            ${txt(x+28,y+99,32,'#f4ead5',String(i+1))}`);
    }));
});
