/**
 * 遥控器/键盘/触屏 导航系统
 * 支持方向键移动焦点、确认/返回操作、触屏滑动返回
 */
const Navigation = (function() {
    let focusableElements = [];
    let currentIndex = 0;
    let currentContext = null; // 'home' | 'subnav' | 'content' | 'detail'
    let contexts = {};
    let lastContextBeforeDetail = null;

    // 触屏滑动状态
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    const SWIPE_THRESHOLD = 80; // 滑动距离阈值
    const SWIPE_TIME = 500; // 滑动时间阈值(ms)

    // 遥控器键码映射
    const KEY_MAP = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'Enter': 'confirm',
        'Escape': 'back',
        'Backspace': 'back',
        ' ': 'confirm',
        'DPAD_UP': 'up',
        'DPAD_DOWN': 'down',
        'DPAD_LEFT': 'left',
        'DPAD_RIGHT': 'right',
        'DPAD_CENTER': 'confirm',
        'BACK': 'back'
    };

    // Android TV 遥控器键码
    const ANDROID_KEY_CODES = {
        19: 'up',
        20: 'down',
        21: 'left',
        22: 'right',
        23: 'confirm',
        4: 'back',
        82: 'menu'
    };

    function init() {
        document.addEventListener('keydown', handleKeyDown);

        // 触屏滑动返回手势
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // 初始化主界面焦点
        setContext('home');
    }

    function handleTouchStart(e) {
        if (!e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }

    function handleTouchEnd(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dt = Date.now() - touchStartTime;

        // 只在详情视图中响应滑动返回（从左边缘向右滑）
        if (dt < SWIPE_TIME && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx > 0 && touchStartX < 50) {
                // 从左边缘右滑 → 返回
                handleBack();
            }
        }
    }

    function handleKeyDown(e) {
        let action = KEY_MAP[e.key];
        if (!action && ANDROID_KEY_CODES[e.keyCode]) {
            action = ANDROID_KEY_CODES[e.keyCode];
        }
        if (!action) return;

        e.preventDefault();
        switch(action) {
            case 'up': moveFocus('up'); break;
            case 'down': moveFocus('down'); break;
            case 'left': moveFocus('left'); break;
            case 'right': moveFocus('right'); break;
            case 'confirm': confirmFocus(); break;
            case 'back': handleBack(); break;
        }
    }

    function setContext(name, options) {
        currentContext = name;
        contexts[name] = options || {};
        refreshFocusables();
        currentIndex = 0;
        if (focusableElements.length > 0) {
            focusElement(0);
        }
    }

    function refreshFocusables() {
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) {
            focusableElements = [];
            return;
        }

        // 检查是否有详情视图打开
        const detailView = activeScreen.querySelector('.detail-view');
        if (detailView) {
            focusableElements = Array.from(detailView.querySelectorAll('.focusable'));
        } else if (currentContext === 'subnav') {
            // 子导航和内容区都有焦点
            const subnav = activeScreen.querySelectorAll('.sub-nav .focusable');
            const content = activeScreen.querySelectorAll('.module-content .focusable');
            focusableElements = Array.from(subnav).concat(Array.from(content));
        } else {
            focusableElements = Array.from(activeScreen.querySelectorAll('.focusable'));
        }
    }

    function focusElement(index) {
        // 移除所有焦点
        document.querySelectorAll('.focused').forEach(el => el.classList.remove('focused'));

        currentIndex = index;
        if (focusableElements[index]) {
            focusableElements[index].classList.add('focused');
            focusableElements[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    function moveFocus(direction) {
        if (focusableElements.length === 0) return;

        const current = focusableElements[currentIndex];
        if (!current) return;

        const rect = current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let bestIndex = -1;
        let bestDist = Infinity;

        for (let i = 0; i < focusableElements.length; i++) {
            if (i === currentIndex) continue;
            const el = focusableElements[i];
            const r = el.getBoundingClientRect();
            const ex = r.left + r.width / 2;
            const ey = r.top + r.height / 2;
            const dx = ex - cx;
            const dy = ey - cy;

            let valid = false;
            switch(direction) {
                case 'up': valid = dy < -20 && Math.abs(dx) < rect.width * 1.5; break;
                case 'down': valid = dy > 20 && Math.abs(dx) < rect.width * 1.5; break;
                case 'left': valid = dx < -20 && Math.abs(dy) < rect.height * 1.5; break;
                case 'right': valid = dx > 20 && Math.abs(dy) < rect.height * 1.5; break;
            }

            if (valid) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIndex = i;
                }
            }
        }

        // 如果没找到精确匹配，用索引顺序
        if (bestIndex === -1) {
            // 对于子导航场景的特殊处理
            if (currentContext === 'subnav') {
                const isInSubnav = current.closest('.sub-nav');
                if (direction === 'down' && isInSubnav) {
                    // 从子导航跳到内容区第一个
                    const firstContent = focusableElements.findIndex(el => el.closest('.module-content'));
                    if (firstContent >= 0) bestIndex = firstContent;
                } else if (direction === 'up' && !isInSubnav) {
                    // 从内容区跳回子导航
                    const subnavItems = focusableElements.filter(el => el.closest('.sub-nav'));
                    if (subnavItems.length > 0) {
                        // 找最近的子导航项
                        const subnavIndex = focusableElements.indexOf(subnavItems[0]);
                        if (subnavIndex >= 0) bestIndex = subnavIndex;
                    }
                }
            }

            // 水平导航在子导航栏内
            if (current.closest('.sub-nav') || current.closest('.module-content')) {
                if (bestIndex === -1) {
                    if (direction === 'left' && currentIndex > 0) {
                        bestIndex = currentIndex - 1;
                    } else if (direction === 'right' && currentIndex < focusableElements.length - 1) {
                        bestIndex = currentIndex + 1;
                    }
                }
            }

            // 主界面水平导航
            if (currentContext === 'home' && bestIndex === -1) {
                if (direction === 'left' && currentIndex > 0) {
                    bestIndex = currentIndex - 1;
                } else if (direction === 'right' && currentIndex < focusableElements.length - 1) {
                    bestIndex = currentIndex + 1;
                }
            }
        }

        if (bestIndex >= 0) {
            focusElement(bestIndex);
        }
    }

    function confirmFocus() {
        const el = focusableElements[currentIndex];
        if (!el) return;

        // 触发点击
        el.click();

        // 如果是主界面卡片
        if (el.classList.contains('home-card')) {
            const screen = el.dataset.screen;
            App.navigateTo(screen);
        }
    }

    function handleBack() {
        const activeScreen = document.querySelector('.screen.active');
        const detailView = activeScreen ? activeScreen.querySelector('.detail-view') : null;

        if (detailView) {
            // 关闭详情视图
            detailView.remove();
            TTS.stop();
            setContext(currentContext === 'detail' ? (lastContextBeforeDetail || 'subnav') : currentContext);
        } else if (activeScreen && activeScreen.id !== 'home-screen') {
            // 返回主界面
            App.navigateHome();
        } else {
            // 在主界面按返回，退出应用（Android TV）
            if (window.AndroidInterface && window.AndroidInterface.exitApp) {
                window.AndroidInterface.exitApp();
            }
        }
    }

    function getCurrentFocused() {
        return focusableElements[currentIndex];
    }

    function pushContext(name, options) {
        if (currentContext === 'subnav' || currentContext === 'content') {
            lastContextBeforeDetail = currentContext;
        }
        setContext(name, options);
    }

    function popContext() {
        setContext(lastContextBeforeDetail || 'home');
    }

    return {
        init: init,
        setContext: setContext,
        refreshFocusables: refreshFocusables,
        focusElement: focusElement,
        moveFocus: moveFocus,
        confirmFocus: confirmFocus,
        handleBack: handleBack,
        getCurrentFocused: getCurrentFocused,
        pushContext: pushContext,
        popContext: popContext
    };
})();
