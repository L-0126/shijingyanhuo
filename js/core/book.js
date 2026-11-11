/* 立体书场景树和纸件系统 */
PB.Book=(function(){
    const PW=800, PH=1000;
    const BOARD=10, T=36;
    const OVER=16;
    const AXIS=T+4;
    const CLOSED_TILT = 0;
    const OPEN_TILT = 66;
    const CLOSED_DISTANCE = 2600;
    const OPEN_DISTANCE = 2000;
    const CAMERA_START_ANGLE = 35;
    const CAMERA_CENTER_Y = 0.46;
    const CLOSED_FRAME_FILL = 0.76;
    const OPEN_FRAME_FILL = 0.88;
    const OPEN_WIDTH_MARGIN = 1.25;
    const READING_FRAME_WIDTH_MARGIN = 1.10;
    const OPEN_FRAME_HEIGHT = 760;
    const ANGLE_EPSILON = 0.01;
    const OPEN_FOCUS_Y = 120;
    const OPEN_FOCUS_Z = T + 90;
    const MAX_VIEW_YAW = 25;
    const MIN_VIEW_TILT = 56;
    const MAX_VIEW_TILT = 76;
    const VIEW_DRAG_THRESHOLD = 5;
    const VIEW_YAW_SENSITIVITY = 0.12;
    const VIEW_TILT_SENSITIVITY = 0.10;
    const MAX_VIEW_FRAMING_REDUCTION = 0.18;
    const VIEW_CONTROLS = 'button, a, input, select, textarea, ' +
        '[role="button"], [role="slider"], [contenteditable="true"]';
    const LIGHT=[0.46,-0.20];
    const canTurnFromPaper = window.BOOK_EDITION === 'v10';

    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* 书的开合角 theta: 0=合上, 180=完全摊开 */
    let theta = 0;
    let targetTheta = 0;

    /* 场景根节点 */
    const world=PB.$('#world');
    const table=PB.el('table',world);
    const desk=PB.el('desk',table,3400,2400);
    desk.style.transform=`translate3d(-1700px,-1150px,-2px)`;

    const bookShadowL=PB.el('book-shadow',table,PW+OVER+40,PH+OVER*2+40);
    bookShadowL.style.transform=`translate3d(${-PW-OVER-20}px,${-PH/2-OVER-20}px,-1px)`;
    const bookShadowR=PB.el('book-shadow',table,PW+OVER+40,PH+OVER*2+40);
    bookShadowR.style.transform=`translate3d(-20px,${-PH/2-OVER-20}px,-1px)`;

    function half(side){
        const g=PB.el('half',table);
        const x0=side<0?-PW:0;

        /* 封板 */
        const bw=PW+OVER, bh=PH+OVER*2;
        const board=PB.el('board',g,bw,bh);
        board.style.transform=`translate3d(${side<0?-bw:0}px,${-bh/2}px,${BOARD}px)`;

        const bFront=PB.el('board-edge',g,bw,BOARD);
        bFront.style.transformOrigin='0 100%';
        bFront.style.transform=`translate3d(${side<0?-bw:0}px,${bh/2-BOARD}px,0) rotateX(-90deg)`;

        const bOut=PB.el('board-edge side',g,bh,BOARD);
        bOut.style.transformOrigin='0 100%';
        bOut.style.transform=`translate3d(${side*bw}px,${-bh/2-BOARD}px,0) rotateZ(90deg) rotateX(-90deg)`;

        /* 封面外侧 */
        if(side>0){
            const cover=PB.el('cover-face',g,bw,bh);
            cover.style.transform=`translate3d(0,${-bh/2}px,-0.5px) rotateY(180deg)`;
            cover.innerHTML=`<div class="cover-title"><b>市井烟火</b><span>百 味 人 间</span></div><div class="cover-seal">烟火</div>`;
        }

        /* 书芯侧边 */
        const front=PB.el('block-edge',g,PW,T-BOARD);
        front.style.transformOrigin='0 100%';
        front.style.transform=`translate3d(${x0}px,${PH/2-(T-BOARD)}px,${BOARD}px) rotateX(-90deg)`;

        const out=PB.el('block-edge side',g,PH,T-BOARD);
        out.style.transformOrigin='0 100%';
        out.style.transform=`translate3d(${side*PW}px,${-PH/2-(T-BOARD)}px,${BOARD}px) rotateZ(90deg) rotateX(-90deg)`;

        /* 页面 */
        const page=PB.el('page '+(side<0?'L':'R'),g,PW,PH);
        page.style.transform=`translate3d(${x0}px,${-PH/2}px,${T}px)`;
        const gutter=PB.el('gutter',page);

        if(canTurnFromPaper){
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'book-page-turn';
            button.dataset.turnPage = side < 0 ? 'previous' : 'next';
            button.setAttribute('aria-label', side < 0 ? '翻到上一章' : '翻到下一章');
            button.innerHTML = '<svg viewBox="0 0 72 72" aria-hidden="true">' +
                '<path class="book-page-corner" d="M9 63h54V9Z"/>' +
                '<path class="book-page-arrow" d="m43 43 7 7-7 7"/>' +
                '</svg>';
            button.addEventListener('click', () => turnPage(side, button));
            page.append(button);
        }

        return {g,page,gutter,x0};
    }

    const L=half(-1);
    const R=half(1);
    R.g.style.transformOrigin=`0 0 ${AXIS}px`;

    /* 纸件列表 */
    const pieces=[];

    function createSpread(id){
        const spread = {id, progress: 1, ready: false};
        for(const [key, half] of Object.entries({L, R})){
            const surface = PB.el('spread-surface', null, PW, PH);
            half.page.insertBefore(surface, half.gutter);
            const g = PB.el('spread-pieces', half.g);
            g.dataset.spread = id;
            const side = {g, page: surface, shadows: PB.el('shadows', surface, PW, PH),
                x0: half.x0, spread, present: false};
            spread[key] = side;
            setSideVisible(side, false);
        }
        return spread;
    }

    function setSideVisible(side, visible){
        side.present = visible;
        side.g.hidden = side.page.hidden = !visible;
    }

    function getShadowSymbol(id){
        const shadowId = id + '-shadow';
        if(document.getElementById(shadowId)) return shadowId;
        const source = document.getElementById(id);
        const shadow = source.cloneNode(true);
        shadow.id = shadowId;
        for(const element of shadow.querySelectorAll('*')){
            for(const attribute of ['fill', 'stroke']){
                if(element.hasAttribute(attribute) &&
                    element.getAttribute(attribute) !== 'none'){
                    element.setAttribute(attribute, '#3b2a1e');
                }
            }
            element.removeAttribute('filter');
        }
        source.parentNode.appendChild(shadow);
        return shadowId;
    }

    // Each moving part gets its own composited SVG surface. Transforming an
    // SVG group would repaint the whole figure and its shadow on every frame.
    function appendArtwork(parent, id, vx, vw, height, scale, hasParts){
        const svg = PB.svgUse(id, vx, vw, height);
        parent.appendChild(svg);
        if(!hasParts) return;
        svg.innerHTML = document.getElementById(id).innerHTML;

        function extractParts(source, target){
            const groups = [...source.querySelectorAll('[data-part]')].filter(
                group => group.parentElement.closest('[data-part]') ===
                    (source.hasAttribute('data-part') ? source : null)
            );
            for(const group of groups){
                const layer = PB.el('paper-part', target);
                layer.dataset.part = group.dataset.part;
                const className = group.getAttribute('class');
                if(className) layer.className += ' ' + className;
                layer.style.transformOrigin = group.style.transformOrigin.replace(
                    /(-?[\d.]+)px/g, (_, value) => Number(value)*scale + 'px'
                );
                const opacity = group.getAttribute('opacity');
                if(opacity !== null) layer.style.opacity = opacity;
                const partSvg = PB.svgUse(id, vx, vw, height);
                layer.appendChild(partSvg);
                extractParts(group, layer);
                group.removeAttribute('data-part');
                group.removeAttribute('class');
                group.removeAttribute('style');
                group.removeAttribute('opacity');
                partSvg.innerHTML = group.outerHTML;
                group.remove();
            }
        }
        extractParts(svg, parent);
    }

    // Each slice of the illustration has its own hinge along the floor below.
    function makeCourses(node, id, vx, vw, scale, cuts, hasParts){
        const layers = PB.el('paper-assembly', node);
        const courses = [];
        const fullHeight = cuts.at(-1);
        for(let i = cuts.length-1; i > 0; i--){
            const top = cuts[i-1];
            const height = cuts[i]-top;
            const course = PB.el('paper-course', layers, vw*scale, height*scale);
            course.style.top = top*scale+'px';
            course.hidden = true;
            const svg = PB.svgUse(id, vx, vw, height);
            if(hasParts) svg.innerHTML = document.getElementById(id).innerHTML;
            svg.setAttribute('viewBox', `${vx} ${top} ${vw} ${height}`);
            svg.setAttribute('aria-hidden', 'true');
            course.append(svg);
            courses.push({node: course, top: top*scale, height, base: fullHeight-cuts[i]});
        }
        return courses;
    }

    function assemble(p, progress){
        let silhouette = 0;
        for(const [i, course] of p.courses.entries()){
            const t = PB.clamp((progress - p.buildDelay - i*.17)/.30, 0, 1);
            const angle = 86*(1-PB.smooth(t));
            if(t > 0){
                silhouette = Math.max(silhouette, course.base+course.height*Math.cos(angle*Math.PI/180));
            }
            if(course.progress === t) continue;
            course.progress = t;
            course.node.hidden = t === 0;
            course.node.style.transform = t === 1 ? '' : `rotateX(${angle.toFixed(2)}deg)`;
            course.node.style.opacity = PB.smooth(PB.clamp(t*5,0,1)).toFixed(3);
        }
        return Math.min(1, silhouette*p.scale/p.h);
    }

    function piece(h,id,o){
        const size=PB.ART.size[id];
        if(!size){
            console.error('Symbol not found:',id);
            return null;
        }
        const [sw,sh]=size;
        const s=o.scale||1, vx=o.vx||0, vw=o.vw||sw;
        const w=vw*s, ht=sh*s, an=o.anchor??0.5;

        const node=PB.el('piece',h.g,w,ht);
        node.style.left=-w*an+'px';
        node.style.top=-ht+'px';
        node.style.transformOrigin=`${an*100}% 100%`;
        const courses = o.build ? makeCourses(node, id, vx, vw, s, o.build, o.parts) : null;
        if(courses) node.classList.add('building');
        if(!courses) appendArtwork(node, id, vx, vw, sh, s, o.parts);
        node.dataset.piece = id;
        if(o.steam) node.appendChild(PB.svgUse(o.steam,vx,vw,sh,'steam'));

        /* 投影 */
        const sh_ = PB.el('cast', o.shadow === false ? null : h.shadows, w, ht);
        sh_.dataset.shadow = id;
        sh_.setAttribute('aria-hidden', 'true');
        sh_.style.width=w+'px';
        sh_.style.height=ht+'px';
        sh_.style.left=(o.x-h.x0)-w*an+'px';
        sh_.style.top=(o.y+PH/2)-ht+'px';
        sh_.style.transformOrigin=`${an*100}% 100%`;
        if(o.shadow !== false){
            appendArtwork(sh_, getShadowSymbol(o.shadowArt || id), vx, vw, sh, s, o.parts);
        }
        const casts = [sh_];
        // A travelling paper cutout may cast onto either page at the gutter.
        for(const side of o.shadowSides || []){
            if(side === h || o.shadow === false) continue;
            const cast = sh_.cloneNode(true);
            cast.style.left = (o.x-side.x0)-w*an+'px';
            side.shadows.append(cast);
            casts.push(cast);
        }

        const p={
            node,
            courses,
            buildDelay: o.buildDelay || 0,
            scale: s,
            cast: sh_,
            casts,
            side: h,
            x: o.x,
            y: o.y,
            originX: o.x,
            originY: o.y,
            yaw: o.yaw||0,
            poseRevision: 0,
            h: ht,
            z: T+1+((o.y+PH/2)/PH)*3+(o.dz||0),
            baseZ: T+1+((o.y+PH/2)/PH)*3,
            elevation: o.dz || 0,
            lead: o.lead||0,
            flat: o.flat || false,
            interactive: Boolean(o.label),
            parts: {},
            partStyles: {},
            wob: 0,
            vel: 0
        };

        if(o.label){
            node.setAttribute('role', o.role || 'button');
            node.setAttribute('aria-label', o.label);
            node.tabIndex = -1;
            node.addEventListener('pointerdown', e => e.stopPropagation());
            node.addEventListener('click', () => {
                if(!reduce && !o.parts) p.vel -= 160;
            });
            node.addEventListener('keydown', e => {
                if(e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                node.click();
            });
        }else{
            node.setAttribute('aria-hidden', 'true');
            node.classList.add('scenery');
        }

        pieces.push(p);
        return p;
    }

    // Animated parts and their paper shadows share the same local transform.
    function setPart(p, name, styles){
        if(!p.parts[name]){
            const selector = `[data-part="${name}"]`;
            p.parts[name] = [
                ...p.node.querySelectorAll(selector),
                ...p.casts.flatMap(cast => [...cast.querySelectorAll(selector)])
            ];
            p.partStyles[name] = {};
        }
        for(const [property, value] of Object.entries(styles)){
            if(p.partStyles[name][property] === value) continue;
            for(const part of p.parts[name]) part.style[property] = value;
            p.partStyles[name][property] = value;
        }
    }

    // Keep the paper hinge and its ground shadow in the same coordinate frame.
    function setPiecePose(p, pose){
        let changed = false;
        for(const key of ['x', 'y', 'yaw', 'elevation']){
            if(pose[key] === undefined || pose[key] === p[key]) continue;
            if(!Number.isFinite(pose[key])) continue;
            p[key] = pose[key];
            changed = true;
        }
        if(!changed) return;
        p.baseZ = T + 1 + ((p.y + PH/2)/PH)*3;
        for(const cast of p.casts){
            cast.style.translate = `${p.x-p.originX}px ${p.y-p.originY}px`;
        }
        p.poseRevision++;
    }

    /* 相机 */
    const view = PB.$('#view');
    const frame = view.querySelector('.scene-frame');
    let cameraX = 0;
    let viewportHeight = 0;
    let closedScale = 1;
    let openScale = 1;
    let renderedTheta = null;
    let viewYaw = 0;
    let viewTilt = OPEN_TILT;
    let isCameraDirty = true;
    let cameraRevision = 0;
    let isViewInteractionEnabled = false;
    let wasViewAvailable = false;
    let viewGesture = null;
    let firstPersonTap = null;
    let suppressedPointerId = null;
    let turnFocus = null;
    const focus = {x: 0, y: OPEN_FOCUS_Y, z: OPEN_FOCUS_Z, zoom: 1};

    function getCameraPose(){
        return {...focus, tilt: viewTilt, yaw: viewYaw};
    }

    function setCameraPose(pose){
        let changed = false;
        for(const key of ['x', 'y', 'z', 'zoom']){
            if(!Number.isFinite(pose[key]) || focus[key] === pose[key]) continue;
            focus[key] = pose[key];
            changed = true;
        }
        if(Number.isFinite(pose.tilt) && viewTilt !== pose.tilt){
            viewTilt = PB.clamp(pose.tilt, 45, 88);
            changed = true;
        }
        if(Number.isFinite(pose.yaw) && viewYaw !== pose.yaw){
            viewYaw = PB.clamp(pose.yaw, -30, 30);
            changed = true;
        }
        if(changed) isCameraDirty = true;
    }

    function canRotateView(){
        return isViewInteractionEnabled && theta === 180 && targetTheta === 180;
    }

    function turnPage(direction, button){
        if(!canRotateView() || !PB.Engine?.isReady() || PB.Shell?.getRoute().view !== 'scene') return;
        const chapter = PB.Engine.getChapter() + direction;
        const lastChapter = CITY_BOOK.chapters.length;
        if(chapter < 1 || chapter > lastChapter) return;
        if(button === document.activeElement && button.matches(':focus-visible')){
            const nextDirection = chapter === 1 ? 1 : chapter === lastChapter ? -1 : direction;
            const nextPage = nextDirection < 0 ? L.page : R.page;
            turnFocus = {chapter, button, next: nextPage.querySelector('.book-page-turn')};
        }
        PB.Shell.navigate({view: 'scene', chapter}, {keepScroll: true});
    }

    function plainPage(target){
        if(!canTurnFromPaper || !target || target.closest(VIEW_CONTROLS)) return null;
        return target.closest('.page');
    }

    function releaseFirstPersonTap(event, cancelled){
        const tap = firstPersonTap;
        if(event.pointerId !== tap?.pointerId) return;
        firstPersonTap = null;
        if(cancelled || tap.hasMoved || PB.Camera?.getMode() !== 'first' ||
            PB.Shell?.getRoute().view !== 'scene') return;
        if(Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > VIEW_DRAG_THRESHOLD) return;
        const target = document.elementFromPoint(event.clientX, event.clientY);
        if(!view.contains(target) || target.closest(VIEW_CONTROLS)) return;
        suppressedPointerId = event.pointerId;
        PB.Camera.setMode('overview');
        window.dispatchEvent(new Event('blur-story'));
    }

    function finishViewGesture(){
        if(!viewGesture) return;
        const {pointerId, hasMoved} = viewGesture;
        viewGesture = null;
        if(hasMoved) suppressedPointerId = pointerId;
        view.classList.remove('view-pointer-down');
        PB.root.classList.remove('view-dragging');
        if(view.hasPointerCapture(pointerId)) view.releasePointerCapture(pointerId);
    }

    function syncViewAvailability(){
        const isAvailable = canRotateView();
        if(!isAvailable) finishViewGesture();
        if(wasViewAvailable === isAvailable) return;
        wasViewAvailable = isAvailable;
        view.classList.toggle('view-rotatable', isAvailable);
    }

    function setViewInteractionEnabled(isEnabled){
        isViewInteractionEnabled = isEnabled;
        syncViewAvailability();
    }

    function resetView(){
        finishViewGesture();
        Object.assign(focus, {x: 0, y: OPEN_FOCUS_Y, z: OPEN_FOCUS_Z, zoom: 1});
        viewYaw = 0;
        viewTilt = OPEN_TILT;
        isCameraDirty = true;
    }

    // A cancelled gesture may never produce a click. Do not swallow the next one.
    document.addEventListener('pointerdown', event => {
        suppressedPointerId = null;
        turnFocus = null;
        if(event.isPrimary) firstPersonTap = null;
    }, true);
    view.addEventListener('pointerdown', event => {
        if(canTurnFromPaper && event.isPrimary && event.button === 0 && PB.Camera?.getMode() === 'first' &&
            !event.target.closest(VIEW_CONTROLS)){
            firstPersonTap = {pointerId: event.pointerId, x: event.clientX, y: event.clientY, hasMoved: false};
            return;
        }
        if(event.pointerType !== 'mouse' || event.button !== 0 || !event.isPrimary){
            return;
        }
        if(viewGesture || !canRotateView() || event.target.closest(VIEW_CONTROLS)){
            return;
        }
        viewGesture = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            lastX: event.clientX,
            lastY: event.clientY,
            page: plainPage(event.target),
            hasMoved: false
        };
        // Capture before crossing scenery so hovering a chef cannot toss noodles.
        view.setPointerCapture(event.pointerId);
        view.classList.add('view-pointer-down');
        event.preventDefault();
    });
    view.addEventListener('pointermove', event => {
        const tap = firstPersonTap;
        if(event.pointerId === tap?.pointerId &&
            Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > VIEW_DRAG_THRESHOLD){
            tap.hasMoved = true;
        }
        if(!viewGesture || event.pointerId !== viewGesture.pointerId) return;
        if(!(event.buttons & 1) || !canRotateView()){
            finishViewGesture();
            return;
        }
        const gesture = viewGesture;
        if(!gesture.hasMoved){
            const distance = Math.hypot(
                event.clientX - gesture.startX,
                event.clientY - gesture.startY
            );
            if(distance <= VIEW_DRAG_THRESHOLD) return;
            gesture.hasMoved = true;
            PB.root.classList.add('view-dragging');
        }
        // Move the near edge with the pointer, as if grabbing the book.
        const yaw = PB.clamp(
            viewYaw - (event.clientX - gesture.lastX) * VIEW_YAW_SENSITIVITY,
            -MAX_VIEW_YAW,
            MAX_VIEW_YAW
        );
        const tilt = PB.clamp(
            viewTilt - (event.clientY - gesture.lastY) * VIEW_TILT_SENSITIVITY,
            MIN_VIEW_TILT,
            MAX_VIEW_TILT
        );
        gesture.lastX = event.clientX;
        gesture.lastY = event.clientY;
        if(yaw !== viewYaw || tilt !== viewTilt){
            viewYaw = yaw;
            viewTilt = tilt;
            isCameraDirty = true;
        }
    });
    for(const type of ['pointerup', 'pointercancel', 'lostpointercapture']){
        view.addEventListener(type, event => {
            releaseFirstPersonTap(event, type !== 'pointerup');
            const gesture = viewGesture;
            if(event.pointerId !== gesture?.pointerId) return;
            finishViewGesture();
            if(type !== 'pointerup' || gesture.hasMoved || !gesture.page) return;
            if(plainPage(document.elementFromPoint(event.clientX, event.clientY)) !== gesture.page) return;
            suppressedPointerId = event.pointerId;
            turnPage(gesture.page === L.page ? -1 : 1);
        });
    }
    view.addEventListener('click', event => {
        if(event.detail === 0 || event.pointerId !== suppressedPointerId) return;
        suppressedPointerId = null;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);
    if(canTurnFromPaper){
        view.addEventListener('click', event => {
            if(event.pointerType === 'mouse') return;
            const page = plainPage(event.target);
            if(page) turnPage(page === L.page ? -1 : 1);
        });
        window.addEventListener('book-ready', ({detail}) => {
            if(!detail.ready || !turnFocus) return;
            const pending = turnFocus;
            turnFocus = null;
            if(detail.chapter !== pending.chapter) return;
            requestAnimationFrame(() => {
                if(document.activeElement !== document.body && document.activeElement !== pending.button) return;
                if(!canRotateView() || !PB.Engine.isReady() || PB.Engine.getChapter() !== pending.chapter) return;
                pending.next.focus({preventScroll: true});
            });
        });
    }
    function cancelViewInput(){
        firstPersonTap = null;
        finishViewGesture();
    }
    window.addEventListener('blur', cancelViewInput);
    document.addEventListener('visibilitychange', () => {
        if(document.hidden) cancelViewInput();
    });

    function fit(){
        // Measure the resting frame. The reader pans it with a CSS translation.
        const frameLeft = frame.offsetLeft;
        const frameWidth = Math.max(1, frame.clientWidth);
        const widthMargin = frameLeft > 0 ? READING_FRAME_WIDTH_MARGIN : OPEN_WIDTH_MARGIN;
        cameraX = frameLeft + frameWidth / 2;
        viewportHeight = Math.max(1, view.clientHeight);
        const bookWidth = PW * 2 + OVER * 2;
        const bookHeight = PH + OVER * 2;
        closedScale = Math.min(
            frameWidth / (PW + OVER * 2),
            viewportHeight / bookHeight
        ) * CLOSED_FRAME_FILL;
        openScale = Math.min(
            frameWidth / (bookWidth * widthMargin),
            viewportHeight / OPEN_FRAME_HEIGHT
        ) * OPEN_FRAME_FILL;
        isCameraDirty = true;
        if(PB.paused) updateCamera();
    }

    function updateCamera(){
        // Let the cover lift before descending toward the paper scene.
        const progress = PB.smooth(PB.clamp(
            (theta - CAMERA_START_ANGLE) / (180 - CAMERA_START_ANGLE),
            0,
            1
        ));
        const tilt = PB.lerp(CLOSED_TILT, viewTilt, progress);
        const yaw = viewYaw * progress;
        const distance = PB.lerp(CLOSED_DISTANCE, OPEN_DISTANCE, progress);
        // Leave room for tall scenery and the near page corner when orbiting.
        const rotationAmount = Math.max(
            Math.abs(viewYaw) / MAX_VIEW_YAW,
            Math.abs(viewTilt - OPEN_TILT) / (MAX_VIEW_TILT - OPEN_TILT)
        );
        const frameFill = 1 - MAX_VIEW_FRAMING_REDUCTION * rotationAmount * progress;
        const scale = PB.lerp(closedScale, openScale, progress) * frameFill *
            PB.lerp(1, focus.zoom, progress);
        const cameraY = viewportHeight * CAMERA_CENTER_Y;
        const rightExtent = Math.max(0, -Math.cos(theta * Math.PI / 180));
        const centerX = PW * (1 - rightExtent) / 2 - focus.x * progress;
        const focusY = focus.y * progress;
        const focusZ = PB.lerp(AXIS * 2, focus.z, progress);

        // Match the optical center and scale depth as well as width/height.
        view.style.perspective = `${distance * scale}px`;
        view.style.perspectiveOrigin = `calc(${cameraX}px + var(--reader-pan, 0px)) ${cameraY}px`;
        world.style.transform =
            `translate3d(${cameraX}px,${cameraY}px,0) ` +
            `scale3d(${scale},${scale},${scale})`;
        table.style.transform =
            `rotateX(${tilt}deg) rotateZ(${yaw}deg) ` +
            `translate3d(${centerX}px,${-focusY}px,${-focusZ}px)`;
        bookShadowR.style.opacity = String(rightExtent);
        cameraRevision++;
        isCameraDirty = false;
    }

    /* 开合动画 */
    function setTheta(t,smooth=true){
        targetTheta=PB.clamp(t,0,180);
        if(!smooth || reduce){
            theta=targetTheta;
            stepOpen(0);
        }
        syncViewAvailability();
    }

    function stepOpen(dt){
        if(!reduce) theta+=(targetTheta-theta)*5*dt;
        else theta=targetTheta;
        if(Math.abs(targetTheta-theta)<ANGLE_EPSILON) theta=targetTheta;

    }

    function render(){
        if(renderedTheta !== theta){
            R.g.style.transform=`rotateY(${-(180-theta)}deg)`;
            isCameraDirty = true;
            PB.root.classList.toggle('scene-open', theta > 150);
            renderedTheta = theta;
        }
        if(isCameraDirty) updateCamera();
        syncViewAvailability();

        /* 纸件立起角 */
        for(const p of pieces){
            if(!p.side.present) continue;
            const {progress, ready, buildFrom, layeredReveal} = p.side.spread;
            if(p.renderedTheta === theta && p.renderedWobble === p.wob &&
                p.renderedProgress === progress && p.renderedReady === ready &&
                p.renderedPoseRevision === p.poseRevision) continue;
            p.renderedTheta = theta;
            p.renderedWobble = p.wob;
            p.renderedProgress = progress;
            p.renderedReady = ready;
            p.renderedPoseRevision = p.poseRevision;
            const scenery = buildFrom && !layeredReveal
                ? PB.clamp(progress/buildFrom, 0, 1) : progress;
            const reveal = p.courses
                ? PB.clamp((progress-buildFrom)/(1-buildFrom), 0, 1)
                : PB.clamp((scenery - (1-p.lead)*.4)/.6, 0, 1);
            // Once the floors align, rasterize the facade as one paper surface.
            // Keeping every static floor in the world's 3D sort slows moving boats.
            if(p.courses){
                p.node.style.transformStyle = reveal === 1 ? 'flat' : 'preserve-3d';
            }
            // Folded scenery can extend past a page edge; tuck it under the cover.
            const visibility = theta < 1 || reveal === 0 ? 'hidden' : 'visible';
            if(p.node.style.visibility !== visibility) p.node.style.visibility = visibility;
            const opacity = (PB.smooth(PB.clamp(theta/35, 0, 1)) *
                (p.courses ? 1 : PB.smooth(PB.clamp(reveal*4, 0, 1)))).toFixed(3);
            if(p.node.style.opacity !== opacity) p.node.style.opacity = opacity;
            const startAngle = 70-p.lead*50;
            const input=(theta-startAngle)/(180-startAngle);
            const clamped=PB.clamp(input,0,1);
            const opened = PB.smooth(clamped);
            const smoothed = opened*PB.smooth(reveal);
            const a=p.flat ? 0 : 90*smoothed;
            p.z = p.baseZ + p.elevation*smoothed;

            const term=Math.max(-a,p.wob*(a/90));
            const alpha=PB.clamp(a+term,0,100);

            const tilt = p.courses ? 90*opened : alpha;
            const tf=`translate3d(${p.x}px,${p.y}px,${p.z}px) rotateZ(${p.yaw}rad) rotateX(${-tilt}deg)`;
            if(p.lastTransform !== tf){
                p.node.style.transform = tf;
                p.lastTransform = tf;
            }
            const interactive = ready && theta > 150;
            const pointerEvents = p.interactive && interactive ? 'auto' : 'none';
            if(p.node.style.pointerEvents !== pointerEvents){
                p.node.style.pointerEvents = pointerEvents;
                if(p.interactive){
                    p.node.tabIndex = interactive ? 0 : -1;
                    p.node.setAttribute('aria-hidden', String(!interactive));
                }
            }

            /* 投影错切 */
            const ar=tilt*Math.PI/180;
            const sa=Math.sin(ar), ca=Math.cos(ar);
            const cy=Math.cos(p.yaw), sy=Math.sin(p.yaw);
            const lx=LIGHT[0]*cy+LIGHT[1]*sy;
            const ly=-LIGHT[0]*sy+LIGHT[1]*cy;
            const elevation = p.elevation*smoothed;
            const shadowScale = p.courses ? ` scaleY(${Math.max(.001, opened*assemble(p, reveal))})` : '';
            const shadowTransform = `rotate(${p.yaw}rad) matrix(1,0,${-lx*sa},${ca-ly*sa},${lx*elevation},${ly*elevation})${shadowScale}`;
            if(p.lastShadowTransform !== shadowTransform){
                for(const cast of p.casts) cast.style.transform = shadowTransform;
                p.lastShadowTransform = shadowTransform;
            }
            const shadowOpacity = ((0.25+0.75*sa)*0.24*Number(opacity)).toFixed(3);
            if(p.cast.style.opacity !== shadowOpacity){
                for(const cast of p.casts) cast.style.opacity = shadowOpacity;
            }
        }
    }

    fit();
    stepOpen(0);
    window.addEventListener('resize',()=>{
        finishViewGesture();
        fit();
    });
    new ResizeObserver(fit).observe(view);

    PB.physicsLoop.add({step(dt){
        stepOpen(dt);
        for(const p of pieces){
            if(!p.side.present) continue;
            p.vel += (-160*p.wob-9*p.vel)*dt;
            p.wob += p.vel*dt;
            if(reduce) p.wob = p.vel = 0;
            if(Math.abs(p.wob) + Math.abs(p.vel) < 0.001) p.wob = p.vel = 0;
        }
    }});
    PB.rafLoop.add(render);

    return {
        table, L, R, PW, PH, T,
        createSpread, setSideVisible,
        piece, setPart, setPiecePose,
        setTheta,
        setViewInteractionEnabled, canRotateView, resetView,
        getCameraPose, setCameraPose, fit, renderNow: render,
        getPiece: id => pieces.find(piece => piece.node.dataset.piece === id),
        getPieces: id => pieces.filter(piece => piece.side.spread.id === id),
        getCameraRevision: () => cameraRevision,
        getTheta: ()=>theta
    };
})();
