#!/bin/bash
#=============================================================================
# 快乐学堂 - 一键打包 Android APK 脚本
#
# 功能：自动检测环境 → 同步Web资源 → 构建APK → 输出APK路径
#
# 用法：
#   chmod +x build-apk.sh
#   ./build-apk.sh              # 构建 debug APK
#   ./build-apk.sh release      # 构建 release APK（需先配置签名）
#   ./build-apk.sh install      # 构建 debug APK 并安装到连接的设备
#
# 前置条件：
#   - JDK 17+
#   - Android SDK (compileSdk 34)
#   - ANDROID_HOME 环境变量
#=============================================================================

set -e

# ---- 颜色定义 ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ---- 项目路径 ----
# 兼容 bash script.sh 和 ./script.sh 两种调用方式
if [ -n "$BASH_SOURCE" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
    SCRIPT_DIR="$(pwd)"
fi
PROJECT_DIR="$SCRIPT_DIR"
ANDROID_DIR="$PROJECT_DIR/android"
WWW_DIR="$PROJECT_DIR/www"
OUTPUT_DIR="$ANDROID_DIR/app/build/outputs/apk"

# ---- 版本信息 ----
APP_NAME="快乐学堂"
APP_ID="com.happyedu.kidslearning"
VERSION="1.0"

# ---- 打印函数 ----
info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- 分隔线 ----
separator() {
    echo -e "${CYAN}=================================================================${NC}"
}

# ---- 检测 JDK ----
check_jdk() {
    info "检测 JDK..."
    if command -v java &> /dev/null; then
        JAVA_VER=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
        if [ "$JAVA_VER" -ge 17 ]; then
            success "JDK $(java -version 2>&1 | head -1)"
        else
            warn "需要 JDK 17+，当前版本: $(java -version 2>&1 | head -1)"
            SKIP_BUILD=1
        fi
    else
        warn "未找到 java 命令，构建步骤将跳过"
        SKIP_BUILD=1
    fi
}

# ---- 检测 Android SDK ----
check_android_sdk() {
    info "检测 Android SDK..."

    # 尝试多种方式找到 SDK
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        success "ANDROID_HOME = $ANDROID_HOME"
    elif [ -n "$ANDROID_SDK_ROOT" ] && [ -d "$ANDROID_SDK_ROOT" ]; then
        export ANDROID_HOME="$ANDROID_SDK_ROOT"
        success "ANDROID_SDK_ROOT = $ANDROID_SDK_ROOT"
    else
        # 尝试常见路径
        local sdk_paths=(
            "$HOME/Library/Android/sdk"           # macOS
            "$HOME/Android/Sdk"                    # Linux
            "$HOME/AppData/Local/Android/Sdk"      # Windows (Git Bash)
            "/c/Users/$USER/AppData/Local/Android/Sdk"
        )
        for p in "${sdk_paths[@]}"; do
            if [ -d "$p" ]; then
                export ANDROID_HOME="$p"
                success "自动检测到 Android SDK: $ANDROID_HOME"
                break
            fi
        done

        if [ -z "$ANDROID_HOME" ]; then
            warn "未找到 Android SDK，构建步骤将跳过"
            warn "请设置 ANDROID_HOME 环境变量或安装 Android Studio"
            SKIP_BUILD=1
        fi
    fi

    # 检查 platform 34
    if [ -d "$ANDROID_HOME/platforms/android-34" ]; then
        success "Android SDK Platform 34 已安装"
    else
        warn "未找到 Android SDK Platform 34，构建可能会失败"
        warn "请在 Android Studio SDK Manager 中安装，或运行："
        warn "  sdkmanager \"platforms;android-34\""
    fi

    # 检查 build-tools
    if ls "$ANDROID_HOME/build-tools/"* &> /dev/null; then
        local bt=$(ls "$ANDROID_HOME/build-tools/" | tail -1)
        success "Build Tools: $bt"
    else
        warn "未找到 Android Build Tools"
    fi
}

# ---- 检测 Node.js ----
check_node() {
    info "检测 Node.js..."
    if command -v node &> /dev/null; then
        success "Node.js $(node --version)"
    else
        error "未找到 node 命令，请安装 Node.js 18+"
    fi
}

# ---- 同步 Web 资源 ----
sync_web_assets() {
    separator
    info "同步 Web 资源到 www/ ..."
    mkdir -p "$WWW_DIR/css" "$WWW_DIR/js"

    # 直接覆盖复制（cp 默认覆盖同名文件）
    cp -f "$PROJECT_DIR/index.html" "$WWW_DIR/"
    cp -rf "$PROJECT_DIR/css/"* "$WWW_DIR/css/" 2>/dev/null || true
    cp -rf "$PROJECT_DIR/js/"* "$WWW_DIR/js/" 2>/dev/null || true

    # 验证复制结果
    local www_ok=true
    [ -f "$WWW_DIR/index.html" ] || { warn "www/index.html 缺失"; www_ok=false; }
    [ -d "$WWW_DIR/css" ] || { warn "www/css 目录缺失"; www_ok=false; }
    [ -d "$WWW_DIR/js" ] || { warn "www/js 目录缺失"; www_ok=false; }

    if [ "$www_ok" = true ]; then
        success "Web 资源已复制到 www/"
    else
        error "Web 资源复制到 www/ 失败"
    fi

    # 同步到 Android 项目
    info "同步到 Android assets..."
    local android_public="$ANDROID_DIR/app/src/main/assets/public"
    mkdir -p "$android_public/css" "$android_public/js"

    # 直接覆盖复制到 Android assets/public
    cp -f "$WWW_DIR/index.html" "$android_public/"
    cp -rf "$WWW_DIR/css/"* "$android_public/css/" 2>/dev/null || true
    cp -rf "$WWW_DIR/js/"* "$android_public/js/" 2>/dev/null || true

    # 验证
    local sync_ok=true
    [ -f "$android_public/index.html" ] || { warn "assets/public/index.html 缺失"; sync_ok=false; }
    [ -d "$android_public/css" ] || { warn "assets/public/css 目录缺失"; sync_ok=false; }
    [ -d "$android_public/js" ] || { warn "assets/public/js 目录缺失"; sync_ok=false; }

    if [ "$sync_ok" = true ]; then
        success "Web 资源已同步到 Android assets/public/"
    else
        error "Web 资源同步到 Android 失败"
    fi

    # 同步 capacitor 配置
    mkdir -p "$ANDROID_DIR/app/src/main/assets"
    cp -f "$PROJECT_DIR/capacitor.config.json" "$ANDROID_DIR/app/src/main/assets/"

    success "Capacitor 配置已同步"
}

# ---- 覆盖 Android TV 配置 ----
apply_tv_config() {
    info "应用 Android TV 横屏配置..."

    # AndroidManifest.xml 已在 android/ 目录中配置好
    # 验证关键配置
    local manifest="$ANDROID_DIR/app/src/main/AndroidManifest.xml"
    if grep -q "leanback" "$manifest" && grep -q "sensorLandscape" "$manifest"; then
        success "AndroidManifest.xml: TV + 横屏配置已就绪"
    else
        warn "AndroidManifest.xml 可能缺少 TV 配置，请手动检查"
    fi

    # 验证 MainActivity
    local main_activity="$ANDROID_DIR/app/src/main/java/com/happyedu/kidslearning/MainActivity.java"
    if [ -f "$main_activity" ]; then
        success "MainActivity.java: 自定义Activity已就绪"
    else
        warn "自定义 MainActivity.java 未找到"
    fi

    # 验证 Banner
    local banner="$ANDROID_DIR/app/src/main/res/drawable/banner.xml"
    if [ -f "$banner" ]; then
        success "TV Banner 资源已就绪"
    else
        warn "TV Banner 资源未找到"
    fi
}

# ---- 构建 APK ----
build_apk() {
    local build_type="$1"  # debug 或 release

    separator
    info "开始构建 ${build_type} APK..."
    info "项目: $APP_NAME v$VERSION"
    info "包名: $APP_ID"

    cd "$ANDROID_DIR"

    # 确保 gradlew 有执行权限
    chmod +x gradlew 2>/dev/null || true

    # 设置环境变量（确保 gradlew 能找到 SDK）
    export ANDROID_HOME
    export JAVA_HOME="${JAVA_HOME:-$(dirname $(dirname $(readlink -f $(which java) 2>/dev/null || echo "/usr/bin/java")))}"

    info "ANDROID_HOME=$ANDROID_HOME"
    info "JAVA_HOME=$JAVA_HOME"

    # 构建命令
    local gradle_task="assemble${build_type^}"
    # 首字母大写: debug -> Debug, release -> Release
    gradle_task="assemble$(echo "$build_type" | sed 's/^./\U&/')"

    info "执行: ./gradlew $gradle_task"

    if ./gradlew "$gradle_task" --no-daemon --info 2>&1 | tail -50; then
        success "Gradle 构建完成"
    else
        error "Gradle 构建失败，请检查上方日志"
    fi

    cd "$PROJECT_DIR"
}

# ---- 检查 APK 产出 ----
check_output() {
    local build_type="$1"
    local apk_dir="$OUTPUT_DIR/$build_type"
    local apk_file=""

    # 查找 APK
    if [ -f "$apk_dir/app-$build_type.apk" ]; then
        apk_file="$apk_dir/app-$build_type.apk"
    elif [ -f "$apk_dir/app-$build_type-unsigned.apk" ]; then
        apk_file="$apk_dir/app-$build_type-unsigned.apk"
    elif [ -f "$apk_dir/app-$build_type-aligned.apk" ]; then
        apk_file="$apk_dir/app-$build_type-aligned.apk"
    else
        # 递归搜索
        apk_file=$(find "$OUTPUT_DIR" -name "*.apk" -type f | head -1)
    fi

    if [ -n "$apk_file" ] && [ -f "$apk_file" ]; then
        local apk_size=$(du -h "$apk_file" | cut -f1)
        separator
        success "✅ APK 构建成功！"
        echo ""
        echo -e "  📦 APK 路径: ${GREEN}$apk_file${NC}"
        echo -e "  📏 文件大小: ${GREEN}$apk_size${NC}"
        echo -e "  🏷️  包名:     ${GREEN}$APP_ID${NC}"
        echo -e "  📱 版本:     ${GREEN}$VERSION${NC}"
        echo -e "  🔧 类型:     ${GREEN}$build_type${NC}"
        echo ""
        echo -e "  安装到设备: ${CYAN}adb install -r $apk_file${NC}"
        echo ""
        return 0
    else
        error "未找到 APK 文件，请检查 $OUTPUT_DIR 目录"
    fi
}

# ---- 安装到设备 ----
install_apk() {
    local build_type="$1"
    local apk_file=$(find "$OUTPUT_DIR" -name "*.apk" -type f | head -1)

    if [ -z "$apk_file" ]; then
        error "未找到 APK 文件"
    fi

    info "安装 APK 到设备..."
    if command -v adb &> /dev/null; then
        # 检查设备连接
        local devices=$(adb devices | grep -v "List" | grep -v "^$" | wc -l)
        if [ "$devices" -eq 0 ]; then
            warn "未检测到已连接的 Android 设备"
            warn "请确保："
            warn "  1. 设备已通过 USB 连接"
            warn "  2. 设备已开启 USB 调试"
            warn "  3. 电视/盒子已通过网络 adb 连接 (adb connect IP:5555)"
            echo ""
            info "手动安装命令: adb install -r $apk_file"
            return 1
        fi

        info "检测到 $devices 个设备"
        adb install -r "$apk_file" && success "APK 安装成功！" || error "APK 安装失败"
    else
        warn "未找到 adb 命令"
        info "请手动安装: adb install -r $apk_file"
    fi
}

# ---- 清理构建缓存 ----
clean_build() {
    info "清理构建缓存..."
    cd "$ANDROID_DIR"
    chmod +x gradlew 2>/dev/null || true
    ./gradlew clean --no-daemon 2>&1 | tail -5
    cd "$PROJECT_DIR"
    success "清理完成"
}

# ---- 主流程 ----
main() {
    local build_type="debug"
    local do_install=false
    local do_clean=false

    # 解析参数
    while [[ $# -gt 0 ]]; do
        case "$1" in
            release|r)
                build_type="release"
                ;;
            install|i)
                do_install=true
                ;;
            clean|c)
                do_clean=true
                ;;
            help|h|--help|-h)
                echo ""
                echo "快乐学堂 - Android APK 一键打包脚本"
                echo ""
                echo "用法: $0 [选项]"
                echo ""
                echo "选项:"
                echo "  (无)       构建 debug APK（默认）"
                echo "  release    构建 release APK"
                echo "  install    构建并安装到设备"
                echo "  clean      清理构建缓存"
                echo "  help       显示帮助信息"
                echo ""
                echo "示例:"
                echo "  $0              # 构建 debug APK"
                echo "  $0 release      # 构建 release APK"
                echo "  $0 install      # 构建 debug APK 并安装"
                echo "  $0 clean        # 清理构建缓存"
                echo ""
                exit 0
                ;;
            *)
                error "未知参数: $1，使用 $0 help 查看帮助"
                ;;
        esac
        shift
    done

    separator
    echo -e "${CYAN}  🎓 快乐学堂 - Android APK 一键打包${NC}"
    echo -e "${CYAN}  版本 $VERSION | 包名 $APP_ID${NC}"
    separator
    echo ""

    # 清理模式
    if [ "$do_clean" = true ]; then
        clean_build
        exit 0
    fi

    # 环境检测
    SKIP_BUILD=0
    info "第一步：环境检测"
    echo ""
    check_jdk
    check_android_sdk
    check_node
    echo ""

    # 同步资源
    info "第二步：同步 Web 资源"
    echo ""
    sync_web_assets
    echo ""

    # 应用 TV 配置
    info "第三步：验证 Android TV 配置"
    echo ""
    apply_tv_config
    echo ""

    # 构建
    if [ "$SKIP_BUILD" -eq 1 ]; then
        warn "⚠️  环境不完整，跳过 APK 构建"
        warn "请安装 Android SDK 后重新运行此脚本"
        echo ""
        info "手动构建方法："
        info "  1. 安装 Android Studio: https://developer.android.com/studio"
        info "  2. 设置 ANDROID_HOME 环境变量"
        info "  3. 重新运行: ./build-apk.sh"
        echo ""
    else
        info "第四步：构建 APK ($build_type)"
        build_apk "$build_type"
        echo ""

        # 检查产出
        info "第五步：验证 APK"
        check_output "$build_type"
        echo ""

        # 安装
        if [ "$do_install" = true ]; then
            info "第六步：安装到设备"
            install_apk "$build_type"
        fi
    fi

    separator
    success "🎉 全部完成！"
    separator
}

# 运行主流程
main "$@"
