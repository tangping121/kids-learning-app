/**
 * TTS 语音合成模块
 * 支持中文和英文语音播放
 */
const TTS = (function() {
    let synth = window.speechSynthesis;
    let currentUtterance = null;
    let voices = [];
    let zhVoice = null;
    let enVoice = null;

    function init() {
        // 加载语音列表
        loadVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
    }

    function loadVoices() {
        voices = synth.getVoices();
        // 优先选择中文语音
        zhVoice = voices.find(v => v.lang.startsWith('zh') && v.name.includes('Female'))
               || voices.find(v => v.lang.startsWith('zh'))
               || null;
        // 英文语音
        enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
               || voices.find(v => v.lang.startsWith('en'))
               || null;
    }

    function speak(text, lang, onEnd) {
        if (!synth) {
            console.warn('Speech synthesis not supported');
            if (onEnd) onEnd();
            return;
        }

        // 停止当前播放
        stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang || 'zh-CN';
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;

        if (lang && lang.startsWith('en') && enVoice) {
            utterance.voice = enVoice;
        } else if (zhVoice) {
            utterance.voice = zhVoice;
        }

        utterance.onstart = function() {
            showIndicator();
        };

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
        let index = 0;
        function next() {
            if (index >= items.length) {
                if (onAllEnd) onAllEnd();
                return;
            }
            const item = items[index];
            index++;
            speak(item.text, item.lang || 'zh-CN', next);
        }
        next();
    }

    function stop() {
        if (synth) {
            synth.cancel();
        }
        hideIndicator();
        currentUtterance = null;
    }

    function isSpeaking() {
        return synth && synth.speaking;
    }

    function showIndicator() {
        const indicator = document.getElementById('voice-indicator');
        if (indicator) indicator.classList.add('active');
    }

    function hideIndicator() {
        const indicator = document.getElementById('voice-indicator');
        if (indicator) indicator.classList.remove('active');
    }

    return {
        init: init,
        speak: speak,
        speakChinese: speakChinese,
        speakEnglish: speakEnglish,
        speakSequence: speakSequence,
        stop: stop,
        isSpeaking: isSpeaking
    };
})();
