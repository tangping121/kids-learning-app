/**
 * 主应用逻辑
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
        TTS.init();
        Navigation.init();
        detectDeviceMode();
        setupClock();
        setupBackgroundEffects();
        setupCardClicks();

        // 默认选中第一个卡片（TV模式需要焦点）
        if (!isTouchDevice) {
            setTimeout(() => {
                const firstCard = document.querySelector('.home-card');
                if (firstCard) firstCard.classList.add('focused');
            }, 100);
        }
    }

    // 检测设备模式：触屏手机 vs TV遥控器
    function detectDeviceMode() {
        isTouchDevice = ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0) ||
                        (window.matchMedia('(hover: none) and (pointer: coarse)').matches);

        const app = document.getElementById('app');
        const tvHints = document.getElementById('footer-hints-tv');
        const touchHints = document.getElementById('footer-hints-touch');

        if (isTouchDevice) {
            // 触屏手机：不强制横屏旋转
            app.classList.remove('tv-mode');
            document.body.classList.add('touch-device');
            if (tvHints) tvHints.style.display = 'none';
            if (touchHints) touchHints.style.display = 'flex';
        } else {
            // TV/遥控器：启用横屏旋转
            app.classList.add('tv-mode');
            document.body.classList.remove('touch-device');
            if (tvHints) tvHints.style.display = 'flex';
            if (touchHints) touchHints.style.display = 'none';
        }
    }

    function setupClock() {
        function updateClock() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const clock = document.getElementById('clock');
            if (clock) clock.textContent = h + ':' + m;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    function setupBackgroundEffects() {
        // 添加背景星星
        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            const starsDiv = document.createElement('div');
            starsDiv.className = 'bg-stars';
            for (let i = 0; i < 20; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.textContent = '✦';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.fontSize = (10 + Math.random() * 20) + 'px';
                star.style.animationDelay = Math.random() * 2 + 's';
                starsDiv.appendChild(star);
            }
            homeScreen.insertBefore(starsDiv, homeScreen.firstChild);
        }
    }

    function setupCardClicks() {
        const TAP_MOVE = 15;
        const TAP_TIME = 500;
        let lastTouchEnd = 0;
        let touchStart = null;

        function resolveElement(el) {
            if (!el) return null;
            if (el.nodeType === Node.ELEMENT_NODE) return el;
            if (el.nodeType === Node.TEXT_NODE) return el.parentElement;
            return null;
        }

        function elementAtTouch(touch) {
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            return resolveElement(el);
        }

        function handleTapOnElement(rawTarget) {
            const target = resolveElement(rawTarget);
            if (!target || !target.closest) return;

            // 详情页按钮（WebView 中 inline onclick 可能不触发）
            const btn = target.closest('.action-btn, .back-btn');
            if (btn) {
                const onclickAttr = btn.getAttribute('onclick');
                if (onclickAttr) {
                    try {
                        new Function(onclickAttr).call(btn);
                    } catch (err) {
                        console.error('onclick执行失败:', err);
                    }
                }
                return;
            }

            const card = target.closest(
                '.content-card, .home-card, .sub-nav-item, .letter-card'
            );
            if (!card) return;

            if (card.classList.contains('home-card')) {
                const screen = card.dataset.screen;
                if (screen) navigateTo(screen);
                return;
            }

            if (card.classList.contains('sub-nav-item')) {
                const module = card.dataset.module;
                const parentScreen = card.closest('.screen');
                if (module && parentScreen) {
                    selectSubNav(parentScreen, module, card);
                }
                return;
            }

            if (card.classList.contains('content-card') || card.classList.contains('letter-card')) {
                const screen = card.closest('.screen');
                if (screen) {
                    const screenKey = screen.id.replace('-screen', '');
                    const moduleObj = SCREENS[screenKey];
                    if (moduleObj) {
                        moduleObj.module.handleCardClick(card);
                    }
                }
            }
        }

        // 触屏：touchstart 记录起点与目标，touchend 判定为点击后再跳转
        document.addEventListener('touchstart', function(e) {
            if (!e.touches || e.touches.length !== 1) {
                touchStart = null;
                return;
            }
            const t = e.touches[0];
            touchStart = {
                x: t.clientX,
                y: t.clientY,
                el: elementAtTouch(t),
                time: Date.now()
            };
        }, { passive: true, capture: true });

        document.addEventListener('touchend', function(e) {
            if (!touchStart || !e.changedTouches || e.changedTouches.length !== 1) {
                touchStart = null;
                return;
            }

            const t = e.changedTouches[0];
            const dx = t.clientX - touchStart.x;
            const dy = t.clientY - touchStart.y;
            const dt = Date.now() - touchStart.time;
            const startEl = touchStart.el;
            touchStart = null;

            if (Math.abs(dx) > TAP_MOVE || Math.abs(dy) > TAP_MOVE || dt > TAP_TIME) return;
            if (Navigation.consumeSwipe && Navigation.consumeSwipe(dx, dy, dt)) return;

            lastTouchEnd = Date.now();
            const target = elementAtTouch(t) || startEl;
            if (target) {
                handleTapOnElement(target);
                e.preventDefault();
            }
        }, { passive: false, capture: true });

        // 鼠标 / TV 遥控器 click
        document.addEventListener('click', function(e) {
            if (Date.now() - lastTouchEnd < 400) return;
            handleTapOnElement(e.target);
        });

        // pointer 兜底（部分 WebView 对 touch 事件支持不完整）
        document.addEventListener('pointerup', function(e) {
            if (e.pointerType !== 'touch') return;
            if (Date.now() - lastTouchEnd < 400) return;
            lastTouchEnd = Date.now();
            handleTapOnElement(e.target);
        });

        // 鼠标悬停焦点（仅桌面端）
        document.addEventListener('mouseover', function(e) {
            const focusable = e.target.closest('.focusable');
            if (focusable && !focusable.closest('.detail-actions')) {
                const allFocusable = document.querySelectorAll('.screen.active .focusable');
                allFocusable.forEach(f => f.classList.remove('focused'));
                focusable.classList.add('focused');
            }
        });
    }

    function navigateTo(screen) {
        if (!SCREENS[screen]) return;

        // 切换屏幕
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const targetScreen = document.getElementById(SCREENS[screen].id);
        targetScreen.classList.add('active');

        currentScreen = screen;
        updateBreadcrumb(SCREENS[screen].name);

        // 自动选择第一个子导航项
        const firstSubNav = targetScreen.querySelector('.sub-nav-item');
        if (firstSubNav) {
            const module = firstSubNav.dataset.module;
            selectSubNav(targetScreen, module, firstSubNav);
        }
    }

    function navigateHome() {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('home-screen').classList.add('active');
        currentScreen = 'home';
        currentModule = null;
        updateBreadcrumb('首页');
        TTS.stop();
        Navigation.setContext('home');
    }

    function selectSubNav(screenEl, module, navEl) {
        // 更新子导航高亮
        screenEl.querySelectorAll('.sub-nav-item').forEach(item => item.classList.remove('active'));
        navEl.classList.add('active');

        currentModule = module;
        const screenKey = screenEl.id.replace('-screen', '');
        const moduleName = SCREENS[screenKey] ? SCREENS[screenKey].name : '';
        updateBreadcrumb(moduleName + ' / ' + navEl.textContent);

        // 渲染对应模块内容
        const contentEl = screenEl.querySelector('.module-content');
        const moduleObj = SCREENS[screenKey];
        if (moduleObj && contentEl) {
            moduleObj.module.render(module, contentEl);
            Navigation.setContext('subnav');
        }
    }

    function updateBreadcrumb(text) {
        const bc = document.getElementById('breadcrumb');
        if (bc) bc.innerHTML = '<span>' + text + '</span>';
    }

    return {
        init: init,
        navigateTo: navigateTo,
        navigateHome: navigateHome
    };
})();

// 全局 Toast 提示
function showToast(message, duration) {
    duration = duration || 2000;
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 启动
document.addEventListener('DOMContentLoaded', App.init);
