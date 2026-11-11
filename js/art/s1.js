// 朝暮百味：武汉的清晨与西北的夜，落在同一张纸上。
PB.ART.register('s1', function(){
    PB.ART.setPalette('wuhan');
    const {sym, rect, txt, roof, person} = PB.ART;
    const ink = '#3b302b';
    const paper = '#f5ecd8';
    const red = '#ac4936';
    const wood = '#79513b';
    const gold = '#d9a249';
    const part = (name, x, y, body, extra = '') =>
        '<g data-part="' + name + '" style="transform-origin:' +
        x + 'px ' + y + 'px" ' + extra + '>' + body + '</g>';
    const path = (d, fill, extra = '') =>
        '<path d="' + d + '" fill="' + fill + '" ' + extra + '/>';
    const line = (d, color = ink, width = 3) =>
        path(d, 'none', 'stroke="' + color + '" stroke-width="' +
            width + '" stroke-linecap="round" stroke-linejoin="round"');
    const ellipse = (x, y, rx, ry, fill, extra = '') =>
        '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx +
        '" ry="' + ry + '" fill="' + fill + '" ' + extra + '/>';
    const label = (x, y, size, text, color = ink, extra = '') =>
        txt(x, y, size, color, text, extra);
    const windows = (x, y, columns, rows, color) => {
        let result = '';
        for(let row = 0; row < rows; row++){
            for(let column = 0; column < columns; column++){
                result += rect(x + column*26, y + row*32, 12, 19, color);
            }
        }
        return result;
    };
    const sesame = (cx, cy, count, radius) => Array.from(
        {length: count}, (_, i) => {
            const angle = i*2.399;
            const distance = radius*Math.sqrt((i + 0.5)/count);
            return ellipse(cx + Math.cos(angle)*distance,
                cy + Math.sin(angle)*distance*0.65, 2, 1, paper);
        }
    ).join('');

    sym('s1-textures', 1, 1,
        '<defs>' +
        '<pattern id="s1-stone" width="148" height="94" patternUnits="userSpaceOnUse">' +
        '<path d="M0 0H148V94H0Z M74 0V47 M0 47H148 M32 47V94" fill="none" stroke="#748481" stroke-width="2" opacity=".17"/>' +
        '<path d="M10 8H62 M85 54H133" stroke="#fffaf0" opacity=".5"/></pattern>' +
        '<pattern id="s1-brick" width="116" height="70" patternUnits="userSpaceOnUse">' +
        '<path d="M0 0H116V70H0Z M58 0V35 M0 35H116 M24 35V70" fill="none" stroke="#91674a" stroke-width="2" opacity=".18"/></pattern>' +
        '<linearGradient id="s1-dawn" x2="0" y2="1"><stop stop-color="#bfced0"/><stop offset="1" stop-color="#f0e8d4"/></linearGradient>' +
        '<linearGradient id="s1-night" x2="0" y2="1"><stop stop-color="#303b55"/><stop offset="1" stop-color="#73738a"/></linearGradient>' +
        '<radialGradient id="s1-ember"><stop stop-color="#f0b95d" stop-opacity=".62"/><stop offset="1" stop-color="#e5a867" stop-opacity="0"/></radialGradient>' +
        '</defs>'
    );
    sym('s1-print-left', 800, 1000,
        rect(0, 0, 800, 1000, '#e7e5d9') +
        rect(22, 20, 756, 960, 'url(#s1-stone)') +
        rect(40, 40, 720, 920, 'none', 'stroke="#aab1a4" stroke-width="2"') +
        path('M56 170H720V320H56Z', '#c1cfd0', 'opacity=".35"') +
        line('M72 230Q210 205 340 235T710 230 M110 265H295 M450 275H675', '#94acae', 3) +
        rect(64, 430, 185, 350, 'url(#s1-brick)') +
        label(230, 870, 57, '朝暮百味') +
        label(230, 922, 23, '一碗过早，唤醒一座城。', '#66726b') +
        rect(451, 824, 74, 74, 'none', 'stroke="' + red + '" stroke-width="4" rx="4"') +
        label(488, 855, 24, '烟火', red) + label(488, 883, 23, '壹', red) +
        label(110, 968, 16, '市井百味志', '#7c7f6e')
    );
    sym('s1-print-right', 800, 1000,
        rect(0, 0, 800, 1000, '#e7d8b9') +
        rect(22, 20, 756, 960, 'url(#s1-brick)') +
        rect(40, 40, 720, 920, 'none', 'stroke="#bda888" stroke-width="2"') +
        ellipse(375, 530, 345, 325, 'url(#s1-ember)') +
        label(525, 881, 42, '长夜有炭火') +
        label(525, 924, 23, '三两好友，坐到月亮打烊。', '#88765e') +
        label(698, 968, 16, '壹 · 味', '#88765e')
    );

    let dawn = path('M0 330V94Q45 78 98 93Q140 7 227 46Q300 12 378 58Q500 19 680 80V330Z', 'url(#s1-dawn)');
    dawn += ellipse(160, 102, 47, 47, '#f7e6bb');
    dawn += path('M0 271Q80 210 145 248Q240 185 322 239Q410 205 500 250L680 235V330H0Z', '#98afb0');
    dawn += line('M262 240L280 118L298 240 M274 162H286 M280 118V64', '#798f94', 5);
    dawn += ellipse(280, 141, 22, 6, '#81979b');
    dawn += rect(30, 246, 120, 84, '#b89c82') + windows(43, 262, 4, 2, '#748b90');
    dawn += rect(420, 217, 183, 113, '#b9b1a0') + windows(434, 239, 6, 3, '#728991');
    dawn += path('M408 218L511 183L615 218Z', '#829698');
    dawn += path('M0 308Q160 281 335 307T680 303V330H0Z', '#cbd8cf');
    dawn += label(392, 120, 26, '江城 · 晨六时', '#61777e');
    sym('s1-dawn-backdrop', 680, 330, dawn);

    let night = path('M0 350V82Q98 50 186 67Q250 10 322 35Q400 8 457 40Q566 29 680 99V350Z', 'url(#s1-night)');
    night += path('M529 64A36 36 0 1 0 567 108A31 31 0 0 1 529 64Z', '#f4db9c');
    for(let i = 0; i < 30; i++){
        const x = 32 + (i*83)%610;
        const y = 84 + (i*37)%115;
        night += ellipse(x, y, i%5 ? 1.5 : 2.4, i%5 ? 1.5 : 2.4, '#eee0b3');
    }
    night += path('M0 287Q93 173 218 251Q370 167 510 252Q600 209 680 244V350H0Z', '#9b897d');
    night += path('M0 321Q130 233 299 290Q490 225 680 299V350H0Z', '#b39b7c');
    night += rect(405, 232, 193, 118, '#7f7778') + rect(392, 221, 220, 18, '#c3ab88');
    for(let i = 0; i < 4; i++){
        night += path('M' + (422 + i*43) + ' 315V275Q' +
            (434 + i*43) + ' 252 ' + (446 + i*43) + ' 275V315Z', '#d5b883');
    }
    night += label(233, 132, 26, '西北 · 夜九时', '#e6d9bf');
    sym('s1-night-backdrop', 680, 350, night);

    const repeat = (count, draw) => Array.from({length: count}, (_, i) => draw(i)).join('');
    function streetWindow(x, y, w, h, warm = false){
        return rect(x-5,y-6,w+10,h+12,warm?'#b59266':'#c6c1a9') +
            rect(x,y,w,h,warm?'#bc9861':'#637b79') +
            line(`M${x+w/2} ${y}v${h}M${x} ${y+h*.48}h${w}`,
                warm?'#705b46':'#ded5b9',3) +
            rect(x-9,y+h+5,w+18,7,warm?'#d3b58a':'#dfd8bd');
    }
    sym('s1-hankou-row', 660, 438,
        path('M4 438V66H143V24H305V42H475V92H654V438Z','#b8bba8') +
        rect(147,48,155,390,'#ddd3b9') + rect(310,67,162,371,'#c8c9b4') +
        rect(480,113,169,325,'#b4beb0') +
        repeat(4,i => {
            const x=17+i*162;
            return rect(x,102,142,9,'#e9ddbf') +
                repeat(2,j=>streetWindow(x+16+j*63,128,39,67)) +
                repeat(2,j=>streetWindow(x+16+j*63,238,39,65)) +
                path(`M${x+15} 438V359q51-49 102 0v79Z`,'#536961') +
                line(`M${x+9} 326h123M${x+5} 116v316m128-316v316`,'#e5d8b7',7);
        }) +
        roof(0,149,66,22,'#81918a','#596f69') +
        path('M144 48V25h39V12h88v13h36v23Z','#e4d9bd',
            'stroke="#9da28c" stroke-width="3"') +
        rect(310,46,166,15,'#e3dbc0') + roof(475,660,111,22,'#7a8b81','#617870') +
        repeat(27,i=>line(`M${12+i*24} 216v13m-5-1h11`,'#829387',2)) +
        rect(5,312,650,13,'#e2d6b9') +
        label(229,82,16,'汉 口 里','#7a806b') +
        repeat(45,i=>line(`M${12+(i*73)%634} ${335+(i*27)%96}h12`,'#a3ab95',1))
    );
    sym('s1-northwest-row', 620, 427,
        path('M5 427V68H201V20H405V81H615V427Z','#b59a78') +
        rect(207,64,192,363,'#c5aa83') +
        path('M200 64V28h48V7h110v21h48v36Z','#cfb68d',
            'stroke="#8e7b65" stroke-width="3"') +
        repeat(3,i=>{
            const x=13+i*202;
            return rect(x,72,189,14,'#ddc394') +
                repeat(3,j=>streetWindow(x+19+j*57,122,32,61,true)) +
                repeat(3,j=>streetWindow(x+19+j*57,233,32,53,true)) +
                repeat(3,j=>path(`M${x+16+j*57} 427V345q20-43 40 0v82Z`,
                    '#655b52','stroke="#d7bd93" stroke-width="5"')) +
                line(`M${x+3} 94v333m183-333v333`,'#d7bd98',8);
        }) +
        line('M5 205h610m-610 109h610','#e0c297',9) +
        repeat(38,i=>rect(12+i*16,93,9,8,'#816f5c')) +
        repeat(36,i=>line(`M${15+i*16} 302v9`,'#7d7361',3)) +
        label(304,56,20,'长 乐 巷','#7b614b') +
        repeat(38,i=>line(`M${20+(i*73)%584} ${332+(i*29)%86}h16`,'#998366',1))
    );

    let clock = rect(19, 151, 108, 209, '#d0c4a8');
    clock += rect(9, 337, 128, 23, '#a49377') + rect(10, 146, 125, 16, '#b5a589');
    clock += rect(34, 54, 78, 96, '#e3d8b9') + rect(27, 46, 92, 12, '#918c78');
    clock += path('M31 46L45 22H100L115 46Z', '#5e7777');
    clock += path('M53 22V15Q73 -3 93 15V22Z', '#718884') + line('M73 12V1', '#667b75', 3);
    clock += windows(38, 180, 3, 4, '#6d8588');
    clock += ellipse(73, 98, 28, 28, '#f8efda', 'stroke="#857d66" stroke-width="4"');
    for(let i = 0; i < 12; i++){
        const a = i*Math.PI/6;
        clock += line('M' + (73 + Math.sin(a)*21) + ' ' +
            (98 - Math.cos(a)*21) + 'L' + (73 + Math.sin(a)*24) +
            ' ' + (98 - Math.cos(a)*24), '#827863', 2);
    }
    clock += part('hands', 73, 98, line('M73 79V98L87 106', '#4c5857', 3));
    clock += label(73, 330, 17, '江汉关', '#655e4f');
    sym('s1-clock', 146, 360, clock);
    sym('s1-ferry', 186, 69,
        path('M4 45H182L161 64H28Z', '#597f85') + rect(35, 23, 119, 24, paper) +
        rect(60, 6, 70, 17, '#d0bd96') + rect(92, 0, 12, 7, red) +
        windows(45, 29, 4, 1, '#527782') + line('M8 67H180', '#ced8cc', 3)
    );

    let arch = rect(44, 141, 35, 299, wood) + rect(561, 141, 35, 299, wood);
    arch += rect(31, 412, 60, 28, '#c4b596') + rect(549, 412, 60, 28, '#c4b596');
    arch += rect(60, 89, 520, 90, '#ad8050') + rect(80, 107, 480, 58, '#654638');
    arch += roof(17, 623, 89, 49, '#536762', '#394d4a');
    arch += rect(187, 99, 266, 77, '#e3c385', 'stroke="' + wood + '" stroke-width="5"') +
        label(320, 150, 46, '人间百味', ink, 'letter-spacing="9"');
    arch += line('M79 178Q90 216 124 222 M561 178Q550 216 516 222', '#b08b59', 12);
    arch += label(61, 248, 22, '晨', paper) + label(61, 283, 22, '起', paper) +
        label(61, 318, 22, '有', paper) + label(61, 353, 22, '味', paper);
    arch += label(578, 248, 22, '夜', paper) + label(578, 283, 22, '归', paper) +
        label(578, 318, 22, '有', paper) + label(578, 353, 22, '香', paper);
    arch += line('M101 183V269', '#bca16d', 5) + ellipse(101, 291, 20, 25, '#c5a36b');
    arch += line('M89 278L113 305 M86 288L108 309 M94 269L116 294', '#96774d', 2);
    arch += line('M536 189V263 M526 195V262', '#bca16d', 4);
    arch += ellipse(532, 289, 23, 22, '#b48a45') + path('M550 283L573 265L564 294H548Z', '#b48a45');
    sym('s1-arch', 640, 440, arch);
    sym('s1-lantern', 80, 180, part('lantern', 40, 4,
        line('M40 3V41', wood, 3) + rect(25, 40, 30, 9, gold) +
        ellipse(40, 85, 32, 40, red) +
        line('M40 48V124 M26 49Q11 85 26 122 M54 49Q69 85 54 122', '#d7794b', 2) +
        rect(25, 121, 30, 8, gold) + line('M40 131V171 M34 133V164 M46 133V164', '#b45b36', 3) +
        label(40, 96, 29, '福', '#eed39d')
    ));

    sym('s1-shop', 390, 330,
        rect(22, 61, 345, 269, '#bd9870') +
        rect(42, 105, 305, 225, '#604e3d') +
        rect(64, 154, 130, 176, '#ad9c72') +
        line('M82 158V326 M105 158V326 M128 158V326 M151 158V326 M174 158V326', '#77674d', 4) +
        roof(0, 390, 62, 33, '#586b68', '#3f5351') +
        rect(66, 61, 258, 56, '#eee0b6', 'stroke="' + wood + '" stroke-width="5"') +
        label(195, 101, 31, '老通城 · 过早') +
        rect(264, 132, 60, 139, '#e6d9ba') +
        label(294, 160, 20, '热干面') + label(294, 194, 20, '三鲜豆皮') +
        label(294, 228, 20, '蛋酒') + line('M279 242H309', '#bda783', 2)
    );
    let counter = rect(6, 79, 378, 106, '#9d694a');
    counter += rect(18, 92, 354, 80, '#c29a67') + line('M130 96V171 M252 96V171', '#a17c53', 3);
    counter += rect(0, 67, 390, 18, '#dfc394') + rect(11, 80, 369, 5, '#704d39');
    counter += ellipse(112, 58, 91, 27, '#383b36') + ellipse(112, 54, 79, 22, '#dca642');
    counter += line('M55 47L161 67 M77 37L184 56 M67 66L128 37 M104 75L165 44', '#a87929', 2);
    counter += sesame(111, 55, 18, 68);
    counter += path('M223 17L228 70Q260 89 292 70L298 17Z', '#9b7951') +
        ellipse(260, 18, 38, 12, '#e1c38c') + ellipse(260, 19, 30, 8, '#b0bcb0') +
        line('M231 33H292 M231 60H291 M241 26V70 M276 25V72', '#674f3b', 3);
    counter += ellipse(339, 56, 24, 12, '#61422e') + ellipse(339, 50, 24, 8, '#855133') +
        rect(308, 18, 24, 27, '#9b4937', 'rx="5"') + rect(307, 16, 26, 7, '#c6b68c');
    counter += label(198, 143, 28, '一口热乎 · 一城清晨', '#f5e5b8');
    sym('s1-counter', 390, 185, counter);
    sym('s1-shop-side', 115, 330,
        rect(0,62,115,268,'#9c896a') + rect(0,62,115,33,'#677c70') +
        streetWindow(30,142,51,82) +
        repeat(16,i=>line(`M${7+i%4*28} ${260+Math.floor(i/4)*17}h23`,'#b4a88b',2))
    );
    sym('s1-counter-side', 86, 185,
        rect(0,70,86,115,'#8b6148') + rect(0,67,86,16,'#c5aa7d') +
        line('M8 94H78 M8 155H78 M21 89V179 M65 89V179','#a98259',3)
    );
    sym('s1-counter-top', 390, 86,
        rect(0,0,390,86,'#c7ac7d') + line('M8 28H382 M8 58H382','#a98c60',2)
    );

    let chef = person(84, 42, {
        shirt: '#738c87', pants: '#454b45',
        apron:true, cap:'tall', face:'round', eyes:'soft', nose:'broad', mouth:'warm',
        look:.15, legs:93, arms:[]
    });
    chef += part('noodle-arm', 66, 85,
        line('M65 86L36 119L8 98', '#738c87', 14) + ellipse(8, 98, 7, 7, '#dfb08b') +
        part('basket', 12, 97,
            line('M10 96L-10 141', '#b29156', 6) +
            path('M-36 139Q-14 120 11 139L3 167Q-13 179 -30 166Z', '#bd9354') +
            line('M-31 145L7 145 M-30 154H4 M-23 137L-20 170 M-10 134L-9 170 M1 137L-1 168', '#846039', 2) +
            line('M-28 135Q-21 124 -15 137Q-8 124 0 138', '#efd28a', 3)
        )
    );
    chef += part('spoon-arm', 101, 85,
        line('M103 86L125 116L153 105', '#738c87', 13) + ellipse(152, 105, 7, 7, '#dfb08b') +
        line('M153 103L175 121', '#b28b54', 5) + ellipse(177, 122, 12, 7, '#88613e')
    );
    chef += part('sauce', 176, 126,
        path('M177 128Q190 152 181 181', 'none',
            'stroke="#865236" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1"'),
        'opacity="0"');
    sym('s1-chef', 196, 245, chef);

    const steam = (x, offset) => part('wisp-' + offset, x, 138,
        path('M' + x + ' 142Q' + (x - 30) + ' 118 ' + (x - 8) +
            ' 92T' + (x + 3) + ' 41Q' + (x - 9) + ' 21 ' + (x + 9) +
            ' 6Q' + (x - 22) + ' 53 ' + (x + 8) + ' 74T' + (x + 5) + ' 126Z', '#fcf5df'),
        'class="steam-wisp wisp-' + offset + '"');
    sym('s1-steam', 260, 160, steam(67, 0) + steam(124, 1) + steam(188, 2));

    let grill = rect(22, 137, 14, 63, '#554a3c') + rect(344, 137, 14, 63, '#554a3c');
    grill += path('M0 79H380L362 150H18Z', '#4f5350') + rect(16, 87, 347, 35, '#a44c32');
    grill += part('embers', 190, 112,
        Array.from({length: 16}, (_, i) =>
            ellipse(28 + i*21, 111 - i%3*5, 9, 6, i%2 ? '#ec9f42' : '#d86432')
        ).join(''), 'class="ember-glow"');
    grill += part('flames', 190, 110,
        Array.from({length: 8}, (_, i) => {
            const x = 29 + i*43;
            return path('M' + (x - 13) + ' 108Q' + (x - 18) + ' 88 ' +
                x + ' ' + (42 + i%3*11) + 'Q' + (x - 1) + ' 77 ' +
                (x + 11) + ' 80Q' + (x + 28) + ' 97 ' + (x + 13) + ' 108Z',
                i%2 ? '#edbd58' : '#e58b38');
        }).join('')
    );
    grill += line('M8 81H375 M21 132H360', '#292f2d', 6);
    for(let i = 0; i < 10; i++){
        const x = 25 + i*34;
        grill += line('M' + x + ' 68L' + (x + 8) + ' 97', '#674638', 3) +
            ellipse(x + 2, 76, 7, 4, '#ae6340') + ellipse(x + 5, 86, 7, 4, '#c27e43');
    }
    grill += label(191, 146, 19, '炭火慢烤 · 红柳大串', '#e6c58d');
    sym('s1-grill', 380, 200, grill);
    let cook = person(82, 44, {
        shirt: '#b4704d', pants: '#50534b', apron: true,
        cap:'flat', face:'square', eyes:'narrow', nose:'long', brows:'straight',
        detail:'moustache', mouth:'wry', skin:'#d4a17b', arms:[], legs:101
    });
    cook += line('M64 89L39 111L16 85', '#b4704d', 14) + ellipse(16, 85, 7, 7, '#dfb08b');
    for(let i = 0; i < 4; i++){
        cook += line('M16 87L' + (3 + i*12) + ' 28', '#815233', 3) +
            ellipse(8 + i*9, 51, 6, 10, '#ae6040');
    }
    cook += part('fan', 99, 86,
        line('M101 87L130 117L162 106', '#b4704d', 14) + ellipse(159, 105, 7, 7, '#dfb08b') +
        line('M160 106L175 78', '#93723d', 5) +
        path('M173 82Q137 69 147 38Q160 14 188 26Q224 44 204 68Q194 81 173 82Z',
            '#d7bd7a', 'stroke="#a78c52" stroke-width="2"') +
        line('M173 77L157 41 M176 76L175 32 M179 76L195 41 M181 77L207 54', '#b09252', 2)
    );
    sym('s1-cook', 220, 250, cook);
    sym('s1-smoke', 300, 180, part('smoke', 150, 177,
        path('M30 180Q-3 128 56 110T73 51Q65 17 104 1Q78 47 113 76T79 140Q55 153 73 180Z',
            '#e5dac9', 'opacity=".38"') +
        path('M167 180Q118 147 168 114T181 51Q207 63 207 88T198 133Q171 151 211 180Z',
            '#f7e7c7', 'opacity=".45"')
    ));
    let rack = line('M15 260V9H123V260 M12 19H128 M23 231H113', wood, 9);
    rack += line('M42 19V51', wood, 2) +
        path('M41 47Q56 50 58 69L50 110Q41 131 29 116L22 89Q23 64 41 47Z', '#a66043') +
        ellipse(43, 56, 7, 10, '#e4c5a0');
    [143, 195].forEach(y => {
        rack += ellipse(79, y, 36, 28, '#d4a24e', 'stroke="#a87a3d" stroke-width="3"') +
            ellipse(79, y, 22, 16, '#c28e3d') + sesame(79, y, 18, 30);
    });
    sym('s1-rack', 140, 260, rack);
    sym('s1-night-sign', 340, 96,
        rect(1, 13, 338, 76, '#624b3e', 'rx="4" stroke="#cfad72" stroke-width="3"') +
        label(170, 48, 30, '老马家 · 红柳烤肉', '#f1dab0') +
        label(170, 75, 18, '炭火不熄，慢慢坐。', '#d5b786')
    );
    sym('s1-night-stall', 420, 338,
        rect(18,45,13,293,wood) + rect(389,45,13,293,wood) +
        rect(0,28,420,25,'#866145') + rect(10,53,400,59,'#b99561') +
        path('M0 28L22 4h376l22 24Z','#677565') +
        repeat(25,i=>line(`M${12+i*16} 9l-3 17`,'#9ba58a',2)) +
        line('M31 112q0 30 32 34M389 112q0 30-32 34','#a98053',8) +
        rect(9,324,31,14,'#b6a07b') + rect(380,324,31,14,'#b6a07b')
    );
    sym('s1-night-awning', 420, 77,
        rect(0,0,420,77,'#7e8b72') +
        repeat(25,i=>line(`M${i*17} 0v77`,'#b1b497',2)) +
        line('M0 76h420','#c7b48a',5)
    );
    sym('s1-grill-side', 80, 200,
        rect(0,80,80,64,'#50584c') + rect(4,143,10,57,'#645541') +
        rect(66,143,10,57,'#645541') +
        line('M0 82h80M7 101h65m-65 17h65','#a08b62',3)
    );
    sym('s1-grill-top', 380, 80,
        rect(0,0,380,80,'#4e5146') + rect(8,7,364,65,'#754c34') +
        repeat(25,i=>line(`M${10+i*15} 0v80`,'#a39064',3)) +
        line('M0 0h380m-380 79h380','#5e5b48',4)
    );

    let girl = line('M34 145L25 225 M85 145L96 225 M33 191H91', '#804b3c', 7) +
        path('M23 139Q52 132 92 138L98 147Q60 153 22 149Z', red) +
        line('M27 140Q62 135 90 140', '#d29468', 2);
    girl += path('M47 112Q56 106 66 116L100 138Q109 145 105 155L93 211L79 211L84 153L51 140Q44 131 47 112Z','#39474a') +
        PB.ART.shoe(85,213) +
        path('M52 111Q63 107 73 115L113 139Q119 145 118 155L114 214L100 214L100 157Q80 148 58 139Q49 130 52 111Z','#526265') +
        line('M65 129L108 150L106 204 M101 208L114 208','#b0b2a0',1.8) + PB.ART.shoe(106,216);
    girl += person(61, 26, {
        shirt:'#a65e4c', legs:0, hair:'#42352e', style:'tied', face:'heart',
        eyes:'bright', nose:'button', mouth:'warm', look:.9, detail:'earring',
        arms: [[-17,43,-10,80,-24,69],[16,43,34,52,28,67]]
    });
    girl += path('M45 94Q69 90 92 94Q91 111 78 117H60Q49 110 45 94Z', '#ecddbd') +
        ellipse(69, 94, 24, 6.6, '#c18b55', 'stroke="#fff0cc" stroke-width="2"') +
        line('M52 102Q69 112 86 103 M54 92q8 6 13 0t13 0m-22 4q7-4 14 0t12-1', '#e8be75', 2) +
        line('M52 106q17 10 34 0m-23 7 10 1','#5d7b72',1.55) +
        line('M69 94L94 64 M77 94L98 65', '#624332', 1.9) +
        path('M90 76q4-4 8-2l3 6-5 5-5-3Z','#e7ba92') +
        line('M94 77l4 2m-5 1 4 2','#ae6f54',1) +
        path('M48 104q7-2 10 4l-2 5-8-2-4-4Z','#e7ba92') +
        line('M49 107l5 2','#ae6f54',1);
    sym('s1-girl', 140, 230, girl);
    sym('s1-cat', 127, 92,
        part('tail', 83, 77,
            path('M79 71Q105 84 104 59Q102 34 113 30Q121 28 120 35Q113 43 115 62Q116 89 93 89Q84 87 76 82Z','#ba814c') +
            line('M105 57l9-1m-10 10 10 2m-13 9 8 4m1-40 7 3','#8f5d3c',2.5)) +
        path('M45 40q18-9 31 8q6 7 7 17q15 7 11 17q-3 7-17 7H44q-9-1-10-7l2-20Z','#ce9456') +
        path('M67 52q3 12-2 18q18-5 24 7q3 7-6 11H61q-6-8 1-18Z','#b67b49') +
        path('M38 51q9 6 18 3q1 11-3 23l-1 8h-9l-1-13-7-10Z','#efd0a0') +
        path('M45 72l-1 12q-2 7 6 7h12q4-4-1-7l-5-1 5-19Z','#d69a5e') +
        path('M44 83q6 2 11 0q6 1 6 6q0 3-6 3H44q-5-3 0-9Z','#edcc9a') +
        path('M31 82q7-3 12 3q3 4-1 6H30q-6-4 1-9Z','#edd1a3') +
        line('M75 62q4 4 6 11m-16-27q7 5 8 10m-7 28h14','#a36b44',2.4) +
        path('M22 30q-2-11 4-22q9 3 15 12q9-2 14 1q6-9 15-10q5 12 1 24q3 13-5 19q-9 7-22 6q-15-1-21-11q-5-8-1-19Z','#df9d5d') +
        path('M27 13q6 2 9 8l-10 4Zm40 3q4 7 1 12l-8-5Z','#b7765b') +
        path('M23 44q8-5 17-2q6-3 13 0q6 1 11 6q-9 12-23 11q-12-2-18-15Z','#f4d3a0') +
        line('M39 22l2 8m5-9 1 7m6-7-1 8 M22 32l7 3m40-3-6 4','#a96d43',2) +
        path('M26 37q6-5 12 1q-5 5-11 1Z M51 37q6-5 12-1q-4 6-11 3Z','#554235') +
        ellipse(33,37.5,1.7,2.2,'#adab66') + ellipse(57,37,1.7,2.3,'#adab66') +
        path('M39 44q5-2 10 0l-5 4Z','#93594a') +
        line('M44 48v2m0 0q-3 3-7 1m7-1q4 4 7 0m-22-4-12-2m14 5-13 3m43-8 11-2m-11 6 12 2','#87654a',1.2)
    );
    const stool = x => line(`M${x-14} 128l-6 48m34-48 6 48m-36-13h32`,'#70513b',6) +
        ellipse(x,125,23,7,'#a37a51','stroke="#78583e" stroke-width="2"');
    let friends = stool(43) + stool(244) +
        path('M34 109Q46 107 50 115L47 137L41 171L30 170L32 134L29 121Z','#354749') +
        PB.ART.shoe(35,172) +
        path('M43 110Q54 106 60 113L76 124Q81 130 77 139L67 173L56 171L63 137L44 129Z','#53635e') +
        line('M52 116l19 14-9 36','#829087',1.3) + PB.ART.shoe(62,174) +
        path('M249 110Q261 109 264 119l-1 15 9 36-11 2-12-36-8-12Z','#3d4143') +
        PB.ART.shoe(267,173,-1) +
        path('M244 109Q255 110 251 124l-15 11-7 38-12-1 5-41q1-10 13-19Z','#565950') +
        line('M242 119l-13 15-6 32','#8b8c7d',1.3) + PB.ART.shoe(222,174,-1);
    friends += person(43,22,{
        shirt:'#63847a',legs:0,style:'waves',face:'long',brows:'lifted',eyes:'laugh',mouth:'open',look:.7,
        arms:[[-16,44,7,96,-12,81],[17,44,46,70,30,68]]
    }) + person(245,22,{
        shirt:'#ac7853',legs:0,dir:-1,style:'crop',skin:'#dbad89',
        face:'square',brows:'straight',eyes:'soft',nose:'broad',mouth:'wry',look:.95,
        arms:[[-17,44,-46,72,-30,70],[17,44,0,96,17,80]]
    });
    friends += line('M98 122l-4 54m99-54 4 54','#73503a',8) +
        path('M80 112Q143 102 210 112L204 123Q145 130 85 123Z','#895b3f') +
        ellipse(145,111,65,10,'#b98353','stroke="#d4a771" stroke-width="1.7"') +
        ellipse(146,109,32,7,'#eeddb5') +
        line('M123 110l43-5m-38 8 42-7','#73513a',1.8) +
        line('M134 109l22-3m-18 6 23-4','#af6845',4);
    friends += path('M109 104l2-28h4v-11h6v11h4l2 28q-9 5-18 0Z','#58714a') +
        rect(111,86,14,11,'#e5ca8e') + line('M114 87v9','#879253',1) +
        path('M84 86h13l-2 12H86Z','#dcc58c','stroke="#f2ddad" stroke-width="1.6"') +
        ellipse(90.5,86,6.5,2.4,'#efd4a2') + PB.ART.grip(86,93,-14,'#e7ba92',.68) +
        line('M203 90l-32 14m34-12-32 13','#80553a',1.8) +
        PB.ART.grip(201,94,51,'#dbad89',.69);
    sym('s1-friends', 290, 182, friends);
    sym('s1-spices', 108, 82,
        rect(5, 29, 42, 53, '#b17b4c', 'rx="7"') + rect(3, 25, 46, 10, '#72563f') +
        rect(11, 44, 30, 27, '#eee0b6') + label(26, 63, 15, '孜然') +
        rect(60, 18, 37, 64, '#a9513a', 'rx="5"') + rect(58, 13, 42, 10, '#765138') +
        rect(65, 37, 27, 30, '#eee0b6') + label(79, 58, 15, '辣子')
    );
});
