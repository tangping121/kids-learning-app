package com.happyedu.kidslearning;

import android.os.Bundle;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

/**
 * 主 Activity - 支持横屏TV和遥控器操作
 */
public class MainActivity extends BridgeActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 全屏沉浸模式
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // 获取 WebView 并配置
        webView = bridge.getWebView();
        if (webView != null) {
            webView.getSettings().setJavaScriptEnabled(true);
            webView.getSettings().setDomStorageEnabled(true);
            webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (webView != null) {
            switch (keyCode) {
                // 菜单键 → 停止语音
                case KeyEvent.KEYCODE_MENU:
                    webView.evaluateJavascript(
                        "if(typeof TTS!=='undefined'&&TTS.isSpeaking()){TTS.stop();}", null);
                    return true;
                // 音量键等保持默认
                default:
                    break;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        // 让 JavaScript 先处理返回逻辑
        if (webView != null) {
            webView.evaluateJavascript(
                "if(typeof Navigation!=='undefined'){Navigation.handleBack();}", null);
            return;
        }
        super.onBackPressed();
    }
}
