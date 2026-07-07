/**
 * 主应用逻辑
 * v1.5 - 极简触屏方案：touchend(e.target) + click 双保险
 */
const App = (function() {

    const SCREENS = {
        'chinese': { name: '语文', id: 'chinese-screen', module: ChineseModule },
        'math': { name: '数学', id: 'math-screen', module: MathModule },
        'english': { name: '英语', id: 'english-screen', module: EnglishModule }
    };

    let currentScreen = 'home';
    let currentModule = null;
    let isTouchDevice = false;

    function init() {
        // 最关键：先绑定交互事件，确保即使其他模块出错也能点击
        try { setupInteraction(); } catch(err) {}

        // 其余模块逐个 try-catch，任何失败不影响交互
        try { detectDeviceMode(); } catch(e) {}
        try { Navigation.init(); } catch(e) {}
        try { TTS.init(); } catch(e) {}
        try { setupClock(); } catch(e) {}
        try { setupBackgroundEffects(); } catch(e) {}

        if (!isTouchDevice) {
            setTimeout(function() {
                var firstCard = document.querySelector('.home-card');
                if (firstCard) firstCard.classList.add('focused');
            }, 100);
        }
    }

    function detectDeviceMode() {
        isTouchDevice = ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0) ||
                        (window.matchMedia('(hover: none) and (pointer: coarse)').matches);

        var app = document.getElementById('app');
        var tvHints = document.getElementById('footer-hints-tv');
        var touchHints = document.getElementById('footer-hints-touch');

        if (isTouchDevice) {
            app.classList.remove('tv-mode');
            document.body.classList.add('touch-device');
            if (tvHints) tvHints.style.display = 'none';
            if (touchHints) touchHints.style.display = 'flex';
        } else {
            app.classList.add('tv-mode');
            document.body.classList.remove('touch-device');
            if (tvHints) tvHints.style.display = 'flex';
            if (touchHints) touchHints.style.display = 'none';
        }
    }

    function setupClock() {
        function updateClock() {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            var clock = document.getElementById('clock');
            if (clock) clock.textContent = h + ':' + m;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    function setupBackgroundEffects() {
        var homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            var starsDiv = document.createElement('div');
            starsDiv.className = 'bg-stars';
            for (var i = 0; i < 20; i++) {
                var star = document.createElement('span');
                star.className = 'star';
                star.textContent = '\u2726';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.fontSize = (10 + Math.random() * 20) + 'px';
                star.style.animationDelay = Math.random() * 2 + 's';
                starsDiv.appendChild(star);
            }
            homeScreen.insertBefore(starsDiv, homeScreen.firstChild);
        }
    }

    /**
     * 极简交互方案：
     * - touchend 用 e.target（不用 elementFromPoint，后者在 WebView 中不可靠）
     * - click 作为兜底
     * - 500ms 去重防止双触发
     * - 不调用 preventDefault，不阻止任何默认行为
     */
    function setupInteraction() {
        var lastActionTime = 0;

        function tryAction(source, target) {
            if (!target) return;
            var now = Date.now();
            if (now - lastActionTime < 500) return;
            lastActionTime = now;
            handleAction(target);
        }

        // 方案1：touchend（移动端响应快）
        document.addEventListener('touchend', function(e) {
            if (e.defaultPrevented) return;
            tryAction('touchend', e.target);
        }, { passive: true });

        // 方案2：click（兜底）
        document.addEventListener('click', function(e) {
            tryAction('click', e.target);
        });

        // 鼠标悬停焦点（仅桌面端）
        document.addEventListener('mouseover', function(e) {
            var focusable = e.target.closest ? e.target.closest('.focusable') : null;
            if (focusable && !focusable.closest('.detail-actions')) {
                var allFocusable = document.querySelectorAll('.screen.active .focusable');
                allFocusable.forEach(function(f) { f.classList.remove('focused'); });
                focusable.classList.add('focused');
            }
        });
    }

    /**
     * 统一动作处理
     */
    function handleAction(element) {
        if (!element || !element.closest) return;

        // 1) data-action 按钮（返回、播放、关闭等）
        var actionEl = element.closest('[data-action]');
        if (actionEl) {
            dispatchAction(actionEl);
            return;
        }

        // 2) 主页课程卡片
        var homeCard = element.closest('.home-card');
        if (homeCard) {
            var screen = homeCard.getAttribute('data-screen');
            if (screen) {
                navigateTo(screen);
            }
            return;
        }

        // 3) 子导航项
        var subNav = element.closest('.sub-nav-item');
        if (subNav) {
            var module = subNav.getAttribute('data-module');
            var parentScreen = subNav.closest('.screen');
            if (module && parentScreen) {
                selectSubNav(parentScreen, module, subNav);
            }
            return;
        }

        // 4) 内容卡片 / 字母卡片
        var card = element.closest('.content-card, .letter-card');
        if (card) {
            var screenEl = card.closest('.screen');
            if (screenEl) {
                var screenKey = screenEl.id.replace('-screen', '');
                var moduleObj = SCREENS[screenKey];
                if (moduleObj) {
                    moduleObj.module.handleCardClick(card);
                }
            }
            return;
        }
    }

    /**
     * data-action 路由
     */
    function dispatchAction(el) {
        var action = el.getAttribute('data-action');
        if (!action) return;

        try {
            switch(action) {
                case 'back':
                    Navigation.handleBack();
                    break;

                // 语文
                case 'playPinyin':
                    ChineseModule.playPinyin(el.getAttribute('data-p1'), el.getAttribute('data-p2'), el.getAttribute('data-p3'));
                    break;
                case 'playHanzi':
                    ChineseModule.playHanzi(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'strokeDemo':
                    ChineseModule.strokeDemo(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playPoetry':
                    ChineseModule.playPoetry(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playIdiom':
                    ChineseModule.playIdiom(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playSanZiJing':
                    ChineseModule.playSanZiJing(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playBaiJiaXing':
                    ChineseModule.playBaiJiaXing(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playStoryTalk':
                    ChineseModule.playStoryTalk(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'revealAnswer':
                    ChineseModule.revealAnswer(parseInt(el.getAttribute('data-p1')));
                    break;

                // 数学
                case 'playNumber':
                    MathModule.playNumber(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'showResult':
                    MathModule.showResult(parseInt(el.getAttribute('data-p1')), el.getAttribute('data-p2'));
                    break;
                case 'playArithmetic':
                    MathModule.playArithmetic(parseInt(el.getAttribute('data-p1')), el.getAttribute('data-p2'));
                    break;
                case 'playShape':
                    MathModule.playShape(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'checkCounting':
                    MathModule.checkCounting(parseInt(el.getAttribute('data-p1')), parseInt(el.getAttribute('data-p2')));
                    break;
                case 'playTime':
                    MathModule.playTime(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'revealCompare':
                    MathModule.revealCompare(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'checkPattern':
                    MathModule.checkPattern(parseInt(el.getAttribute('data-p1')), el.getAttribute('data-p2'));
                    break;

                // 英语
                case 'playAlphabet':
                    EnglishModule.playAlphabet(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playAlphabetWord':
                    EnglishModule.playAlphabetWord(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playWord':
                    EnglishModule.playWord(el.getAttribute('data-p1'), el.getAttribute('data-p2'));
                    break;
                case 'playDialogue':
                    EnglishModule.playDialogue(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playDialogueCN':
                    EnglishModule.playDialogueCN(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playSong':
                    EnglishModule.playSong(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playColorShape':
                    EnglishModule.playColorShape(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'playNumEn':
                    EnglishModule.playNumEn(parseInt(el.getAttribute('data-p1')));
                    break;
                case 'checkQuiz':
                    EnglishModule.checkQuiz(parseInt(el.getAttribute('data-p1')), parseInt(el.getAttribute('data-p2')));
                    break;
            }
        } catch(err) {
            console.error('action error:', action, err);
        }
    }

    function navigateTo(screen) {
        if (!SCREENS[screen]) return;

        document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
        var targetScreen = document.getElementById(SCREENS[screen].id);
        targetScreen.classList.add('active');

        currentScreen = screen;
        updateBreadcrumb(SCREENS[screen].name);

        var firstSubNav = targetScreen.querySelector('.sub-nav-item');
        if (firstSubNav) {
            var module = firstSubNav.getAttribute('data-module');
            selectSubNav(targetScreen, module, firstSubNav);
        }
    }

    function navigateHome() {
        document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
        document.getElementById('home-screen').classList.add('active');
        currentScreen = 'home';
        currentModule = null;
        updateBreadcrumb('首页');
        TTS.stop();
        Navigation.setContext('home');
    }

    function selectSubNav(screenEl, module, navEl) {
        screenEl.querySelectorAll('.sub-nav-item').forEach(function(item) { item.classList.remove('active'); });
        navEl.classList.add('active');

        currentModule = module;
        var screenKey = screenEl.id.replace('-screen', '');
        var moduleName = SCREENS[screenKey] ? SCREENS[screenKey].name : '';
        updateBreadcrumb(moduleName + ' / ' + navEl.textContent);

        var contentEl = screenEl.querySelector('.module-content');
        var moduleObj = SCREENS[screenKey];
        if (moduleObj && contentEl) {
            moduleObj.module.render(module, contentEl);
            Navigation.setContext('subnav');
        }
    }

    function updateBreadcrumb(text) {
        var bc = document.getElementById('breadcrumb');
        if (bc) bc.innerHTML = '<span>' + text + '</span>';
    }

    return {
        init: init,
        navigateTo: navigateTo,
        navigateHome: navigateHome
    };
})();

function showToast(message, duration) {
    duration = duration || 2000;
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() {
        toast.classList.remove('show');
    }, duration);
}

document.addEventListener('DOMContentLoaded', App.init);
