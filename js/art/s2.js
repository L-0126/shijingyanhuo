// A single waterfront drawing supplies both halves of the morning market.
PB.ART.register('s2', () => {
    const {sym, rect, txt, person, portrait, shoe, grip} = PB.ART;
    const paper = '#eee1c7', water = '#6d9c8f', stone = '#8d9185';
    const ink = '#424b49', ochre = '#d1b381', red = '#a64b35';
    const repeat = (count, draw) => Array.from({length: count}, (_, i) => draw(i)).join('');
    const part = (name, x, y, body) =>
        `<g data-part="${name}" style="transform-origin:${x}px ${y}px">${body}</g>`;

    function tiles(x, y, width, height){
        return `<path d="M${x-8} ${y+height}L${x+15} ${y}h${width-30}l23 ${height}Z" fill="${ink}"/>
            ${repeat(Math.floor(width/11), i => `<path d="M${x+15+i*10} ${y+3}l${(i-width/22)*.65} ${height-3}" stroke="#788177" stroke-width="1.5"/>`)}
            <path d="M${x-9} ${y+height}h${width+18}m-${width+12} 5h${width+6}" stroke="#b7b5a0" stroke-width="3"/>
            <path d="M${x+14} ${y}h${width-28}" stroke="#58615b" stroke-width="5"/>`;
    }

    function lattice(x, y, w, h, colored = false){
        return `${rect(x-4,y-4,w+8,h+8,'#b3a384')}
            ${rect(x,y,w,h,colored?'#6c8878':'#465954')}
            ${colored ? rect(x+2,y+2,w/2-3,h/2-3,'#bf8a55') + rect(x+w/2+1,y+h/2+1,w/2-3,h/2-3,'#8e7970') : ''}
            <path d="M${x+w/2} ${y}v${h}M${x} ${y+h/2}h${w}m-${w} ${h/4}h${w}m-${w} -${h/2}h${w}"
                fill="none" stroke="#dbc597" stroke-width="2.5"/>
            ${rect(x-6,y+h+3,w+12,5,'#9f967e')}`;
    }

    function basket(x, y, w, h, produce = ''){
        return `<path d="M${x} ${y}h${w}l-${w*.1} ${h}h-${w*.8}Z" fill="#bb9258" stroke="#725a3b" stroke-width="2"/>
            ${repeat(4, i => `<path d="M${x+i*w/4} ${y}l${w*.12} ${h}" stroke="#ead19a" stroke-width="2"/>`)}
            ${repeat(3, i => `<path d="M${x+2} ${y+4+i*h/3}h${w-4}" stroke="#826c48" stroke-width="2"/>`)}
            <ellipse cx="${x+w/2}" cy="${y}" rx="${w/2}" ry="${w*.12}" fill="#776344" stroke="#e3bd7c" stroke-width="3"/>${produce}`;
    }

    // All coordinates are in the same 1600 x 1000 print, including the gutter.
    const bridgeOutline = 'M0 260V224L61 201 124 158 191 104Q325-5 459 104L526 158 589 201 650 224V260Z M202 260V235C202 48 448 48 448 235V260Z';
    const farBank = 'M0 0H1600V632C1407 622 1280 619 1120 568S876 446 758 432C661 421 620 397 600 341C579 288 504 261 436 283C346 315 348 445 259 498C176 550 81 551 0 588Z';
    const nearBank = 'M0 755C156 697 264 707 335 777C388 829 418 935 552 1000H0Z M1600 720C1458 711 1410 756 1332 803S1190 910 1103 1000H1600Z';
    sym('s2-print', 1600, 1000, `
        <defs>
            <clipPath id="s2-bridge-masonry"><path d="${bridgeOutline}" fill-rule="evenodd" clip-rule="evenodd"/></clipPath>
            <linearGradient id="s2-river" x2=".5" y2="1"><stop stop-color="#567e74"/><stop offset=".54" stop-color="${water}"/><stop offset="1" stop-color="#9db5a0"/></linearGradient>
            <linearGradient id="s2-stone" x2="0" y2="1"><stop stop-color="#a8a58b"/><stop offset="1" stop-color="${paper}"/></linearGradient>
            <clipPath id="s2-land"><path d="${farBank} ${nearBank}"/></clipPath>
            <clipPath id="s2-water-clip"><path d="M0 0H1600V1000H0Z ${farBank} ${nearBank}" clip-rule="evenodd"/></clipPath>
        </defs>
        <rect width="1600" height="1000" fill="url(#s2-river)"/>
        <path d="${farBank} ${nearBank}" fill="url(#s2-stone)" stroke="#536e61" stroke-width="9"/>
        <path d="${farBank} ${nearBank}" fill="none" stroke="#e0d1ad" stroke-width="4"/>
        <g clip-path="url(#s2-land)" fill="none" stroke="#8b8e7b" opacity=".47" stroke-width="2">
            ${repeat(23,i=>`<path d="M0 ${i*47}H1600"/>`)}
            ${repeat(24,i=>`<path d="M${i*72} 0l-75 1000"/>`)}
            ${repeat(12,i=>`<path d="M${830+i*69} 0l-28 620" stroke="#ab9374"/>`)}
        </g>
        <g clip-path="url(#s2-water-clip)" fill="none" stroke-linecap="round">
            <path d="${farBank}" stroke="#d7dfbf" stroke-width="22" opacity=".20"/>
            ${repeat(170,i=>`<path d="M${(i*151)%1600} ${285+(i*73)%710}q${15+i%13} -4 ${29+i%49} -1" stroke="${i%4?'#d6dbc0':'#3f786c'}" stroke-width="${i%4===0?3:1.6}" opacity="${.16+(i%5)*.065}"/>`)}
            ${repeat(34,i=>`<path d="M${133+i*41} ${602+(i*31)%251}l${15+i%21} -2" stroke="#f4e3b5" stroke-width="3" opacity=".5"/>`)}
        </g>
        <path d="M45 572Q208 538 277 477M782 446Q968 517 1127 580T1571 648" fill="none" stroke="#ece0bd" stroke-width="5"/>
        ${repeat(6,i=>`<ellipse cx="${80+i*26}" cy="${659+i%3*15}" rx="12" ry="4.5" fill="#617d4d"/><path d="M${80+i*26} ${659+i%3*15}l8-3" stroke="#b6bd81" stroke-width="1.4"/>`)}
        ${txt(1396,893,43,'#525749','巷陌喧声','letter-spacing="7"')}
        ${txt(1385,940,16,'#78745b','一河晨光 · 两岸人家','letter-spacing="4"')}
        <rect x="1525" y="849" width="41" height="76" rx="2" fill="none" stroke="${red}" stroke-width="3"/>
        ${txt(1547,878,23,red,'贰')}${txt(1547,911,23,red,'声')}
    `);

    sym('s2-backdrop', 1530, 313, `
        <path d="M0 113L52 100 106 78 191 83 255 45 340 67 400 30 487 47 561 13 666 37 740 19 822 42 902 12 994 31 1082 54 1180 49 1260 86 1361 79 1462 102 1530 135V313H0Z" fill="#d7d4b4"/>
        <path d="M0 171Q184 73 386 111T738 110Q959 71 1179 129T1530 157V313H0Z" fill="#bfc3a3"/>
        <path d="M0 254l46-45 39 10 31-42 54 14 40-33 54 27 46-31 69 44 67-17 40 17 83-28 62 29 67-11 55 19 89-28 74 32 56-21 94 26 62-18 105 39 65-26 127 47V313H0Z" fill="#9ea78d"/>
        <circle cx="1135" cy="76" r="38" fill="#f0dfae"/>
        <path d="M83 128q65-18 118-9m204-31q58-15 115-1m696 47q82-15 142 5" stroke="#eee3c4" stroke-width="3" fill="none" opacity=".8"/>
        <path d="M676 75q9-9 19 0q9-10 18 0m43 15q7-7 14 0q8-8 15 0" stroke="#7e897d" fill="none" stroke-width="2"/>
    `);

    sym('s2-water-houses', 500, 361, `
        <path d="M8 358V138L42 138V99H74V73H102V104H127V136H145V358Z" fill="#ded8c0" stroke="#aca991" stroke-width="2"/>
        <path d="M135 358V112L159 112V71H186V22H213V60H242V101H263V358Z" fill="#f2e7cd"/>
        <path d="M257 358V155L286 155V123H313V90H341V124H368V153H394V358Z" fill="#e9ddc2"/>
        <path d="M388 358V186H489V358Z" fill="#bfc3ad"/>
        <path d="M8 138H42V99H74V73H102V104H127V136H145M135 112H159V71H186V22H213V60H242V101H263M257 155H286V123H313V90H341V124H368V153H394"
            stroke="${ink}" stroke-width="10" fill="none"/>
        ${tiles(18,156,114,26)}${tiles(146,127,107,32)}${tiles(267,173,116,27)}${tiles(392,174,96,27)}
        ${lattice(33,198,33,51)}${lattice(88,198,29,51)}
        ${lattice(162,181,31,61)}${lattice(212,181,29,61)}
        ${lattice(278,215,34,48)}${lattice(334,215,33,48)}
        ${lattice(406,226,30,50)}${lattice(450,226,25,50)}
        ${repeat(4,i=>`<path d="M${24+i*125} 358v-59q37-43 75 0v59" fill="#53645a" stroke="#a79e83" stroke-width="5"/>`)}
        <path d="M5 349H496M136 156v202m126-181v181m129-153v153" stroke="#aaa98e" stroke-width="5"/>
        ${repeat(23,i=>`<path d="M${13+i*21} 345v13" stroke="#6f7b6b" stroke-width="3"/>`)}
        <path d="M63 285v59m7-53v53m105-59v59m7-53v53m110-59v59m7-53v53" stroke="#c4b98e" stroke-width="2"/>
        <path d="M16 277h103m32-8h95m25 13h106" stroke="#c6bea1" stroke-width="3"/>
        ${rect(72,269,44,15,'#8b6b47')}${txt(94,280,10,paper,'茶  米')}
        <path d="M182 29h23m87 97h36" stroke="#c1bea6" stroke-width="2"/>
        ${repeat(17,i=>rect(21+(i*53)%455,312+i%4*8,10,3,'#8d947c'))}
    `);

    sym('s2-house-side', 110, 240, `
        <path d="M0 15L110 40V240H0Z" fill="#b6b79f"/>
        <path d="M0 15L110 40" stroke="${ink}" stroke-width="9"/>
        ${lattice(28,72,43,61)}
        <path d="M12 235h92M14 181h66m-61 11h48m-31 13h52" stroke="#8b977f" stroke-width="3"/>
    `);

    sym('s2-willow', 285, 383, `
        <path d="M151 382q-9-70-5-152t-19-105q-19-44-65-57m74 74q29-79 81-87m-75 76q3-69-33-102" fill="none" stroke="#686953" stroke-width="16"/>
        <path d="M151 382q-9-70-5-152t-19-105" fill="none" stroke="#aba27a" stroke-width="4"/>
        ${repeat(15,i=>{
            const x=15+i*18, y=63+Math.abs(7-i)*4, length=90+(i*37)%116;
            return `<path d="M145 78Q${x} ${y-28} ${x} ${y+length}" fill="none" stroke="#6c8055" stroke-width="2"/>`+
                repeat(8,j=>`<path d="M${x+3*Math.sin(j)} ${y+j*length/8}q-17 4-15 16q14-4 15-16m1 8q16 5 13 17q-11-7-13-17" fill="${j%2?'#829365':'#677e54'}"/>`);
        })}
    `);

    sym('s2-market-link', 412, 253, `
        <path d="M5 252V118H124V70H250V102H404V252Z" fill="#c6b587"/>
        <path d="M124 252V83h126v169" fill="#ddd0aa"/>
        ${tiles(1,94,131,38)}${tiles(117,44,142,44)}${tiles(244,81,163,32)}
        ${lattice(141,106,35,55)}${lattice(200,106,32,55)}
        ${repeat(5,i=>rect(20+i*80,173,53,78,'#615b43'))}
        <path d="M8 177H407M16 166v86m109-91v91m127-89v89m147-91v91" stroke="#806e4c" stroke-width="7"/>
        <path d="M1 175l22-31h366l23 31Z" fill="#b8b188" stroke="#787955" stroke-width="2"/>
        ${repeat(14,i=>`<path d="M${23+i*27} 145l-10 29" stroke="#e5d6aa" stroke-width="12"/>`)}
        <path d="M0 176h412" stroke="#dbca9f" stroke-width="5"/>
        ${repeat(7,i=>basket(16+i*55,233,42,17,repeat(4,j=>`<ellipse cx="${24+i*55+j*9}" cy="229" rx="5" ry="7" fill="${i%2?'#8e9d60':'#d7b05d'}"/>`)))}
        ${rect(272,119,112,33,'#8a6e43')}${txt(328,143,22,paper,'桥 头 杂 货')}
        <path d="M149 26v23m-1-22 25-9 26 9 24-10 28 10v22" stroke="#7a795c" stroke-width="2" fill="none"/>
        <path d="M174 20v17h22V25m29-6v19h24V26" fill="#a8b5a0"/>
    `);

    function arcade(w, h, bays, facade){
        const step = (w-28)/bays;
        const openings = repeat(bays, i => {
            const x = 14+i*step;
            return `M${x+10} ${h}V${h-111}q${step/2-10} -52 ${step-20} 0V${h}Z `;
        });
        return `<path d="M8 ${h}V34H${w-8}V${h}Z ${openings}" fill="${facade}" fill-rule="evenodd"/>
            <path d="M0 35h${w}v16H0Z" fill="#e4c99b" stroke="#9c885f" stroke-width="2"/>
            <path d="M12 34V14h${w-24}v20" fill="#d9c59b" stroke="#a28b65" stroke-width="3"/>
            ${repeat(bays,i=>{
                const x=14+i*step;
                return `<path d="M${x+10} ${h}V${h-111}q${step/2-10} -52 ${step-20} 0V${h}" fill="none" stroke="#ead8af" stroke-width="6"/>
                    <path d="M${x+20} ${h}V${h-111}q${step/2-20} -34 ${step-40} 0" fill="none" stroke="#6f7258" stroke-width="6"/>
                    ${lattice(x+15,76,step-31,64,true)}
                    ${lattice(x+15,183,step-31,69,true)}
                    <path d="M${x+10} 73q${step/2-10} -32 ${step-20} 0M${x+9} 178h${step-18}"
                        fill="none" stroke="#a58e65" stroke-width="3"/>
                    <path d="M${x+13} 73q${step/2-13} -23 ${step-26} 0" fill="none" stroke="#e8d7ae" stroke-width="3"/>
                    <path d="M${x+9} 80v59m${step-18} -59v59m-${step-18} 46v61m${step-18} -61v61"
                        stroke="#7e8b70" stroke-width="5"/>
                    ${repeat(6,j=>`<path d="M${x+6} ${84+j*9}h7m${step-18} 0h7" stroke="#c7c6a0" stroke-width="1.3"/>`)}
                    <path d="M${x-5} 60h15v8h-15m-1 103h15v8h-15m-1 108h15v8h-15" fill="#b9a17a"/>
                    <path d="M${x} 62V${h}m${step-5} -${h-62}V${h}" stroke="#ead8b0" stroke-width="7"/>
                    <path d="M${x-2} ${h-8}h13m${step-15} 0h13" stroke="#96846a" stroke-width="5"/>`;
            })}
            <path d="M0 155h${w}v15H0Zm0 112h${w}v14H0Z" fill="#e8d5ac" stroke="#a99470" stroke-width="2"/>
            <path d="M5 298H${w-5}M5 310H${w-5}" stroke="#7d7156" stroke-width="3"/>
            ${repeat(Math.floor(w/11),i=>`<path d="M${10+i*11} 283v25" stroke="#8e7857" stroke-width="2"/>`)}
            ${repeat(Math.floor(w/17),i=>rect(8+i*17,46,8,7,'#a99570'))}
            ${repeat(22,i=>`<path d="M${19+(i*37)%(w-38)} ${63+(i*53)%209}l${4+i%9} 1" stroke="#a88f67" stroke-width="1" opacity=".46"/>`)}
            <path d="M4 ${h-2}H${w-4}" stroke="#a58f6c" stroke-width="7"/>`;
    }

    sym('s2-arcade', 410, 444, `
        ${arcade(410,444,4,ochre)}
        <path d="M122 16V0h165v16" fill="#d9c59b" stroke="#9c885f" stroke-width="3"/>
        ${txt(205,28,17,'#746441','永 安 里','letter-spacing="5"')}
        ${rect(21,320,367,33,'#815d3e')}${rect(25,324,359,25,red)}
        ${txt(205,344,22,'#fae3ae','荣 记 烧 腊 · 时 鲜 果 蔬')}
        <path d="M19 356h375" stroke="#c49a5f" stroke-width="5"/>
        ${repeat(6,i=>`<path d="M${44+i*62} 357v10q-10 0-10 13q-10 11-2 25q9 9 17 0q9-11-1-23l-4-11" fill="${i%2?'#ab502e':'#8c4230'}" stroke="#e1a762" stroke-width="2"/>`)}
    `);
    sym('s2-arcade-side', 132, 444, `
        <path d="M0 36h132v408H0Z M15 444V347q49-53 102 0v97Z" fill="#aa956b" fill-rule="evenodd"/>
        <path d="M0 36h132v15H0M0 155h132v15H0m0 97h132v14H0" fill="#c7b18a" stroke="#7d785e" stroke-width="2"/>
        ${lattice(19,78,37,62,true)}${lattice(78,78,36,62,true)}
        ${lattice(19,183,37,69,true)}${lattice(78,183,36,69,true)}
        <path d="M16 444V345q48-51 100 0v99M7 288h117m-112 17h110" fill="none" stroke="#d6be91" stroke-width="6"/>
    `);
    sym('s2-arcade-rear', 410, 150, `
        <rect width="410" height="150" fill="#626e59"/>
        ${repeat(4,i=>`<path d="M${18+i*96} 150V42h68v108" fill="#3f554b" stroke="#a69c74" stroke-width="5"/>
            <path d="M${26+i*96} 50v95m20-95v95m20-95v95" stroke="#72836a" stroke-width="3"/>`)}
        <path d="M0 14h410M0 148h410" stroke="#a29973" stroke-width="7"/>
        ${repeat(12,i=>rect(9+i*34,22,21,8,'#8d9675'))}
    `);
    sym('s2-arcade-floor', 459.2, 150, `
        <rect width="459.2" height="150" fill="#a4ab8c"/>
        ${repeat(6,i=>`<path d="M0 ${i*30}h459M${i*90} 0v150" stroke="#c9c7a4" stroke-width="2"/>`)}
        <path d="M0 149h459" stroke="#e6d6af" stroke-width="5"/>
    `);
    sym('s2-arcade-small', 187, 339, `
        <path d="M4 339V43h179v296Z" fill="#c1c4a4"/>
        <path d="M0 42h187v14H0m7-12V21h43V7h88v14h42v23" fill="#dcd8b6" stroke="#9da083" stroke-width="3"/>
        ${lattice(28,79,46,66,true)}${lattice(113,79,46,66,true)}
        ${lattice(28,177,46,48)}${lattice(113,177,46,48)}
        <path d="M4 155h180m-180 81h180M10 57v282m81-282v282m85-282v282" stroke="#e1dbb6" stroke-width="8"/>
        <path d="M23 339v-66q27-34 54 0v66m27 0v-66q27-34 54 0v66" fill="#596753" stroke="#dcd4ad" stroke-width="4"/>
        ${rect(19,241,151,27,'#6a7660')}${txt(94,260,16,paper,'南 北 茶 行')}
    `);
    sym('s2-balcony-floor', 419, 46, `
        <rect width="419" height="46" fill="#b7a37c" stroke="#6f715b" stroke-width="2"/>
        <path d="M0 44h419m-419-7h419" stroke="#e4cea0" stroke-width="3"/>
        ${repeat(16,i=>`<path d="M${i*27} 0v45" stroke="#8e886d" stroke-width="1.5"/>`)}
    `);
    sym('s2-balcony-rail', 419, 33, `
        <path d="M0 2h419m-419 28h419" stroke="#dfc59a" stroke-width="5"/>
        ${repeat(26,i=>`<path d="M${6+i*16} 4v25m1-20q9 7 0 13" stroke="#796d51" stroke-width="2" fill="none"/>`)}
        ${repeat(6,i=>`<path d="M${i*83} 0v33" stroke="#ceb48a" stroke-width="7"/>`)}
    `);
    sym('s2-produce', 179, 104, `
        <path d="M10 100V58h159v42m-145-7h135" fill="#977c50" stroke="#5b634a" stroke-width="4"/>
        ${basket(4,45,71,33,repeat(8,i=>`<ellipse cx="${14+i%4*15}" cy="${39-Math.floor(i/4)*9}" rx="9" ry="6" fill="${i%2?'#a6ae64':'#7f9654'}"/>`))}
        ${basket(93,48,76,30,repeat(8,i=>`<path d="M${104+i%4*17} ${45-Math.floor(i/4)*12}q-11-15-3-21l8 16 7-21 6 5-9 23Z" fill="${i%2?'#74894f':'#a5ac68'}"/>`))}
        <path d="M75 36l6-33h25l-7 34Z" fill="#e2cf9f" stroke="#a0885c" stroke-width="2"/>
        ${txt(90,23,16,'#856440','鲜')}
    `);

    // Both arch faces have a real hole; no painted rectangle covers the boat.
    sym('s2-bridge', 650, 260, `
        <path d="${bridgeOutline}" fill="${stone}" fill-rule="evenodd" stroke="#5c685e" stroke-width="3"/>
        <g clip-path="url(#s2-bridge-masonry)" stroke="#657264" stroke-width="2" opacity=".8">
            ${repeat(10,i=>`<path d="M0 ${41+i*24}H650"/>`)}
            ${repeat(48,i=>`<path d="M${(i%12)*58+(i%2)*23} ${83+Math.floor(i/12)*45}v23"/>`)}
        </g>
        <path d="M198 260V235C198 43 452 43 452 235V260" fill="none" stroke="#cdc9aa" stroke-width="17"/>
        <path d="M208 258V235C208 60 442 60 442 235V258" fill="none" stroke="#5c7163" stroke-width="4"/>
        ${repeat(13,i=>{
            const angle=Math.PI+i*Math.PI/12;
            const x=325+120*Math.cos(angle), y=230+140*Math.sin(angle);
            return `<path d="M${x} ${y}l${Math.cos(angle)*14} ${Math.sin(angle)*14}" stroke="#7a8373" stroke-width="2"/>`;
        })}
        <path d="M0 223L61 200 124 157 191 103Q325-6 459 103L526 157 589 200 650 223" fill="none" stroke="#ddd4b6" stroke-width="9"/>
        <path d="M0 199L61 176 124 133 191 79Q325-30 459 79L526 133 589 176 650 199" fill="none" stroke="#b9b9a1" stroke-width="8"/>
        ${repeat(17,i=>{
            const x=9+i*39.5, y=42+175*Math.pow(Math.abs(x-325)/325,1.35);
            return `<path d="M${x} ${y}v-29" stroke="#c7c4a8" stroke-width="8"/><path d="M${x-6} ${y-30}h12" stroke="#e7ddbe" stroke-width="4"/>`;
        })}
        <path d="M2 260h192m262 0h191" stroke="#c4c3a6" stroke-width="5"/>
        <path d="M14 257h56m467-5h54" stroke="#71865e" stroke-width="5"/>
    `);
    sym('s2-bridge-step', 46, 120, `
        <rect width="46" height="120" fill="#b9b79e" stroke="#727c6c" stroke-width="2"/>
        <path d="M2 118h42M23 2v115" stroke="#e0d6b8" stroke-width="2"/>
    `);
    sym('s2-stone-lion', 47, 70, `
        <path d="M8 66h35V54H8Z" fill="#a1a38e" stroke="#657566" stroke-width="2"/>
        <path d="M15 54q-8-17 0-30q-5-10 4-17q10-7 18 3q9 8-2 19l3 25Z" fill="#c4c4a8" stroke="#7c8771" stroke-width="2"/>
        <path d="M17 33q-18-13-13 3q2 9 13 7m7-24h6m-10 9q6 5 12 0m-10 16v9" stroke="#727b66" fill="none" stroke-width="3"/>
    `);
    sym('s2-quay-steps', 229, 114, `
        <path d="M0 0H229V25H197V49H162V73H121V96H74V114H0Z" fill="#8b9881" stroke="#5c7361" stroke-width="3"/>
        <path d="M0 1h229M0 25h197M0 49h162M0 73h121M0 96h74" stroke="#ddd7b4" stroke-width="5"/>
        <path d="M53 3v20m41 4v20m-56 4v20m31 4v19" stroke="#6b7c68" stroke-width="2"/>
    `);

    const rower = (coat,shade,band) => `
        <path d="M36 94h26l2 22 6 25-10 2-8-22-4-13-5 18-6 16-10-1 6-21Z" fill="#3f5050"/>
        <path d="M48 103l-9 31m18-19 8 19" fill="none" stroke="#87918a" stroke-width="1.3"/>
        ${shoe(33,143)}${shoe(65,143)}
        <path d="M43 48l11 1 1 10-14 2Z" fill="#bf8969"/>
        <path d="M40 54q-9 2-10 11l2 20-3 16q18 5 36-1l-3-20 2-14q-3-10-10-11-7 8-14-1Z" fill="${coat}"/>
        <path d="M54 56L45 72l3 28m-13-6q14 6 26 0" fill="none" stroke="${shade}" stroke-width="1.8"/>
        ${portrait(48,24,{skin:'#d4a580',style:'part',face:'long',eyes:'narrow',brows:'straight',
            nose:'long',mouth:'focus',look:.82,mature:true,hair:'#372f2a'})}
        <path d="M33 36q10-8 29-6l2 5q-16-2-29 6l-4 6-3-3Z" fill="${band}"/>
        <path d="M37 36l3-1m4 0 2-1m5-1h3m4 0h2" stroke="#ddd6b9" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M58 59q4-1 7 5l8 17q2 6-3 9L49 101l-4-7 17-12-7-14Z" fill="${coat}"/>
        <path d="M34 60q-4 0-7 6l-9 18q-3 6 2 11l18 15 6-7-16-15 11-20Z" fill="${shade}"/>
        <path d="M29 68L22 87l14 14m24-36 8 17-15 10" stroke="#ddd2af" stroke-width="1.5" opacity=".65" fill="none"/>
        ${grip(46,98,20,'#dcb389',.67)}${grip(41,108,22,'#dcb389',.73)}`;
    const paddle = '<path d="M49 91Q35 130 12 172" stroke="#6a5840" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M16 156Q12 160 4 178l7 4 14-23Z" fill="#a98753" stroke="#755c43" stroke-width="1.4"/><path d="M17 161l-7 15" stroke="#d7b479" stroke-width="1.3"/>';
    sym('s2-boat', 300, 190, `
        ${part('jiangnan',150,190,`
            <path d="M13 146Q140 165 291 137L263 175Q142 196 35 176Z" fill="#6a5940" stroke="#373e33" stroke-width="3"/>
            <path d="M23 155Q144 177 281 149M35 168q105 26 228-4" stroke="#bd9b64" fill="none" stroke-width="3"/>
            <path d="M81 147V105q4-68 62-51q61 7 70 93Z" fill="#4a5650" stroke="#c0b996" stroke-width="3"/>
            <path d="M178 147q4-58-22-87q54 18 57 87Z" fill="#344a43"/>
            ${repeat(7,i=>`<path d="M${92+i*13} ${69-Math.sin(i/7*Math.PI)*14}q28 32 28 80" stroke="#87917a" stroke-width="2" fill="none"/>`)}
            <path d="M22 145q129 17 264-7" stroke="#d5bb85" stroke-width="4" fill="none"/>
            ${part('oar',42,109,paddle)}
            ${rower('#63828a','#50717d','#426c7e')}
            ${basket(215,139,48,23,repeat(4,i=>`<ellipse cx="${224+i*9}" cy="134" rx="8" ry="6" fill="#769452"/><circle cx="${224+i*9}" cy="133" r="1.7" fill="#cfcc81"/>`))}
            ${basket(178,151,43,20)}
            ${repeat(3,i=>part('fish-'+i,191+i*10,145,`<path d="M${184+i*10} 145q9-12 20-3l7-6-1 10-6-1q-10 9-20 0Z" fill="#e2e0c4" stroke="#708b82" stroke-width="1.5"/>`))}
        `)}
        ${part('canton',150,190,`
            <path d="M11 143Q147 155 294 125L271 171Q133 200 31 174Z" fill="#6b6750" stroke="#354d43" stroke-width="3"/>
            <path d="M15 150Q146 168 287 139l-4 11Q145 184 25 161Z" fill="#a64b35"/>
            <path d="M32 170q116 23 237-10" fill="none" stroke="#d9bb83" stroke-width="3"/>
            <path d="M76 143V75h152v62Z" fill="#d9c99f" stroke="#836e4d" stroke-width="3"/>
            <path d="M67 77l12-15h147l17 12Z" fill="#527667" stroke="#a9b28e" stroke-width="3"/>
            ${repeat(5,i=>`<rect x="${87+i*26}" y="86" width="20" height="34" fill="#46675e" stroke="#a9976a" stroke-width="2"/><path d="M${97+i*26} 87v32" stroke="#ddc995" stroke-width="2"/>`)}
            <path d="M76 129h151m-141 7h120M90 61V47h15v14" fill="#77674c" stroke="#a58a60" stroke-width="2"/>
            <path d="M107 59V41h44v18" fill="#ddc89a" stroke="#8e7c56" stroke-width="2"/>
            <path d="M112 47h33" stroke="#a64b35" stroke-width="3"/>
            ${part('canton-oar',42,109,paddle)}
            ${rower('#a18b61','#857a56','#6f845e')}
            <circle cx="211" cy="89" r="15" fill="#e8d4a2" stroke="#ad533d" stroke-width="5"/>
            <circle cx="211" cy="89" r="8" fill="#587568"/>
            <path d="M242 136v-31m-3 0h28m-4-4v32" fill="none" stroke="#dfc99b" stroke-width="3"/>
            ${basket(244,139,35,16)}
            ${txt(155,153,13,'#f3dcb0','珠 江')}
        `)}
    `);
    // Shadows need the cut edge, not every window, plank and woven basket line.
    sym('s2-boat-silhouette', 300, 190, `
        ${part('jiangnan',150,190,`
            <path d="M13 146Q140 165 291 137L263 175Q142 196 35 176Z M81 147V105q4-68 62-51q61 7 70 93Z M31 60q17-12 33 2l4 42H30Z M40 98h10l-3 41H35Z M56 98h9l8 39H62Z M215 139h48v23h-48Z" fill="#3b2a1e"/>
            <circle cx="48" cy="45" r="16" fill="#3b2a1e"/>
            ${part('oar',42,109,'<path d="M43 102L9 177" stroke="#3b2a1e" stroke-width="6"/><path d="M18 153L4 179l7 4 14-27Z" fill="#3b2a1e"/>')}
            ${repeat(3,i=>part('fish-'+i,191+i*10,145,`<ellipse cx="${194+i*10}" cy="143" rx="13" ry="5" fill="#3b2a1e"/>`))}
        `)}
        ${part('canton',150,190,`
            <path d="M11 143Q147 155 294 125L271 171Q133 200 31 174Z M76 143V75h152v62Z M67 77l12-15h147l17 12Z M107 59V41h44v18Z M90 61V47h15v14Z M31 60q17-12 33 2l4 42H30Z M40 98h10l-3 41H35Z M56 98h9l8 39H62Z" fill="#3b2a1e"/>
            <circle cx="48" cy="45" r="16" fill="#3b2a1e"/>
            ${part('canton-oar',40,111,'<path d="M40 107L9 176" stroke="#3b2a1e" stroke-width="6"/><path d="M16 157L4 180l8 3 13-24Z" fill="#3b2a1e"/>')}
        `)}
    `);
    sym('s2-wake', 260, 114, `
        <path d="M4 40q17 52 112 62M16 15q-15 52 65 72M256 40q-17 52-112 62M244 15q15 52-65 72" stroke="#e1dfba" stroke-width="3" fill="none" opacity=".55"/>
        <path d="M15 63q40 42 104 44m126-44q-40 42-104 44" stroke="#4b8578" stroke-width="3" fill="none"/>
    `);
    sym('s2-grandma', 113, 160, `
        ${person(54,6,{shirt:'#7f846d',pants:'#59685c',legs:52,hair:'#a9aa91',style:'bun',
            face:'round',eyes:'laugh',mouth:'warm',nose:'broad',mature:true,
            arms:[[-18,44,-26,73],[18,44,29,82]]})}
        <path d="M76 101q15-30 29 0" fill="none" stroke="#866d46" stroke-width="3"/>
        ${basket(72,105,39,27)}
        <path d="M77 102l6-19m3 19 11-22m-6 22 14-15" stroke="#6c854d" stroke-width="6"/>
    `);
    sym('s2-peddler', 163, 163, `
        ${person(80,2,{shirt:'#9b8060',pants:'#59665b',legs:54,skin:'#c79a75',face:'square',
            detail:'moustache',eyes:'narrow',brows:'angled',mouth:'open',dir:-1,
            arms:[[-18,44,-27,28],[18,44,29,59]]})}
        <path d="M8 40q70-23 145-8M15 39v77m133-84v78" stroke="#77633e" stroke-width="3" fill="none"/>
        ${basket(0,114,40,29)}${basket(123,109,39,29)}
        <path d="M66 12q9-29 25-1l9 5H57Z" fill="#c3a978" stroke="#8b7b54" stroke-width="2"/>
        <path d="M4 110l7-12 8 11 7-16 9 16m97-5 9-15 11 13" fill="#92a169"/>
    `);
    sym('s2-neighbor', 104, 167, `
        ${person(49,4,{shirt:'#ddd5b5',pants:'#777965',legs:57,style:'bob',
            face:'heart',brows:'lifted',eyes:'bright',nose:'button',mouth:'quiet',dir:-1,
            arms:[[-18,44,-29,87],[18,44,25,83]]})}
        <path d="M12 101q-1-18 16-15l6 14-2 35H8Z" fill="${red}"/>
        <path d="M14 97q9-20 14 0" fill="none" stroke="#d7996c" stroke-width="2"/>
        <path d="M32 157h14m6 0h17" stroke="#ddbe91" stroke-width="3"/>
    `);
    function duck(x, y, scale, pale){
        const feather = pale ? '#ece7d0' : '#baa177';
        const shade = pale ? '#c6ccb8' : '#8a7454';
        return `<g transform="translate(${x} ${y}) scale(${scale})">
            <path d="M5 33q-1-6-5-11l14 6q10-8 27-7q-3-13 5-17q9-5 17 2q6 6 2 13q3 8-3 15q-9 12-31 11Q10 45 5 33Z" fill="${feather}"/>
            <path d="M13 33q15 4 25-2q6-3 12-2q-4 10-17 12q-13 1-20-8Z" fill="${shade}"/>
            <path d="M16 30q14 0 22-3m-19 7q9 1 15-2" stroke="${pale?'#faf0d8':'#ddc292'}" fill="none" stroke-width="1.7" stroke-linecap="round"/>
            <path d="M64 11l14 3q2 2-1 4l-13 1Z" fill="#ca9150"/>
            <path d="M67 16h9" stroke="#9b653f" stroke-width="1.1"/>
            <circle cx="59" cy="10" r="2.1" fill="#443d31"/><circle cx="59.5" cy="9.3" r=".6" fill="#f9edd0"/>
            <path d="M9 41q21 10 48 0" stroke="#567f71" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>`;
    }
    sym('s2-ducks', 151, 63, duck(5,2,1,true) + duck(79,23,.82,false));
    sym('s2-duck-wake', 168, 51, `
        <path d="M19 15q31-9 61 0q-30 11-61 0Zm66 15q27-7 57 0q-28 9-57 0Z" fill="#527b6f" opacity=".52"/>
        <path d="M8 16q24 16 64 2m-62 10q16 5 38 1m42 2q24 12 64 0m-45 12q20 3 36-1" fill="none" stroke="#d8e0c6" stroke-width="2.2" stroke-linecap="round"/>
    `);

    sym('s2-counter', 301, 134, `
        <path d="M8 65h285v64H8Z" fill="#9a7852" stroke="#594b37" stroke-width="3"/>
        ${repeat(13,i=>`<path d="M${17+i*22} 69v56" stroke="#c5a471" stroke-width="3"/>`)}
        <path d="M0 59h301v12H0Z" fill="#d3b887" stroke="#69563b" stroke-width="3"/>
        ${part('board',90,55,'<ellipse cx="86" cy="52" rx="49" ry="12" fill="#765634"/><ellipse cx="86" cy="48" rx="49" ry="10" fill="#b38f5f"/><path d="M66 46l35 3m-30-7 21 10" stroke="#765634" stroke-width="2"/>')}
        ${basket(165,48,55,19,repeat(9,i=>`<circle cx="${173+(i%5)*9}" cy="${40+Math.floor(i/5)*8}" r="6" fill="${i%2?'#a94b37':'#c6794d'}"/><path d="M${173+(i%5)*9} ${35+Math.floor(i/5)*8}l4-6" stroke="#698049" stroke-width="2"/>`))}
        ${basket(228,49,61,19,'<path d="M235 45l8-26 5 27 11-28 4 28 17-19-8 22" stroke="#68834f" stroke-width="9" fill="none"/>')}
        <path d="M16 79h35v35H16Z" fill="#e1c997"/>
        ${txt(34,103,20,'#79583b','鲜')}
    `);
    sym('s2-counter-top', 316.05, 68, `
        <rect width="316.05" height="68" fill="#c2a773" stroke="#78613f" stroke-width="2"/>
        <path d="M4 19h308M4 43h308" stroke="#a18a60" stroke-width="2"/>
    `);
    sym('s2-counter-side', 68, 78.75, `
        <rect width="68" height="78.75" fill="#8b7550" stroke="#65583e" stroke-width="3"/>
        <path d="M3 7h62M16 11v63m18-63v63m18-63v63" stroke="#b79d6c" stroke-width="3"/>
    `);
    sym('s2-scale-stand', 112, 275, `
        <path d="M101 275V0H57v8" fill="none" stroke="#716449" stroke-width="7"/>
        <path d="M101 55L59 0" stroke="#a58d61" stroke-width="4"/>
        <path d="M88 274h23" stroke="#d1b382" stroke-width="6"/>
    `);
    sym('s2-chef', 145, 184, `
        ${person(66,8,{shirt:'#a9b79d',pants:'#53665a',legs:67,apron:true,cap:true,
            face:'oval',eyes:'soft',brows:'angled',mouth:'focus',look:.85,arms:[]})}
        <path d="M47 48q-7 2-9 9l-9 24q-2 6 0 11l5 12 10-4-6-14 12-25Z" fill="#8c9f8a"/>
        <path d="M34 100l10-4 4 5-11 5Z" fill="#718572"/>
        <path d="M37 103l9-3 4 8q2 5-2 7l-5-2-6-6Z" fill="#e7ba92"/>
        <path d="M44 106l3 5m-6-4 3 4" fill="none" stroke="#ae7458" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M81 48q7-3 13 5l18 23q6 9-1 13q-6 4-12-3L83 64q-8-8-2-16Z" fill="#a9b79d"/>
        <path d="M85 52q14 12 23 29" fill="none" stroke="#cdd4ba" stroke-width="1.7" stroke-linecap="round"/>
        ${part('knife-arm',106,81,`
            <path d="M107 74q8 0 8 7q0 5-6 8L89 99l-6-11 16-11q4-3 8-3Z" fill="#8fa48c"/>
            <path d="M109 78q-6-1-21 12" fill="none" stroke="#becaae" stroke-width="1.7" stroke-linecap="round"/>
            <path d="M89 85l6 11-6 4-7-11Z" fill="#758b76"/>
            <path d="M85 89l6 8-9 6-6-9Z" fill="#d9a780"/>
            <path d="M88 91l-17 8" stroke="#694f39" stroke-width="5.5" stroke-linecap="round"/>
            <path d="M75 97l-25 2 1 17q13 4 28-2Z" fill="#bcc9c1" stroke="#667d77" stroke-width="1.8"/>
            <path d="M54 114q12 2 22-2" fill="none" stroke="#eef1dc" stroke-width="1.6"/>
            <circle cx="55" cy="103" r="1.5" fill="#63756e"/>
            ${grip(82,94,62,'#e7ba92',.76)}
        `)}
    `);
    sym('s2-scale', 225, 170, `
        <path d="M114 0V36" stroke="#756449" stroke-width="4"/>
        <path d="M108 28q7-11 13 0l-7 9Z" fill="#a78d52"/>
        ${part('beam',114,36,`
            <path d="M18 36h191" stroke="#80673f" stroke-width="6"/>
            ${repeat(17,i=>`<path d="M${59+i*8} 33v7" stroke="#e0c98a" stroke-width="1.5"/>`)}
            ${part('weight',165,36,'<path d="M165 37v27" stroke="#9e8650" stroke-width="3"/><path d="M153 62h24l7 28h-37Z" fill="#9c8149" stroke="#615b3d" stroke-width="3"/>')}
            ${part('pan',44,37,'<path d="M44 38L10 118m34-80 36 80" stroke="#aa9c6a" stroke-width="2"/><path d="M2 116q41 34 84 0Z" fill="#b69e62" stroke="#7a724e" stroke-width="3"/><path d="M11 121q33 16 65 0" stroke="#e7d19a" stroke-width="3" fill="none"/>')}
            ${part('goose',43,108,'<path d="M18 113q8-21 31-11l17 5 8 9H18Z" fill="#a75832" stroke="#d29d5d" stroke-width="2"/><path d="M26 110l7 9m8-13 7 13m7-11 7 10" stroke="#e2b273" stroke-width="2"/>')}
        `)}
    `);
    sym('s2-kapok', 232, 334, `
        <path d="M106 334l12-175-28-84m28 95 58-73m-58 52-69-27m74-24 17-66" stroke="#777357" stroke-width="12" fill="none"/>
        ${repeat(26,i=>{
            const x=21+(i*57)%195, y=35+(i*43)%130;
            return `<path d="M${x} ${y}q-17-30-24-10q-4 12 19 13q-19 17-2 24q15 3 12-19q19 19 26 2q0-14-20-14q15-27-3-28q-12 2-8 25Z" fill="${i%3?'#b95e40':'#cf8150'}"/><circle cx="${x+2}" cy="${y+3}" r="4" fill="#d5b169"/>`;
        })}
    `);
});
