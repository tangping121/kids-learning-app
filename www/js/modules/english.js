/**
 * 英语模块
 */
const EnglishModule = (function() {

    function render(module, container) {
        switch(module) {
            case 'alphabet': renderAlphabet(container); break;
            case 'words': renderWords(container); break;
            case 'dialogue': renderDialogue(container); break;
            case 'songs': renderSongs(container); break;
        }
    }

    // 字母学习
    function renderAlphabet(container) {
        let html = '<div class="alphabet-grid">';
        ALPHABET_DATA.forEach((item, i) => {
            html += `<div class="letter-card focusable" data-type="alphabet" data-index="${i}">
                <div class="letter-upper">${item.upper}</div>
                <div class="letter-lower">${item.lower}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showAlphabetDetail(index) {
        const item = ALPHABET_DATA[index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main">
                    <div class="detail-display bounce" style="flex-direction: column; color: #2ecc71;">
                        <div style="font-size: 200px;">${item.upper}</div>
                        <div style="font-size: 100px; color: var(--color-text-dim);">${item.lower}</div>
                    </div>
                    <div class="detail-info">
                        <h2 style="color: #2ecc71;">字母 ${item.upper} / ${item.lower}</h2>
                        <p class="pinyin">音标：/${item.phonetic}/</p>
                        <p style="font-size: 28px;">单词：<span style="color: #4ecdc4; font-weight: 700;">${item.word}</span></p>
                        <p style="font-size: 22px;">中文：${item.cn}</p>
                        <p style="font-size: 80px;">${item.emoji}</p>
                        <div class="detail-actions">
                            <button class="action-btn play-btn focusable" onclick="EnglishModule.playAlphabet(${index})">🔊 听发音</button>
                            <button class="action-btn next-btn focusable" onclick="EnglishModule.playAlphabetWord(${index})">📖 读单词</button>
                            <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playAlphabet(index), 500);
    }

    function playAlphabet(index) {
        const item = ALPHABET_DATA[index];
        TTS.speakEnglish(item.upper + ' ' + item.lower);
    }

    function playAlphabetWord(index) {
        const item = ALPHABET_DATA[index];
        TTS.speakEnglish(item.word + '. ' + item.word + ' means ' + item.cn);
    }

    // 单词认知
    function renderWords(container) {
        let html = '';
        Object.keys(WORDS_DATA).forEach(category => {
            html += `<div class="content-card focusable section-header" style="grid-column: 1/-1; background: rgba(46,204,113,0.15);"><h2 style="font-size:30px;">📦 ${category}</h2></div>`;
            WORDS_DATA[category].forEach((item, i) => {
                const globalIndex = category + '-' + i;
                html += `<div class="content-card focusable" data-type="word" data-cat="${category}" data-index="${i}">
                    <div class="card-emoji">${item.emoji}</div>
                    <div class="card-text" style="font-size:26px; color: #2ecc71;">${item.en}</div>
                    <div class="card-desc">${item.cn}</div>
                </div>`;
            });
        });
        container.innerHTML = '<div class="content-grid">' + html + '</div>';
        Navigation.refreshFocusables();
    }

    function showWordDetail(cat, index) {
        const item = WORDS_DATA[cat][index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main">
                    <div class="detail-display bounce" style="font-size: 140px;">
                        ${item.emoji}
                    </div>
                    <div class="detail-info">
                        <h2 style="color: #2ecc71; font-size: 48px;">${item.en}</h2>
                        <p style="font-size: 28px;">中文：${item.cn}</p>
                        <p style="font-size: 20px; color: var(--color-text-dim);">分类：${cat}</p>
                        <div class="detail-actions">
                            <button class="action-btn play-btn focusable" onclick="EnglishModule.playWord('${item.en}', '${item.cn}')">🔊 读单词</button>
                            <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playWord(item.en, item.cn), 500);
    }

    function playWord(en, cn) {
        TTS.speakSequence([
            { text: en, lang: 'en-US' },
            { text: cn, lang: 'zh-CN' }
        ]);
    }

    // 日常对话
    function renderDialogue(container) {
        let html = '<div class="content-grid">';
        DIALOGUE_DATA.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="dialogue" data-index="${i}" style="min-height: 160px;">
                <div class="card-emoji">💬</div>
                <div class="card-text" style="font-size:26px;">${item.title}</div>
                <div class="card-desc">${item.lines.length} 句对话</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showDialogueDetail(index) {
        const item = DIALOGUE_DATA[index];
        let linesHtml = '';
        item.lines.forEach((line, i) => {
            linesHtml += `
                <div class="dialogue-line" style="animation-delay: ${i * 0.3}s;">
                    <div class="speaker">${line.speaker}</div>
                    <div class="bubble">
                        <div class="en">${line.en}</div>
                        <div class="cn">${line.cn}</div>
                    </div>
                </div>
            `;
        });

        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column;">
                    <h2 style="font-size: 36px; color: #2ecc71; margin-bottom: 20px;">💬 ${item.title}</h2>
                    <div class="dialogue-view">${linesHtml}</div>
                    <div class="detail-actions" style="margin-top: 25px;">
                        <button class="action-btn play-btn focusable" onclick="EnglishModule.playDialogue(${index})">🔊 听对话</button>
                        <button class="action-btn next-btn focusable" onclick="EnglishModule.playDialogueCN(${index})">🔊 中文翻译</button>
                        <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playDialogue(index), 800);
    }

    function playDialogue(index) {
        const item = DIALOGUE_DATA[index];
        let sequence = [];
        item.lines.forEach(line => {
            sequence.push({ text: line.en, lang: 'en-US' });
        });
        TTS.speakSequence(sequence);
    }

    function playDialogueCN(index) {
        const item = DIALOGUE_DATA[index];
        let text = '';
        item.lines.forEach(line => {
            text += line.cn + '。';
        });
        TTS.speakChinese(text);
    }

    // 英文儿歌
    function renderSongs(container) {
        let html = '<div class="content-grid">';
        SONGS_DATA.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="song" data-index="${i}" style="min-height: 160px;">
                <div class="card-emoji">🎵</div>
                <div class="card-text" style="font-size:24px;">${item.title}</div>
                <div class="card-desc">${item.cn}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showSongDetail(index) {
        const item = SONGS_DATA[index];
        let lyricsHtml = '';
        item.lyrics.forEach((line, i) => {
            lyricsHtml += `<p style="animation-delay: ${i * 0.2}s;">${line}</p>`;
        });

        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column;">
                    <div class="song-view">
                        <div class="song-title">🎵 ${item.title}</div>
                        <p style="color: var(--color-text-dim); margin-bottom: 20px;">${item.cn}</p>
                        <div class="song-lyrics">${lyricsHtml}</div>
                        <div class="detail-actions" style="margin-top: 25px;">
                            <button class="action-btn play-btn focusable" onclick="EnglishModule.playSong(${index})">🔊 唱一唱</button>
                            <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playSong(index), 800);
    }

    function playSong(index) {
        const item = SONGS_DATA[index];
        let text = item.lyrics.join('. ');
        TTS.speakEnglish(text);
    }

    function handleCardClick(card) {
        const type = card.dataset.type;
        const index = parseInt(card.dataset.index);
        const cat = card.dataset.cat;

        switch(type) {
            case 'alphabet': showAlphabetDetail(index); break;
            case 'word': showWordDetail(cat, index); break;
            case 'dialogue': showDialogueDetail(index); break;
            case 'song': showSongDetail(index); break;
        }
    }

    return {
        render: render,
        handleCardClick: handleCardClick,
        playAlphabet: playAlphabet,
        playAlphabetWord: playAlphabetWord,
        playWord: playWord,
        playDialogue: playDialogue,
        playDialogueCN: playDialogueCN,
        playSong: playSong
    };
})();
