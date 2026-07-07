/**
 * 导航系统
 * v1.5 - 极简版：去掉所有复杂耦合
 */
const Navigation = (function() {
    var focusableElements = [];
    var currentIndex = 0;
    var currentContext = null;
    var lastContextBeforeDetail = null;

    var KEY_MAP = {
        'ArrowUp': 'up', 'ArrowDown': 'down',
        'ArrowLeft': 'left', 'ArrowRight': 'right',
        'Enter': 'confirm', 'Escape': 'back',
        'Backspace': 'back', ' ': 'confirm'
    };

    var ANDROID_KEY_CODES = {
        19: 'up', 20: 'down', 21: 'left', 22: 'right',
        23: 'confirm', 4: 'back', 82: 'menu'
    };

    function init() {
        document.addEventListener('keydown', handleKeyDown);

        // 触屏滑动返回（简单版）
        var sx = 0, sy = 0, st = 0;
        document.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length > 0) {
                sx = e.touches[0].clientX;
                sy = e.touches[0].clientY;
                st = Date.now();
            }
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            var dx = e.changedTouches[0].clientX - sx;
            var dy = e.changedTouches[0].clientY - sy;
            var dt = Date.now() - st;
            if (dt < 600 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2
                && dx > 0 && sx < 80) {
                handleBack();
            }
        }, { passive: true });

        setContext('home');
    }

    function handleKeyDown(e) {
        var action = KEY_MAP[e.key];
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

    function setContext(name) {
        currentContext = name;
        refreshFocusables();
        currentIndex = 0;
        if (focusableElements.length > 0) focusElement(0);
    }

    function refreshFocusables() {
        var activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) { focusableElements = []; return; }

        var detailView = activeScreen.querySelector('.detail-view');
        if (detailView) {
            focusableElements = Array.from(detailView.querySelectorAll('.focusable'));
        } else if (currentContext === 'subnav') {
            var subnav = activeScreen.querySelectorAll('.sub-nav .focusable');
            var content = activeScreen.querySelectorAll('.module-content .focusable');
            focusableElements = Array.from(subnav).concat(Array.from(content));
        } else {
            focusableElements = Array.from(activeScreen.querySelectorAll('.focusable'));
        }
    }

    function focusElement(index) {
        document.querySelectorAll('.focused').forEach(function(el) { el.classList.remove('focused'); });
        currentIndex = index;
        if (focusableElements[index]) {
            focusableElements[index].classList.add('focused');
            focusableElements[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    function moveFocus(direction) {
        if (focusableElements.length === 0) return;
        var current = focusableElements[currentIndex];
        if (!current) return;

        var rect = current.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var bestIndex = -1, bestDist = Infinity;

        for (var i = 0; i < focusableElements.length; i++) {
            if (i === currentIndex) continue;
            var r = focusableElements[i].getBoundingClientRect();
            var ex = r.left + r.width / 2;
            var ey = r.top + r.height / 2;
            var dx = ex - cx, dy = ey - cy;
            var valid = false;

            switch(direction) {
                case 'up': valid = dy < -20 && Math.abs(dx) < rect.width * 1.5; break;
                case 'down': valid = dy > 20 && Math.abs(dx) < rect.width * 1.5; break;
                case 'left': valid = dx < -20 && Math.abs(dy) < rect.height * 1.5; break;
                case 'right': valid = dx > 20 && Math.abs(dy) < rect.height * 1.5; break;
            }
            if (valid) {
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < bestDist) { bestDist = dist; bestIndex = i; }
            }
        }

        if (bestIndex === -1) {
            if (direction === 'left' && currentIndex > 0) bestIndex = currentIndex - 1;
            else if (direction === 'right' && currentIndex < focusableElements.length - 1) bestIndex = currentIndex + 1;
        }

        if (bestIndex >= 0) focusElement(bestIndex);
    }

    function confirmFocus() {
        var el = focusableElements[currentIndex];
        if (!el) return;
        el.click();
        if (el.classList.contains('home-card')) {
            var screen = el.getAttribute('data-screen');
            if (screen) App.navigateTo(screen);
        }
    }

    function handleBack() {
        var activeScreen = document.querySelector('.screen.active');
        var detailView = activeScreen ? activeScreen.querySelector('.detail-view') : null;

        if (detailView) {
            detailView.remove();
            TTS.stop();
            setContext(lastContextBeforeDetail || 'subnav');
        } else if (activeScreen && activeScreen.id !== 'home-screen') {
            App.navigateHome();
        }
    }

    return {
        init: init,
        setContext: setContext,
        refreshFocusables: refreshFocusables,
        handleBack: handleBack,
        pushContext: function(name) {
            if (currentContext === 'subnav' || currentContext === 'content') {
                lastContextBeforeDetail = currentContext;
            }
            setContext(name);
        }
    };
})();
