package com.happyedu.kidslearning;

import android.os.Bundle;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

/**
 * 主 Activity
 * - 强制横屏全屏
 * - 拦截遥控器按键并传递给 WebView
 */
public class MainActivity extends BridgeActivity {

    private WebView webView;

    // Android 遥控器键码 → JavaScript keyIdentifier
    // 方向键、确认、返回已由系统自动映射，这里处理特殊按键

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 全屏沉浸模式
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        
        // 获取 WebView
        webView = bridge.getWebView();
        if (webView != null) {
            webView.getSettings().setJavaScriptEnabled(true);
            webView.getSettings().setDomStorageEnabled(true);
            webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // 将遥控器按键转发给 WebView JavaScript
        if (webView != null) {
            // 方向键、确认键、返回键等由 WebView 自动处理
            // 特殊键码映射
            switch (keyCode) {
                case KeyEvent.KEYCODE_DPAD_UP:
                case KeyEvent.KEYCODE_DPAD_DOWN:
                case KeyEvent.KEYCODE_DPAD_LEFT:
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                case KeyEvent.KEYCODE_DPAD_CENTER:
                case KeyEvent.KEYCODE_ENTER:
                case KeyEvent.KEYCODE_BACK:
                    // 这些键由 Capacitor/WebView 自动处理
                    break;
                // 快捷键：菜单键播放/暂停语音
                case KeyEvent.KEYCODE_MENU:
                    webView.evaluateJavascript(
                        "if (TTS && TTS.isSpeaking()) { TTS.stop(); }", null);
                    return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        // 先让 JavaScript 处理返回
        if (webView != null) {
            webView.evaluateJavascript(
                "Navigation.handleBack();", null);
            // 不调用 super，防止直接退出
            return;
        }
        super.onBackPressed();
    }
}
