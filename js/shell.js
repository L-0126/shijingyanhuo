PB.Shell = (() => {
    const edition = window.BOOK_EDITION || 'v7_1';
    const chapters = CITY_BOOK.chapters;
    const $ = selector => document.querySelector(selector);
    const numbers = ['壹', '贰', '叁', '肆', '伍'];
    const names = {v7_1: '导读专题版', v7_2: '书内阅读版', v7_3: '图文长卷版', v10: 'V10'};
    const isV10 = edition === 'v10';
    const isLongScroll = edition === 'v7_3' || isV10;
    const compactReading = matchMedia('(max-width: 920px)');
    const kindNames = {receipt: '餐票', fold: '折页', tea: '茶签',
        ticket: '浴票', label: '衣物标签', letter: '家书'};
    const paperDialog = $('#paper-dialog');
    const utilityDialog = $('#utility-dialog');
    const workbench = $('#workbench');
    const positions = new Map();
    let route = {view: 'home', chapter: 1};
    let returnRoute = {view: 'scene', chapter: 1};
    let returnFocus = null;
    let sceneReturn = {view: isLongScroll ? 'scroll' : 'home', chapter: 1};
    let gesture = null;
    let previousChapter = 0;
    let previousPhase = '';
    let noticeTimer;
    let scrollFrame;
    let readingRequest;
    let isRouting = false;
    let suppressPrimaryClick = false;

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[character]);
    }

    function urlFor(value) {
        const parameters = new URLSearchParams();
        for(const [key, item] of Object.entries(value)) {
            if(item !== undefined && item !== null) parameters.set(key, item);
        }
        return '#' + parameters.toString();
    }

    function parseRoute() {
        const parameters = new URLSearchParams(location.hash.slice(1));
        const legacy = new URLSearchParams(location.search).get('chapter');
        const requested = Number(parameters.get('chapter') || legacy || 1);
        const chapter = Number.isInteger(requested) ? PB.clamp(requested, 1, 5) : 1;
        let view = parameters.get('view') || (legacy ? 'scene' : 'home');
        if(!['home', 'scene', 'read', 'paper', 'scroll'].includes(view)) view = 'home';
        if(isV10 && view === 'home') view = 'scene';
        else if(isLongScroll && (view === 'home' || view === 'read')) view = 'scroll';
        return {view, chapter,
            ...(parameters.has('section') ? {section: parameters.get('section')} : {}),
            ...(parameters.has('paper') ? {paper: parameters.get('paper')} : {})};
    }

    function keyFor(value) {
        return value.view + ':' + value.chapter;
    }

    function moveStage(slot) {
        if(PB.root.parentElement !== slot) slot.append(PB.root);
        PB.Book.fit();
    }

    function chapterLink(chapter, view = 'read') {
        return urlFor({view: edition === 'v7_2' && view === 'read' ? 'paper' : view,
            chapter: chapter.id});
    }

    function renderSources(chapter) {
        return `<section class="article-sources" id="sources-${chapter.id}">
            <h3>资料从哪里来</h3><ol>${chapter.sources.map((source, index) =>
                `<li id="source-${chapter.id}-${index}"><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.title)} ↗</a></li>`).join('')}</ol>
            <p>以上资料提供地方文化背景。纸页中的店铺布置、人物对话与互动情节为本书原创演绎。外部资料链接需要联网。</p></section>`;
    }

    function renderArticle(chapter, isScroll = false) {
        const heading = isScroll ? 'h2' : 'h1';
        const photos = chapter.photos.length ? `<div class="article-photos">${chapter.photos.map(photo =>
            `<figure><img src="assets/photos/${photo.file}" alt="${escapeHtml(photo.caption.split(' · ')[0])}" loading="lazy" width="${photo.width}" height="${photo.height}"><figcaption>${escapeHtml(photo.caption)} · <a href="${escapeHtml(photo.url)}" target="_blank" rel="noopener">原图与许可 ↗</a></figcaption></figure>`).join('')}</div>` : '';
        return `<article class="${isScroll ? 'scroll-article' : 'chapter-article'}" id="chapter-${chapter.id}" data-chapter="${chapter.id}">
            <header class="article-header">
            <${heading} id="${isScroll ? 'scroll' : 'article'}-title-${chapter.id}">${chapter.heading}</${heading}>
            <p class="article-region">${chapter.word} · ${chapter.region}</p>
            <p class="article-lead">${chapter.lead}</p>
            <div class="article-meta"><span>约 4 分钟阅读 · 两则物件札记</span>
            ${isScroll ? `<button class="text-button article-scene" data-enter-chapter="${chapter.id}">走进本章 ↗</button>` : ''}</div></header>
            <div class="article-body">${chapter.sections.map((section, index) =>
                `<section class="article-section" id="section-${chapter.id}-${index}"><h3>${section.title}<button class="section-share" data-share-section="${index}" data-chapter="${chapter.id}">分享此段 ↗</button></h3><p>${section.text}${section.source !== null ? `<a class="source-mark" href="${escapeHtml(chapter.sources[section.source].url)}" target="_blank" rel="noopener" aria-label="查看本段资料来源">[${section.source + 1}]</a>` : ''}</p></section>${index === 1 ? photos : ''}`).join('')}</div>
            <div class="article-notes">${chapter.notes.map((note, index) => `<section class="article-note"><p class="eyebrow">随页小札 / ${kindNames[note.kind] || '物件'}</p><h3>${note.title}</h3><p>${note.body}</p><button class="text-button" data-open-note="${index}" data-chapter="${chapter.id}">展开这张纸 ↗</button></section>`).join('')}</div>
            <section class="article-story"><span class="eyebrow">原创生活故事</span><h3>${chapter.story.title}</h3><p>${chapter.story.opening}</p><button class="button primary" data-enter-chapter="${chapter.id}">走进故事，亲手做一件事 ↗</button></section>
            ${renderSources(chapter)}
            ${!isScroll ? `<nav class="article-navigation" aria-label="相邻章节">${chapter.id > 1 ? `<a href="${chapterLink(chapters[chapter.id - 2])}">← ${chapters[chapter.id - 2].title}</a>` : '<span>从味开始，走入街巷。</span>'}${chapter.id < 5 ? `<a href="${chapterLink(chapters[chapter.id])}">${chapters[chapter.id].title} →</a>` : '<span>书翻完了，日子还在继续。</span>'}</nav>` : ''}</article>`;
    }

    function renderPaper(value) {
        const chapter = chapters[value.chapter - 1];
        if(value.paper === 'preface') {
            $('#paper-content').innerHTML = `<article class="preface-paper"><p class="eyebrow">翻开之前 / 序言</p><h1 id="paper-title">从街角面摊，翻到家门口。</h1><p>${CITY_BOOK.introduction}</p><p>页边的餐票记着熟客的口味，捎菜单等一个送达的印记，茶签旁的水还温着。翻到弄堂，可以帮阿婆补好一件旧衣；走上山城石阶，桌边已经替你留出座位。读到想停的地方，就展开纸签，再去人物身边接下这件小事。</p><div class="utility-catalog">${chapters.map(item => `<a href="${urlFor({view: 'scene', chapter: item.id})}"><span>${numbers[item.id - 1]} · ${item.word}　${item.title}</span><span>走进这一页 ↗</span></a>`).join('')}</div><p class="preface-note">${CITY_BOOK.editorialNote}</p><button class="button primary" data-enter-chapter="1">从清晨的一碗面开始 ↗</button></article>`;
            paperDialog.scrollTop = 0;
            return;
        }
        if(value.paper !== undefined) {
            const note = chapter.notes[PB.clamp(Number(value.paper) || 0, 0, 1)];
            const state = PB.Story.getStates()[value.chapter - 1];
            const result = state.phase === 'done' ? '这段生活，已有你的笔迹。' : '故事之外，随时可以读。';
            $('#paper-content').innerHTML = `<article class="paper-artifact" data-kind="${kindNames[note.kind] || '折页'}"><p class="eyebrow">${numbers[value.chapter - 1]} / ${kindNames[note.kind] || '随页小札'} · 原创纸页</p><h2 id="paper-title">${note.title}</h2><p>${note.body}</p><span class="artifact-stamp">${result}</span><div class="artifact-bottom">${chapter.word} · ${chapter.region}<br>${value.chapter === 1 ? '本次口味：' + chapter.story.choices[state.choice] + '<br>' : ''}<button class="text-button" data-action="read-current">读完整专题与资料 ↗</button></div></article>`;
        } else {
            $('#paper-content').innerHTML = renderArticle(chapter);
            $('#paper-content h1').id = 'paper-title';
        }
        paperDialog.scrollTop = 0;
    }

    function requestReading(chapter, section) {
        readingRequest = {chapter, section};
        window.dispatchEvent(new Event('show-book-reading'));
    }

    function takeReadingRequest() {
        const request = readingRequest;
        readingRequest = undefined;
        return request;
    }

    function renderRoute(value, options = {}) {
        const reading = isV10 && value.view === 'scroll' ? value : null;
        if(reading && route.view === 'scene' && route.chapter === reading.chapter) {
            requestReading(reading.chapter, reading.section);
            return;
        }
        isRouting = true;
        PB.Story.cancelInput();
        PB.UI.clearBubble();
        const previous = route;
        route = reading ? {view: 'scene', chapter: reading.chapter} : value;
        document.body.dataset.view = route.view;
        document.body.classList.toggle('has-closeup', innerWidth <= 760 &&
            ['scene', 'paper'].includes(route.view) && PB.Camera.getMode() !== 'overview');
        const isPaper = route.view === 'paper' ||
            (edition === 'v7_2' && route.view === 'read');
        if(!isPaper && paperDialog.open) paperDialog.close();
        if(isPaper) {
            if(!paperDialog.open) {
                returnFocus = document.activeElement;
                if(previous.view !== 'paper' && previous.view !== 'read') {
                    returnRoute = {...previous};
                }
                if($('#landing').hidden && $('#experience').hidden &&
                    $('#scroll-view').hidden) showScene(route.chapter);
                paperDialog.showModal();
            }
            renderPaper(route);
            PB.setPaused(true);
            requestAnimationFrame(() => {
                if(route.section !== undefined) {
                    $('#paper-content').querySelector(`#section-${route.chapter}-${route.section}`)?.scrollIntoView({behavior: 'instant'});
                }
            });
            isRouting = false;
            return;
        }
        for(const selector of ['#landing', '#experience', '#reading-view', '#scroll-view']) {
            if(selector === '#experience' && route.view === 'scene') continue;
            $(selector).hidden = true;
        }
        PB.Story.setEnabled(route.view === 'scene');
        if(route.view === 'scene') {
            showScene(route.chapter, options.immediate);
        } else if(route.view === 'read') {
            $('#reading-view').hidden = false;
            $('#reading-view').innerHTML = `<div class="article-topbar"><a class="text-button" href="#view=home">← 回到导读</a><button class="text-button" data-enter-chapter="${route.chapter}">进入本章场景 ↗</button></div>` + renderArticle(chapters[route.chapter - 1]);
            PB.setPaused(true);
        } else if(route.view === 'scroll') {
            $('#scroll-view').hidden = false;
            moveStage($('#scroll-slot'));
            setReadingChapter(route.chapter);
        } else {
            $('#landing').hidden = false;
            moveStage($('#hero-slot'));
            PB.Camera.reset();
            if(edition === 'v7_2') PB.Engine.close();
            else PB.Engine.open(1, false);
            PB.setPaused(false);
        }
        document.title = (route.view === 'home' ? '市井烟火' :
            chapters[route.chapter - 1].title + ' · 市井烟火') + ' / ' + names[edition];
        if(!options.keepScroll) {
            requestAnimationFrame(() => {
                let anchor = null;
                if(route.section !== undefined) anchor = $(route.view === 'scroll' ? '#scroll-articles' : '#reading-view').querySelector(`#section-${route.chapter}-${route.section}`);
                else if(route.view === 'scroll' && options.toChapter) anchor = $(`#chapter-${route.chapter}`);
                if(anchor) anchor.scrollIntoView({behavior: 'instant', block: 'start'});
                else window.scrollTo({top: options.toTop ? 0 : positions.get(keyFor(route)) || 0, behavior: 'instant'});
            });
        }
        if(previous.view === 'paper' && returnFocus?.isConnected) {
            returnFocus.focus({preventScroll: true});
        }
        isRouting = false;
        if(reading) requestReading(reading.chapter, reading.section);
    }

    function showSceneHeading(chapter) {
        const content = chapters[chapter - 1];
        $('#scene-region').textContent = content.region;
        $('#scene-title').textContent = content.word + ' · ' + content.title;
    }

    function showScene(chapter, immediate = false) {
        $('#experience').hidden = false;
        moveStage($('#experience-slot'));
        const hasChanged = previousChapter !== chapter;
        if(hasChanged) PB.Camera.reset();
        PB.Engine.select(chapter, isLongScroll && !immediate, immediate);
        PB.Story.select(chapter);
        PB.Story.setEnabled(true);
        PB.setPaused(PB.Engine.isReady() && PB.Engine.getChapter() === chapter && PB.Story.getState().paused);
        const content = chapters[chapter - 1];
        showSceneHeading(PB.Tour?.isReadingAlong() ? PB.Engine.getChapter() : chapter);
        $('#story-title').textContent = content.story.title;
        $('#story-person').textContent = content.story.person;
        if(hasChanged || !workbench.firstElementChild) {
            if(!isLongScroll) {
                workbench.innerHTML = PB.Illustrations.build(chapter);
            }
            workbench.hidden = isLongScroll;
            $('#close-props').innerHTML = PB.Illustrations.foreground(chapter);
            previousChapter = chapter;
            previousPhase = '';
        }
        $('#story-choices').innerHTML = content.story.choices.map((choice, index) =>
            `<button data-choice="${index}" aria-pressed="${PB.Story.getState().choice === index}">${choice}</button>`).join('');
        renderStory(PB.Story.getState());
    }

    function navigate(value, options = {}) {
        if(!options.tour) PB.Tour?.manualPause();
        if(!isRouting) positions.set(keyFor(route), window.scrollY);
        if(value.view === 'scene' && route.view !== 'scene' && route.view !== 'paper') {
            sceneReturn = {...route};
        }
        if(value.view === 'paper' && route.view !== 'paper') returnRoute = {...route};
        const next = {chapter: route.chapter, ...value};
        next.chapter = PB.clamp(Number(next.chapter) || 1, 1, 5);
        if(isV10 && next.view === 'home') next.view = 'scene';
        else if(isLongScroll && (next.view === 'read' || next.view === 'home')) next.view = 'scroll';
        history[options.replace ? 'replaceState' : 'pushState'](null, '', urlFor(next));
        renderRoute(next, options);
    }

    function closePaper() {
        navigate(returnRoute);
    }

    function renderStory(state) {
        if(state.chapter !== previousChapter ||
            (!isLongScroll && !workbench.firstElementChild)) return;
        const story = chapters[state.chapter - 1].story;
        const isActive = state.phase === 'active';
        const isDone = state.phase === 'done';
        const isIntro = state.phase === 'intro';
        const hasChanged = previousPhase !== state.phase + ':' + state.round + ':' + state.hasGift;
        if(hasChanged) {
            previousPhase = state.phase + ':' + state.round + ':' + state.hasGift;
            $('#story-dialogue').textContent = isDone ? story.ending :
                state.round > 0 || state.phase === 'ready' ? story.middle : story.opening;
            $('#story-primary').textContent = isIntro ? ['接下这碗面', '接下阿婆的托付', '落座，添第一盏茶', '选好布，开始缝补', '带着东西回家'][state.chapter - 1] :
                isDone ? '读故事背后的生活 ↗' :
                isActive ? ['按住慢慢拌', '按住摇橹', '收壶停一停', '按住慢慢缝', '按住继续归家'][state.chapter - 1] :
                state.chapter === 3 && state.round === 0 ? '收壶听他讲，再续一盏' :
                state.chapter === 5 ? (state.hasGift ? '拉开椅子，坐下吃饭' : '把带回的东西放上桌') : story.action;
            $('#story-step').hidden = !isActive || state.chapter === 3;
            $('#story-step').textContent = ['拌一圈', '摇一橹', '', '缝一段', '前进一段'][state.chapter - 1];
            $('#angle-control').hidden = state.chapter !== 3 || !isActive;
            $('#story-result').hidden = !isDone;
            $('#story-result').innerHTML = `<strong>${['餐票已留下', '菜篮送到了', '明天，留一把椅子', '旧衣又能穿了', '这一桌，齐了'][state.chapter - 1]}</strong><p>${story.ending}</p>`;
            if(state.chapter === 5) $('#close-props').innerHTML = PB.Illustrations.foreground(isDone ? 5 : 6);
        }
        $('#story-primary').disabled = !PB.Engine.isReady() || (state.paused && !isDone);
        $('#story-step').disabled = state.paused;
        $('#story-choices').hidden = !isIntro || !story.choices.length;
        $('#story-choices').querySelectorAll('button').forEach(button =>
            button.setAttribute('aria-pressed', String(Number(button.dataset.choice) === state.choice)));
        workbench.dataset.disabled = String(!isActive || state.paused);
        const instructions = [
            '在碗上绕圈拖动，酱色会慢慢覆上面条。也可按住下方按钮，或用方向键。',
            '在河面上向右拖住摇橹；松手后船缓缓滑行。方向键或“摇一橹”同样可用。',
            '向右拖动提壶，松手收壶。也可调整下方倾角；水满后收壶，听完再续。',
            '从针尖沿破口向右拖动，让针脚接上。也可按住下方按钮或按方向键。',
            '向右拖住前行，先到码头坐船过江，靠岸后沿石阶回家。松手暂停；也可按方向键。'
        ];
        $('#gesture-instruction').textContent = isIntro ? '先读这段托付，再开始。操作途中可以暂停，也可以随时翻开纸页。' :
            isDone ? '这次操作的结果会留在当前页面。可以继续看街巷，也可以重新来过。' : instructions[state.chapter - 1];
        const progress = state.chapter === 3 ? (state.round + state.progress) / 2 : state.progress;
        $('#story-progress').value = progress;
        $('#progress-value').textContent = Math.round(progress * 100) + '%';
        $('#progress-label').textContent = story.labels[isIntro ? 0 : isDone ? 2 : 1] +
            (state.chapter === 3 && isActive ? ' · 第 ' + (state.round + 1) + ' 盏' : '');
        $('[data-action="pause-story"]').textContent = state.paused ? '继续故事' : '暂停故事';
        $('#pour-angle').value = Math.round(state.angle * 100);
        $('#angle-value').textContent = Math.round(state.angle * 60) + '°';
        if(!isLongScroll) PB.Illustrations.update(workbench, state);
        const foregroundCargo = document.querySelector('[data-foreground-cargo]');
        if(foregroundCargo) foregroundCargo.style.opacity = isDone ? '0' : '1';
    }

    function showNotice(message) {
        clearTimeout(noticeTimer);
        $('#notice').textContent = message;
        $('#notice').classList.add('show');
        noticeTimer = setTimeout(() => $('#notice').classList.remove('show'), 3000);
    }

    function showUtility(content) {
        PB.Tour?.manualPause();
        PB.Story.cancelInput();
        returnFocus = document.activeElement;
        $('#utility-content').innerHTML = content;
        PB.setPaused(true);
        if(!utilityDialog.open) utilityDialog.showModal();
    }

    function closeUtility() {
        utilityDialog.close();
        PB.setPaused(route.view === 'read' || route.view === 'paper' ||
            (route.view === 'scene' && PB.Story.getState().paused));
        returnFocus?.focus({preventScroll: true});
    }

    function showCatalog() {
        showUtility(`<p class="eyebrow">从任何一页，走进日常</p><h2 id="utility-title">五章目录</h2><div class="utility-catalog">${chapters.map(chapter =>
            `<a href="${chapterLink(chapter)}"><span>${numbers[chapter.id - 1]} · ${chapter.word}　${chapter.title}</span><span>读这一章 ↗</span></a>`).join('')}</div><p style="margin-top:24px">阅读随时可进入对应场景；离开场景后，故事会记得你走到了哪里。</p>`);
    }

    function showSources() {
        showUtility(`<p class="eyebrow">书后的资料室</p><h2 id="utility-title">关于这本生活志</h2><p>${CITY_BOOK.introduction}</p><p>${CITY_BOOK.editorialNote}</p>${chapters.map(chapter =>
            `<h3>${chapter.word} · ${chapter.title}</h3><ol>${chapter.sources.map(source => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${source.title} ↗</a></li>`).join('')}</ol>`).join('')}<h3>图像与字体</h3><p>纸艺场景继承 v7_0，近景道具由本项目绘制。阅读区实拍照片来自 Wikimedia Commons，作者与许可见图注及随包的来源记录。文楷字体采用 SIL Open Font License 1.1，许可全文随包提供。</p><h3>怎样阅读</h3><p>正文、纸艺、音效与字体均随书保存，可直接打开 index.html，也可放到静态网站。外部资料链接需要联网。故事进度保留到本次页面关闭或刷新；分享链接定位章节与段落。</p>`);
    }

    async function share(value = route) {
        const url = new URL(location.href);
        url.hash = urlFor(value).slice(1);
        try {
            if(location.protocol === 'file:') throw new Error('local-file');
            await navigator.clipboard.writeText(url.href);
            showNotice('阅读位置已复制，可以分享了。');
        } catch {
            showUtility(`<h2 id="utility-title">分享阅读位置</h2><p>${location.protocol === 'file:' ? '当前从本地打开。把完整文件夹分享给对方后，可用下面的章节位置；部署到网站后会生成网页链接。' : '复制下面的地址，对方会直接到达这一段。'}</p><input aria-label="阅读位置链接" readonly value="${escapeHtml(location.protocol === 'file:' ? 'index.html' + url.hash : url.href)}">`);
            $('#utility-content input').select();
        }
    }

    function setReadingChapter(chapter) {
        PB.Camera.reset();
        PB.Engine.select(chapter, isLongScroll && !compactReading.matches);
        PB.Story.select(chapter);
        PB.setPaused(compactReading.matches);
        $('#sticky-title').textContent = chapters[chapter - 1].word + ' · ' + chapters[chapter - 1].title;
        $('#scroll-chapters').querySelectorAll('a').forEach(link => {
            if(Number(link.dataset.chapter) === chapter) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function syncScrollChapter() {
        scrollFrame = null;
        if(route.view !== 'scroll' || paperDialog.open || utilityDialog.open) return;
        const articles = [...document.querySelectorAll('.scroll-article')];
        const active = articles.filter(article => article.getBoundingClientRect().top < innerHeight * .4).at(-1);
        if(!active) return;
        const number = Number(active.dataset.chapter);
        if(number === route.chapter) return;
        route = {view: 'scroll', chapter: number};
        history.replaceState(null, '', urlFor(route));
        setReadingChapter(number);
    }

    function onAction(action, element) {
        const chapter = route.chapter;
        switch(action) {
            case 'preface': navigate({view: 'paper', chapter, paper: 'preface'}); break;
            case 'catalog':
                if(edition === 'v7_1' && route.view === 'home') $('#catalog').scrollIntoView();
                else showCatalog();
                break;
            case 'enter':
                navigate({view: 'scene', chapter: 1});
                if(edition === 'v7_2') navigate({view: 'paper', chapter: 1, paper: 'preface'});
                break;
            case 'enter-current': navigate({view: 'scene', chapter}); break;
            case 'leave': navigate(sceneReturn, {toChapter: isLongScroll}); break;
            case 'read-current':
                if(isV10) {
                    if(paperDialog.open) closePaper();
                    requestReading(chapter);
                } else {
                    navigate({view: edition === 'v7_2' || route.view === 'paper' ? 'paper' : 'read', chapter}, {toChapter: true});
                }
                break;
            case 'paper': navigate({view: 'paper', chapter, paper: element.dataset.paper}); break;
            case 'close-paper': closePaper(); break;
            case 'sources': showSources(); break;
            case 'close-utility': closeUtility(); break;
            case 'pause-story': PB.Story.setPaused(!PB.Story.getState().paused); break;
            case 'reset-story': PB.Story.reset(); break;
            case 'replay-story': PB.Tour.replay(chapter); break;
            case 'share': share(); break;
            case 'tour': PB.Tour.start(); break;
            case 'tour-previous': PB.Tour.previous(); break;
            case 'tour-next': PB.Tour.next(); break;
            case 'tour-pause': PB.Tour.toggle(); break;
            case 'tour-stop': PB.Tour.stop(); break;
        }
    }

    document.addEventListener('click', event => {
        if(event.defaultPrevented) return;
        const target = event.target.closest('button, a');
        if(!target) return;
        if(target.matches('a[href^="#view="]')) {
            if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const parameters = new URLSearchParams(target.getAttribute('href').slice(1));
            if(utilityDialog.open) closeUtility();
            const toTop = parameters.get('view') === 'home';
            const destination = toTop ? {view: 'home', chapter: 1} : Object.fromEntries(parameters);
            navigate(destination, {toChapter: !toTop, toTop});
            if(isV10 && toTop) requestReading(1);
        } else if(target.dataset.action) onAction(target.dataset.action, target);
        else if(target.dataset.camera) {
            PB.Tour?.manualPause();
            PB.Camera.setMode(target.dataset.camera);
        } else if(target.dataset.enterChapter) {
            navigate({view: 'scene', chapter: Number(target.dataset.enterChapter)});
        } else if(target.dataset.openNote !== undefined) {
            navigate({view: 'paper', chapter: Number(target.dataset.chapter), paper: target.dataset.openNote});
        } else if(target.dataset.shareSection !== undefined) {
            share({view: isLongScroll ? 'scroll' : edition === 'v7_2' ? 'paper' : 'read',
                chapter: target.dataset.chapter, section: target.dataset.shareSection});
        } else if(target.dataset.choice !== undefined) PB.Story.choose(Number(target.dataset.choice));
    });

    $('#story-primary').addEventListener('click', () => {
        if(suppressPrimaryClick) {
            suppressPrimaryClick = false;
            return;
        }
        const state = PB.Story.getState();
        if(state.phase === 'intro') PB.Story.start();
        else if(state.phase === 'ready') PB.Story.finish();
        else if(state.phase === 'done') onAction('read-current');
        else if(state.chapter === 3) PB.Story.setInput(0);
    });
    const holdButton = $('#story-primary');
    holdButton.addEventListener('pointerdown', event => {
        const state = PB.Story.getState();
        if(state.phase !== 'active' || state.chapter === 3) return;
        suppressPrimaryClick = true;
        event.preventDefault();
        holdButton.setPointerCapture(event.pointerId);
        PB.Story.setInput(1);
    });
    for(const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
        holdButton.addEventListener(name, () => PB.Story.setInput(0, true));
    }
    holdButton.addEventListener('pointercancel', () => {suppressPrimaryClick = false;});
    holdButton.addEventListener('keydown', event => {
        if([' ', 'Enter'].includes(event.key) && PB.Story.getState().phase === 'active') {
            event.preventDefault(); PB.Story.setInput(1);
        }
    });
    holdButton.addEventListener('keyup', () => PB.Story.setInput(0, true));
    $('#story-step').addEventListener('click', () => PB.Story.addProgress(.12));
    $('#pour-angle').addEventListener('input', event => PB.Story.setInput(Number(event.target.value) / 100));
    workbench.addEventListener('pointerdown', event => {
        const state = PB.Story.getState();
        if(state.phase !== 'active' || state.paused || !event.isPrimary) return;
        const bounds = workbench.getBoundingClientRect();
        gesture = {id: event.pointerId, x: event.clientX, y: event.clientY, bounds,
            angle: Math.atan2(event.clientY - bounds.top - bounds.height / 2,
                event.clientX - bounds.left - bounds.width / 2)};
        workbench.setPointerCapture(event.pointerId);
        workbench.dataset.active = 'true';
        PB.Tour?.manualPause();
        event.preventDefault();
    });
    workbench.addEventListener('pointermove', event => {
        if(!gesture || event.pointerId !== gesture.id) return;
        const state = PB.Story.getState();
        const {bounds} = gesture;
        const x = (event.clientX - bounds.left) / bounds.width * 340;
        const y = (event.clientY - bounds.top) / bounds.height * 180;
        if(state.chapter === 1) {
            const angle = Math.atan2(y - 84, x - 172);
            let difference = angle - gesture.angle;
            if(difference > Math.PI) difference -= Math.PI * 2;
            if(difference < -Math.PI) difference += Math.PI * 2;
            const distance = Math.hypot(x - 172, y - 84);
            if(distance > 12 && distance < 140) PB.Story.addProgress(Math.abs(difference) / (Math.PI * 12));
            gesture.angle = angle;
        } else if(state.chapter === 4) {
            const targetX = 79 + state.progress * 176;
            const targetY = 94 + Math.sin(state.progress * 22 * .38) * 13;
            if(Math.abs(y - targetY) < 28 && x >= targetX - 12 && x < targetX + 45) {
                PB.Story.addProgress(Math.max(0, x - targetX) / 176);
            }
        } else {
            PB.Story.setInput(PB.clamp((event.clientX - gesture.x) / (bounds.width * .42), 0, 1));
        }
    });
    function endGesture() {
        gesture = null;
        workbench.dataset.active = 'false';
        PB.Story.setInput(0, true);
    }
    for(const name of ['pointerup', 'pointercancel', 'lostpointercapture']) workbench.addEventListener(name, endGesture);
    window.addEventListener('gesture-cancel', () => {
        gesture = null;
        suppressPrimaryClick = false;
        workbench.dataset.active = 'false';
    });
    workbench.addEventListener('keydown', event => {
        if(!['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', ' '].includes(event.key)) return;
        event.preventDefault();
        if(PB.Story.getState().chapter === 3) {
            const direction = ['ArrowLeft', 'ArrowDown'].includes(event.key) ? -1 : 1;
            PB.Story.setInput(PB.Story.getState().angle + direction * .15);
        } else PB.Story.addProgress(.065);
    });
    paperDialog.addEventListener('cancel', event => {event.preventDefault(); closePaper();});
    utilityDialog.addEventListener('cancel', event => {event.preventDefault(); closeUtility();});
    window.addEventListener('popstate', () => {
        PB.Tour?.manualPause();
        positions.set(keyFor(route), window.scrollY);
        const next = parseRoute();
        renderRoute(next, {toChapter: !positions.has(keyFor(next))});
    });
    window.addEventListener('hashchange', () => {
        const next = parseRoute();
        if(urlFor(next) !== urlFor(route)) renderRoute(next, {toChapter: true});
    });
    window.addEventListener('story-change', event => renderStory(event.detail));
    PB.root.addEventListener('pointerdown', () => PB.Tour?.manualPause(),
        {capture: true});
    PB.root.addEventListener('keydown', event => {
        if(['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp',
            'ArrowDown'].includes(event.key)) PB.Tour?.manualPause();
    }, {capture: true});
    window.addEventListener('camera-change', event => {
        document.body.classList.toggle('has-closeup', innerWidth <= 760 &&
            route.view === 'scene' && event.detail !== 'overview');
        requestAnimationFrame(() => PB.Book.fit());
    });
    window.addEventListener('resize', () => {
        const isMobile = innerWidth <= 760;
        document.body.classList.toggle('has-closeup', isMobile &&
            ['scene', 'paper'].includes(route.view) &&
            PB.Camera.getMode() !== 'overview');
        if(route.view === 'scroll') PB.setPaused(compactReading.matches);
        PB.Book.fit();
    });
    window.addEventListener('book-ready', event => {
        const state = PB.Story.getState();
        if(route.view === 'scene' && (route.chapter === event.detail.chapter || PB.Tour?.isReadingAlong())) {
            showSceneHeading(event.detail.chapter);
        }
        if(event.detail.ready && route.view === 'scene' && route.chapter === event.detail.chapter &&
            state.chapter === route.chapter && state.paused) PB.setPaused(true);
        if(previousChapter) renderStory(state);
    });
    window.addEventListener('open-book', () => onAction('enter'));
    window.addEventListener('focus-story', () => {
        if(isV10) return;
        if(innerWidth <= 760) $('#story-panel').scrollIntoView({block: 'start'});
        else workbench.focus({preventScroll: true});
    });
    window.addEventListener('scroll', () => {
        if(!scrollFrame) scrollFrame = requestAnimationFrame(syncScrollChapter);
    }, {passive: true});

    document.body.dataset.edition = edition;
    $('#introduction').textContent = CITY_BOOK.introduction;
    $('#chapter-index').innerHTML = chapters.map(chapter => `<a class="chapter-row" href="${chapterLink(chapter)}"><span class="chapter-number">0${chapter.id}</span><span class="chapter-word">${chapter.word}</span><span class="chapter-name">${chapter.title}<small class="chapter-region">${chapter.region}</small></span><span class="chapter-teaser">${chapter.lead.slice(0, 52)}…</span><span class="chapter-link">读这一章 ↗</span></a>`).join('');
    $('#scroll-chapters').innerHTML = chapters.map(chapter => `<a href="${urlFor({view: 'scroll', chapter: chapter.id})}" data-chapter="${chapter.id}"><strong>${chapter.word}</strong><span>${chapter.title}</span></a>`).join('');
    if(isLongScroll) $('#scroll-articles').innerHTML = chapters.map(chapter => renderArticle(chapter, true)).join('');
    if(edition === 'v7_2') {
        $('.hero-copy h1').innerHTML = '翻开一页，<br>走近一种生活。';
        $('[data-action="enter"]').innerHTML = '打开红布封面 ↗';
    }
    const initialRoute = parseRoute();
    if(isLongScroll && initialRoute.view === 'paper' && initialRoute.paper === 'preface') {
        renderRoute({view: isV10 ? 'scene' : 'scroll', chapter: initialRoute.chapter}, {keepScroll: true});
    }
    renderRoute(initialRoute, {toChapter: new URLSearchParams(location.hash.slice(1)).has('chapter')});
    if('serviceWorker' in navigator && ['http:', 'https:'].includes(location.protocol)) {
        navigator.serviceWorker.register('sw.js').catch(() => {
            // Local-file opening remains available if the host disables workers.
        });
    }
    return {navigate, getRoute: () => ({...route}), takeReadingRequest, showNotice, share};
})();
