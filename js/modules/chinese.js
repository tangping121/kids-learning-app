/**
 * 语文模块
 * v1.4 - 去掉 inline onclick，改用 data-action
 */
const ChineseModule = (function() {

    function render(module, container) {
        switch(module) {
            case 'pinyin': renderPinyin(container); break;
            case 'hanzi': renderHanzi(container); break;
            case 'poetry': renderPoetry(container); break;
            case 'idiom': renderIdiom(container); break;
            case 'sanZiJing': renderSanZiJing(container); break;
            case 'baiJiaXing': renderBaiJiaXing(container); break;
            case 'storyTalk': renderStoryTalk(container); break;
        }
    }

    // 拼音学习
    function renderPinyin(container) {
        let html = '<div class="content-grid">';
        html += '<div class="content-card focusable section-header" style="grid-column: 1/-1; background: rgba(231,76,60,0.15);"><h2 style="font-size:32px;">📢 声母 (23个)</h2></div>';
        PINYIN_SHENGMU.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="pinyin" data-index="${i}" data-sub="shengmu">
                <div class="card-emoji">${item.emoji}</div>
                <div class="card-text" style="font-size:48px; color:#e74c3c;">${item.text}</div>
                <div class="card-desc">${item.desc} · ${item.example}</div>
            </div>`;
        });
        html += '<div class="content-card focusable section-header" style="grid-column: 1/-1; background: rgba(231,76,60,0.15);"><h2 style="font-size:32px;">🎵 韵母 (24个)</h2></div>';
        PINYIN_YUNMU.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="pinyin" data-index="${i}" data-sub="yunmu">
                <div class="card-emoji">${item.emoji}</div>
                <div class="card-text" style="font-size:48px; color:#e67e22;">${item.text}</div>
                <div class="card-desc">${item.desc} · ${item.example}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showPinyinDetail(index, sub) {
        const data = sub === 'shengmu' ? PINYIN_SHENGMU[index] : PINYIN_YUNMU[index];
        const color = sub === 'shengmu' ? '#e74c3c' : '#e67e22';
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" data-action="back">‹ 返回</button>
                <div class="detail-main">
                    <div class="detail-display bounce" style="font-size: 160px; color: ${color};">
                        ${data.text}
                    </div>
                    <div class="detail-info">
                        <h2>拼音：${data.text}</h2>
                        <p class="pinyin">读音：${data.desc}</p>
                        <p>例字：${data.example}</p>
                        <p style="font-size:60px;">${data.emoji}</p>
                        <div class="detail-actions">
                            <button class="action-btn play-btn focusable" data-action="playPinyin" data-p1="${data.text}" data-p2="${data.desc}" data-p3="${data.example}">🔊 听发音</button>
                            <button class="action-btn close-btn focusable" data-action="back">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playPinyin(data.text, data.desc, data.example), 500);
    }

    function playPinyin(text, desc, example) {
        TTS.speakChinese(text + '，' + desc + '。例字：' + example);
    }

    // 汉字认知
    function renderHanzi(container) {
        let html = '<div class="content-grid">';
        HANZI_LIST.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="hanzi" data-index="${i}">
                <div class="card-emoji">${item.emoji}</div>
                <div class="card-text" style="font-size:56px; color:#e74c3c; font-family: 'STKaiti','KaiTi',serif;">${item.char}</div>
                <div class="card-desc">${item.pinyin} · ${item.strokes}画</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showHanziDetail(index) {
        const item = HANZI_LIST[index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" data-action="back">‹ 返回</button>
                <div class="detail-main">
                    <div class="detail-display bounce" style="font-family: 'STKaiti','KaiTi',serif; color: #e74c3c;">
                        ${item.char}
                    </div>
                    <div class="detail-info">
                        <h2>${item.char} - ${item.pinyin}</h2>
                        <p class="pinyin">拼音：${item.pinyin}</p>
                        <p>笔画数：${item.strokes} 画</p>
                        <p>意思：${item.meaning}</p>
                        <p>词语：${item.words}</p>
                        <p style="font-size:60px;">${item.emoji}</p>
                        <div class="detail-actions">
                            <button class="action-btn play-btn focusable" data-action="playHanzi" data-p1="${index}">🔊 读汉字</button>
                            <button class="action-btn next-btn focusable" data-action="strokeDemo" data-p1="${index}">✏️ 笔画演示</button>
                            <button class="action-btn close-btn focusable" data-action="back">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playHanzi(index), 500);
    }

    function playHanzi(index) {
        const item = HANZI_LIST[index];
        TTS.speakChinese(item.char + '，' + item.pinyin + '。' + item.meaning + '。词语：' + item.words);
    }

    function strokeDemo(index) {
        const item = HANZI_LIST[index];
        const detailView = document.querySelector('.detail-view');
        if (!detailView) return;

        const display = detailView.querySelector('.detail-display');
        display.innerHTML = `
            <svg viewBox="0 0 200 200" style="width:280px; height:280px;">
                <text x="100" y="140" text-anchor="middle" font-size="140" font-family="STKaiti,KaiTi,serif"
                      fill="none" stroke="#f5a623" stroke-width="3"
                      style="animation: textDraw 3s ease forwards; paint-order: stroke;">
                    ${item.char}
                </text>
            </svg>
            <style>
                @keyframes textDraw {
                    0% { fill: transparent; stroke-dasharray: 1000; stroke-dashoffset: 1000; }
                    50% { fill: transparent; stroke-dashoffset: 0; }
                    100% { fill: #e74c3c; stroke-dashoffset: 0; }
                }
            </style>
        `;
        display.classList.add('pulse');
        TTS.speakChinese(item.char + '，共' + item.strokes + '画');
    }

    // 古诗欣赏
    function renderPoetry(container) {
        let html = '<div class="content-grid">';
        POETRY_LIST.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="poetry" data-index="${i}" style="font-family: 'STKaiti','KaiTi',serif;">
                <div class="card-emoji">📜</div>
                <div class="card-text" style="font-size:32px;">${item.title}</div>
                <div class="card-desc">${item.author}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showPoetryDetail(index) {
        const item = POETRY_LIST[index];
        let linesHtml = '';
        item.lines.forEach((line, i) => {
            linesHtml += `<p style="animation-delay: ${i * 0.3}s;">${line}</p>`;
        });

        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" data-action="back">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column;">
                    <div class="poetry-view">
                        <div class="poetry-title">${item.title}</div>
                        <div class="poetry-author">—— ${item.author}</div>
                        <div class="poetry-lines">${linesHtml}</div>
                        <p style="margin-top:20px; color: var(--color-text-dim); font-size: 18px;">💡 ${item.desc}</p>
                        <div class="detail-actions" style="margin-top: 30px;">
                            <button class="action-btn play-btn focusable" data-action="playPoetry" data-p1="${index}">🔊 朗诵</button>
                            <button class="action-btn close-btn focusable" data-action="back">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playPoetry(index), 800);
    }

    function playPoetry(index) {
        const item = POETRY_LIST[index];
        let text = item.title + '，' + item.author + '。';
        item.lines.forEach(line => { text += line + '。'; });
        TTS.speakChinese(text);
    }

    // 成语故事
    function renderIdiom(container) {
        let html = '<div class="content-grid">';
        IDIOM_LIST.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="idiom" data-index="${i}">
                <div class="card-emoji">📖</div>
                <div class="card-text" style="font-size:28px; font-family: 'STKaiti','KaiTi',serif;">${item.name}</div>
                <div class="card-desc">${item.pinyin}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showIdiomDetail(index) {
        const item = IDIOM_LIST[index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" data-action="back">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column; max-width: 800px;">
                    <div class="poetry-view" style="width: 100%;">
                        <div class="poetry-title" style="font-family: 'STKaiti','KaiTi',serif;">${item.name}</div>
                        <div class="poetry-author">${item.pinyin}</div>
                        <p style="font-size: 26px; color: var(--color-gold); margin: 20px 0;">释义：${item.meaning}</p>
                        <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 16px; margin-top: 15px;">
                            <p style="font-size: 22px; line-height: 2; text-align: left;">📖 ${item.story}</p>
                        </div>
                        <div class="detail-actions" style="margin-top: 25px;">
                            <button class="action-btn play-btn focusable" data-action="playIdiom" data-p1="${index}">🔊 听故事</button>
                            <button class="action-btn close-btn focusable" data-action="back">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playIdiom(index), 500);
    }

    function playIdiom(index) {
        const item = IDIOM_LIST[index];
        TTS.speakChinese(item.name + '。' + item.meaning + '。故事：' + item.story);
    }

    // ====== 三字经 ======
    function renderSanZiJing(container) {
        let html = '<div class="content-grid">';
        SANZIJING_LIST.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="sanZiJing" data-index="${i}" style="font-family: 'STKaiti','KaiTi',serif;">
                <div class="card-emoji">${item.emoji}</div>
                <div class="card-text" style="font-size:24px;">${item.text}</div>
                <div class="card-desc" style="font-size:13px;">${item.meaning}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showSanZiJingDetail(index) {
        const item = SANZIJING_LIST[index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" data-action="back">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column;">
                    <div class="poetry-view">
                        <div style="font-size:80px; margin-bottom:20px;">${item.emoji}</div>
                        <div class="poetry-title" style="font-family: 'STKaiti','KaiTi',serif; font-size:48px;">${item.text}</div>
                        <p style="font-size:26px; color: var(--color-gold); margin:25px 0;">💡 ${item.meaning}</p>
                        <div class="detail-actions" style="margin-top:25px;">
                            <button class="action-btn play-btn focusable" data-action="playSanZiJing" data-p1="${index}">🔊 听朗读</button>
                            <button class="action-btn close-btn focusable" data-action="back">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>`;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playSanZiJing(index), 500);
    }

    function playSanZiJing(index) {
        const item = SANZIJING_LIST[index];
        TTS.speakChinese(item.text + '。' + item.meaning);
    }

    // ====== 百家姓 ======
    function renderBaiJiaXing(container) {
        let html = '<div class="content-grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">';
        BAIJIAXING_LIST.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="baiJiaXing" data-index="${i}" style="min-height:140px;">
                <div class="card-text" style="font-size:56px; color: var(--color-gold); font-family: 'STKaiti','KaiTi',serif;">${item.name}</div>
                <div class="card-desc" style="font-size:14px;">${item.pinyin}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showBaiJiaXingDetail(index) {
        const item = BAIJIAXING_LIST[index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" data-action="back">‹ 返回</button>
                <div class="detail-main">
                    <div class="detail-display bounce" style="font-family: 'STKaiti','KaiTi',serif; color: var(--color-gold);">
                        ${item.name}
                    </div>
                    <div class="detail-info">
                        <h2 style="color: var(--color-gold);">姓${item.name} - ${item.pinyin}</h2>
                        <p class="pinyin">拼音：${item.pinyin}</p>
                        <p style="font-size:24px;">起源：${item.origin}</p>
                        <div class="detail-actions">
                            <button class="action-btn play-btn focusable" data-action="playBaiJiaXing" data-p1="${index}">🔊 读一读</button>
                            <button class="action-btn close-btn focusable" data-action="back">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>`;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playBaiJiaXing(index), 400);
    }

    function playBaiJiaXing(index) {
        const item = BAIJIAXING_LIST[index];
        TTS.speakChinese('姓' + item.name + '，' + item.pinyin + '。' + item.origin);
    }

    // ====== 看图说话 ======
    function renderStoryTalk(container) {
        let html = '<div class="content-grid">';
        STORYTALK_LIST.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="storyTalk" data-index="${i}" style="min-height:180px;">
                <div style="font-size:48px; margin-bottom:8px;">${item.emoji}</div>
                <div class="card-desc" style="font-size:14px;">${item.scene.substring(0, 15)}…</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showStoryTalkDetail(index) {
        const item = STORYTALK_LIST[index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" data-action="back">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column; max-width: 800px;">
                    <div style="font-size:80px; margin-bottom:15px;">${item.emoji}</div>
                    <p style="font-size:28px; line-height:1.8; text-align:center;">${item.scene}</p>
                    <p style="font-size:26px; color: var(--color-gold); margin-top:20px;">❓ ${item.question}</p>
                    <p style="font-size:14px; color: var(--color-text-dim);">💡 提示：${item.hint}</p>
                    <div class="detail-actions" style="margin-top:20px;">
                        <button class="action-btn play-btn focusable" data-action="playStoryTalk" data-p1="${index}">🔊 听描述</button>
                        <button class="action-btn next-btn focusable" data-action="revealAnswer" data-p1="${index}">👀 看答案</button>
                        <button class="action-btn close-btn focusable" data-action="back">✕ 关闭</button>
                    </div>
                    <div id="story-answer" style="margin-top:15px;"></div>
                </div>
            </div>`;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playStoryTalk(index), 500);
    }

    function playStoryTalk(index) {
        const item = STORYTALK_LIST[index];
        TTS.speakChinese(item.scene + '。' + item.question);
    }

    function revealAnswer(index) {
        const item = STORYTALK_LIST[index];
        const answerEl = document.getElementById('story-answer');
        if (answerEl) {
            answerEl.innerHTML = `<div class="bounce" style="font-size:36px; color:#2ecc71; font-weight:700;">✅ ${item.answer}</div>`;
            TTS.speakChinese('答案是：' + item.answer);
        }
    }

    // 处理卡片点击
    function handleCardClick(card) {
        const type = card.dataset.type;
        const index = parseInt(card.dataset.index);
        const sub = card.dataset.sub;

        switch(type) {
            case 'pinyin': showPinyinDetail(index, sub); break;
            case 'hanzi': showHanziDetail(index); break;
            case 'poetry': showPoetryDetail(index); break;
            case 'idiom': showIdiomDetail(index); break;
            case 'sanZiJing': showSanZiJingDetail(index); break;
            case 'baiJiaXing': showBaiJiaXingDetail(index); break;
            case 'storyTalk': showStoryTalkDetail(index); break;
        }
    }

    return {
        render: render,
        handleCardClick: handleCardClick,
        playPinyin: playPinyin,
        playHanzi: playHanzi,
        strokeDemo: strokeDemo,
        playPoetry: playPoetry,
        playIdiom: playIdiom,
        playSanZiJing: playSanZiJing,
        playBaiJiaXing: playBaiJiaXing,
        playStoryTalk: playStoryTalk,
        revealAnswer: revealAnswer
    };
})();
