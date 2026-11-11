PB.Illustrations = (() => {
    const frame = body => `<svg viewBox="0 0 340 180" aria-hidden="true">
        <defs><pattern id="cloth-weave" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 1h7M1 0v7" stroke="#e6d4b5" stroke-width=".6" opacity=".35"/></pattern></defs>${body}</svg>`;

    function noodleBowl() {
        const noodles = Array.from({length: 14}, (_, index) => {
            const y = 65 + index * 3.7;
            return `<path d="M${102 + index % 3 * 4} ${y}q30 -19 63 0t65 -2" fill="none" stroke="${index % 2 ? '#d8a84d' : '#f4ca76'}" stroke-width="3.2"/>`;
        }).join('');
        return frame(`<ellipse cx="173" cy="151" rx="92" ry="9" fill="#8a6c4730"/>
            <path d="M77 82Q87 151 173 151T267 82" fill="#dfd6be" stroke="#544a37" stroke-width="2"/>
            <path d="M98 112q75 42 149 -1" fill="none" stroke="#668486" stroke-width="6"/>
            <ellipse cx="172" cy="84" rx="96" ry="44" fill="#f8ecd2" stroke="#534635" stroke-width="2"/>
            <ellipse cx="172" cy="86" rx="82" ry="33" fill="#d7b35c"/>
            <g id="noodle-threads">${noodles}</g>
            <ellipse id="sauce-coverage" cx="172" cy="86" rx="79" ry="30" fill="#85502a" opacity="0"/>
            <g fill="#59734b"><path d="M127 68l8 1-2 7-7-2zM194 99l9-2 2 7-9 1zM213 69l7 3-3 7-6-3zM155 100l7 3-3 7-7-2z"/></g>
            <g id="chopsticks" transform="rotate(0 172 84)" stroke="#6b3e22" stroke-width="5" stroke-linecap="round"><path d="M168 90L241 16M176 94L254 20"/></g>
            <text x="20" y="27" fill="#927958" font-size="11">晨 · 06:40</text>
            <text id="bowl-choice" x="270" y="154" fill="#8b4c34" font-size="12" text-anchor="end">芝麻香</text>`);
    }

    function boat() {
        return frame(`<path d="M0 103q50-20 100-2t100-1 140-7v87H0z" fill="#9faf9d" opacity=".5"/>
            <path d="M0 119q55-15 110 0t110 0 120-9M0 142q50-10 100 0t140-3 100 0M0 165q90-13 180-1t160-8" fill="none" stroke="#6b8b85" stroke-width="1.3"/>
            <path d="M14 102V60h42v42m-46-42 25-23 26 23M282 91V49h41v42m-45-42 24-22 25 22" fill="#dfd0b2" stroke="#73694c" stroke-width="1.5"/>
            <path d="M91 92V64Q132 26 170 64v28h-13V73q-26-30-53 0v19z" fill="#c2b49b" stroke="#807358"/>
            <g id="route-boat" transform="translate(10 0)"><path d="M28 111h81l-14 19H44z" fill="#775236" stroke="#4e3828" stroke-width="2"/>
            <path d="M48 106V80q23-14 46 0v26" fill="#a68b5b" stroke="#4e3828" stroke-width="1.5"/>
            <path d="M52 102V83m8 21V80m9 24V80m9 23V80m8 23V83" stroke="#d7bb7b"/>
            <path id="route-oar" d="M47 99l-25 45" stroke="#5f402c" stroke-width="5"/>
            <g id="cargo-basket"><path d="M84 107h19l-3-15H88z" fill="#c9a04e" stroke="#644b29"/><path d="M87 94q-8-16 3-12 4-18 8-1 11-8 2 13" fill="#597c48"/></g></g>
            <text x="15" y="26" font-size="11" fill="#796a51">阿婆的菜篮</text><text x="319" y="166" text-anchor="end" font-size="11" fill="#796a51">岸边有人等</text>`);
    }

    function tea() {
        return frame(`<path d="M0 137q170-20 340 0v43H0z" fill="#b18c59"/>
            <path d="M0 153h340M30 140l-10 40m120-43-3 43m100-43 6 43" stroke="#8f6c44" opacity=".5"/>
            <g id="tea-kettle" transform="rotate(0 122 84)"><path d="M66 73q-7 53 39 53h43q37-3 29-51z" fill="#9c5837" stroke="#593c2c" stroke-width="2"/>
            <path d="M76 83q-45-24-43 13t40 12M170 89l33-17 13-24-6-5-21 24-20 5" fill="none" stroke="#8a4d32" stroke-width="9"/>
            <ellipse cx="121" cy="73" rx="57" ry="16" fill="#b7744c" stroke="#67432d"/><path d="M97 68q23-21 47 0" fill="#a65f3d" stroke="#67432d"/><circle cx="120" cy="55" r="5" fill="#69452f"/></g>
            <path id="tea-stream" d="M215 62Q259 59 266 119" fill="none" stroke="#caa96a" stroke-width="3" opacity="0"/>
            <ellipse cx="268" cy="148" rx="44" ry="9" fill="#e0d5b7" stroke="#667568"/>
            <path d="M230 116q3 32 38 32t38-32" fill="#e9e0c7" stroke="#657469" stroke-width="2"/>
            <ellipse cx="268" cy="116" rx="38" ry="12" fill="#f7edd5" stroke="#657469"/>
            <ellipse id="tea-level" cx="268" cy="120" rx="29" ry="7" fill="#a47a32" opacity="0"/>
            <path d="M242 132q25 13 50 0" fill="none" stroke="#81988b" stroke-width="3"/>
            <g id="cup-steam" opacity="0" stroke="#f8f0d9" fill="none" stroke-width="2"><path d="M261 99q-10-12 2-24t0-20M274 95q12-11 0-21"/></g>
            <text x="18" y="27" fill="#927958" font-size="11">一盏茶的时间</text>`);
    }

    function cloth() {
        const stitches = Array.from({length: 23}, (_, index) => {
            const x = 79 + index * 8;
            const y = 94 + Math.sin(index * .38) * 13;
            return `<path data-stitch="${index}" d="M${x - 3} ${y - 5}l6 10" stroke="#e8cf8a" stroke-width="2" opacity="0"/>`;
        }).join('');
        return frame(`<path d="M54 48l55-22 26 22h70l24-20 57 19-18 105H72z" fill="#536f70" stroke="#394f50" stroke-width="2"/>
            <path d="M54 48l55-22 26 22h70l24-20 57 19-18 105H72z" fill="url(#cloth-weave)"/>
            <path id="cloth-patch" d="M68 78q100-8 205 0l-7 47q-98-15-190 0z" fill="#9c6b4d" stroke="#4c4339" stroke-width="1"/>
            <path d="M80 94q36 26 72 0t72 0 36 0" fill="none" stroke="#483b30" stroke-width="3" stroke-dasharray="4 3"/>
            <g id="cloth-stitches">${stitches}</g>
            <g id="cloth-needle" transform="translate(79 94)"><path d="M0 0l10-43" stroke="#e9e6d9" stroke-width="3"/><path d="M9-42q7-27 35-17" fill="none" stroke="#e8cf8a" stroke-width="1.5"/></g>
            <text x="18" y="20" fill="#927958" font-size="11">沿着破口，把布慢慢送过去。</text>`);
    }

    function home() {
        return frame(`<path d="M13 160h45v-27h47v-25h45V83h45V58h45V34h80" fill="none" stroke="#977e5c" stroke-width="11"/>
            <path d="M13 153h45v-27h47v-25h45V76h45V51h45V27h80" fill="none" stroke="#dbc6a1" stroke-width="2"/>
            <g id="home-windows">${[0, 1, 2, 3].map(i => `<rect data-window="${i}" x="${30 + i * 70}" y="${62 - i * 13}" width="28" height="35" fill="#756043" stroke="#59452c" stroke-width="3"/>`).join('')}</g>
            <g id="home-walker" transform="translate(42 117)"><circle cy="-13" r="8" fill="#c59a73" stroke="#64462e"/><path d="M-9-5h18l3 24H-12z" fill="#915448"/><path d="M-5 18l-2 15m11-15 4 15" stroke="#4f5044" stroke-width="6"/><path d="M12 3l12 7" stroke="#b78960" stroke-width="5"/><path d="M19 8h16v18H19z" fill="#bda26a" stroke="#745b3e"/></g>
            <text x="319" y="150" text-anchor="end" fill="#927958" font-size="11">有灯的地方，是家。</text>`);
    }

    function foreground(chapter) {
        const prefix = '<svg viewBox="0 0 700 210" preserveAspectRatio="xMidYMax meet">';
        if(chapter === 6) return prefix + `<path d="M0 210v-35h180v-30h165v-30h175v-30h180v125" fill="#998576" stroke="#c9b9a2" stroke-width="3"/><path d="M470 210l-11-81q43-14 88 0l-12 81" fill="#c6a86b" stroke="#765733" stroke-width="4"/><path d="M478 131q-4-67 23-67t29 67" fill="none" stroke="#b88752" stroke-width="8"/><path d="M481 161h42m-45 18h47m-43 19h40" stroke="#aa844f" stroke-width="3"/></svg>`;
        if(chapter === 2) return prefix + `<path d="M30 210l185-162q135-59 270 0l185 162" fill="#926443" stroke="#563b2a" stroke-width="5"/><path d="M70 210l158-148q120-46 244 0l159 148" fill="#b68b5d" stroke="#d4b383" stroke-width="2"/><path d="M232 65l-85 145M300 48l-30 162M400 48l30 162M468 65l85 145M106 163h487M153 118h394" stroke="#795334" stroke-width="3"/><g data-foreground-cargo><path d="M290 92h120l-8 79h-104z" fill="#ac8b47" stroke="#624d31" stroke-width="3"/><path d="M305 105q-33-54 3-37 15-66 33-11 31-47 34 7 36-27 27 43" fill="#607849" stroke="#436039" stroke-width="3"/></g></svg>`;
        if(chapter === 5) return prefix + `<ellipse cx="350" cy="225" rx="340" ry="130" fill="#96704b" stroke="#5e412d" stroke-width="5"/><ellipse cx="350" cy="141" rx="92" ry="40" fill="#594b3b" stroke="#c3a47c" stroke-width="8"/><ellipse cx="350" cy="132" rx="80" ry="30" fill="#a04c2b"/><path d="M352 105q-35 25 0 55" stroke="#ccb18a" stroke-width="5" fill="none"/><ellipse cx="160" cy="165" rx="39" ry="15" fill="#e5d7b7"/><ellipse cx="544" cy="165" rx="39" ry="15" fill="#e5d7b7"/><path d="M233 175l-30-60m35 60-27-60M470 175l28-60m-21 64 29-60" stroke="#422f24" stroke-width="4"/></svg>`;
        return prefix + `<path d="M0 210l42-94q308-45 616 0l42 94" fill="#a58056" stroke="#68492e" stroke-width="5"/><path d="M42 142h616M25 174h650M175 102l-29 108M350 95v115M525 102l29 108" stroke="#86603b" stroke-width="2"/><path d="M62 111l105-21 58 94-120 22z" fill="#e9d9b7" stroke="#b09a73"/><path d="M92 119l69-13m-58 29 69-13m-58 29 69-13m-58 29 69-13" stroke="#ab946c" stroke-width="2"/><ellipse cx="500" cy="144" rx="62" ry="18" fill="#e0d1b0" stroke="#6b7b6b" stroke-width="3"/><path d="M452 109q2 41 48 41t48-41" fill="#eee4cc" stroke="#6b7b6b" stroke-width="3"/><ellipse cx="500" cy="109" rx="48" ry="15" fill="#ba9859" stroke="#eee4cc" stroke-width="5"/></svg>`;
    }

    function update(container, state) {
        const get = selector => container.querySelector(selector);
        const progress = state.progress;
        if(state.chapter === 1) {
            get('#sauce-coverage').setAttribute('opacity', progress * .6);
            get('#sauce-coverage').setAttribute('fill', state.choice ? '#99452c' : '#85502a');
            get('#chopsticks').setAttribute('transform', `rotate(${progress * 1080} 172 84)`);
            get('#bowl-choice').textContent = CITY_BOOK.chapters[0].story.choices[state.choice];
        }
        if(state.chapter === 2) {
            get('#route-boat').setAttribute('transform', `translate(${10 + progress * 200} 0)`);
            get('#route-oar').style.transformOrigin = '47px 99px';
            get('#route-oar').style.transform = `rotate(${Math.sin(state.elapsed * 7) * state.velocity * 100}deg)`;
            get('#cargo-basket').setAttribute('opacity', state.phase === 'done' ? '0' : '1');
        }
        if(state.chapter === 3) {
            get('#tea-kettle').setAttribute('transform', `rotate(${state.angle * 24} 122 84)`);
            get('#tea-stream').setAttribute('opacity', state.angle > .18 ? state.angle : 0);
            get('#tea-level').setAttribute('opacity', progress);
            get('#tea-level').setAttribute('cy', 124 - progress * 8);
            get('#cup-steam').setAttribute('opacity', progress * .85);
        }
        if(state.chapter === 4) {
            get('#cloth-patch').setAttribute('fill', ['#53757b', '#9c6b4d'][state.choice]);
            container.querySelectorAll('[data-stitch]').forEach((node, index) => {
                node.setAttribute('opacity', index < progress * 23 ? '1' : '0');
            });
            const x = 79 + progress * 176;
            const y = 94 + Math.sin(progress * 22 * .38) * 13;
            get('#cloth-needle').setAttribute('transform', `translate(${x} ${y})`);
        }
        if(state.chapter === 5) {
            const step = Math.min(5, Math.floor(progress * 6));
            get('#home-walker').setAttribute('transform', `translate(${42 + progress * 240} ${117 - step * 23})`);
            container.querySelectorAll('[data-window]').forEach((node, index) => {
                node.setAttribute('fill', progress > (index + 1) / 6 ? '#e7b764' : '#756043');
            });
        }
    }

    return {build: chapter => [noodleBowl, boat, tea, cloth, home][chapter - 1](),
        foreground, update};
})();
