/**
 * 数学模块
 */
const MathModule = (function() {

    function render(module, container) {
        switch(module) {
            case 'numbers': renderNumbers(container); break;
            case 'addition': renderArithmetic(container); break;
            case 'shapes': renderShapes(container); break;
            case 'counting': renderCounting(container); break;
        }
    }

    // 数字认知
    function renderNumbers(container) {
        let html = '<div class="content-grid">';
        NUMBERS_DATA.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="number" data-index="${i}">
                <div class="card-text" style="font-size:72px; color: #3498db;">${item.num}</div>
                <div class="card-text" style="font-size:28px; color: var(--color-gold);">${item.word}</div>
                <div class="card-desc">${item.pinyin}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showNumberDetail(index) {
        const item = NUMBERS_DATA[index];
        let objectsHtml = '';
        for (let i = 0; i < item.count; i++) {
            objectsHtml += `<span class="obj" style="animation-delay: ${i * 0.15}s;">${item.emoji}</span>`;
        }

        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main">
                    <div class="detail-display bounce" style="color: #3498db; font-size: 180px;">
                        ${item.num}
                    </div>
                    <div class="detail-info">
                        <h2>数字 ${item.num} - ${item.word}</h2>
                        <p class="pinyin">拼音：${item.pinyin}</p>
                        <p style="font-size: 28px;">中文写作：<span style="color: var(--color-gold); font-size: 36px;">${item.word}</span></p>
                        <div class="math-objects" style="max-width: 400px;">${objectsHtml}</div>
                        <div class="detail-actions" style="margin-top: 20px;">
                            <button class="action-btn play-btn focusable" onclick="MathModule.playNumber(${index})">🔊 读数字</button>
                            <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playNumber(index), 600);
    }

    function playNumber(index) {
        const item = NUMBERS_DATA[index];
        TTS.speakChinese('数字' + item.num + '，中文写作' + item.word + '，' + item.pinyin);
    }

    // 加减运算
    function renderArithmetic(container) {
        let html = '<div class="content-grid">';
        html += '<div class="content-card focusable section-header" style="grid-column: 1/-1; background: rgba(52,152,219,0.15);"><h2 style="font-size:32px;">➕ 加法练习</h2></div>';
        ADDITION_PROBLEMS.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="arithmetic" data-index="${i}" data-sub="add">
                <div class="card-text" style="font-size:36px; color: #3498db;">${item.a} ${item.op} ${item.b} = ?</div>
                <div class="card-emoji" style="font-size:32px;">${item.emoji}</div>
            </div>`;
        });
        html += '<div class="content-card focusable section-header" style="grid-column: 1/-1; background: rgba(52,152,219,0.15);"><h2 style="font-size:32px;">➖ 减法练习</h2></div>';
        SUBTRACTION_PROBLEMS.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="arithmetic" data-index="${i}" data-sub="sub">
                <div class="card-text" style="font-size:36px; color: #3498db;">${item.a} ${item.op} ${item.b} = ?</div>
                <div class="card-emoji" style="font-size:32px;">${item.emoji}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showArithmeticDetail(index, sub) {
        const item = sub === 'add' ? ADDITION_PROBLEMS[index] : SUBTRACTION_PROBLEMS[index];
        let groupA = '', groupB = '';

        for (let i = 0; i < item.a; i++) {
            groupA += `<span class="obj" style="animation-delay: ${i * 0.1}s;">${item.emoji}</span>`;
        }
        for (let i = 0; i < item.b; i++) {
            groupB += `<span class="obj" style="animation-delay: ${(item.a + i) * 0.1}s;">${item.emoji}</span>`;
        }

        const symbol = sub === 'add' ? '+' : '-';
        const opText = sub === 'add' ? '加' : '减';

        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column;">
                    <div class="arithmetic-display" style="margin-bottom: 20px;">
                        <span style="color: #3498db;">${item.a}</span>
                        <span style="color: var(--color-gold);">${symbol}</span>
                        <span style="color: #2ecc71;">${item.b}</span>
                        <span style="color: var(--color-gold);">=</span>
                        <span class="result-display" style="color: #e94560; font-size: 120px;">?</span>
                    </div>
                    <div style="display: flex; gap: 40px; align-items: center; margin-bottom: 20px;">
                        <div>
                            <div class="arithmetic-group">${groupA}</div>
                            <p style="text-align: center; font-size: 28px; color: #3498db; margin-top: 10px;">${item.a}</p>
                        </div>
                        <div style="font-size: 60px; color: var(--color-gold);">${symbol}</div>
                        <div>
                            <div class="arithmetic-group">${groupB}</div>
                            <p style="text-align: center; font-size: 28px; color: #2ecc71; margin-top: 10px;">${item.b}</p>
                        </div>
                        <div style="font-size: 60px; color: var(--color-gold);">=</div>
                        <div class="result-area" style="min-width: 100px; text-align: center;">
                            <div style="font-size: 80px; color: #e94560; font-weight: 700;" id="result-num">?</div>
                        </div>
                    </div>
                    <div class="detail-actions">
                        <button class="action-btn play-btn focusable" onclick="MathModule.showResult(${index}, '${sub}')">🔍 看答案</button>
                        <button class="action-btn next-btn focusable" onclick="MathModule.playArithmetic(${index}, '${sub}')">🔊 听一听</button>
                        <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playArithmetic(index, sub), 800);
    }

    function showResult(index, sub) {
        const item = sub === 'add' ? ADDITION_PROBLEMS[index] : SUBTRACTION_PROBLEMS[index];
        const resultEl = document.getElementById('result-num');
        if (resultEl) {
            // 动画显示结果
            let current = 0;
            const target = item.result;
            const interval = setInterval(() => {
                current++;
                resultEl.textContent = current;
                resultEl.classList.add('count-anim');
                if (current >= target) {
                    clearInterval(interval);
                    resultEl.style.color = '#2ecc71';
                    resultEl.classList.add('bounce');
                    // 撒花效果
                    showToast('🎉 答对了！' + item.a + (sub === 'add' ? ' 加 ' : ' 减 ') + item.b + ' 等于 ' + item.result);
                    TTS.speakChinese(item.a + (sub === 'add' ? '加' : '减') + item.b + '等于' + item.result);
                }
            }, 200);
        }
    }

    function playArithmetic(index, sub) {
        const item = sub === 'add' ? ADDITION_PROBLEMS[index] : SUBTRACTION_PROBLEMS[index];
        const opText = sub === 'add' ? '加' : '减';
        TTS.speakChinese(item.a + opText + item.b + '等于几？答案是' + item.result);
    }

    // 形状认知
    function renderShapes(container) {
        let html = '<div class="content-grid">';
        SHAPES_DATA.forEach((item, i) => {
            html += `<div class="content-card focusable" data-type="shape" data-index="${i}">
                <svg viewBox="0 0 100 100" style="width:80px; height:80px;">
                    <g fill="${item.color}" fill-opacity="0.3" stroke="${item.color}" stroke-width="3">
                        ${item.svg}
                    </g>
                </svg>
                <div class="card-text" style="font-size:26px; margin-top: 8px;">${item.name}</div>
                <div class="card-desc">${item.desc}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showShapeDetail(index) {
        const item = SHAPES_DATA[index];
        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main">
                    <div class="shape-canvas bounce" style="background: rgba(255,255,255,0.05); border-radius: 30px; border: 3px solid ${item.color};">
                        <svg viewBox="0 0 100 100" style="width:200px; height:200px;">
                            <g fill="${item.color}" fill-opacity="0.4" stroke="${item.color}" stroke-width="3"
                               style="animation: shapePulse 2s ease-in-out infinite;">
                                ${item.svg}
                            </g>
                        </svg>
                    </div>
                    <div class="detail-info">
                        <h2 style="color: ${item.color};">${item.name}</h2>
                        <p class="pinyin">拼音：${item.pinyin}</p>
                        <p style="font-size: 26px;">${item.desc}</p>
                        <div class="detail-actions">
                            <button class="action-btn play-btn focusable" onclick="MathModule.playShape(${index})">🔊 读一读</button>
                            <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 关闭</button>
                        </div>
                    </div>
                </div>
                <style>
                    @keyframes shapePulse {
                        0%, 100% { fill-opacity: 0.3; transform: scale(1); transform-origin: center; }
                        50% { fill-opacity: 0.6; transform: scale(1.05); }
                    }
                </style>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => playShape(index), 500);
    }

    function playShape(index) {
        const item = SHAPES_DATA[index];
        TTS.speakChinese(item.name + '，' + item.pinyin + '。' + item.desc);
    }

    // 趣味数数
    function renderCounting(container) {
        let html = '<div class="content-grid">';
        COUNTING_DATA.forEach((item, i) => {
            let emojis = '';
            for (let j = 0; j < item.count; j++) {
                emojis += item.emoji;
            }
            html += `<div class="content-card focusable" data-type="counting" data-index="${i}" style="min-height: 200px;">
                <div style="font-size: 36px; margin-bottom: 8px;">${emojis}</div>
                <div class="card-desc" style="font-size: 16px;">${item.question}</div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        Navigation.refreshFocusables();
    }

    function showCountingDetail(index) {
        const item = COUNTING_DATA[index];
        let emojis = '';
        for (let i = 0; i < item.count; i++) {
            emojis += `<span class="obj" style="font-size:56px; animation-delay: ${i * 0.2}s;">${item.emoji}</span>`;
        }

        let optionsHtml = '';
        item.options.forEach((opt, i) => {
            optionsHtml += `<button class="action-btn focusable ${opt === item.answer ? 'play-btn' : ''}" onclick="MathModule.checkCounting(${index}, ${opt})">${opt}</button>`;
        });

        const html = `
            <div class="detail-view fade-in">
                <button class="back-btn focusable" onclick="Navigation.handleBack()">‹ 返回</button>
                <div class="detail-main" style="flex-direction: column;">
                    <h2 style="font-size: 32px; color: var(--color-gold); margin-bottom: 20px;">${item.question}</h2>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; max-width: 600px; margin-bottom: 30px;">
                        ${emojis}
                    </div>
                    <p style="font-size: 24px; margin-bottom: 15px;">数一数，选择正确的答案：</p>
                    <div class="detail-actions" id="counting-options">
                        ${optionsHtml}
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.screen.active').insertAdjacentHTML('beforeend', html);
        Navigation.pushContext('detail');
        setTimeout(() => TTS.speakChinese(item.question), 500);
    }

    function checkCounting(index, answer) {
        const item = COUNTING_DATA[index];
        if (answer === item.answer) {
            showToast('🎉 太棒了！答对了！');
            TTS.speakChinese('太棒了，答对了！一共' + item.answer + '个');
            // 添加撒花动画
            const options = document.getElementById('counting-options');
            if (options) {
                options.innerHTML = `<div style="font-size: 80px; animation: bounce 0.5s ease 3;">🎉</div>
                    <p style="font-size: 28px; color: #2ecc71;">正确答案是 ${item.answer} 个！</p>
                    <button class="action-btn close-btn focusable" onclick="Navigation.handleBack()">✕ 完成</button>`;
                Navigation.refreshFocusables();
            }
        } else {
            showToast('🤔 再数一数试试');
            TTS.speakChinese('再数一数试试看');
        }
    }

    function handleCardClick(card) {
        const type = card.dataset.type;
        const index = parseInt(card.dataset.index);
        const sub = card.dataset.sub;

        switch(type) {
            case 'number': showNumberDetail(index); break;
            case 'arithmetic': showArithmeticDetail(index, sub); break;
            case 'shape': showShapeDetail(index); break;
            case 'counting': showCountingDetail(index); break;
        }
    }

    return {
        render: render,
        handleCardClick: handleCardClick,
        playNumber: playNumber,
        showResult: showResult,
        playArithmetic: playArithmetic,
        playShape: playShape,
        checkCounting: checkCounting
    };
})();
