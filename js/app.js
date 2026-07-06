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
        // 鼠标/触摸点击支持
        document.addEventListener('click', function(e) {
            const card = e.target.closest('.content-card[data-type], .home-card, .sub-nav-item, .letter-card[data-type]');
            if (!card) return;

            // 如果是详情视图内的按钮，不处理
            if (card.closest('.detail-actions')) return;

            // 主页卡片
            if (card.classList.contains('home-card')) {
                const screen = card.dataset.screen;
                navigateTo(screen);
                return;
            }

            // 子导航
            if (card.classList.contains('sub-nav-item')) {
                const module = card.dataset.module;
                const parentScreen = card.closest('.screen');
                selectSubNav(parentScreen, module, card);
                return;
            }

            // 内容卡片
            if (card.classList.contains('content-card') || card.classList.contains('letter-card')) {
                const screen = card.closest('.screen');
                if (screen) {
                    const screenKey = screen.id.replace('-screen', '');
                    const moduleObj = SCREENS[screenKey];
                    if (moduleObj) {
                        moduleObj.module.handleCardClick(card);
                    }
                }
                return;
            }
        });

        // 鼠标悬停焦点
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
