PB.Camera = (() => {
    const overview = {x: 0, y: 120, z: 126, zoom: 1, tilt: 66, yaw: 0};
    const anchors = ['s1-chef', 's2-boat', 's3-tea-service',
        's4-sewing', 's5-homecoming'];
    const guideScenes = [
        {
            left: {x: -463, y: 132, z: 151, zoom: 2, tilt: 66, yaw: -5},
            right: {x: 442, y: 139, z: 157, zoom: 2, tilt: 66, yaw: 4},
            captions: ["江汉关的天亮了，师傅已经架好面锅。", "沿碗口拌开芝麻酱，面还冒着热气。", "入夜后，红柳烤肉守着一炉炭火，桌边的人还在慢慢聊。"]
        },
        {
            left: {x: -452, y: 90, z: 151, zoom: 1.88, tilt: 68, yaw: -4},
            right: {x: 479, y: 134, z: 154, zoom: 1.92, tilt: 68, yaw: 3},
            captions: ["阿婆递来一篮青菜，托你捎给老邻居。", "船慢慢穿过桥洞，两岸的街景在书缝处相接。", "岸上的人接过菜，还托你带回一句谢。"]
        },
        {
            left: {x: -464, y: 193, z: 133, zoom: 1.96, tilt: 68, yaw: -4},
            right: {x: 449, y: 194, z: 153, zoom: 2.05, tilt: 66, yaw: 3},
            captions: ["蓝布浴帘一拉，帘里热气腾腾，池边的人还在慢慢唠嗑。", "“坐嘛，正好续水。”倾壶添一盏，等茶客把话说完。", "再续一盏热的，约好明天还在这里坐。"]
        },
        {
            left: {x: -455, y: 120, z: 148, zoom: 2.02, tilt: 66, yaw: -4},
            right: {x: 445, y: 182, z: 141, zoom: 2, tilt: 67, yaw: 4},
            captions: ["“母亲替我改过这件衣服，我还想穿。”", "把补布慢慢送过机针，袖口的针脚一段段接好。", "弄堂空地上，孩子们捂紧耳朵，等着爆米花炉开炉。"]
        },
        {
            left: {x: -392, y: 116, z: 210, zoom: 1.82, tilt: 65, yaw: -4},
            right: {x: 525, y: 231, z: 153, zoom: 2, tilt: 68, yaw: 4},
            captions: ["提着东西走到码头，江上的游轮正在等候。", "坐上游轮渡过江，靠岸后再沿石阶回家。", "东西放好了，空椅子也坐上人，祈愿灯慢慢升空。"]
        }
    ];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let mode = 'overview';
    let previous = {...overview};
    let target = {...overview};
    let lastTime = 0;
    let stableAnchor = null;
    let guideEntry = null;

    function getAnchor() {
        const piece = PB.Book.getPiece(anchors[PB.Engine.getChapter() - 1]);
        if(!piece) return {x: 0, y: 100, z: 50, yaw: 0};
        if(PB.Engine.getChapter() === 5) {
            const boat = PB.Book.getPiece('s5-boat');
            const aboard = Number(boat?.node.dataset.passengerOpacity || 0);
            if(boat && aboard > 0) {
                return {
                    x: PB.lerp(piece.x, boat.x, aboard),
                    y: PB.lerp(piece.y, boat.y, aboard),
                    z: PB.lerp(piece.z, boat.z + 35, aboard),
                    yaw: 0
                };
            }
        }
        return {x: piece.x, y: piece.y, z: piece.z, yaw: piece.yaw};
    }

    function composePose() {
        if(mode === 'overview') return target;
        const point = reduced.matches && stableAnchor ? stableAnchor : getAnchor();
        const chapter = PB.Engine.getChapter();
        const isFirst = mode === 'first';
        const zoom = PB.root.clientWidth < 600 ? 3 : 2.15;
        const poses = {
            1: {x: point.x + 5, y: point.y - 20, z: 155},
            2: {x: point.x, y: point.y - 45, z: 118},
            3: {x: 425, y: 190, z: 155},
            4: {x: -445, y: 155, z: 125},
            5: {x: point.x + 25, y: point.y - 30, z: point.z + 95}
        };
        if(chapter === 5 && PB.Story?.getState().phase === 'done') {
            poses[5] = {x: 580, y: 255, z: 145};
        }
        return {...poses[chapter], zoom: isFirst ? zoom * 1.5 : zoom,
            tilt: isFirst ? 83 : mode === 'follow' ? 72 : 66,
            yaw: isFirst ? (chapter === 3 ? -7 : chapter === 2 ?
                -Math.min(22, PB.Story.getState().progress * 28) : 0) :
                mode === 'follow' ? point.yaw * 24 : -5};
    }

    function mixPose(from, to, progress) {
        const t = PB.smooth(PB.clamp(progress, 0, 1));
        return {
            x: PB.lerp(from.x, to.x, t), y: PB.lerp(from.y, to.y, t),
            z: PB.lerp(from.z, to.z, t), zoom: PB.lerp(from.zoom, to.zoom, t),
            tilt: PB.lerp(from.tilt, to.tilt, t), yaw: PB.lerp(from.yaw, to.yaw, t)
        };
    }

    function boatPose(offset, left, right) {
        const point = getAnchor();
        const boat = {
            x: PB.clamp(point.x - 24, -440, 475),
            y: PB.clamp(point.y + 16, 32, 172),
            z: 144, zoom: left.zoom, tilt: 69,
            yaw: PB.clamp(point.yaw * 12, -10, 10)
        };
        if(offset < 5) return mixPose(left, boat, (offset - 3) / 2);
        if(offset < 13.5) return boat;
        return mixPose(boat, right, (offset - 13.5) / 2.5);
    }

    function homecomingPose(offset, left, right) {
        const traveler = PB.Book.getPiece('s5-homecoming');
        const boat = PB.Book.getPiece('s5-boat');
        if(!traveler || !boat) return left;
        const aboard = Number(boat.node.dataset.passengerOpacity || 0);
        const point = getAnchor();
        const journey = {
            x: point.x, y: point.y - 5,
            z: PB.lerp(traveler.elevation + 100, 90, aboard),
            zoom: left.zoom, tilt: 69, yaw: 0
        };
        if(offset < 4.5) return mixPose(left, journey, (offset - 3) / 1.5);
        if(offset < 13.5) return journey;
        return mixPose(journey, right, (offset - 13.5) / 2.5);
    }

    function guidePose(chapter, offset) {
        const {left, right} = guideScenes[chapter - 1];
        const zoomFactor = PB.root.clientWidth < 600 ? 1.12 : 1;
        const a = {...left, zoom: left.zoom * zoomFactor};
        const b = {...right, zoom: right.zoom * zoomFactor};
        if(reduced.matches) {
            if(offset < 1 || offset >= 17) return overview;
            if(chapter === 5 && offset >= 5.4 && offset < 12.2) {
                return {x: 25, y: 265, z: 100, zoom: 1.45, tilt: 69, yaw: 0};
            }
            return offset < 9 ? a : b;
        }
        if(offset < 3) return mixPose(overview, a, offset / 3);
        if(offset >= 16) return mixPose(b, overview, (offset - 16) / 2);
        if(chapter === 2) return boatPose(offset, a, b);
        if(chapter === 5) return homecomingPose(offset, a, b);
        if(offset < 7) return a;
        if(offset < 10) return mixPose(a, b, (offset - 7) / 3);
        return b;
    }

    function guide(chapter, offset, immediate = false) {
        if(!guideScenes[chapter - 1] || !PB.Engine.isOpen() || !PB.Engine.isReady() ||
            PB.Engine.getChapter() !== chapter) return;
        if(mode !== 'guided') {
            const current = PB.Book.getCameraPose();
            if(mode === 'overview') previous = current;
            guideEntry = offset > 3 ? {pose: current, offset} : null;
            mode = 'guided';
            PB.root.dataset.camera = mode;
            PB.Book.setViewInteractionEnabled(false);
            window.dispatchEvent(new CustomEvent('camera-change', {detail: mode}));
        }
        const pose = guidePose(chapter, offset);
        if(immediate || reduced.matches || (guideEntry && offset >= guideEntry.offset + .55)) {
            guideEntry = null;
        }
        // A paper turn can finish after the wide-to-close move would have ended.
        PB.Book.setCameraPose(guideEntry ? mixPose(guideEntry.pose, pose, (offset - guideEntry.offset) / .55) : pose);
        if(immediate || PB.paused) {
            PB.Book.renderNow();
            PB.UI.invalidateLayout();
        }
    }

    function releaseGuide() {
        if(mode === 'guided') setMode('overview');
    }

    function guideSide(chapter, offset) {
        if(chapter === 5) return offset < 5.4 ? 0 : 1;
        if(reduced.matches) return offset < 9 ? 0 : 1;
        if(chapter === 2) {
            if(offset < 5) return 0;
            return offset >= 13.5 || PB.Book.getPiece('s2-boat')?.x >= 24 ? 1 : 0;
        }
        return offset < 8.5 ? 0 : 1;
    }

    function guideCaption(chapter, offset) {
        const captions = guideScenes[chapter - 1]?.captions;
        if(!captions) return '';
        if(chapter === 5) return captions[offset < 5.4 ? 0 : offset < 16.2 ? 1 : 2];
        return captions[offset < 7 ? 0 : offset < 12 ? 1 : 2];
    }

    function setMode(value) {
        if(!['overview', 'close', 'follow', 'first'].includes(value)) return;
        if(value === mode) return;
        stableAnchor = getAnchor();
        if(mode === 'overview' && value !== 'overview') {
            previous = PB.Book.getCameraPose();
        }
        if(value === 'overview') target = {...previous};
        mode = value;
        PB.root.dataset.camera = mode;
        PB.Book.setViewInteractionEnabled(mode === 'overview');
        if(reduced.matches || PB.paused) {
            PB.Book.setCameraPose(composePose());
            PB.Book.renderNow();
        }
        window.dispatchEvent(new CustomEvent('camera-change', {detail: mode}));
    }

    function reset() {
        previous = {...overview};
        target = {...overview};
        mode = 'overview';
        PB.root.dataset.camera = mode;
        PB.Book.setCameraPose(overview);
        PB.Book.setViewInteractionEnabled(true);
        window.dispatchEvent(new CustomEvent('camera-change', {detail: mode}));
    }

    PB.rafLoop.add(now => {
        const delta = Math.min((now - lastTime) / 1000, .05);
        lastTime = now;
        if(mode === 'guided' || !PB.Engine.isOpen() || !PB.Engine.isReady()) return;
        const pose = composePose();
        if(!pose) return;
        const current = PB.Book.getCameraPose();
        const ratio = reduced.matches ? 1 : 1 - Math.exp(-delta * 5);
        const next = {};
        let difference = 0;
        for(const key of Object.keys(pose)) {
            difference += Math.abs(pose[key] - current[key]);
            next[key] = PB.lerp(current[key], pose[key], ratio);
        }
        if(difference > .015) PB.Book.setCameraPose(next);
        else if(mode === 'overview') target = null;
    });
    return {setMode, reset, getMode: () => mode, getAnchor, guide, releaseGuide, guideSide, guideCaption};
})();
