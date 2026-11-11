// A winter bathhouse and a bamboo courtyard share one printed stone lane.
PB.ART.register('s3', () => {
    const {sym, rect, txt, portrait, person, shoe, grip} = PB.ART;
    const PAPER = '#EEE1C7', BLUE = '#789CA4', BRICK = '#A5634D';
    const BAMBOO = '#687E58', WOOD = '#75553B', COPPER = '#BA8B49';
    const INK = '#474C45', SKIN = '#E7B88F';
    const repeat = (count, draw) => Array.from({length: count}, (_, i) => draw(i)).join('');
    const line = (d, color = WOOD, width = 2, extra = '') =>
        `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
    const part = (name, x, y, body) =>
        `<g data-part="${name}" style="transform-origin:${x}px ${y}px">${body}</g>`;

    function bricks(x, y, width, height, color = BRICK){
        return rect(x, y, width, height, color) + line(
            repeat(Math.floor(height/16), row => `M${x} ${y+row*16}h${width}` +
                repeat(Math.floor(width/34), col => `M${x+col*34+(row%2)*17} ${y+row*16}v16`)),
            '#D4AA8D', 1, 'opacity=".48"');
    }

    function tiles(width, height){
        return rect(0, 0, width, height, '#CAD5C6') + line(
            repeat(Math.floor(height/20)+1, i => `M0 ${i*20}h${width}`) +
            repeat(Math.floor(width/24)+1, i => `M${i*24} 0v${height}`), '#819B95', 1.3);
    }

    function roof(width, height, snowy = false){
        return `<path d="M1 ${height}L33 5Q${width/2} 25 ${width-33} 5l32 ${height-5}Z" fill="#525D58"/>` +
            line(repeat(Math.floor(width/14), i => `M${34+i*(width-68)/Math.floor(width/14)} 12l${(i-width/28)*.6} ${height-17}`), '#919987', 2) +
            line(`M2 ${height-4}Q${width/2} ${height+6} ${width-2} ${height-4}`, '#C9BC98', 6) +
            (snowy ? `<path d="M26 14l8-11q${width/2-34} 15 ${width-68} 0l9 13q-${width/2} 12-${width-51} -2Z" fill="#E4E8DC"/>` : '');
    }

    function bowl(x, y, scale = 1){
        return `<g transform="translate(${x} ${y}) scale(${scale})">
            <ellipse cx="0" cy="10" rx="22" ry="5" fill="#BFCBBE" stroke="#587A81"/>
            <path d="M-19-1Q-15 19 0 18T19-1Z" fill="#ECE7D1" stroke="#587A81" stroke-width="1.6"/>
            ${line('M-12 3q8 2 3 8m9-10v12m9-11q-8 3-3 8', '#668693', 2)}
            <ellipse cx="0" cy="-1" rx="19" ry="5" fill="#BE9251" stroke="#E4DEC4" stroke-width="3"/>
            <path d="M22 8q14-16 24-5Z" fill="#E6E5CE" stroke="#587A81"/><circle cx="35" cy="1" r="3" fill="#64828B"/>
        </g>`;
    }

    sym('s3-print', 1600, 1000, `
        <defs>
            <linearGradient id="s3-ground"><stop stop-color="#C2CFCA"/><stop offset=".43" stop-color="#D1D0B8"/><stop offset=".72" stop-color="#D8C9A7"/><stop offset="1" stop-color="#D5CAAB"/></linearGradient>
            <linearGradient id="s3-sky-wash"><stop stop-color="#AABFC4"/><stop offset=".48" stop-color="#D4D6C0"/><stop offset="1" stop-color="#DDE0B6"/></linearGradient>
            <linearGradient id="s3-water" x2="0" y2="1"><stop stop-color="#5D9292"/><stop offset="1" stop-color="#9ABCAF"/></linearGradient>
            <linearGradient id="s3-curtain-wash"><stop stop-color="#9CB7B3"/><stop offset=".48" stop-color="#E0E3CE"/><stop offset="1" stop-color="#8EA8A4"/></linearGradient>
            <pattern id="s3-floor-tiles" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M0 0h48v48H0Z" fill="none" stroke="#81978C" stroke-width="1.5"/><path d="M3 3h42v42" fill="none" stroke="#ECE7CE" opacity=".6"/><rect x="21" y="21" width="6" height="6" fill="#7F9A93" opacity=".4"/></pattern>
            <pattern id="s3-stone-floor" width="160" height="96" patternUnits="userSpaceOnUse"><path d="M0 0h160v48H0ZM-80 48H80v48H-80ZM80 48h160v48H80Z" fill="none" stroke="#9A9E85" stroke-width="2"/><path d="M4 4h150M84 52h70" stroke="#EEE2C6" stroke-width="2"/></pattern>
        </defs>
        ${rect(0,0,1600,1000,'url(#s3-ground)')}
        <path d="M0 0H640L755 370 704 665 610 1000H0Z" fill="url(#s3-floor-tiles)"/>
        <path d="M640 0H1600V1000H610L704 665 755 370Z" fill="url(#s3-stone-floor)"/>
        <path d="M0 285Q455 264 790 340T1600 364" fill="none" stroke="#ADB29A" stroke-width="22"/>
        ${line('M0 278Q455 257 790 333T1600 357', '#EEE2C8', 5)}
        <path d="M0 12l120 7 75 18 124-4 62 24-57 18-109-12-79 17L0 64ZM0 800l91-24 49 13-15 32-71 9-54 37Z" fill="#E5E9DC"/>
        ${repeat(9, i => `<path d="M${25+i*48} ${108+(i%3)*48}q15-9 32 0-17 13-32 0Z" fill="#E7E9DD" opacity="${.8-i*.06}"/>`)}
        <path d="M1320 120l-114 580m92-440-165 66m143 40 134 83m-156-7-151 95m129 17 159 82" fill="none" stroke="#748A5C" stroke-width="16" opacity=".11"/>
        ${repeat(18,i=>`<ellipse cx="${930+i%6*92}" cy="${420+Math.floor(i/6)*110+i%3*18}" rx="25" ry="5" transform="rotate(-33 ${930+i%6*92} ${420+Math.floor(i/6)*110+i%3*18})" fill="${BAMBOO}" opacity=".12"/>`)}
        ${repeat(17,i=>`<path d="M${1060+i%6*45} ${718+Math.floor(i/6)*26}l8 4-5 6Z" fill="#81785D" opacity=".58"/>`)}
        ${txt(1260,933,40,'#5B6453','浮生偷闲','letter-spacing="10"')}
        ${txt(1255,976,16,'#7A8067','一池热汤 · 一盏清茶','letter-spacing="4"')}
        <rect x="1490" y="903" width="43" height="83" fill="none" stroke="${BRICK}" stroke-width="3"/>
        ${txt(1512,935,24,BRICK,'叁')}${txt(1512,969,24,BRICK,'闲')}
    `);

    sym('s3-sky', 1500, 450, `
        <path d="M0 70l120-26 140 9 148-34 177 11L768 6l223 22 159-11 180 40 170 21V450H0Z" fill="url(#s3-sky-wash)"/>
        <circle cx="1230" cy="115" r="52" fill="#ECE7BE"/>
        ${line('M21 133q160-19 269 0m445-58q140-13 228 11', '#E5E8D5', 4)}
        ${repeat(5,i=>`<path d="M${i*118} 450V${267+i%2*24}l49-38 58 38v${183-i%2*24}Z" fill="${i%2?'#9FAFA6':'#93A6A1'}"/>`)}
        ${repeat(19,i=>{
            const x=777+i*39, y=20+i%5*28;
            return line(`M${x} 450Q${x-30} 200 ${x+14} ${y}`, i%2?'#879B72':'#9FAE82', 6) +
                repeat(4,j=>`<path d="M${x-3} ${y+60+j*64}q-48-51-68-45 11 34 68 45q52-60 72-53-13 35-72 53Z" fill="${i%2?'#8FA078':'#A8B38A'}"/>`);
        })}
    `);

    sym('s3-bath-back', 570, 410, `
        ${bricks(17,63,536,347)}${roof(570,68,true)}
        ${rect(10,143,550,12,'#D0B99A')}${rect(17,348,536,62,'#8A9D91')}
        ${repeat(4,i=>{
            const x=43+i*134;
            return rect(x-7,176,107,141,'#CFBDA1')+rect(x,183,93,121,'#5A7778')+
                rect(x+4,186,40,51,'#A5BCB1')+line(`M${x+47} 184v120M${x} 241h93`, '#E0D2B3',4)+
                line(`M${x-7} 318h107`, '#E4DBC3',6);
        })}
        ${rect(118,83,334,46,'#596E69','rx="3"')}${rect(124,88,322,36,'none','stroke="#C9B893"')}
        ${txt(285,117,30,'#EEE1C7','天 池 大 众 浴 池')}
        ${line('M27 348h516', '#D2D2BA',5)}
        ${repeat(6,i=>rect(25+i*88,359,76,39,'#91AAA1','stroke="#C1CDBB" stroke-width="2"'))}
    `);
    sym('s3-bath-side', 210, 312, bricks(0,0,210,312,'#906450')+
        rect(0,233,210,79,'#84998D')+line('M0 229h210','#D1C3A8',6)+
        rect(31,45,101,115,'#ABBAAB','stroke="#C4B69A" stroke-width="8"')+
        line('M81 46v112M31 102h101','#667E78',5));
    sym('s3-chimney', 75, 472, bricks(19,18,40,454,'#997363')+
        rect(10,12,58,20,'#BCADA0')+rect(12,9,54,6,'#E9E7D6')+
        repeat(5,i=>line(`M12 ${82+i*78}h51`, '#70695B',4)));

    sym('s3-corridor', 390, 304, `
        ${roof(390,63)}${rect(20,65,350,21,WOOD)}
        ${repeat(5,i=>rect(27+i*81,82,9,222,i<2?'#88785C':'#9A8D62'))}
        ${line('M32 86l39 43m-1-43-38 43M356 86l-39 43m1-43 38 43', '#B5A279',6)}
        ${rect(39,133,149,150,'#B6C3B3','fill-opacity=".35"')}
        ${repeat(9,i=>line(`M${44+i*17} 136v147`, '#9B9D80',2))}
        ${line('M40 181h148m-148 48h148', '#B7B393',4)}
        ${rect(209,141,123,142,'#9DA887','fill-opacity=".18"')}
        ${repeat(10,i=>line(`M${212+i*12} 145v135`, '#B1A77B',2))}
        ${rect(121,92,145,30,'#7C7255')}${txt(193,114,21,PAPER,'且 坐 吃 茶')}
        ${line('M22 299h346', '#C2B490',7)}
    `);
    sym('s3-tea-back', 560, 370, `
        ${bricks(22,110,516,260,'#A48668')}${rect(30,123,500,218,'#C4BC94')}
        ${roof(560,83)}${rect(10,86,540,19,WOOD)}
        ${repeat(6,i=>rect(28+i*99,108,9,262,WOOD))}
        ${repeat(4,i=>{
            const x=53+i*124;
            return rect(x,142,93,137,'#738366')+line(`M${x} 183h93m-93 44h93`, '#B9A474',4)+
                repeat(5,j=>line(`M${x+9+j*19} 144v133`, '#C0AE7B',3));
        })}
        ${repeat(6,i=>line(`M${33+i*99} 111l29 32`, '#AB9061',6))}
        ${rect(177,104,205,34,'#596A4B')}${txt(280,129,25,'#E8D7AA','竹 隐 茶 铺')}
        ${rect(20,352,520,18,'#8E8568')}
    `);
    sym('s3-tea-side', 155, 285, rect(0,0,155,285,'#AAAB82')+
        repeat(8,i=>line(`M${7+i*20} 8v271`, '#786E4C',3))+
        line('M0 28h155m-155 143h155M0 280h155', WOOD,9));
    sym('s3-canopy', 566, 155, `${rect(0,0,566,155,'#BEB080')}
        ${repeat(37,i=>line(`M${i*16} 0v155`, '#8C865C',3))}
        ${repeat(8,i=>line(`M0 ${i*22}h566`, '#D0BF8D',3))}
        ${line('M3 3h560v149H3Z', WOOD,6)}`);
    sym('s3-canopy-edge', 566, 34, `${rect(0,0,566,24,'#94805A')}
        ${repeat(35,i=>line(`M${7+i*16} 23v${5+i%3*3}`, '#B6A579',3))}
        ${line('M0 5h566', '#D2BC83',3)}`);
    sym('s3-post', 28, 284, rect(8,0,12,284,'#A78E57')+
        line('M11 0v284','#D1BA7B',2)+repeat(10,i=>line(`M7 ${i*30}h14`, '#706D45',3)));
    sym('s3-bamboo', 220, 340, repeat(6,i=>{
        const x=20+i*35;
        return line(`M${x} 340l${i%2?18:-12}-320`, '#718353',7)+
            repeat(8,j=>line(`M${x-5+(i%2?1:-1)*j*2} ${326-j*38}h11`, '#B4BB83',2))+
            repeat(3,j=>`<path d="M${x} ${59+j*81}q-52-44-64-29 18 23 64 29q46-55 60-43-10 31-60 43Z" fill="${i%2?'#698354':'#84955D'}"/>`);
    }));

    sym('s3-pool-water', 294, 185, `
        ${rect(0,0,294,185,'#C8D1BF','rx="6"')}${rect(12,12,270,161,'url(#s3-water)','rx="24"')}
        ${repeat(8,i=>line(`M${25+i%3*23} ${25+i*20}q43-9 72 0t86 0`, '#BDD3BE',2,'opacity=".65"'))}
    `);
    sym('s3-pool-front', 294, 66, `${tiles(294,66)}
        ${rect(0,0,294,12,'#E0DFC5')}${rect(0,56,294,10,'#91AAA0')}
        ${repeat(7,i=>rect(16+i*41,27,12,13,BLUE))}`);
    sym('s3-pool-side', 185, 66, tiles(185,66)+rect(0,0,185,12,'#E0DFC5'));
    sym('s3-bathers', 240, 135, repeat(2,i=>{
        const x=57+i*131;
        return `<path d="M${x-32} 125v-36q32-31 64 0v36Z" fill="${SKIN}"/>`+
            portrait(x,48,i===0
                ? {skin:SKIN,cap:'towel',face:'round',eyes:'closed',nose:'broad',mouth:'warm',look:.1}
                : {skin:SKIN,cap:'towel',face:'long',eyes:'narrow',brows:'straight',nose:'long',
                    mouth:'wry',detail:'moustache',mature:true,dir:-1})+
            line(`M${x-28} 104l-17 12m69-12 19 12`,SKIN,14)+
            `<path d="M${x-48} 126q48-12 96 0v9h-96Z" fill="#A7C4B4"/>`;
    }));
    sym('s3-lockers', 100, 184, rect(0,0,100,184,'#897659')+
        repeat(6,i=>{
            const x=5+i%2*48,y=5+Math.floor(i/2)*59;
            return rect(x,y,42,53,'#AF9872','stroke="#D1B995" stroke-width="2"')+
                rect(x+4,y+6,18,11,'#DCC9A3')+txt(x+13,y+15,9,'#715F4D',String(i+1))+
                line(`M${x+33} ${y+26}v8`, '#615B45',3);
        }));
    sym('s3-basin', 91, 54, `<path d="M3 17q42 17 85 0l-9 29q-36 14-68 0Z" fill="#A84F3C" stroke="#774B38" stroke-width="2"/>
        <ellipse cx="45" cy="17" rx="42" ry="14" fill="#805944" stroke="#CF8060" stroke-width="4"/>
        ${repeat(4,i=>`<path d="M${12+i*14} 23q-9-8-3-13 8-7 13 3t-10 10Z" fill="#776951"/>`)}
        <path d="M68 20V3h10v17" fill="#7C916B" stroke="#B9C798" stroke-width="2"/>
        ${rect(68,7,11,9,'#E1CAA0')}${txt(74,14,5,BRICK,'汽水')}
        ${line('M18 31l27-4m9-3 10-5', '#778953',5)}`);

    sym('s3-scrubber', 388, 253, `
        <path d="M101 139l29 4-6 37-7 25-5 26-14 8-14-9 2-24 4-24Z" fill="#465553"/>
        <path d="M127 142l33-1 4 35-4 26 3 28-13 9-14-5-3-30-4-24Z" fill="#535b55"/>
        <path d="M95 177q9 8 20 8l-8 35 4 10-11 3-10-4 3-20Z" fill="#59625a"/>
        <path d="M143 175q2 25 9 31l1 23-11 2-5-28-4-21Z" fill="#6a6f61"/>
        ${line('M91 215l4 11 11 2m37-7 3 8 11 1','#a7a28a',1.25)}
        <path d="M87 229q6 3 18 2l9 4 6 4q3 4-2 5H86q-6-2-4-7Z" fill="#3b3631"/>
        <path d="M140 230l14 2 12-4 7 6 10 3q5 2 1 6l-41 1q-5-1-5-6Z" fill="#3b3631"/>
        ${line('M85 242q15 3 33 0m24 0h41','#bca482',1.6)}

        <!-- Lean begins at the waist. Apron and shirt wrap the same torso. -->
        <path d="M171 33q5-8 16-5l6 12-6 14-20 1-9-9Z" fill="#b78264"/>
        <path d="M167 28q-15-2-29 8q-17 10-35 38q-7 13-2 22q12 14 33 14l22-7q13-7 20-22l8-21-1-14Z" fill="#4f746e"/>
        <path d="M103 78q17-12 40-12q16-2 26-16l5 12q-12 14-31 20q-19 6-41 9Z" fill="#3f615b"/>
        <path d="M107 74q18-24 29-31q12-9 27-10l-13 13q-20 13-31 29Z" fill="#698a80"/>
        ${line('M167 33l11 15 3 12m-74 27q12 8 28 5m2-12 12-5','#90a69a',1.55)}
        <path d="M99 89q26 9 60 6l-1 11q-5 35 5 73q-29 13-65 4q-8-27-4-65Z" fill="#b5946f"/>
        <path d="M111 99q7 26 7 48l3 38-22-2q-7-27-4-62l3-27Z" fill="#957958"/>
        <path d="M125 109q13 6 26 0l-2 17q-12 5-23-1Z" fill="#a3835f"/>
        <path d="M97 88q25 8 62 6l-1 6q-35 4-63-6Z" fill="#dfbd8e"/>
        <path d="M98 90q-9-6-14-1q-1 4 7 6l-9 16 6 3 11-19 3 17 5-2-6-18Z" fill="#ceb08b"/>
        ${line('M114 101q6 12 7 27m28 2q-3 9 1 16m-24-35q11 4 23 0','#ead0a7',1.6)}

        <!-- Head in profile with a downward gaze and a clear chin-to-neck connection. -->
        <path d="M171 31q-5-11 3-19q9-10 24-5q11 3 13 13l-1 11-1 6-4 5q-4 9-13 10q-7 0-13-6Z" fill="#c69b79"/>
        <path d="M175 28q-10-4-7-14q2-10 14-13q18-5 27 7q4 5 3 13l-6 3q-2-10-10-13q-11 0-16 12l-1 10Z" fill="#4f4a42"/>
        <path d="M177 23q3-9 10-12q4 0 8 2q-10 2-14 14Z" fill="#979083"/>
        <path d="M174 17q-1-8 10-12m-7 12q4-7 10-9m10-3q10 2 12 11" fill="none" stroke="#b2a99a" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M178 26q-6-3-7 2q-1 6 6 8l3-5Z" fill="#be8a6d"/>
        <path d="M197 36q4-2 8 1l-1 2q-5-2-8 0Z" fill="#716a5d"/>
        <path d="M198 43q4 0 7-3q-1 8-6 11l-5 2 1-6Z" fill="#716a5d"/>
        <path d="M204 23l6 4-1 6-5-1Z" fill="#d5ad8b"/>
        ${line('M195 22q4 0 8 4m-9 0q3 3 6 3m2 8 4 1m-33-9 3 2m16 13 3 3','#765748',1.25)}

        <!-- Mortised table, with the rear feet inset behind the front feet. -->
        ${line('M43 161v77m285-77v77m-283-38h282','#77513a',10)}
        ${line('M26 164v84m325-84v84','#8e603f',14)}
        ${line('M28 242l15-13m306 12-20-12M30 209l34-39m283 38-36-39','#96694a',8)}
        ${line('M23 172v70m326-70v70M48 197h278','#bf8e61',2.4)}
        <path d="M20 161h344l-4 14H22Z" fill="#75503a"/>
        <path d="M6 150l14-6 347 1 15 7-2 13H5Z" fill="#a9754e"/>
        <path d="M7 150q84-5 163-4l198 1 12 5q-52 5-111 4H19Z" fill="#c49565"/>
        ${line('M10 159q68-3 122 0m17 0q75-2 121 0m43 0 61-2m-340 13h321','#c48d5d',1.6)}

        <!-- The client rests face down, arms folded by a padded head support. -->
        <path d="M52 126q-15 4-27 0q-7-2-13 5l-8 15q-3 6 3 8l16-5 10-7 20-1Z" fill="#b67e60"/>
        <path d="M56 127q-14 4-27 0q-6-2-10 3L7 150q-4 7 1 8q6 1 12-4l14-12 24-1Z" fill="#d4a080"/>
        ${line('M10 152l6-4m-5 6 6-4m-1-16q6-4 9-1','#a26e55',1.1)}
        <path d="M180 115q29-5 51 1q19 4 37-6q22-10 40 1l14 13-16 25-39 3-30-1q-27 4-53 2Z" fill="#d3a183"/>
        <path d="M193 122q18-6 38-3q21 5 39-6q17-7 27-2l11 10q-16-2-29 8q-12 9-32 9q-25 9-55 7Z" fill="#e6ba99"/>
        ${line('M225 122q19 4 32-3m12-2q12-6 21-3m-30 14q15-8 24-6','#b27e64',1.45)}
        <path d="M45 126q27-6 53-4q28 2 51-7q28-8 51-6q7 0 9 9l-1 48q-21-8-35-5q-30 10-65 5q-31-4-77 1l4-19Z" fill="#e8d8b9"/>
        <path d="M32 159q29-7 62-3q45 4 72-6q18-6 42 1v15q-23-7-35-5q-28 10-67 5q-28-4-75 1Z" fill="#d3be9f"/>
        <path d="M53 126q-14 13-15 37l6 1q4-24 17-38Zm134-16q-10 15-10 49l7-1q0-30 9-47Z" fill="#f4e5c9"/>
        ${line('M34 163q35-5 67 0q34 5 62-4q22-8 42-1M63 130q-12 11-12 24m72-28q-8 12-9 23m60-32q-8 13-9 28','#b9a282',1.45)}
        <path d="M296 143q9-10 27-12l37 1q17 2 19 13q3 9-13 10l-66-2q-9-2-4-10Z" fill="#849689"/>
        <path d="M306 141q16-6 36-7l20 3q11 3 13 9q-14 6-39 3Z" fill="#a1af9b"/>
        ${line('M298 148q29 8 74 1','#b9c3a7',1.5)}
        <path d="M316 111q7-13 24-9q11 3 13 12l-1 7 3 6-6 3-3 6q-5 7-13 4l-15-9-12-4Z" fill="#d6a482"/>
        <path d="M315 125q-7-11-1-22q5-10 19-12q15-2 21 8q5 8 1 14l-7 1q-8-3-11-9q-7 8-13 9l-4 11Z" fill="#413831"/>
        <path d="M327 94q-5-7 1-12q7-7 14-3q7 4 7 13Z" fill="#4b4036"/>
        ${line('M328 92q9-3 17-1m-25 15q5-9 14-10m-8 20q3-3 5 1m13 6q2 2 5 1m-6 9 3-1','#8e624e',1.2)}
        <path d="M279 128q8-5 17-2l27 13q7 4 15 0l19-12 11-1q7 0 8 5q-1 4-7 5l-8 1-23 16q-11 5-20 1l-34-14q-7-3-5-12Z" fill="#d7a180"/>
        <path d="M285 129q8 0 12 3l26 11q8 4 16-1l19-11 11-2-7 6-25 15q-8 3-18-1l-30-11Z" fill="#e9b697"/>
        ${line('M354 131l11-2m-7 5 13-2m-50 17q8 3 15-1','#ac775f',1.25)}

        <!-- Near right arm, rebuilt to follow the downward diagonal in the study. -->
        ${part('upper-arm',160,62,`
            <path d="M151 52q11-6 23-1l12 3 8-1q7 1 8 7q0 8-8 10l-13-1-15 2-12 1q-10-1-11-10Z" fill="#c99775"/>
            <path d="M141 53q14-8 29-4l13 3-1 19-19 3-18-1q-8-7-4-20Z" fill="#61837b"/>
            <path d="M148 51q13-4 23-1l10 3-1 5q-16-3-30 2Z" fill="#7f9a8e"/>
            ${line('M177 54l-2 15m11-13 7 1','#aab8a4',1.55)}
        `)}
        ${part('forearm',194,62,`
            <path d="M189 56q8-6 20-4l15 3 15 2 4 4-4 6-18 1-14 4q-13 2-18-4Z" fill="#cc9b79"/>
            <path d="M192 65q12 3 28-3l19-1 1 5-18 3-16 3q-10 1-14-3Z" fill="#b77f62"/>
            ${line('M198 56q13 0 34 4','#e9bb96',1.55)}
            ${part('scrub-hand',238,62,`
                <path d="M236 70q12-5 28-3l8 3-3 5q-17 5-32 2l-5-3Z" fill="#567e73" stroke="#49685f" stroke-width="1"/>
                <path d="M236 70q13-3 28-3l5 3q-13 4-31 3Z" fill="#92a89a"/>
                ${line('M236 74q12 4 29-1m-2-4 5 1','#c2cdb9',1.05)}
                <path d="M231 58q7-4 15-1l14 4q4 2 3 4q-1 2-6 1l-10-3 13 5q0 2-3 2l-13-4-7 1-6-3Z" fill="#d9a785"/>
                ${line('M246 59l13 5m-16-3 14 5m-17-3 9 4','#9c6b53',.9)}
            `)}
        `)}
    `);

    sym('s3-curtains', 450, 257, `
        ${line('M5 10h440', '#6B7165',6)}
        ${line('M7 8h436', '#D9D6B7',2)}
        ${line('M7 23V4h11M443 23V4h-11', '#737965',4)}
        <circle cx="7" cy="10" r="5" fill="#A4A88A"/><circle cx="443" cy="10" r="5" fill="#A4A88A"/>
        ${[0,1].map(side=>{
            const left=side?223:13;
            return part(side?'right':'left',0,0,`
                <path class="s3-curtain-fabric" d="M${left} 26h214v226h-214Z" fill="url(#s3-curtain-wash)" stroke="#829F95" stroke-width="1.6"/>
                <path class="s3-curtain-folds" fill="none" stroke="#7F9B90" stroke-width="2.6"/>
                <path class="s3-curtain-highlights" fill="none" stroke="#E5E6CF" stroke-width="2.2"/>
                <path class="s3-curtain-seams" fill="none" stroke="#D5DCC7" stroke-width="3"/>
                ${txt(left+107,139,32,'#567B75',side?'汤':'暖','class="s3-curtain-letter" opacity=".75"')}
                ${repeat(8,i=>`<g class="s3-curtain-hook" transform="translate(${left+8+i*198/7} 0)">
                    <ellipse cx="0" cy="10" rx="5.5" ry="7" fill="none" stroke="#5E6E62" stroke-width="2.7"/>
                    ${line('M-4 9q0-8 6-5', '#E7DDAC',1.4)}
                    ${line('M2 16v5q-6 0-4 6t5-1', '#6D7D6B',2.2)}
                    <circle cx="0" cy="28" r="2.7" fill="#D8DFC9" stroke="#7F9D8C" stroke-width="1.3"/>
                </g>`)}
            `);
        }).join('')}
    `);

    sym('s3-stove', 174, 194, `
        ${bricks(19,100,137,94,'#8D7754')}${rect(12,96,150,14,'#5E6550')}
        <path d="M53 188v-41q32-23 65 0v41Z" fill="#4F5141"/>
        <path d="M66 182q-5-16 7-26-3 12 6 12l9-21 10 24 8-6-1 17Z" fill="#C68E4B"/>
        <path d="M36 91V41q48-26 97 0v50q-48 19-97 0Z" fill="${COPPER}" stroke="#776B45" stroke-width="3"/>
        <ellipse cx="84" cy="40" rx="48" ry="13" fill="#D3AE65" stroke="#87784D" stroke-width="3"/>
        <path d="M44 38q37-33 81 0Z" fill="#D6B674"/><path d="M73 19v-8h22v8" fill="${WOOD}"/>
        ${line('M39 47q-40-3-26 28m119-28q40-4 26 27', COPPER,7)}
        ${line('M135 72h28v14', '#BFC09B',5)}${line('M40 57v26', '#E1C78B',3)}
        ${txt(87,125,15,'#D4C39A','老 虎 灶')}
    `);
    sym('s3-chair', 90, 124, `
        ${line('M12 123L9 11Q44-4 77 11l-3 112M14 77h59m-60 11h59M17 113h53', '#9C8B53',7)}
        ${line('M13 15q31-9 60 0M15 25h56m-56 11h56m-56 11h56m-56 11h56M23 11v56m13-58v59m14-58v58m13-56v55', '#C7B77B',3)}
        ${line('M8 69l-7 17h19m56-17 13 16H69', '#8B814F',5)}
        <path d="M14 77h60l12 15H20Z" fill="#BCAF72"/>
        ${repeat(6,i=>line(`M${22+i*9} 79l5 10`, '#DFCF94',2))}
    `);
    sym('s3-table-front', 192, 91, `${rect(0,0,192,12,'#AB8D55')}
        ${rect(5,12,182,16,'#897345')}${line('M19 28v62m154-62v62M20 73h152', '#8E814D',7)}
        ${line('M6 16h180', '#C5B57D',3)}`);
    sym('s3-table-top', 192, 102, rect(0,0,192,102,'#C4AF79','rx="5"')+
        repeat(9,i=>line(`M5 ${6+i*11}h182`, '#A38D5D',1.4))+
        `<ellipse cx="54" cy="40" rx="31" ry="21" fill="#93855A" stroke="#E2CB94" stroke-width="4"/>`+
        repeat(12,i=>`<path d="M${34+i%4*11} ${28+Math.floor(i/4)*11}l6 3-4 5Z" fill="#D3C39A"/>`));
    sym('s3-tea-service', 368, 232, `
        ${part('body',70,213,`
            <path d="M48 134h43l5 43 7 36-15 2-8-33-9-27-6 27-6 32-14-1 2-36Z" fill="#4d5f53"/>
            ${line('M67 148l-8 33-4 25m28-40 6 19 4 23','#879587',1.8)}
            ${shoe(52,215)}${shoe(95,216)}
            <path d="M61 44h16l-1 13 10 5-15 11-15-12 6-9Z" fill="#bd876c"/>
            <path d="M57 53q-13 2-17 11l5 29-9 52q22 7 34 3l9-8 6 9 15-5-9-47 2-29q-3-10-16-13l-6 7Z" fill="#697e68"/>
            <path d="M51 60l11-7 11 11 8-8 7 4-10 13 3 61-15 11H57l7-69Z" fill="#b2b99a"/>
            ${line('M62 55l10 10-7 9m12 2 3 56m-31-5-3 15m44-17 3 14','#dde0bc',1.7)}
            ${line('M86 94l2 13 7-2m-10-9 7-2','#465948',1.5)}
            ${portrait(69,17,{style:'part',face:'long',eyes:'narrow',brows:'straight',
                mouth:'warm',nose:'long',look:.75,skin:'#e3b48a'})}
            <path d="M43 61Q35 63 33 73l-4 23q1 7 8 11l24 6 2-11-21-8 7-20Z" fill="#627662"/>
            ${line('M36 72l-3 23q3 6 20 10','#9eac8e',1.7)}
            <path d="M60 97l18 4 3 22-24-7Z" fill="#e9dcbe"/>
            ${line('M69 101l2 18m-7-19-1 16','#baa98a',1.4)}
            ${grip(62,106,-74,'#e3b48a',.74)}
        `)}
        ${part('pot',104,106,`
            <path d="M81 63q6-4 12 1l11 22q3 6 7 8l11 4-4 10-15-4q-7-2-11-10L80 73q-3-6 1-10Z" fill="#718572"/>
            ${line('M85 66l13 23q4 9 18 12','#a1ae93',1.7)}
            <path d="M121 91q-9-23 17-23t20 23" fill="none" stroke="${COPPER}" stroke-width="6"/>
            <path d="M117 92q23-12 46 0l7 39q-24 17-51-2Z" fill="${COPPER}" stroke="#7E714D" stroke-width="2"/>
            <path d="M162 100L260 72l2 5-93 37Z" fill="#D7B56D" stroke="#8D7D50" stroke-width="1.5"/>
            <ellipse cx="140" cy="91" rx="21" ry="5" fill="#D3B674"/><circle cx="140" cy="85" r="4" fill="#786747"/>
            ${line('M125 102v23m1 3q18 7 35 0', '#E8CA86',2.4)}
            ${line('M120 99q-15-4-13 9q2 12 14 13','#775937',5)}
            ${grip(111,105,-23,'#e3b48a',.8)}
        `)}
        ${bowl(327,123,1)}
        ${part('stream',0,0,'<path class="s3-tea-stream" d="M261 74Q303 90 327 122" fill="none" stroke="#DAB36A" stroke-width="3.4" stroke-linecap="round" opacity="0"/>')}
        ${part('cup-steam',327,118,line('M315 116q-11-12 0-23t1-23m13 46q12-11 0-22t0-22m12 43q-7-10 0-18','#F4EAD0',4,'opacity=".82"'))}
    `);
    sym('s3-guest', 100, 151, `
        ${line('M16 145l3-47-4-55q20-11 42-1l-2 55 7 47m-41-48 47 7m-50-54 38-2m-37 13 35-2m-33 14 33-2m-31 13 30-1','#a89b6a',5)}
        <path d="M19 93h45l14 10-55 2Z" fill="#c4b581"/>
        <path d="M31 84q9-6 19 0l17 14-5 44-10-1 4-34-24-12Z" fill="#605f4d"/>
        ${shoe(57,142)}
        <path d="M39 85q10-4 17 1l24 13-1 14 3 30H71l-4-29-1-7-29-11Z" fill="#7d795e"/>
        ${line('M51 92l24 12-2 10 4 23','#a5a181',1.6)}${shoe(77,143)}
        ${person(45,5,{shirt:'#a7895d',legs:0,skin:'#d8ad86',style:'recede',hair:'#89877b',
            face:'square',mature:true,eyes:'soft',nose:'broad',mouth:'wry',
            arms:[[-16,45,8,56,-20,65],[16,46,20,55,24,59]]})}
        ${bowl(62,56,.48)}
        ${grip(56,61,-30,'#d8ad86',.67)}
    `);
    sym('s3-ear-scene', 183, 184, `
        ${line('M39 122l-7 41m44-38 15 37m-57-7h53M76 127l24-63','#7e714a',5.3)}
        <path d="M72 129l18-67 15 5-22 67Z" fill="#b4a273"/>
        ${line('M80 115l13-44m-10 47 15-48m-19 39 12 3m-9-12 12 3m-9-12 12 3m-9-12 12 3','#d8c695',1.9)}
        <path d="M30 124l9-8 45 8-9 13-48-7Z" fill="#bea876"/>
        ${line('M35 122l39 8m-34-11 39 8','#e2c997',2.2)}
        <path d="M57 119q12-3 20 4l-2 11-27 8-5 29-11-1 3-32q1-7 9-10Z" fill="#4f625a"/>
        ${shoe(38,172,-1)}
        <path d="M65 121q10-1 15 6l-1 10-26 11-1 28-12 1-1-30q0-10 10-15Z" fill="#6d7f72"/>
        ${line('M70 129l-22 14-2 28','#adba9f',1.6)}${shoe(47,176,-1)}
        <path d="M72 80q8-4 17 2l6 9-9 15-5 24q-18 4-31-8l5-17Z" fill="#7b9890"/>
        <path d="M77 84l-5-8 4-12 13 4-1 10 4 6-6 8Z" fill="#c29475"/>
        ${line('M74 82q5 8 15 10m-31 28q8 5 17 5','#b2c4aa',1.5)}
        <g transform="rotate(-12 82 66)">${portrait(82,51,{dir:-1,style:'recede',hair:'#909084',
            skin:'#e2b48b',face:'round',mature:true,closed:true,nose:'button',look:.85})}</g>
        <path d="M70 88q8-2 10 6l-5 16q-2 6-9 8l-15-1 1-8 12-2 1-13Z" fill="#90a69b"/>
        <path d="M54 109q-8-4-13 0q-3 3 1 6l9 1 5-3Z" fill="#e2b48b"/>
        ${line('M30 126l-8 48m57-41 15 41m-68-9 65 1M78 132l23-66M32 112l48 7m-47-6-3 16m42-11-1 14','#9d8658',5)}
        ${line('M33 110l45 7m1 11 19-58m-65 58-7 42','#d9bf8c',1.7)}
        ${person(144,14,{shirt:'#9ca788',pants:'#596553',dir:-1,style:'crop',legs:61,arms:[],skin:'#e4b791',
            face:'heart',eyes:'soft',brows:'angled',mouth:'focus',look:.75})}
        <path d="M128 54q-4-1-7 6l-8 17-11-7-6 7 16 11q5 3 9-3l11-18Z" fill="#8a9a7e"/>
        ${line('M125 60l-10 21-12-6','#c1c6a5',1.5)}
        ${part('fork',101,73,`${line('M101 73l2-17m0 0-6-11m6 11 8-10','#d6dac4',2.4)}${grip(101,73,16,'#e4b791',.62)}`)}
        ${part('feather',158,58,`
            <path d="M157 53q6 0 8 7l4 20q1 6-5 9l-32 7-3-9 28-8-4-15Z" fill="#a7af90"/>
            ${line('M160 62l4 18-28 10','#d4d4b3',1.5)}
            ${line('M133 90L102 78','#94744f',1.8)}
            <path d="M104 80q-5-8-12-9q1 8 10 10Z" fill="#f1ead1"/>
            ${grip(130,91,-66,'#e4b791',.64)}
        `)}
    `);
    sym('s3-cage', 79, 111, `${line('M40 0v15m-4-12q-10-12 4-13', WOOD,2)}
        ${part('cage',40,15,`<path d="M10 96V43q30-56 60 0v53Z" fill="#A7AF7B" fill-opacity=".18" stroke="#BBA46A" stroke-width="3"/>
            ${repeat(5,i=>line(`M${18+i*11} 96V${35-Math.sin(i*Math.PI/4)*11}`, '#BBA46A',2))}
            ${line('M10 51h60M10 95h60', '#A08D58',4)}
            <ellipse cx="39" cy="67" rx="11" ry="8" fill="#796A45"/><circle cx="47" cy="61" r="5" fill="#6D6041"/>
            <path d="M28 69l-12 7 7-13m29-3 7 2-8 2" fill="#8B7A4E"/>
            ${line('M19 80h40', WOOD,3)}${line('M43 59h6', '#EEE2BA',1.5)}
            <ellipse cx="40" cy="98" rx="32" ry="7" fill="#BBA16C"/>
        `)}`);
    sym('s3-cat', 126, 66, `
        ${part('tail',35,47,`
            <path d="M37 49Q19 55 12 43Q6 30 15 24Q19 23 20 27Q16 35 22 40Q25 43 37 41Z" fill="#ba804a"/>
            ${line('M12 34l7-2m-5 9 7-3m-2 8 6-5','#8f5d3e',2.7)}
        `)}
        <path d="M24 48q-5-10 5-19q9-8 22-8q17 0 26 11q8 4 16 4l9 15q-10 13-32 11l-36-4q-9-2-10-10Z" fill="#ce9153"/>
        <path d="M32 46q13 8 26 4q8-3 10-12q7 5 4 12q-2 12-20 12l-18-4q-7-2-2-12Z" fill="#ba804a"/>
        ${line('M37 27q6 4 8 11m5-15q6 4 7 11m5-8q6 3 6 9m-37 11q4 9 14 8','#a96d42',2.5)}
        <path d="M48 53q7 1 15 4q4 3 1 6H46q-6-2-2-7Z" fill="#eac087"/>
        ${part('paws',89,59,`
            <path d="M75 50q5-5 11-3l11 8h10q8 0 8 5q0 4-7 4H89q-8-1-14-7Z" fill="#bd8249"/>
            <path d="M91 55q8 2 18 0q8 0 8 5q0 4-7 4H92q-6-1-5-5Z" fill="#f1cd96"/>
            ${line('M106 61v2m5-2v2','#a97855',1)}
        `)}
        <path d="M79 32q-3-8 0-19q9 1 15 9q8-2 13 1q4-7 12-9q4 12-1 21q3 9-3 15q-6 6-17 6q-10 0-17-6q-7-5-2-18Z" fill="#de9e5c"/>
        <path d="M81 17q7 2 10 7l-9 4Zm35 1q2 5 0 10l-7-3Z" fill="#b87557"/>
        <path d="M82 43q7-5 13-1q4-3 8-1q6 1 11 5q-3 8-15 9q-12 0-17-12Z" fill="#f1d2a1"/>
        ${line('M94 25l2 7m5-8-1 7m6-6-2 7m-21 3 5 2m25-2 4-2','#a76a44',1.9)}
        ${line('M85 38q3 3 7 0m13 0q3 3 7-1','#574032',1.6)}
        <path d="M96 43q4-2 7 0l-3 3Z" fill="#8d5749"/>
        ${line('M100 46v2m0 0q-3 3-6 1m6-1q3 3 6 0M85 45l-11-2m11 5-10 1m37-4 10-4m-9 7 10 1','#8c674d',1.1)}
    `);
    sym('s3-steam', 370, 160, repeat(3,i=>
        line(`M${38+i*116} 150q-26-23 0-45t-4-48q-22-15-2-34`, '#EFE9D5',8,'opacity=".37"')+
        line(`M${64+i*116} 151q22-27 1-51t-1-40`, '#F4EDD9',5,'opacity=".28"')));
});
