# 快乐学堂 - Android TV 学习软件

## 📱 应用简介

幼小衔接（幼儿园大班到小学）学习软件，包含**语文、数学、英语**三大课程，支持：
- 📺 横屏 TV 显示
- 🎮 遥控器操作（方向键导航、确认/返回）
- 🔊 语音播放（TTS 中文+英文）
- ✨ 动画展示
- 📚 完整课程素材

## 📂 项目结构

```
kids-learning-app/
├── index.html              # 主入口
├── css/
│   ├── style.css           # 主样式（横屏TV适配）
│   └── animations.css      # 动画样式
├── js/
│   ├── app.js              # 主应用逻辑
│   ├── tts.js              # TTS语音合成模块
│   ├── navigation.js       # 遥控器/键盘导航系统
│   ├── data/
│   │   ├── chinese-data.js # 语文素材数据
│   │   ├── math-data.js    # 数学素材数据
│   │   └── english-data.js # 英语素材数据
│   └── modules/
│       ├── chinese.js      # 语文模块
│       ├── math.js         # 数学模块
│       └── english.js      # 英语模块
├── android-overlay/        # Android TV 配置覆盖文件
├── capacitor.config.ts     # Capacitor 配置
└── package.json
```

## 📚 课程内容

### 语文
| 模块 | 内容 |
|------|------|
| 拼音学习 | 23个声母 + 24个韵母，每项含例字和Emoji |
| 汉字认知 | 30个常用基础汉字（一二三四…山水火木…），含拼音、笔画数、组词 |
| 古诗欣赏 | 10首经典古诗（咏鹅、静夜思、春晓、悯农等），逐句朗诵 |
| 成语故事 | 8个成语故事（画蛇添足、守株待兔等），含释义和故事 |

### 数学
| 模块 | 内容 |
|------|------|
| 数字认知 | 0-10数字，中文读法，实物计数动画 |
| 加减运算 | 17道加法 + 15道减法，可视化物品演示，答案动画 |
| 形状认知 | 8种几何形状（圆、方、三角、星、心等），SVG动画 |
| 趣味数数 | 8道数数选择题，互动答题 |

### 英语
| 模块 | 内容 |
|------|------|
| 字母学习 | A-Z 26个字母，大小写+音标+代表单词 |
| 单词认知 | 6大类50+单词（动物、水果、颜色、食物、家庭、身体） |
| 日常对话 | 5组情景对话（打招呼、介绍自己、在教室、买东西、问路） |
| 英文儿歌 | 6首经典儿歌（ABC Song、Twinkle Star、Happy Birthday等） |

## 🎮 遥控器操作

| 按键 | 功能 |
|------|------|
| ⬆ ⬇ ⬅ ➡ | 方向导航，移动焦点 |
| OK / 确认 | 进入选中项 |
| BACK / 返回 | 返回上一级 / 关闭弹窗 |
| MENU 菜单键 | 停止语音播放 |

## 🚀 本地预览

### 方法1：直接打开
用浏览器打开 `index.html`（建议 Chrome）

### 方法2：启动本地服务器
```bash
cd kids-learning-app
npx http-server . -p 8080 -c-1
# 浏览器访问 http://localhost:8080
```

> **注意**：需要 Chrome 内核浏览器才能使用 TTS 语音合成功能

## 📦 打包为 Android APK

> **当前状态**：Android 项目已创建完成（`android/` 目录），Web 资源已同步。  
> 只需安装 Android SDK 后即可构建 APK。

### 前置条件
- Node.js 18+
- Android Studio (含 SDK 34)
- JDK 17

### 快速构建步骤

项目已经完成了 Capacitor 初始化和 Android 平台配置，直接构建即可：

1. **安装 Android SDK**（如果还没有）
   - 安装 [Android Studio](https://developer.android.com/studio)
   - 在 SDK Manager 中安装 Android 14 (API 34)

2. **设置环境变量**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk   # macOS
export ANDROID_HOME=$HOME/Android/Sdk           # Linux
set ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk  # Windows
```

3. **用 Android Studio 打开并构建**
```bash
cd kids-learning-app
npx cap open android
```
在 Android Studio 中：
- 等待 Gradle 同步完成
- `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- 生成的 APK 在 `android/app/build/outputs/apk/debug/app-debug.apk`

4. **安装到 TV/电视盒子**
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 命令行构建（无需 Android Studio）
```bash
cd android
./gradlew assembleDebug
# APK 产出: android/app/build/outputs/apk/debug/app-debug.apk
```

### 签名发布版 APK
```bash
# 1. 生成签名密钥
keytool -genkey -v -keystore kids-learning.keystore -alias kids-learning -keyalg RSA -keysize 2048 -validity 10000

# 2. 在 android/app/build.gradle 中添加签名配置

# 3. 构建 release 版本
cd android && ./gradlew assembleRelease
```

### 修改代码后重新同步
如果修改了 Web 代码（HTML/CSS/JS），需要重新同步到 Android：
```bash
# 先更新 www 目录
cp -r css js index.html www/

# 同步到 Android
npx cap sync android
```

## 🔧 技术要点

- **TTS 语音合成**：使用浏览器 `SpeechSynthesis API`，支持中英文自动切换
- **遥控器导航**：监听 `keydown` 事件，映射 Android TV 键码（19/20/21/22/23/4）
- **横屏适配**：CSS `@media (orientation: portrait)` 旋转 + AndroidManifest `sensorLandscape`
- **焦点系统**：空间距离算法自动寻找最近的可聚焦元素
- **动画**：纯 CSS 动画（弹跳、缩放、淡入、笔画书写等）

## 📐 分辨率适配

- 1920×1080（全高清 TV）✅ 最佳
- 1280×720（高清 TV）✅ 良好
- 960×540 ✅ 可用
- 3840×2160（4K TV）✅ 自动缩放
