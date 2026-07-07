/**
 * TTS 语音合成模块
 * 支持中文和英文语音播放
 * v1.6 - 安全降级：speechSynthesis 不存在时所有方法优雅返回
 */
const TTS = (function() {
    let synth = null;
    let currentUtterance = null;
    let voices = [];
    let zhVoice = null;
    let enVoice = null;
    let available = false;

    function init() {
        try {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                synth = window.speechSynthesis;
                available = true;
                loadVoices();
                if (synth.onvoiceschanged !== undefined) {
                    synth.onvoiceschanged = loadVoices;
                }
            } else {
                console.warn('SpeechSynthesis not supported, TTS disabled');
            }
        } catch(e) {
            console.warn('TTS init error:', e);
            available = false;
        }
    }

    function loadVoices() {
        if (!synth) return;
        try {
            voices = synth.getVoices() || [];
        } catch(e) {
            voices = [];
            return;
        }
        zhVoice = voices.find(function(v) { return v.lang && v.lang.startsWith('zh') && v.name.includes('Female'); })
               || voices.find(function(v) { return v.lang && v.lang.startsWith('zh'); })
               || null;
        enVoice = voices.find(function(v) { return v.lang && v.lang.startsWith('en') && v.name.includes('Female'); })
               || voices.find(function(v) { return v.lang && v.lang.startsWith('en'); })
               || null;
    }

    function speak(text, lang, onEnd) {
        if (!available || !synth) {
            if (onEnd) onEnd();
            return;
        }
        stop();
        try {
            var utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang || 'zh-CN';
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1.0;

            if (lang && lang.startsWith('en') && enVoice) {
                utterance.voice = enVoice;
            } else if (zhVoice) {
                utterance.voice = zhVoice;
            }

            utterance.onstart = function() { showIndicator(); };
            utterance.onend = function() {
                hideIndicator();
                currentUtterance = null;
                if (onEnd) onEnd();
            };
            utterance.onerror = function() {
                hideIndicator();
                currentUtterance = null;
                if (onEnd) onEnd();
            };

            currentUtterance = utterance;
            synth.speak(utterance);
        } catch(e) {
            console.warn('TTS speak error:', e);
            if (onEnd) onEnd();
        }
    }

    function speakChinese(text, onEnd) {
        speak(text, 'zh-CN', onEnd);
    }

    function speakEnglish(text, onEnd) {
        speak(text, 'en-US', onEnd);
    }

    function speakSequence(items, onAllEnd) {
        if (!items || items.length === 0) {
            if (onAllEnd) onAllEnd();
            return;
        }
        var index = 0;
        function next() {
            if (index >= items.length) {
                if (onAllEnd) onAllEnd();
                return;
            }
            var item = items[index];
            index++;
            speak(item.text, item.lang || 'zh-CN', next);
        }
        next();
    }

    function stop() {
        if (synth) {
            try { synth.cancel(); } catch(e) {}
        }
        hideIndicator();
        currentUtterance = null;
    }

    function isSpeaking() {
        return available && synth && synth.speaking;
    }

    function showIndicator() {
        var indicator = document.getElementById('voice-indicator');
        if (indicator) indicator.classList.add('active');
    }

    function hideIndicator() {
        var indicator = document.getElementById('voice-indicator');
        if (indicator) indicator.classList.remove('active');
    }

    return {
        init: init,
        speak: speak,
        speakChinese: speakChinese,
        speakEnglish: speakEnglish,
        speakSequence: speakSequence,
        stop: stop,
        isSpeaking: isSpeaking,
        isAvailable: function() { return available; }
    };
})();
