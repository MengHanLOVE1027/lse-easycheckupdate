// TAG: 全局常量模块
// #region 全局常量模块
// 声明常量
const plugin_name = "EasyCheckUpdate",
    plugin_name_smallest = "easycheckupdate",
    plugin_version = "0.2.3",
    plugin_description_key = "logo.description",
    plugin_github_link = "https://github.com/MengHanLOVE1027/lse-easycheckupdate",
    plugin_minebbs_link = "https://www.minebbs.com/resources/easycheckupdate-ecu-lse.15501/",
    plugin_update_url = "https://raw.githubusercontent.com/MengHanLOVE1027/lse-easycheckupdate/main/update_versions.json",
    plugin_license = "AGPL-3.0",
    plugin_path = `./plugins/${plugin_name}`;

// 声明全局变量
let pluginConfig = null;
let bstatsInstance = null;
// 定时器管理（LSE QuickJS 不支持 clearTimeout/clearInterval，使用代数计数器取消旧定时器）
let scheduleGeneration = 0;
let checkingInProgress = false;
// #endregion

// TAG: I18N 国际化模块
// #region I18N 国际化模块
// 内置默认翻译表（回退用）
const I18N_DEFAULTS = {
    "zh_CN": {
        // ── Logo / 启动 ──
        "logo.description": "一个基于 LSE 的插件更新检查工具",
        "logo.author": "作者：梦涵LOVE          版本：v{0}",
        "logo.thanks": "感谢您使用Easy系列插件！",
        "logo.license": "本插件使用 {0} 许可证协议发布",
        "logo.github": "GitHub 仓库：{0}",
        "logo.minebbs": "插件MineBBS资源帖：{0}",
        "logo.community": "Easy系列插件交流群：1083195477",
        "logo.author_ver": "作者：梦涵LOVE | 版本：v{0}",
        "logo.bstats_status": "BStats状态：{0}",
        "general.enabled": "已启用",
        "general.disabled": "已禁用",

        // ── 配置 ──
        "config.created": "已创建默认配置文件",
        "config.backed_up": "配置已备份到 {0}",
        "config.backup_failed": "配置备份失败: {0}",
        "config.version_update": "检测到配置版本更新: v{0} → v{1}，开始迁移配置...",
        "config.migrated": "配置已迁移到 v{0}",
        "config.migrate_failed": "配置迁移到 v{0} 失败: {1}",
        "config.missing_added": "已补充缺失配置项: {0}",
        "config.missing_auto_added": "已自动补充缺失配置项: {0}",
        "config.migrate_done": "配置迁移完成!",
        "config.load_failed": "加载配置文件失败: {0}",
        "config.reloaded": "配置文件已重新加载",
        "config.not_exist": "配置文件不存在，使用默认配置",
        "config.reload_success": "重载成功",
        "config.reload_failed": "重载失败: {0}",
        "config.file_path": "配置文件: {0}",
        "config.unknown_language": "未知语言 \"{0}\"，回退到 zh_CN",
        "config.migration.lang_updated": "语言文件 [{0}] 已更新至版本 {1}",
        "config.migration.lang_exported": "已导出默认语言文件: {0}",

        // ── 更新检查 ──
        "update.auto_check_delay": "将在 {0} 秒后自动检查所有插件的更新...",
        "update.checking_all": "正在检查所有插件的更新...",
        "update.checking": "正在检查插件 {0} 的更新...",
        "update.fetching": "正在从 {0} 获取插件 {1} 的更新信息...",
        "update.fetch_error": "从 {0} 获取插件 {1} 的更新信息时出错，状态码: {2}",
        "update.format_error": "插件 {0} 的更新信息格式不正确",
        "update.version_not_found": "插件 {0} 未找到指定版本 v{1}",
        "update.up_to_date": "插件 {0} 已是最新版本: {1}",
        "update.no_download_url": "插件 {0} 的更新信息缺少下载链接",
        "update.no_required_info": "插件 {0} 的更新信息文件缺少必要信息",
        "update.new_version": "插件 {0} 有新版本: v{1} (当前版本: {2})",
        "update.target_version": "插件 {0} 将安装指定版本 v{1} (当前版本: {2})",
        "update.author": "作者: {0}",
        "update.time": "更新时间: {0}",
        "update.type": "类型: {0}",
        "update.content": "更新内容: {0}",
        "update.download_url": "下载地址: {0}",
        "update.newer_than_latest": "插件 {0} 的当前版本 {1} 比最新版本 v{2} 更新",
        "update.parse_error": "解析插件 {0} 的更新信息时出错: {1}",
        "update.check_error": "检查插件 {0} 的更新时出错: {1}",
        "update.no_update_url": "未找到插件 {0} 的 update_url 字段，无法检查更新",
        "update.check_done": "检查完成，共检查了 {0} 个支持更新检查的插件",
        "update.no_plugins": "没有找到支持更新检查的插件",
        "update.check_time_guard": "距上次检查不足 {0} 秒，跳过检查",
        "update.checking_in_progress": "更新检查正在进行中，请稍后再试",
        "update.version_list": "插件 {0} 的可用版本列表 (第{1}/{2}页, {3}-{4}/{5}):",
        "update.version_list_next": "使用 /checkupdate info {0} p{1} 查看下一页",
        "update.version_detail": "插件 {0} 版本 v{1} 的详细信息:",
        "update.fetch_failed": "获取插件 {0} 的更新信息失败，状态码: {1}",
        "update.parse_version_error": "解析版本信息时出错: {0}",
        "general.pre_release": "测试版",
        "general.stable": "正式版",
        "general.current_version": " [当前版本]",
        "general.recommended": " ★推荐",
        "general.no_content": "无更新内容",
        "general.unknown_author": "未知作者",
        "general.unknown_time": "未知时间",
        "general.none": "无",

        // ── 下载 / 解压 ──
        "download.clean_dir_error": "清理目录 {0} 时出错: {1}",
        "download.tar_done": "已使用 tar 解压完成",
        "download.tar_failed": "tar 解压失败(exit={0})，尝试 PowerShell...",
        "download.ps_done": "已使用 PowerShell 解压完成",
        "download.ps_failed": "PowerShell 解压也失败(exit={0}): {1}",
        "download.extract_failed": "解压失败: tar 和 PowerShell 均无法解压",
        "download.detect_root": "检测到压缩包根目录: {0}",
        "download.scan_error": "扫描解压目录时出错: {0}",
        "download.copy": "  复制: {0}",
        "download.copy_sub": "  复制: {0}/{1}",
        "download.installed": "已安装 {0} 个文件到 {1}",
        "download.copy_error": "复制文件时出错: {0}",
        "download.downloading": "正在下载: {0}",
        "download.curl_done": "curl 下载完成: {0} ({1} bytes)",
        "download.curl_failed": "curl 下载失败(exit={0})，尝试 network.httpGet...",
        "download.httpget_done": "httpGet 下载完成: {0}",
        "download.write_failed": "写入文件失败: {0}",
        "download.need_redirect": "GitHub Release 需要跟随重定向，但 curl 不可用",
        "download.install_curl": "请确保服务器已安装 curl (Windows 10+ 自带)",
        "download.fail_no_curl": "下载失败: HTTP {0} (curl 不可用，无法跟随重定向)",
        "download.failed": "下载失败: HTTP {0}",
        "download.from_url": "正在从 {0} 下载插件 {1} 版本 {2}...",
        "download.plugin_failed": "下载插件 {0} 失败: {1}",
        "download.extracting": "ZIP 已下载，正在解压...",
        "download.updated_reloading": "插件 {0} 已更新到 v{1}，正在重载插件...",
        "download.reloaded": "插件 {0} 已重载",
        "download.reload_failed": "重载插件失败: {0}",
        "download.reload_manual": "请手动执行: ll reload {0}",
        "download.update_error": "更新插件 {0} 时出错: {1}",
        "download.url_error": "从URL下载插件 {0} 时出错: {1}",
        "download.backed_up": "已备份旧文件到 {0}",
        "download.backup_failed": "备份文件失败: {0}",
        "download.backup_dir_done": "已备份插件目录到 {0}",
        "download.rollback_done": "安装失败，已恢复原插件文件",
        "download.rollback_failed": "安装失败且无法恢复原插件文件: {0}",
        "download.install_empty": "压缩包中没有可安装的文件",
        "download.invalid_url": "下载地址不安全或格式无效: {0}",
        "download.invalid_plugin_name": "插件名称包含非法路径字符: {0}",
        "download.binary_need_curl": "二进制文件下载需要可用的 curl，已停止更新",
        "download.file_updated": "已更新插件文件: {0}",
        "download.no_file_path": "无法找到插件 {0} 的文件路径",

        // ── 命令 / 帮助 ──
        "command.desc": "检查插件更新",
        "command.no_permission": "你没有权限使用此命令",
        "command.help": "命令帮助:\n/checkupdate - 显示此帮助信息\n/checkupdate all - 检查所有插件的更新\n/checkupdate reload - 重载插件\n/checkupdate check <插件名称> - 检查指定插件的更新\n/checkupdate update <插件名称> [版本号] - 更新指定插件\n/checkupdate info <插件名称> [版本号|p页码] - 查看版本列表或版本详情",
        "command.update_usage": "用法: /checkupdate update <插件名称> [版本号]",
        "command.info_usage": "用法: /checkupdate info <插件名称> [版本号]",
        "command.checking_update": "正在检查并更新插件 {0}，请查看控制台获取详细信息",
        "command.plugin_not_found": "未找到插件: {0}",
        "command.querying_detail": "正在查询插件 {0} 版本 v{1} 的详细信息，请查看控制台",
        "command.querying_list": "正在查询插件 {0} 的版本列表，请查看控制台",
        "command.checking_all": "正在检查所有插件的更新，请查看控制台获取详细信息",
        "command.checking_plugin": "正在检查插件 {0} 的更新，请查看控制台获取详细信息",

        // ── BStats / 其他 ──
        "bstats.init_failed": "BStats初始化失败: {0}",
        "bstats.cmd_register_ok": "指令注册成功",
        "bstats.cmd_register_fail": "指令注册失败: {0}",
        "bstats.write_log_failed": "写入日志文件失败: {0}",
        "bstats.read_config_failed": "读取bstats配置文件失败: {0}",
        "bstats.save_config_failed": "保存配置文件失败: {0}",
        "bstats.sync_config_failed": "同步BStats配置失败: {0}",
        "bstats.disabled": "遥测模块已禁用，跳过上报。",
        "bstats.preparing": "准备上报数据包内容:",
        "bstats.submit_ok": "遥测数据上报成功。",
        "bstats.submit_failed": "上报失败，状态码: {0}, 返回结果: {1}",
        "bstats.network_error": "网络请求异常: {0}",
        "bstats.started": "{0}遥测模块已启动。首次数据将在 10 秒后发送。",
        "bstats.onlinemode_missing": "server.properties 中未找到 'online-mode'，将使用默认值 1。",
        "bstats.onlinemode_read_error": "读取 server.properties 失败: {0}，将使用默认值 1。",
        "bstats.onlinemode_read": "从 server.properties 读取到 online-mode: {0}",
    },
    "en_US": {
        // ── Logo / Startup ──
        "logo.description": "A plugin update checker based on LSE",
        "logo.author": "Author: MengHanLOVE          Version: v{0}",
        "logo.thanks": "Thank you for using the Easy series plugins!",
        "logo.license": "This plugin is released under the {0} license",
        "logo.github": "GitHub Repository: {0}",
        "logo.minebbs": "MineBBS Resource Post: {0}",
        "logo.community": "Easy Series Plugin Community: 1083195477",
        "logo.author_ver": "Author: MengHanLOVE | Version: v{0}",
        "logo.bstats_status": "BStats Status: {0}",
        "general.enabled": "Enabled",
        "general.disabled": "Disabled",

        // ── Config ──
        "config.created": "Default configuration file created",
        "config.backed_up": "Configuration backed up to {0}",
        "config.backup_failed": "Configuration backup failed: {0}",
        "config.version_update": "Config version update detected: v{0} → v{1}, starting migration...",
        "config.migrated": "Configuration migrated to v{0}",
        "config.migrate_failed": "Configuration migration to v{0} failed: {1}",
        "config.missing_added": "Missing config items added: {0}",
        "config.missing_auto_added": "Automatically added missing config items: {0}",
        "config.migrate_done": "Configuration migration complete!",
        "config.load_failed": "Failed to load configuration file: {0}",
        "config.reloaded": "Configuration file reloaded",
        "config.not_exist": "Configuration file does not exist, using defaults",
        "config.reload_success": "Reload successful",
        "config.reload_failed": "Reload failed: {0}",
        "config.file_path": "Config file: {0}",
        "config.unknown_language": "Unknown language \"{0}\", falling back to zh_CN",
        "config.migration.lang_updated": "Language files [{0}] updated to version {1}",
        "config.migration.lang_exported": "Default language file exported: {0}",

        // ── Update Check ──
        "update.auto_check_delay": "Will auto-check all plugins for updates in {0} seconds...",
        "update.checking_all": "Checking all plugins for updates...",
        "update.checking": "Checking plugin {0} for updates...",
        "update.fetching": "Fetching update info for {1} from {0}...",
        "update.fetch_error": "Error fetching update info for {1} from {0}, status code: {2}",
        "update.format_error": "Update info format for plugin {0} is incorrect",
        "update.version_not_found": "Plugin {0}: specified version v{1} not found",
        "update.up_to_date": "Plugin {0} is up to date: {1}",
        "update.no_download_url": "Update info for {0} is missing download URL",
        "update.no_required_info": "Update info file for {0} is missing required information",
        "update.new_version": "Plugin {0} has a new version: v{1} (current: {2})",
        "update.target_version": "Plugin {0} will install specified version v{1} (current: {2})",
        "update.author": "Author: {0}",
        "update.time": "Update Time: {0}",
        "update.type": "Type: {0}",
        "update.content": "Update Content: {0}",
        "update.download_url": "Download URL: {0}",
        "update.newer_than_latest": "Plugin {0} current version {1} is newer than latest v{2}",
        "update.parse_error": "Error parsing update info for {0}: {1}",
        "update.check_error": "Error checking updates for {0}: {1}",
        "update.no_update_url": "update_url field not found for plugin {0}, unable to check for updates",
        "update.check_done": "Check complete, {0} update-capable plugin(s) checked",
        "update.no_plugins": "No plugins supporting update checks found",
        "update.check_time_guard": "Less than {0} seconds since last check, skipping",
        "update.checking_in_progress": "Update check already in progress, try later",
        "update.version_list": "Available versions for plugin {0} (Page {1}/{2}, {3}-{4}/{5}):",
        "update.version_list_next": "Use /checkupdate info {0} p{1} to view next page",
        "update.version_detail": "Details for plugin {0} version v{1}:",
        "update.fetch_failed": "Failed to fetch update info for {0}, status code: {1}",
        "update.parse_version_error": "Error parsing version info: {0}",
        "general.pre_release": "Pre-release",
        "general.stable": "Stable",
        "general.current_version": " [Current]",
        "general.recommended": " ★Recommended",
        "general.no_content": "No update content",
        "general.unknown_author": "Unknown author",
        "general.unknown_time": "Unknown time",
        "general.none": "None",

        // ── Download / Extract ──
        "download.clean_dir_error": "Error cleaning directory {0}: {1}",
        "download.tar_done": "Extraction completed using tar",
        "download.tar_failed": "tar extraction failed (exit={0}), trying PowerShell...",
        "download.ps_done": "Extraction completed using PowerShell",
        "download.ps_failed": "PowerShell extraction also failed (exit={0}): {1}",
        "download.extract_failed": "Extraction failed: both tar and PowerShell could not extract",
        "download.detect_root": "Detected archive root directory: {0}",
        "download.scan_error": "Error scanning extracted directory: {0}",
        "download.copy": "  Copy: {0}",
        "download.copy_sub": "  Copy: {0}/{1}",
        "download.installed": "Installed {0} file(s) to {1}",
        "download.copy_error": "Error copying files: {0}",
        "download.downloading": "Downloading: {0}",
        "download.curl_done": "curl download complete: {0} ({1} bytes)",
        "download.curl_failed": "curl download failed (exit={0}), trying network.httpGet...",
        "download.httpget_done": "httpGet download complete: {0}",
        "download.write_failed": "Failed to write file: {0}",
        "download.need_redirect": "GitHub Release requires redirect following, but curl is unavailable",
        "download.install_curl": "Please ensure curl is installed on the server (built-in on Windows 10+)",
        "download.fail_no_curl": "Download failed: HTTP {0} (curl unavailable, cannot follow redirect)",
        "download.failed": "Download failed: HTTP {0}",
        "download.from_url": "Downloading plugin {1} version {2} from {0}...",
        "download.plugin_failed": "Failed to download plugin {0}: {1}",
        "download.extracting": "ZIP downloaded, extracting...",
        "download.updated_reloading": "Plugin {0} updated to v{1}, reloading...",
        "download.reloaded": "Plugin {0} reloaded",
        "download.reload_failed": "Failed to reload plugin: {0}",
        "download.reload_manual": "Please manually execute: ll reload {0}",
        "download.update_error": "Error updating plugin {0}: {1}",
        "download.url_error": "Error downloading plugin {0} from URL: {1}",
        "download.backed_up": "Old file backed up to {0}",
        "download.backup_failed": "Failed to backup file: {0}",
        "download.backup_dir_done": "Plugin directory backed up to {0}",
        "download.rollback_done": "Installation failed; original plugin files were restored",
        "download.rollback_failed": "Installation failed and original plugin files could not be restored: {0}",
        "download.install_empty": "The archive contains no installable files",
        "download.invalid_url": "Download URL is unsafe or invalid: {0}",
        "download.invalid_plugin_name": "Plugin name contains invalid path characters: {0}",
        "download.binary_need_curl": "A working curl installation is required for binary downloads; update stopped",
        "download.file_updated": "Plugin file updated: {0}",
        "download.no_file_path": "Cannot find file path for plugin {0}",

        // ── Command / Help ──
        "command.desc": "Check plugin updates",
        "command.no_permission": "You do not have permission to use this command",
        "command.help": "Command Help:\n/checkupdate - Show this help\n/checkupdate all - Check all plugins for updates\n/checkupdate reload - Reload plugin\n/checkupdate check <plugin> - Check specified plugin for updates\n/checkupdate update <plugin> [version] - Update specified plugin\n/checkupdate info <plugin> [version|page] - View version list or details",
        "command.update_usage": "Usage: /checkupdate update <plugin> [version]",
        "command.info_usage": "Usage: /checkupdate info <plugin> [version]",
        "command.checking_update": "Checking and updating plugin {0}, check console for details",
        "command.plugin_not_found": "Plugin not found: {0}",
        "command.querying_detail": "Querying details for {0} v{1}, check console",
        "command.querying_list": "Querying version list for {0}, check console",
        "command.checking_all": "Checking all plugins for updates, check console for details",
        "command.checking_plugin": "Checking {0} for updates, check console for details",

        // ── BStats / Misc ──
        "bstats.init_failed": "BStats initialization failed: {0}",
        "bstats.cmd_register_ok": "Command registration successful",
        "bstats.cmd_register_fail": "Command registration failed: {0}",
        "bstats.write_log_failed": "Failed to write log file: {0}",
        "bstats.read_config_failed": "Failed to read BStats config file: {0}",
        "bstats.save_config_failed": "Failed to save config file: {0}",
        "bstats.sync_config_failed": "Failed to sync BStats config: {0}",
        "bstats.disabled": "Telemetry module disabled, skipping data submission.",
        "bstats.preparing": "Preparing telemetry data payload:",
        "bstats.submit_ok": "Telemetry data submitted successfully.",
        "bstats.submit_failed": "Submission failed, status code: {0}, response: {1}",
        "bstats.network_error": "Network request error: {0}",
        "bstats.started": "{0} telemetry module started. First data will be sent in 10 seconds.",
        "bstats.onlinemode_missing": "'online-mode' not found in server.properties, defaulting to 1.",
        "bstats.onlinemode_read_error": "Failed to read server.properties: {0}, defaulting to 1.",
        "bstats.onlinemode_read": "Read online-mode from server.properties: {0}",
    }
};

// 语言文件目录
const LANGS_DIR = plugin_path + "/langs/";

// 运行时翻译数据（从外部文件加载，失败则回退到内置默认值）
let i18nData = {};
let i18nLang = "zh_CN";

/**
 * 翻译函数
 * @param {String} key 翻译键
 * @param  {...any} args 格式化参数（替换 {0}, {1}, ... 占位符）
 * @returns {String} 翻译后的字符串
 */
function t(key, ...args) {
    let template = i18nData[key];
    if (template === undefined) {
        // 回退到内置默认
        const defaults = I18N_DEFAULTS[i18nLang] || I18N_DEFAULTS["zh_CN"];
        template = defaults[key];
    }
    if (template === undefined) {
        return key;
    }
    for (let i = 0; i < args.length; i++) {
        template = template.replace(`{${i}}`, args[i]);
    }
    return template;
}

/**
 * 从 langs/ 目录加载语言文件
 * @param {string} lang - 语言代码
 */
function loadLangFile(lang) {
    const langFile = LANGS_DIR + lang + ".json";
    try {
        if (File.exists(langFile)) {
            const content = File.readFrom(langFile);
            const data = JSON.parse(content);
            if (typeof data === "object") {
                const defaults = I18N_DEFAULTS[lang] || I18N_DEFAULTS["zh_CN"];
                i18nData = Object.assign({}, defaults, data);
                return;
            }
        }
    } catch (e) {
        // 文件损坏，回退
    }
    i18nData = Object.assign({}, I18N_DEFAULTS[lang] || I18N_DEFAULTS["zh_CN"]);
}

/**
 * 语言文件迁移：根据版本号将新增的翻译键合并到已有的语言文件中
 * - 通过 langs/.version 记录当前版本，避免重复迁移
 * - 如语言文件损坏则用默认值重建
 */
function migrateLangFiles() {
    const versionFile = LANGS_DIR + ".version";
    let storedVersion = "0.0.0";

    if (File.exists(versionFile)) {
        try {
            storedVersion = File.readFrom(versionFile).trim();
        } catch (e) {
            // 读取失败，视为旧版本
        }
    }

    if (storedVersion === plugin_version) return;

    for (const lang of Object.keys(I18N_DEFAULTS)) {
        const langFile = LANGS_DIR + lang + ".json";
        const defaults = I18N_DEFAULTS[lang];

        if (File.exists(langFile)) {
            try {
                const content = File.readFrom(langFile);
                const data = JSON.parse(content);
                if (typeof data === "object") {
                    let changed = false;
                    for (const key of Object.keys(defaults)) {
                        if (!(key in data)) {
                            data[key] = defaults[key];
                            changed = true;
                        }
                    }
                    if (changed) {
                        File.writeTo(langFile, JSON.stringify(data, null, 4));
                        pluginPrint(t("config.migration.lang_updated", lang, plugin_version), "INFO");
                    }
                }
            } catch (e) {
                // 文件损坏 → 用默认值重建
                try {
                    File.writeTo(langFile, JSON.stringify(defaults, null, 4));
                    pluginPrint(t("config.migration.lang_exported", langFile), "INFO");
                } catch (e2) {
                    pluginPrint(t("bstats.write_log_failed", e2), "ERROR");
                }
            }
        } else {
            // 语言文件不存在 → 用默认值创建
            try {
                File.writeTo(langFile, JSON.stringify(defaults, null, 4));
                pluginPrint(t("config.migration.lang_exported", langFile), "INFO");
            } catch (e2) {
                pluginPrint(t("bstats.write_log_failed", e2), "ERROR");
            }
        }
    }

    // 更新版本记录
    try {
        File.writeTo(versionFile, plugin_version);
    } catch (e) {
        // 非关键，忽略
    }
}

/**
 * 根据当前配置切换输出语言
 */
function applyConfiguredLanguage() {
    const configLang = pluginConfig && pluginConfig.language ? pluginConfig.language : "zh_CN";
    if (I18N_DEFAULTS[configLang]) {
        i18nLang = configLang;
        loadLangFile(configLang);
    } else {
        i18nLang = "zh_CN";
        loadLangFile("zh_CN");
        pluginPrint(t("config.unknown_language", configLang), "WARNING");
    }
}
// #endregion

// TAG: BStats模块 - By Nico6719
// #region BStats模块 - By Nico6719
/**
 * EasyBackuper - bStats 遥测模块
 */
function bstatsRandomGradientLog(text) {
    const len = text.length;
    let out = '';
    for (let i = 0; i < len; i++) {
        const t = len <= 1 ? 0 : i / (len - 1);
        const [r, g, b] = globalLerpColor(t);
        out += `\x1b[38;2;${r};${g};${b}m` + text[i];
    }
    logger.log(out + '\x1b[0m');
}

class BStatsImpl {
    constructor(pluginId) {
        this.pluginId = pluginId;
        this.enabled = true;
        this.debugMode = false;
        this.pluginName = plugin_name;
        this.pluginVersion = plugin_version;

        // 初始设为空，方便观察是否获取成功
        this.cachedCoreCount = "Unknown";
        this.cachedOsName = "Unknown";
        this.cachedOsArch = "Unknown";
        this.cachedOsVersion = "Unknown";

        this.platform = "bukkit"; // 保持为 "bukkit" 以便 bstats.org 接受
        this.baseUrl = `https://bstats.org/api/v2/data/${this.platform}`;

        // 立即同步一次配置并探测系统信息
        this.syncConfig();
        this.probeSystemInfo();
    }

    /**
     * 从 server.properties 文件中读取 online-mode 设置
     * @returns {number} 1 表示 true (在线模式), 0 表示 false (离线模式)
     */
    readServerProperties() {
        const path = './server.properties';
        try {
            if (File.exists(path)) {
                const content = File.readFrom(path);
                const match = content.match(/^online-mode\s*=\s*(true|false)/m);
                if (match) {
                    const value = match[1];
                    if (this.debugMode) bstatsRandomGradientLog(t("bstats.onlinemode_read", value));
                    return value === 'true' ? 1 : 0;
                }
            }
            if (this.debugMode) logger.warn(t("bstats.onlinemode_missing"));
        } catch (e) {
            if (this.debugMode) logger.error(t("bstats.onlinemode_read_error", e.message));
        }
        // 默认返回 1 (在线模式)
        return 1;
    }

    syncConfig() {
        try {
            // 从bstats/config.json读取配置
            const bstatsConfigPath = plugin_path + "/bstats/config.json";
            let bstatsConfig = {};
            if (File.exists(bstatsConfigPath)) {
                try {
                    const configContent = File.readFrom(bstatsConfigPath);
                    bstatsConfig = JSON.parse(configContent);
                } catch (e) {
                    logger.error(t("bstats.read_config_failed", e.message));
                }
            }

            // 从插件配置中读取BStats配置
            const bstatsConf = pluginConfig && pluginConfig.Bstats ? pluginConfig.Bstats : {};
            this.enabled = bstatsConfig.enabled !== undefined ? bstatsConfig.enabled : (bstatsConf.EnableModule !== undefined ? bstatsConf.EnableModule : true);
            this.debugMode = bstatsConfig.logSentDataEnabled !== undefined ? bstatsConfig.logSentDataEnabled : (bstatsConf.logSentData !== undefined ? bstatsConf.logSentData : false);
            this.serverUUID = bstatsConfig.serverUUID || bstatsConf.serverUUID || this.generateUUID();

            // 如果配置中没有UUID，保存新生成的UUID
            if (!bstatsConfig.serverUUID && !bstatsConf.serverUUID && pluginConfig) {
                if (!pluginConfig.Bstats) {
                    pluginConfig.Bstats = {};
                }
                pluginConfig.Bstats.serverUUID = this.serverUUID;
                // 保存配置到文件
                try {
                    const configPath = `${plugin_path}/config/${plugin_name}.json`;
                    File.writeTo(configPath, JSON.stringify(pluginConfig, null, 4));
                } catch (e) {
                    logger.error(t("bstats.save_config_failed", e.message));
                }
            }
        } catch (e) {
            logger.error(t("bstats.sync_config_failed", e.message));
            // 使用默认UUID
            this.serverUUID = this.generateUUID();
        }
    }

    // 深度探测系统信息
    probeSystemInfo() {
        // 1. 尝试通过 process 对象获取
        try {
            if (typeof process !== 'undefined') {
                this.cachedOsName = process.platform || this.cachedOsName;
                this.cachedOsArch = process.arch || this.cachedOsArch;
            }
        } catch (e) { }

        // 2. 尝试通过异步命令预加载
        const updateVal = (cmd, prop) => {
            try {
                system.cmd(cmd, (exit, out) => {
                    if (exit === 0 && out) this[prop] = out.trim();
                });
            } catch (e) { }
        };

        updateVal("nproc", "cachedCoreCount");
        updateVal("uname -s", "cachedOsName");
        updateVal("uname -m", "cachedOsArch");
        updateVal("uname -r", "cachedOsVersion");

        // 3. 针对 Windows 的特殊探测
        if (this.cachedOsName === "Unknown") {
            updateVal("echo %NUMBER_OF_PROCESSORS%", "cachedCoreCount");
            updateVal("echo %OS%", "cachedOsName");
            updateVal("echo %PROCESSOR_ARCHITECTURE%", "cachedOsArch");
        }
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    collectData() {
        // 每次收集数据时都重新同步配置，确保 UUID 等信息是最新的
        this.syncConfig();

        let playerCount = 0;
        try { playerCount = mc.getOnlinePlayers().length; } catch (e) { }

        // 获取LSE版本
        const lseVerRaw = (typeof ll !== 'undefined') ? ll.versionString() : "Unknown";
        const pureLseVersion = lseVerRaw.replace("LSE-QuickJS ", "").split(" ")[0];

        // 获取Minecraft版本
        let mcVer = (typeof mc !== 'undefined' ? mc.getBDSVersion() : "1.21.0");
        if (mcVer.startsWith('v')) mcVer = mcVer.substring(1);

        // 最终兜底：如果探测失败，至少给一个看起来真实的占位符
        const finalOsName = this.cachedOsName !== "Unknown" ? this.cachedOsName : "Windows";
        const finalOsArch = this.cachedOsArch !== "Unknown" ? this.cachedOsArch : "x86_64";
        const finalCoreCount = this.cachedCoreCount !== "Unknown" ? this.cachedCoreCount : "8";
        const finalOsVersion = this.cachedOsVersion !== "Unknown" ? this.cachedOsVersion : "10.0";

        return {
            "serverUUID": this.serverUUID,
            "metricsVersion": "2",
            "playerAmount": playerCount,
            "onlineMode": this.readServerProperties(),
            "bukkitVersion": mcVer,
            "javaVersion": "N/A (Bedrock)",
            "osName": finalOsName,
            "osArch": finalOsArch,
            "osVersion": finalOsVersion,
            "coreCount": parseInt(finalCoreCount) || 8,
            "service": {
                "id": this.pluginId,
                "pluginVersion": this.pluginVersion,
                "customCharts": [
                    { "chartId": "lse_version", "type": "simple_pie", "data": { "value": pureLseVersion } }
                ]
            }
        };
    }

    submit() {
        // 先同步配置，确保运行期间启用或禁用遥测能立即生效
        this.syncConfig();
        if (!this.enabled) {
            bstatsRandomGradientLog(t("bstats.disabled"));
            return;
        }
        const payload = this.collectData();
        if (this.debugMode) {
            bstatsRandomGradientLog(t("bstats.preparing"));
            bstatsRandomGradientLog(JSON.stringify(payload, null, 2));
        }
        try {
            network.httpPost(this.baseUrl, JSON.stringify(payload), "application/json", (status, result) => {
                if (status === 200) {
                    bstatsRandomGradientLog(t("bstats.submit_ok"));
                } else {
                    logger.warn(t("bstats.submit_failed", status, result));
                }
            });
        } catch (e) {
            if (this.debugMode) {
                logger.error(t("bstats.network_error", e.message));
            }
        }
    }

    start() {
        // 延长到 10 秒，给异步命令足够的时间返回结果
        setTimeout(() => this.submit(), 10 * 1000);
        setInterval(() => this.submit(), 30 * 60 * 1000);
        setTimeout(() => {
            bstatsRandomGradientLog(t("bstats.started", this.pluginName));
        }, 2000)
    }
}
// #endregion

// ── 全局随机颜色对（Logo、Tip、logInfo 共用）────────────────
function randomVividColor() {
    // 排除绿色(90°~150°)和深紫色(260°~300°)
    // 可用色相段：[0,90) [150,260) [300,360) 共 260°
    const rand = Math.random() * 260;
    let h;
    if (rand < 90) h = rand;           // 红/橙/黄
    else if (rand < 200) h = rand + 60;      // 青/蓝  (150~260)
    else h = rand + 100;     // 粉/洋红 (300~360)

    const s = 0.90 + Math.random() * 0.10;  // 90%~100% 高饱和
    const l = 0.65 + Math.random() * 0.15;  // 65%~80%  高亮度
    const a = s * Math.min(l, 1 - l);
    function f(n) {
        const k = (n + h / 30) % 12;
        return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
    }
    return [f(0), f(8), f(4)];
}

function generateColorPair() {
    const c1 = randomVividColor();
    let c2, attempts = 0;
    do {
        c2 = randomVividColor();
        const diff = Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]) + Math.abs(c1[2] - c2[2]);
        if (diff > 150 || attempts++ > 20) break;
    } while (true);
    return [c1, c2];
}

// 全局唯一颜色对，本次启动所有渐变共用
const [GLOBAL_C1, GLOBAL_C2] = generateColorPair();

function globalLerpColor(t) {
    return [
        Math.round(GLOBAL_C1[0] + (GLOBAL_C2[0] - GLOBAL_C1[0]) * t),
        Math.round(GLOBAL_C1[1] + (GLOBAL_C2[1] - GLOBAL_C1[1]) * t),
        Math.round(GLOBAL_C1[2] + (GLOBAL_C2[2] - GLOBAL_C1[2]) * t)
    ];
}

function RandomColor(text) {
    const len = text.length;
    let out = '';
    for (let i = 0; i < len; i++) {
        const t = len <= 1 ? 0 : i / (len - 1);
        const [r, g, b] = globalLerpColor(t);
        out += `\x1b[38;2;${r};${g};${b}m` + text[i];
    }
    return (out + '\x1b[0m');
}

// TAG: 日志系统模块
// #region 日志系统模块

/**
 * 自制日志输出函数
 * @param {String} text 日志内容
 * @param {String} level 日志级别 (DEBUG, INFO, WARNING, ERROR, SUCCESS)
 */
function pluginPrint(text, level = "INFO") {

    // 日志级别颜色映射
    const level_colors = {
        "DEBUG": "\x1b[36m",    // 青色
        "INFO": "\x1b[37m",     // 白色
        "WARNING": "\x1b[33m",  // 黄色
        "ERROR": "\x1b[31m",    // 红色
        "SUCCESS": "\x1b[32m"   // 绿色
    }

    // 获取颜色
    const level_color = level_colors[level] || "\x1b[37m"
    const logger_head = `[${level_color}${level}\x1b[0m] `

    // 根据日志级别使用不同的logger方法
    switch (level) {
        case "INFO":
            logger.info(String(RandomColor(text)))
            break
        case "SUCCESS":
            logger.info(logger_head + String(RandomColor(text)))
            break
        case "DEBUG":
            logger.info(logger_head + String(RandomColor(text)))
            break
        case "WARNING":
            logger.warn(String(RandomColor(text)))
            break
        case "ERROR":
            logger.error(String(RandomColor(text)))
            break
    }

    // 写入到日志文件
    try {
        const log_dir = `./logs/${plugin_name}/`
        if (!File.exists(log_dir)) {
            // 使用File.createDir创建目录
            File.createDir(log_dir)
        }
        const now = new Date()
        // 格式化时间为: 2026-02-03 10:00:12,040
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const seconds = String(now.getSeconds()).padStart(2, '0')
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
        const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds},${milliseconds}`
        const log_file = `${log_dir}${plugin_name_smallest}_${now.toISOString().split('T')[0]}.log`
        const log_line = `${timestamp} - ${plugin_name} - ${level} - ${text}`
        File.writeLine(log_file, log_line)
    } catch (e) {
        logger.error(t("bstats.write_log_failed", e))
    }
}

/**
 * 加载插件
 */
function Loadplugin() {

    // NOTE: 输出插件LOGO
    logger.setTitle(`\x1b[32m${plugin_name}\x1b[0m`) // 设置日志头

    // 确保插件目录存在
    if (!File.exists(plugin_path)) {
        File.createDir(plugin_path);
    }
    // 确保配置目录存在
    const configDir = `${plugin_path}/config`;
    if (!File.exists(configDir)) {
        File.createDir(configDir);
    }

    // ── 配置版本管理系统（版本号跟随插件版本） ──
    const configPath = `${plugin_path}/config/${plugin_name}.json`;
    const configBackupPath = `${configDir}/.config_backup.json`;

    // 完整默认配置（Version 使用插件版本号）
    const configDefaults = {
        "Version": plugin_version,
        "language": "zh_CN",
        "Bstats": {
            "EnableModule": true,
            "logSentData": false
        },
        "check_update_on_load": true,
        "check_interval": 1800,
        "check_delay": 10,
        "last_check_time": 0
    };

    /**
     * 深度合并配置：将 defaults 中缺失的键合并到 target，不覆盖已有值
     */
    function deepMergeConfig(defaults, target) {
        const result = JSON.parse(JSON.stringify(target));
        for (const key in defaults) {
            if (result[key] === undefined) {
                result[key] = defaults[key];
            } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key]) &&
                       typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
                result[key] = deepMergeConfig(defaults[key], result[key]);
            }
        }
        return result;
    }

    /**
     * 列出 defaults 中 target 缺失的属性名
     */
    function getMissingKeys(defaults, target) {
        const missing = [];
        for (const key in defaults) {
            if (target[key] === undefined) {
                missing.push(key);
            }
        }
        return missing;
    }

    /**
     * 备份当前配置到 .config_backup.json
     */
    function backupConfig(savedVer) {
        try {
            const backup = {
                version: savedVer || "unknown",
                timestamp: new Date().toISOString(),
                config: JSON.parse(JSON.stringify(pluginConfig))
            };
            File.writeTo(configBackupPath, JSON.stringify(backup, null, 4));
            pluginPrint(t("config.backed_up", configBackupPath), "INFO");
        } catch (e) {
            pluginPrint(t("config.backup_failed", e.message), "WARNING");
        }
    }

    /**
     * 增量迁移配置
     * @param {String} oldVersion 旧配置记录的插件版本号
     */
    function migrateConfig(oldVersion) {
        const migrations = [
            // 未来配置迁移示例：
            // { version: "0.3.0", handler: () => {
            //     if (!pluginConfig.notifyChannel) pluginConfig.notifyChannel = "console";
            // } },
        ];

        for (const migration of migrations) {
            if (compareVersions(oldVersion, migration.version) < 0) {
                try {
                    backupConfig(oldVersion);
                    migration.handler();
                    pluginPrint(t("config.migrated", migration.version), "SUCCESS");
                } catch (e) {
                    pluginPrint(t("config.migrate_failed", migration.version, e.message), "ERROR");
                }
            }
        }
    }

    // ── 加载配置文件 ──
    try {
        if (File.exists(configPath)) {
            const configContent = File.readFrom(configPath);
            pluginConfig = JSON.parse(configContent);
        } else {
            // 全新安装，写入默认配置
            pluginConfig = JSON.parse(JSON.stringify(configDefaults));
            File.writeTo(configPath, JSON.stringify(pluginConfig, null, 4));
            pluginPrint(t("config.created"), "INFO");
        }

        const savedVersion = pluginConfig.Version || "0.0.0";

        if (compareVersions(savedVersion, plugin_version) < 0) {
            pluginPrint(t("config.version_update", savedVersion, plugin_version));
            backupConfig(savedVersion);
            migrateConfig(savedVersion);
            // 补全所有当前版本必需的配置项
            const missing = getMissingKeys(configDefaults, pluginConfig);
            pluginConfig = deepMergeConfig(configDefaults, pluginConfig);
            pluginConfig.Version = plugin_version;
            File.writeTo(configPath, JSON.stringify(pluginConfig, null, 4));
            if (missing.length > 0) {
                pluginPrint(t("config.missing_added", missing.join(", ")), "INFO");
            }
            pluginPrint(t("config.migrate_done"), "SUCCESS");
        } else {
            // 版本一致，但仍需确保所有默认项存在（防止用户手误删除）
            const missing = getMissingKeys(configDefaults, pluginConfig);
            if (missing.length > 0) {
                pluginConfig = deepMergeConfig(configDefaults, pluginConfig);
                File.writeTo(configPath, JSON.stringify(pluginConfig, null, 4));
                pluginPrint(t("config.missing_auto_added", missing.join(", ")), "INFO");
            }
        }
    } catch (e) {
        // 使用默认配置（不影响插件运行）
        pluginConfig = JSON.parse(JSON.stringify(configDefaults));
        pluginPrint(t("config.load_failed", e.message), "ERROR");
    }

    // ── 初始化 i18n 语言 ──
    // 确保 langs 目录存在
    if (!File.exists(LANGS_DIR)) {
        File.createDir(LANGS_DIR);
    }
    migrateLangFiles();
    applyConfiguredLanguage();

    pluginPrint(`
███████╗ █████╗ ███████╗██╗   ██╗██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
█████╗  ███████║███████╗ ╚████╔╝ ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗  
██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝  
███████╗██║  ██║███████║   ██║   ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗
╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝`)
    pluginPrint(t("logo.author", plugin_version))
    pluginPrint("================================================================================")
    pluginPrint(`${plugin_name} - ${t(plugin_description_key)}`)
    pluginPrint(t("logo.thanks"))
    pluginPrint(t("logo.license", plugin_license))
    pluginPrint(t("logo.github", plugin_github_link))
    pluginPrint(t("logo.minebbs", plugin_minebbs_link))
    pluginPrint(t("logo.community"))
    pluginPrint(t("logo.author_ver", plugin_version))

    let bstatsConf = pluginConfig && pluginConfig.Bstats ? pluginConfig.Bstats : {}; // 获取BStats配置
    pluginPrint(t("logo.bstats_status", bstatsConf.EnableModule ? t("general.enabled") : t("general.disabled")))
    pluginPrint("================================================================================")

    // 初始化BStats
    try {
        bstatsInstance = new BStatsImpl(29850);
        bstatsInstance.start();
    } catch (e) {
        pluginPrint(t("bstats.init_failed", e), "ERROR");
    }

    // 注册指令
    try {
        RegisterCmd();
        pluginPrint(t("bstats.cmd_register_ok"), "SUCCESS");
    } catch (e) {
        pluginPrint(t("bstats.cmd_register_fail", e), "ERROR");
    }

    scheduleUpdateChecks();
}

// TAG: 更新检查模块
// #region 更新检查模块
/**
 * 比较两个版本号
 * @param {String} version1 版本号1
 * @param {String} version2 版本号2
 * @returns {Number} -1 表示 version1 < version2，0 表示 version1 == version2，1 表示 version1 > version2
 */
function parseSemanticVersion(version) {
    let normalized = String(version == null ? "" : version).trim().replace(/^[vV]/, '');
    normalized = normalized.split('+')[0];

    let coreText = normalized;
    let preReleaseText = null;
    const dashIndex = normalized.indexOf('-');
    if (dashIndex >= 0) {
        coreText = normalized.substring(0, dashIndex);
        preReleaseText = normalized.substring(dashIndex + 1);
    } else {
        // 兼容 1.0.0rc1 这类未使用连字符的常见写法
        const attachedPreRelease = normalized.match(/^(\d+(?:\.\d+)*?)([A-Za-z][0-9A-Za-z.-]*)$/);
        if (attachedPreRelease) {
            coreText = attachedPreRelease[1];
            preReleaseText = attachedPreRelease[2];
        }
    }

    if (!/^\d+(?:\.\d+)*$/.test(coreText)) return null;
    if (preReleaseText !== null && !/^[0-9A-Za-z.-]+$/.test(preReleaseText)) return null;

    return {
        normalized: normalized,
        core: coreText.split('.').map(part => Number(part)),
        preRelease: preReleaseText === null ? null : preReleaseText.split('.')
    };
}

function compareVersions(version1, version2) {
    const parsed1 = parseSemanticVersion(version1);
    const parsed2 = parseSemanticVersion(version2);

    // 对非标准版本号保留确定性的自然排序，避免比较函数抛出异常
    if (!parsed1 || !parsed2) {
        const loose1 = String(version1 == null ? "" : version1).replace(/^[vV]/, '').toLowerCase();
        const loose2 = String(version2 == null ? "" : version2).replace(/^[vV]/, '').toLowerCase();
        const tokens1 = loose1.match(/\d+|\D+/g) || [];
        const tokens2 = loose2.match(/\d+|\D+/g) || [];
        const tokenCount = Math.max(tokens1.length, tokens2.length);
        for (let i = 0; i < tokenCount; i++) {
            if (tokens1[i] === undefined) return -1;
            if (tokens2[i] === undefined) return 1;
            const numeric1 = /^\d+$/.test(tokens1[i]);
            const numeric2 = /^\d+$/.test(tokens2[i]);
            if (numeric1 && numeric2) {
                const number1 = Number(tokens1[i]);
                const number2 = Number(tokens2[i]);
                if (number1 !== number2) return number1 < number2 ? -1 : 1;
            } else if (tokens1[i] !== tokens2[i]) {
                return tokens1[i] < tokens2[i] ? -1 : 1;
            }
        }
        return 0;
    }

    const coreLength = Math.max(parsed1.core.length, parsed2.core.length);
    for (let i = 0; i < coreLength; i++) {
        const part1 = parsed1.core[i] === undefined ? 0 : parsed1.core[i];
        const part2 = parsed2.core[i] === undefined ? 0 : parsed2.core[i];
        if (part1 !== part2) return part1 < part2 ? -1 : 1;
    }

    // SemVer 规则：相同核心版本下，正式版高于任何预发布版
    if (parsed1.preRelease === null && parsed2.preRelease !== null) return 1;
    if (parsed1.preRelease !== null && parsed2.preRelease === null) return -1;
    if (parsed1.preRelease === null && parsed2.preRelease === null) return 0;

    const preLength = Math.max(parsed1.preRelease.length, parsed2.preRelease.length);
    for (let i = 0; i < preLength; i++) {
        const part1 = parsed1.preRelease[i];
        const part2 = parsed2.preRelease[i];
        if (part1 === undefined) return -1;
        if (part2 === undefined) return 1;
        if (part1 === part2) continue;

        const numeric1 = /^\d+$/.test(part1);
        const numeric2 = /^\d+$/.test(part2);
        if (numeric1 && numeric2) return Number(part1) < Number(part2) ? -1 : 1;
        if (numeric1 !== numeric2) return numeric1 ? -1 : 1;
        return part1 < part2 ? -1 : 1;
    }
    return 0;
}

/**
 * 检测版本号是否为预发布版本（包含 alpha、beta、rc 等标记）
 * @param {String} version 版本号
 * @returns {Boolean} 是否为预发布版本
 */
function isPreRelease(version) {
    const parsed = parseSemanticVersion(version);
    if (parsed) return parsed.preRelease !== null;
    return /[a-zA-Z]/.test(String(version == null ? "" : version).replace(/^[vV]/, ''));
}

/**
 * 标准化版本号：去除开头的 v 或 V 前缀
 * @param {String} ver 版本号
 * @returns {String} 标准化后的版本号
 */
function normalizeVersion(ver) {
    return String(ver == null ? "" : ver).replace(/^[vV]/, '');
}

function findVersionKey(versions, requestedVersion) {
    if (versions[requestedVersion]) return requestedVersion;
    const normalized = String(requestedVersion).replace(/^[vV]/, '');
    return Object.keys(versions).find(version => version.replace(/^[vV]/, '') === normalized) || null;
}

/**
 * 获取插件的更新信息（通过导入CheckUpdate函数）
 * @param {String} pluginName 插件名称
 * @returns {Object|null} 返回插件导出的更新信息对象，失败返回null
 */
function getPluginUpdateInfo(pluginName) {
    // 先尝试"ecu"命名空间
    if (ll.hasExported) {
        try {
            if (ll.hasExported("ecu", pluginName)) {
                const checkUpdateFunc = ll.imports("ecu", pluginName);
                if (checkUpdateFunc && typeof checkUpdateFunc === "function") {
                    return checkUpdateFunc();
                }
            }
        } catch (e) {
            // 静默失败
        }
    }

    // 如果从"ecu"命名空间导入失败，尝试直接从插件导入
    if (ll.hasExported) {
        try {
            if (ll.hasExported(pluginName, "CheckUpdate")) {
                const checkUpdateFunc = ll.imports(pluginName, "CheckUpdate");
                if (checkUpdateFunc && typeof checkUpdateFunc === "function") {
                    return checkUpdateFunc();
                }
            }
        } catch (e) {
            // 静默失败
        }
    }

    return null;
}

/**
 * 打印单个版本的详细信息
 * @param {String} pluginName 插件名称
 * @param {String} versionKey 版本号键名
 * @param {Object} verInfo 版本信息对象
 */
function printVersionDetail(pluginName, versionKey, verInfo) {
    const tag = t(isPreRelease(versionKey) ? "general.pre_release" : "general.stable");
    pluginPrint(t("update.version_detail", pluginName, versionKey));
    pluginPrint(t("update.author", verInfo.author || t("general.unknown_author")));
    pluginPrint(t("update.time", verInfo.update_time || t("general.unknown_time")));
    pluginPrint(t("update.type", tag));
    pluginPrint(t("update.content", verInfo.update_content || t("general.no_content")));
    const downloadUrl = verInfo.download_url || "";
    if (downloadUrl) {
        pluginPrint(t("update.download_url", downloadUrl));
    }
}

/**
 * 打印插件的版本列表（多版本格式，支持分页）
 * @param {String} pluginName 插件名称
 * @param {Object} versions 版本信息对象
 * @param {String} currentVersion 当前版本
 * @param {String|null} recommendedVer 推荐升级版本，null表示无更新
 * @param {Number} page 页码（从1开始）
 * @param {Number} perPage 每页条数
 */
function printVersionList(pluginName, versions, currentVersion, recommendedVer, page = 1, perPage = 10) {
    // 显示全部版本（不过滤预发布/正式版），与 Python 版行为一致
    const sorted = Object.keys(versions).sort((a, b) => compareVersions(b, a));

    const totalCount = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalCount);
    const pageSlice = sorted.slice(startIndex, endIndex);

    pluginPrint(t("update.version_list", pluginName, page, totalPages, startIndex + 1, endIndex, totalCount));

    for (const ver of pageSlice) {
        const tag = t(isPreRelease(ver) ? "general.pre_release" : "general.stable");
        const marker = compareVersions(ver, currentVersion) === 0 ? t("general.current_version") : "";
        const latest = ver === recommendedVer ? t("general.recommended") : "";
        pluginPrint(`  v${ver} (${tag})${latest}${marker}`);
    }

    if (page < totalPages) {
        pluginPrint(t("update.version_list_next", pluginName, page + 1));
    }
}

/**
 * 检查指定插件的更新
 * @param {String} pluginName 插件名称
 * @param {String} currentVersion 当前版本
 * @param {Boolean} autoUpdate 是否自动更新插件（默认false）
 * @param {Object|null} pluginObj 预导入的插件信息对象，为null时内部调用getPluginUpdateInfo获取
 * @param {Function|null} onComplete 异步HTTP请求完成后的回调
 * @param {String|null} targetVersion 指定目标版本号，为null时智能选择最佳版本
 */
function checkPluginUpdate(pluginName, currentVersion, autoUpdate = false, pluginObj = null, onComplete = null, targetVersion = null) {
    pluginPrint(t("update.checking", pluginName));

    // 如果未传入预导入的pluginObj，则通过getPluginUpdateInfo获取
    if (pluginObj === null) {
        pluginObj = getPluginUpdateInfo(pluginName);
    }

    // 完成信号：异步操作结束后统一调用
    const signalComplete = () => {
        if (onComplete) onComplete();
    };

    if (pluginObj && pluginObj.update_url) {
        try {
            // 从update_url字段获取更新信息
            const updateUrl = pluginObj.update_url;
            pluginPrint(t("update.fetching", updateUrl, pluginName));

            // 下载更新信息
            network.httpGet(updateUrl, (status, response) => {
                try {
                    if (status !== 200) {
                        pluginPrint(t("update.fetch_error", updateUrl, pluginName, status), "WARNING");
                        return;
                    }

                    const updateData = JSON.parse(response);
                    let latestVersion, downloadUrl, updateContent, author, updateTime;

                    // 检查是否包含必要的信息
                    // 支持两种格式：单版本格式和多版本格式
                    let explicitTarget = false;
                    if (updateData.version && updateData.download_url) {
                        // 单版本格式
                        latestVersion = updateData.version;
                        downloadUrl = updateData.download_url;
                        updateContent = updateData.update_content || t("general.no_content");
                        author = updateData.author || t("general.unknown_author");
                        updateTime = updateData.update_time || t("general.unknown_time");
                        if (targetVersion) {
                            if (compareVersions(targetVersion, latestVersion) !== 0) {
                                pluginPrint(t("update.version_not_found", pluginName, targetVersion), "WARNING");
                                return;
                            }
                            explicitTarget = true;
                        }
                    } else if (updateData.latest_version && updateData.versions) {
                        // 多版本格式
                        const versions = updateData.versions;

                        // 仅支持对象格式的 versions
                        if (!versions || Array.isArray(versions) || typeof versions !== 'object') {
                            pluginPrint(t("update.format_error", pluginName), "WARNING");
                            return;
                        }

                        // 如果指定了目标版本，直接使用
                        if (targetVersion) {
                            const targetKey = findVersionKey(versions, targetVersion);
                            if (!targetKey) {
                                pluginPrint(t("update.version_not_found", pluginName, targetVersion), "WARNING");
                                return;
                            }
                            const targetInfo = versions[targetKey];
                            if (!targetInfo || typeof targetInfo !== 'object') {
                                pluginPrint(t("update.format_error", pluginName), "WARNING");
                                return;
                            }
                            latestVersion = targetKey;
                            downloadUrl = targetInfo.download_url;
                            updateContent = targetInfo.update_content || t("general.no_content");
                            author = targetInfo.author || t("general.unknown_author");
                            updateTime = targetInfo.update_time || t("general.unknown_time");
                            explicitTarget = true;
                        } else {
                            // 智能选择最佳版本：测试版→最新测试版，正式版→最新正式版
                            const userIsPreRelease = isPreRelease(currentVersion);
                            const sortedVers = Object.keys(versions).sort((a, b) => compareVersions(b, a)); // 降序
                            let candidateVer = null;

                            for (const ver of sortedVers) {
                                // 版本类型匹配且高于当前版本
                                if (isPreRelease(ver) === userIsPreRelease && compareVersions(ver, currentVersion) > 0) {
                                    candidateVer = ver; break;
                                }
                            }

                            if (!candidateVer) {
                                pluginPrint(t("update.up_to_date", pluginName, currentVersion));
                                return;
                            }

                            const versionInfo = versions[candidateVer];
                            if (!versionInfo || typeof versionInfo !== 'object') {
                                pluginPrint(t("update.format_error", pluginName), "WARNING");
                                return;
                            }
                            latestVersion = candidateVer;
                            downloadUrl = versionInfo.download_url;
                            updateContent = versionInfo.update_content || t("general.no_content");
                            author = versionInfo.author || t("general.unknown_author");
                            updateTime = versionInfo.update_time || t("general.unknown_time");
                        }
                    } else {
                        pluginPrint(t("update.no_required_info", pluginName), "WARNING");
                        return;
                    }

                    if (typeof downloadUrl !== 'string' || !downloadUrl) {
                        pluginPrint(t("update.no_download_url", pluginName), "WARNING");
                        return;
                    }

                    // 使用版本比较函数比较版本号
                    const versionComparison = compareVersions(latestVersion, currentVersion);
                    if (explicitTarget || versionComparison > 0) {
                        pluginPrint("================================================================================", "INFO");
                        pluginPrint(t(explicitTarget ? "update.target_version" : "update.new_version", pluginName, latestVersion, currentVersion));
                        pluginPrint(t("update.author", author));
                        pluginPrint(t("update.time", updateTime));
                        pluginPrint(t("update.content", updateContent));
                        pluginPrint(t("update.download_url", downloadUrl));
                        pluginPrint("================================================================================", "INFO");

                        // 如果启用了自动更新，则下载并更新插件
                        if (autoUpdate) {
                            downloadAndUpdatePlugin(pluginName, latestVersion, downloadUrl);
                        }
                    } else if (versionComparison < 0) {
                        pluginPrint(t("update.newer_than_latest", pluginName, currentVersion, latestVersion), "INFO");
                    } else {
                        pluginPrint(t("update.up_to_date", pluginName, currentVersion));
                    }
                } catch (e) {
                    pluginPrint(t("update.parse_error", pluginName, e.message), "WARNING");
                } finally {
                    signalComplete();
                }
            });
        } catch (e) {
            pluginPrint(t("update.check_error", pluginName, e.message), "ERROR");
            signalComplete();
        }
    } else {
        pluginPrint(t("update.no_update_url", pluginName), "WARNING");
        signalComplete();
    }
}

/**
 * 确保目录存在，不存在则创建
 * @param {String} dir 目录路径
 */
function ensureDir(dir) {
    if (!File.exists(dir)) {
        File.createDir(dir);
    }
    if (!File.exists(dir)) {
        throw new Error(`Cannot create directory: ${dir}`);
    }
}

/**
 * 递归删除目录及其所有内容
 * @param {String} dirPath 目录路径
 */
function removeDir(dirPath) {
    if (!File.exists(dirPath)) return true;
    let removed = true;
    try {
        const entries = File.getFilesList(dirPath);
        for (const entry of entries) {
            const fullPath = `${dirPath}/${entry}`;
            // 尝试作为文件删除，如果失败则作为目录递归删除
            if (File.exists(fullPath)) {
                try {
                    File.delete(fullPath);
                } catch (e) {
                    // 可能是目录，递归删除
                    if (!removeDir(fullPath)) removed = false;
                }
                if (File.exists(fullPath) && !removeDir(fullPath)) removed = false;
            }
        }
        // 删除空目录自身
        try { File.delete(dirPath); } catch (e) { /* 忽略 */ }
    } catch (e) {
        pluginPrint(t("download.clean_dir_error", dirPath, e.message), "WARNING");
        removed = false;
    }
    if (File.exists(dirPath)) removed = false;
    return removed;
}

/**
 * 递归复制文件或目录，失败时抛出异常
 * @returns {Number} 已复制的文件数量
 */
function copyPathRecursive(sourcePath, destinationPath) {
    let entries = null;
    try {
        const listed = File.getFilesList(sourcePath);
        if (Array.isArray(listed)) entries = listed;
    } catch (e) {
        entries = null;
    }

    if (entries !== null && entries.length > 0) {
        ensureDir(destinationPath);
        let copiedCount = 0;
        for (const entry of entries) {
            copiedCount += copyPathRecursive(`${sourcePath}/${entry}`, `${destinationPath}/${entry}`);
        }
        return copiedCount;
    }

    // 文件和空目录都可能返回空列表，先尝试按文件复制
    try {
        if (File.exists(destinationPath)) {
            File.delete(destinationPath);
            if (File.exists(destinationPath)) throw new Error(`Cannot remove destination: ${destinationPath}`);
        }
        File.copy(sourcePath, destinationPath);
        if (!File.exists(destinationPath)) {
            throw new Error(`Copy did not create destination: ${destinationPath}`);
        }
        return 1;
    } catch (copyError) {
        // 空目录和读取失败的文件都可能返回空列表，再用读取操作确认类型
        if (entries !== null) {
            let readableAsFile = false;
            try {
                File.readFrom(sourcePath);
                readableAsFile = true;
            } catch (e) { }
            if (readableAsFile) throw copyError;

            if (File.exists(destinationPath)) {
                try {
                    File.getFilesList(destinationPath);
                } catch (e) {
                    File.delete(destinationPath);
                    if (File.exists(destinationPath)) throw copyError;
                }
            }
            ensureDir(destinationPath);
            return 0;
        }
        throw copyError;
    }
}

/**
 * 解压 ZIP 文件到目标目录
 * 依次尝试 tar → powershell Expand-Archive
 * @param {String} zipPath ZIP文件路径
 * @param {String} destDir 解压目标目录
 * @param {Function} onComplete 完成回调(err)
 */
function extractZip(zipPath, destDir, onComplete) {
    ensureDir(destDir);

    // 尝试 tar（Windows 10+ 和 Linux 均支持）
    const tarCmd = `tar -xf "${zipPath}" -C "${destDir}"`;
    system.cmd(tarCmd, (exitCode, output) => {
        if (exitCode === 0) {
            pluginPrint(t("download.tar_done"), "INFO");
            onComplete(null);
            return;
        }

        // tar 失败，尝试 PowerShell
        pluginPrint(t("download.tar_failed", exitCode), "INFO");
        const psCmd = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`;
        system.cmd(psCmd, (exitCode2, output2) => {
            if (exitCode2 === 0) {
                pluginPrint(t("download.ps_done"), "INFO");
                onComplete(null);
            } else {
                pluginPrint(t("download.ps_failed", exitCode2, output2), "ERROR");
                onComplete(t("download.extract_failed"));
            }
        });
    });
}

/**
 * 将解压后的文件安装到插件目录
 * @param {String} extractDir 解压根目录
 * @param {String} targetPluginDir 目标插件目录
 * @param {String} pluginName 插件名称
 */
function installFromExtract(extractDir, targetPluginDir, pluginName, backupDir) {
    // 查找源根目录：若解压后只有一个子目录，以该子目录为源根
    let sourceRoot = extractDir;
    try {
        const entries = File.getFilesList(extractDir);
        const topDirs = [];
        const topFiles = [];
        for (const entry of entries) {
            const fullPath = `${extractDir}/${entry}`;
            try {
                const childEntries = File.getFilesList(fullPath);
                if (Array.isArray(childEntries) && (childEntries.length > 0 || !entry.includes('.'))) {
                    topDirs.push(entry);
                } else {
                    topFiles.push(entry);
                }
            } catch (e) {
                topFiles.push(entry);
            }
        }
        if (topDirs.length === 1 && topFiles.length === 0) {
            // 典型 GitHub Release ZIP 结构：外层一个文件夹
            sourceRoot = `${extractDir}/${topDirs[0]}`;
            pluginPrint(t("download.detect_root", topDirs[0]), "INFO");
        }
    } catch (e) {
        pluginPrint(t("download.scan_error", e.message), "WARNING");
    }

    const targetExisted = File.exists(targetPluginDir);
    if (targetExisted) {
        if (File.exists(backupDir) && !removeDir(backupDir)) {
            throw new Error(`Cannot clean backup directory: ${backupDir}`);
        }
        copyPathRecursive(targetPluginDir, backupDir);
        pluginPrint(t("download.backup_dir_done", backupDir), "INFO");
    }

    try {
        const sourceFiles = File.getFilesList(sourceRoot);
        if (!Array.isArray(sourceFiles) || sourceFiles.length === 0) {
            throw new Error(t("download.install_empty"));
        }

        ensureDir(targetPluginDir);
        let copiedCount = 0;
        for (const fileName of sourceFiles) {
            const srcPath = `${sourceRoot}/${fileName}`;
            const dstPath = `${targetPluginDir}/${fileName}`;
            const entryCount = copyPathRecursive(srcPath, dstPath);
            copiedCount += entryCount;
            pluginPrint(t("download.copy", fileName), "INFO");
        }
        if (copiedCount === 0) throw new Error(t("download.install_empty"));
        pluginPrint(t("download.installed", copiedCount, targetPluginDir), "SUCCESS");
        return copiedCount;
    } catch (e) {
        try {
            if (File.exists(targetPluginDir) && !removeDir(targetPluginDir)) {
                throw new Error(`Cannot remove failed installation: ${targetPluginDir}`);
            }
            if (targetExisted) copyPathRecursive(backupDir, targetPluginDir);
            pluginPrint(t("download.rollback_done"), "WARNING");
        } catch (rollbackError) {
            pluginPrint(t("download.rollback_failed", rollbackError.message), "ERROR");
        }
        throw new Error(t("download.copy_error", e.message));
    }
}

/**
 * 下载文件到指定路径（自动跟随重定向）
 * 优先使用 curl -L，失败则回退到 network.httpGet
 * @param {String} url 下载链接
 * @param {String} destPath 目标文件路径
 * @param {Function} onComplete 完成回调(err)
 * @param {Boolean} allowTextFallback 是否允许使用文本型 httpGet 回退
 */
function downloadFile(url, destPath, onComplete, allowTextFallback = true) {
    pluginPrint(t("download.downloading", url), "INFO");

    if (typeof url !== 'string' || !/^https?:\/\/[A-Za-z0-9._~:/?#\[\]@!&'()*+,;=%-]+$/i.test(url)) {
        onComplete(t("download.invalid_url", url));
        return;
    }

    if (File.exists(destPath)) {
        try {
            File.delete(destPath);
            if (File.exists(destPath)) throw new Error(`Cannot remove old download: ${destPath}`);
        } catch (e) {
            onComplete(t("download.write_failed", e.message));
            return;
        }
    }

    // 使用 curl -L 下载（自动跟随重定向，Windows 10+ 和 Linux 通用）
    const curlCmd = `curl --fail --location --silent --show-error -o "${destPath}" "${url}"`;
    system.cmd(curlCmd, (exitCode, output) => {
        if (exitCode === 0 && File.exists(destPath)) {
            let fileSize = "unknown";
            try {
                const downloadedContent = File.readFrom(destPath);
                if (downloadedContent != null) fileSize = downloadedContent.length;
            } catch (e) { }
            pluginPrint(t("download.curl_done", destPath, fileSize), "INFO");
            onComplete(null);
            return;
        }

        pluginPrint(t("download.curl_failed", exitCode), "INFO");

        if (!allowTextFallback) {
            if (File.exists(destPath)) {
                try { File.delete(destPath); } catch (e) { }
            }
            onComplete(t("download.binary_need_curl"));
            return;
        }

        // 回退：使用 network.httpGet（适用于不重定向的链接）
        network.httpGet(url, (status, response) => {
            if (status === 200) {
                try {
                    File.writeTo(destPath, response);
                    pluginPrint(t("download.httpget_done", destPath), "INFO");
                    onComplete(null);
                } catch (e) {
                    onComplete(t("download.write_failed", e.message));
                }
                return;
            }

            // 如果是 302/301 重定向，curl 已失败，不再重试
            if (status === 302 || status === 301) {
                pluginPrint(t("download.need_redirect"), "ERROR");
                pluginPrint(t("download.install_curl"), "ERROR");
                onComplete(t("download.fail_no_curl", status));
            } else {
                onComplete(t("download.failed", status));
            }
        });
    });
}

function reloadPluginAfterUpdate(pluginName) {
    setTimeout(() => {
        try {
            const result = mc.runcmdEx(`ll reload "${pluginName}"`);
            if (!result || result.success !== true) {
                const output = result && result.output ? result.output : "command returned failure";
                throw new Error(output);
            }
            pluginPrint(t("download.reloaded", pluginName), "SUCCESS");
        } catch (error) {
            pluginPrint(t("download.reload_failed", error.message), "ERROR");
            pluginPrint(t("download.reload_manual", pluginName), "WARNING");
        }
    }, 1000);
}

function findPluginScriptPath(rootDir, pluginName, depth = 0) {
    if (depth > 4) return null;
    let entries;
    try {
        entries = File.getFilesList(rootDir);
    } catch (e) {
        return null;
    }
    if (!Array.isArray(entries)) return null;

    const expectedName = `${pluginName}.js`.toLowerCase();
    for (const entry of entries) {
        if (entry.toLowerCase() === expectedName) return `${rootDir}/${entry}`;
    }
    for (const entry of entries) {
        if (entry.toLowerCase().endsWith('.js') && entry.toLowerCase().includes(pluginName.toLowerCase())) {
            return `${rootDir}/${entry}`;
        }
    }
    for (const entry of entries) {
        if (entry === '_temp') continue;
        const nestedPath = findPluginScriptPath(`${rootDir}/${entry}`, pluginName, depth + 1);
        if (nestedPath) return nestedPath;
    }
    return null;
}

/**
 * 从指定URL下载并更新插件
 * 支持 ZIP 包（自动解压安装）和单文件两种格式
 * @param {String} pluginName 插件名称
 * @param {String} version 要更新的版本号
 * @param {String} downloadUrl 下载链接
 */
function downloadAndUpdatePlugin(pluginName, version, downloadUrl) {
    try {
        if (typeof pluginName !== 'string' || pluginName === '_temp' || /[\\/:*?"<>|\r\n]/.test(pluginName)) {
            pluginPrint(t("download.invalid_plugin_name", pluginName), "ERROR");
            return;
        }
        if (typeof downloadUrl !== 'string') {
            pluginPrint(t("download.invalid_url", downloadUrl), "ERROR");
            return;
        }
        pluginPrint(t("download.from_url", downloadUrl, pluginName, version));

        const isZip = downloadUrl.toLowerCase().endsWith('.zip') ||
            downloadUrl.toLowerCase().includes('.zip?');

        // 临时目录和文件路径
        const tempBaseDir = `./plugins/_temp`;
        const safeTempName = pluginName.replace(/[^0-9A-Za-z_.-]/g, '_');
        const tempWorkDir = `${tempBaseDir}/${safeTempName}`;
        const extractDir = `${tempWorkDir}/extract`;
        const backupDir = `${tempWorkDir}/backup`;
        const zipPath = `${tempWorkDir}/update.zip`;

        // 目标插件目录
        const targetPluginDir = `./plugins/${pluginName}`;

        if (isZip) {
            // ── ZIP 流程 ──
            ensureDir(tempBaseDir);
            removeDir(tempWorkDir);
            ensureDir(tempWorkDir);

            downloadFile(downloadUrl, zipPath, (err) => {
                if (err) {
                    pluginPrint(t("download.plugin_failed", pluginName, err), "ERROR");
                    removeDir(tempWorkDir);
                    return;
                }

                try {
                    pluginPrint(t("download.extracting"));

                    // 解压
                    extractZip(zipPath, extractDir, (err) => {
                        // 清理临时 ZIP 文件
                        if (File.exists(zipPath)) {
                            try { File.delete(zipPath); } catch (e) { }
                        }

                        if (err) {
                            pluginPrint(t("download.update_error", pluginName, err), "ERROR");
                            removeDir(tempWorkDir);
                            return;
                        }

                        try {
                            installFromExtract(extractDir, targetPluginDir, pluginName, backupDir);
                        } catch (installError) {
                            pluginPrint(t("download.update_error", pluginName, installError.message), "ERROR");
                            removeDir(tempWorkDir);
                            return;
                        }

                        // 清理临时目录
                        removeDir(tempWorkDir);
                        try {
                            const tempEntries = File.getFilesList(tempBaseDir);
                            if (tempEntries.length === 0) {
                                try { File.delete(tempBaseDir); } catch (e) { }
                            }
                        } catch (e) { }

                        pluginPrint(t("download.updated_reloading", pluginName, version), "INFO");
                        reloadPluginAfterUpdate(pluginName);
                    });
                } catch (e) {
                    pluginPrint(t("download.update_error", pluginName, e.message), "ERROR");
                    removeDir(tempWorkDir);
                }
            }, false);
        } else {
            // ── 单文件流程（兼容旧格式） ──
            const tempDir = tempWorkDir;
            ensureDir(tempBaseDir);
            removeDir(tempDir);
            ensureDir(tempDir);

            let fileName = downloadUrl.split('/').pop();
            // 去除 URL 查询参数
            if (fileName.includes('?')) {
                fileName = fileName.split('?')[0];
            }
            if (!fileName || !fileName.includes('.') || fileName === '.' || fileName === '..') {
                fileName = `${pluginName}-${version}.js`;
            }
            fileName = fileName.replace(/[^0-9A-Za-z_.-]/g, '_');

            const tempFile = `${tempDir}/${fileName}`;
            downloadFile(downloadUrl, tempFile, (err) => {
                if (err) {
                    pluginPrint(t("download.plugin_failed", pluginName, err), "ERROR");
                    removeDir(tempWorkDir);
                    return;
                }

                try {
                    // 查找插件文件路径
                    const pluginsDir = "./plugins";
                    const pluginFilePath = findPluginScriptPath(pluginsDir, pluginName);

                    if (pluginFilePath) {
                        const backupPath = pluginFilePath + '.bak';
                        const stagedPath = pluginFilePath + '.update.tmp';
                        try {
                            if (File.exists(stagedPath)) File.delete(stagedPath);
                            if (File.exists(stagedPath)) throw new Error(`Cannot remove old staging file: ${stagedPath}`);
                            File.copy(tempFile, stagedPath);
                            if (!File.exists(stagedPath)) throw new Error(`Cannot stage update at ${stagedPath}`);

                            if (File.exists(backupPath)) File.delete(backupPath);
                            if (File.exists(backupPath)) throw new Error(`Cannot remove old backup: ${backupPath}`);
                            File.copy(pluginFilePath, backupPath);
                            if (!File.exists(backupPath)) throw new Error(`Cannot create backup at ${backupPath}`);
                            pluginPrint(t("download.backed_up", backupPath));
                        } catch (backupError) {
                            pluginPrint(t("download.backup_failed", backupError.message), "WARNING");
                            if (File.exists(stagedPath)) {
                                try { File.delete(stagedPath); } catch (e) { }
                            }
                            if (File.exists(tempFile)) {
                                try { File.delete(tempFile); } catch (e) { }
                            }
                            removeDir(tempWorkDir);
                            return;
                        }

                        try {
                            File.delete(pluginFilePath);
                            if (File.exists(pluginFilePath)) throw new Error(`Cannot remove ${pluginFilePath}`);
                            File.copy(stagedPath, pluginFilePath);
                            if (!File.exists(pluginFilePath)) throw new Error(`Cannot replace ${pluginFilePath}`);
                        } catch (replaceError) {
                            try {
                                if (File.exists(pluginFilePath)) File.delete(pluginFilePath);
                                if (File.exists(pluginFilePath)) throw new Error(`Cannot remove failed update: ${pluginFilePath}`);
                                File.copy(backupPath, pluginFilePath);
                                pluginPrint(t("download.rollback_done"), "WARNING");
                            } catch (rollbackError) {
                                pluginPrint(t("download.rollback_failed", rollbackError.message), "ERROR");
                            }
                            pluginPrint(t("download.update_error", pluginName, replaceError.message), "ERROR");
                            if (File.exists(stagedPath)) {
                                try { File.delete(stagedPath); } catch (e) { }
                            }
                            if (File.exists(tempFile)) {
                                try { File.delete(tempFile); } catch (e) { }
                            }
                            removeDir(tempWorkDir);
                            return;
                        }
                        pluginPrint(t("download.file_updated", pluginFilePath));

                        if (File.exists(stagedPath)) {
                            File.delete(stagedPath);
                        }
                        if (File.exists(tempFile)) {
                            File.delete(tempFile);
                        }
                        removeDir(tempWorkDir);

                        pluginPrint(t("download.updated_reloading", pluginName, version), "INFO");

                        reloadPluginAfterUpdate(pluginName);
                    } else {
                        pluginPrint(t("download.no_file_path", pluginName), "WARNING");
                        if (File.exists(tempFile)) {
                            try { File.delete(tempFile); } catch (e) { }
                        }
                        removeDir(tempWorkDir);
                    }
                } catch (e) {
                    pluginPrint(t("download.update_error", pluginName, e.message), "ERROR");
                    removeDir(tempWorkDir);
                }
            });
        }
    } catch (e) {
        pluginPrint(t("download.url_error", pluginName, e.message), "ERROR");
    }
}

/**
 * 重载插件
 * @returns {String} 重载结果
 */
function ReloadPlugin() {
    try {
        // 重新加载配置
        const configPath = `${plugin_path}/config/${plugin_name}.json`;
        if (File.exists(configPath)) {
            const configContent = File.readFrom(configPath);
            const reloadedConfig = JSON.parse(configContent);
            if (!reloadedConfig || typeof reloadedConfig !== 'object' || Array.isArray(reloadedConfig)) {
                throw new Error("Configuration root must be an object");
            }
            pluginConfig = reloadedConfig;
            migrateLangFiles();
            applyConfiguredLanguage();
            if (bstatsInstance) bstatsInstance.syncConfig();
            scheduleUpdateChecks();
            pluginPrint(t("config.reloaded"), "SUCCESS");
        } else {
            pluginPrint(t("config.not_exist"), "WARNING");
            return `${t("config.file_path", configPath)}\n${t("config.not_exist")}`;
        }

        return `${t("config.file_path", configPath)}\n${t("config.reload_success")}`;
    } catch (e) {
        pluginPrint(t("config.reload_failed", e.message), "ERROR");
        return t("config.reload_failed", e.message);
    }
}

function saveRuntimeConfig() {
    if (!pluginConfig) return;
    try {
        const configPath = `${plugin_path}/config/${plugin_name}.json`;
        File.writeTo(configPath, JSON.stringify(pluginConfig, null, 4));
    } catch (e) {
        pluginPrint(t("config.reload_failed", e.message), "WARNING");
    }
}

function recordLastCheckTime() {
    if (!pluginConfig) return;
    pluginConfig.last_check_time = Math.floor(Date.now() / 1000);
    saveRuntimeConfig();
}

function scheduleUpdateChecks() {
    // 取消之前的定时任务（LSE 不支持 clearTimeout，使用代数计数器）
    scheduleGeneration++;
    const myGeneration = scheduleGeneration;

    if (!pluginConfig || !pluginConfig.check_update_on_load) return;

    let delay = Number(pluginConfig.check_delay);
    if (!Number.isFinite(delay) || delay < 0) delay = 10;
    let interval = Number(pluginConfig.check_interval);
    if (!Number.isFinite(interval) || interval <= 0) interval = 1800;

    pluginPrint(t("update.auto_check_delay", delay));
    setTimeout(() => {
        if (scheduleGeneration !== myGeneration) return;
        checkAllPluginsUpdate();
        // 启动定期检查
        const doInterval = () => {
            if (scheduleGeneration !== myGeneration) return;
            checkAllPluginsUpdate();
            setTimeout(doInterval, interval * 1000);
        };
        setTimeout(doInterval, interval * 1000);
    }, delay * 1000);
}

/**
 * 检查所有插件的更新
 * @param {Boolean} force 是否强制检查（跳过时间间隔限制）
 */
function checkAllPluginsUpdate(force = false) {
    // 并发守卫：防止重叠检查
    if (checkingInProgress) {
        pluginPrint(t("update.checking_in_progress"), "WARNING");
        return;
    }

    // 时间间隔守卫
    if (!force && pluginConfig) {
        const now = Math.floor(Date.now() / 1000);
        const lastCheck = pluginConfig.last_check_time || 0;
        const interval = Number(pluginConfig.check_interval);
        if (Number.isFinite(interval) && interval > 0 && (now - lastCheck) < interval / 4) {
            pluginPrint(t("update.check_time_guard", Math.floor(interval / 4)), "INFO");
            return;
        }
    }

    checkingInProgress = true;
    pluginPrint(t("update.checking_all"));

    // 获取所有已加载的插件
    const plugins = ll.listPlugins();
    let pending = 0;
    let checkedCount = 0;

    for (const pluginName of plugins) {
        // 使用统一辅助函数获取插件更新信息（一次导入，避免重复）
        const pluginInfo = getPluginUpdateInfo(pluginName);

        if (pluginInfo) {
            const currentVersion = pluginInfo.plugin_version || "unknown";
            pending++;
            checkedCount++;
            // 传入已获取的pluginInfo避免内部重复导入，通过onComplete追踪异步完成
            checkPluginUpdate(pluginName, currentVersion, false, pluginInfo, () => {
                pending--;
                if (pending === 0) {
                    recordLastCheckTime();
                    checkingInProgress = false;
                    pluginPrint(t("update.check_done", checkedCount), "SUCCESS");
                }
            });
        }
    }

    // 边界情况：没有任何插件支持更新检查
    if (pending === 0) {
        recordLastCheckTime();
        checkingInProgress = false;
        pluginPrint(t("update.no_plugins"), "INFO");
    }
}

// TAG: 注册指令模块
// #region 注册指令模块
/**
 * 注册指令
 */
function RegisterCmd() {
    // 注册checkupdate指令（使用 RawText 手动解析子命令，避免 BDS 解析裸 RawText 参数报错）
    const checkupdate_cmd = mc.newCommand("checkupdate", t("command.desc"), PermType.GameMasters);
    checkupdate_cmd.setAlias("ecu"); // 设置别名

    // 设置参数（统一使用 RawText，在回调中手动解析子命令）
    checkupdate_cmd.mandatory("action", ParamType.RawText);
    checkupdate_cmd.optional("target", ParamType.RawText);
    checkupdate_cmd.optional("version", ParamType.RawText);

    // 设置overload
    checkupdate_cmd.overload([]);                              // /checkupdate → 帮助
    checkupdate_cmd.overload(["action"]);                       // /checkupdate <reload|all|插件名>
    checkupdate_cmd.overload(["action", "target"]);             // /checkupdate <update|info> <插件名>
    checkupdate_cmd.overload(["action", "target", "version"]);  // /checkupdate update|info <插件名> <版本号>

    // 指令回调处理
    checkupdate_cmd.setCallback((_cmd, origin, output, results) => {
        // 检查权限
        if (origin.typeName == "Player") {
            const pl = mc.getPlayer(origin.player.realName);
            if (!pl.isOP()) {
                pl.tell("§c" + t("command.no_permission"));
                return output.success();
            }
        }

        const action = results.action;

        // 无参数 → 显示帮助
        if (!action) {
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell(`§a[${plugin_name}] §f` + t("command.help"));
            } else {
                pluginPrint(t("command.help"));
            }
            return output.success();
        }

        // 子命令：reload
        if (action === "reload") {
            const result = ReloadPlugin();
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell(`§a[${plugin_name}] §f${result}`);
            } else {
                pluginPrint(result);
            }
            return output.success();
        }

        // 子命令：check <插件名>
        if (action === "check") {
            const pluginName = results.target;
            if (!pluginName) {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell("§c" + t("command.update_usage"));
                } else {
                    pluginPrint(t("command.update_usage"));
                }
                return output.success();
            }
            const pluginInfo = getPluginUpdateInfo(pluginName);
            if (pluginInfo) {
                const currentVersion = pluginInfo.plugin_version || "unknown";
                checkPluginUpdate(pluginName, currentVersion, false, pluginInfo);
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell("§a" + t("command.checking_plugin", pluginName));
                }
            } else {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell("§c" + t("command.plugin_not_found", pluginName));
                } else {
                    pluginPrint(t("command.plugin_not_found", pluginName), "ERROR");
                }
            }
            return output.success();
        }

        // 子命令：all
        if (action === "all") {
            checkAllPluginsUpdate();
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell("§a" + t("command.checking_all"));
            }
            return output.success();
        }

        // 子命令：update <插件名> [版本号]
        if (action === "update") {
            const pluginName = results.target;
            if (!pluginName) {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell("§c" + t("command.update_usage"));
                } else {
                    pluginPrint(t("command.update_usage"));
                }
                return output.success();
            }

            const targetVer = results.version ? normalizeVersion(results.version) : null;
            const pluginInfo = getPluginUpdateInfo(pluginName);
            if (pluginInfo) {
                const currentVersion = pluginInfo.plugin_version || "unknown";
                checkPluginUpdate(pluginName, currentVersion, true, pluginInfo, null, targetVer);
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§a` + t("command.checking_update", pluginName));
                }
            } else {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§c` + t("command.plugin_not_found", pluginName));
                } else {
                    pluginPrint(t("command.plugin_not_found", pluginName), "ERROR");
                }
            }
            return output.success();
        }

        // 子命令：info <插件名> [版本号|p页码]
        if (action === "info") {
            const pluginName = results.target;
            let versionName = results.version || null;
            let pageNum = 1;
            // 解析分页参数 (如 p2)
            if (versionName && /^p\d+$/i.test(versionName)) {
                pageNum = parseInt(versionName.substring(1), 10);
                versionName = null;
            } else if (versionName) {
                versionName = normalizeVersion(versionName);
            }
            if (!pluginName) {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell("§c" + t("command.info_usage"));
                } else {
                    pluginPrint(t("command.info_usage"));
                }
                return output.success();
            }

            const pluginInfo = getPluginUpdateInfo(pluginName);
            if (!pluginInfo || !pluginInfo.update_url) {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§c` + t("command.plugin_not_found", pluginName));
                } else {
                    pluginPrint(t("command.plugin_not_found", pluginName), "ERROR");
                }
                return output.success();
            }

            // 异步拉取版本信息
            network.httpGet(pluginInfo.update_url, (status, response) => {
                if (status !== 200) {
                    pluginPrint(t("update.fetch_failed", pluginName, status), "WARNING");
                    return;
                }
                try {
                    const updateData = JSON.parse(response);
                    if (!updateData.versions || typeof updateData.versions !== 'object') {
                        pluginPrint(t("update.format_error", pluginName), "WARNING");
                        return;
                    }
                    const versions = updateData.versions;

                    if (versionName) {
                        // 查看指定版本详情
                        const verKey = findVersionKey(versions, versionName);
                        if (!verKey || !versions[verKey]) {
                            pluginPrint(t("update.version_not_found", pluginName, versionName), "WARNING");
                            return;
                        }
                        printVersionDetail(pluginName, verKey, versions[verKey]);
                    } else {
                        // 显示版本列表（支持分页），计算推荐版本 ★
                        const currentVersion = pluginInfo.plugin_version || "unknown";
                        const sortedVers = Object.keys(versions).sort((a, b) => compareVersions(b, a));
                        const currentIsPre = isPreRelease(currentVersion);
                        let recommendedVer = null;
                        // 测试版→推荐最新测试版，正式版→推荐最新正式版（跳过当前版本）
                        for (const v of sortedVers) {
                            if (isPreRelease(v) === currentIsPre && compareVersions(v, currentVersion) > 0) {
                                recommendedVer = v; break;
                            }
                        }
                        if (!recommendedVer) recommendedVer = updateData.latest_version || "";
                        // 推荐版本不高于当前版本则不显示★
                        if (recommendedVer && compareVersions(recommendedVer, currentVersion) <= 0) {
                            recommendedVer = "";
                        }
                        printVersionList(pluginName, versions, currentVersion, recommendedVer, pageNum);
                    }
                } catch (e) {
                    pluginPrint(t("update.parse_version_error", e.message), "WARNING");
                }
            });
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                if (versionName) {
                    pl.tell(`§a` + t("command.querying_detail", pluginName, versionName));
                } else {
                    pl.tell(`§a` + t("command.querying_list", pluginName));
                }
            }
            return output.success();
        }

        // 未知子命令 → 显示帮助
        {
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell(`§a[${plugin_name}] §f` + t("command.help"));
            } else {
                pluginPrint(t("command.help"));
            }
            return output.success();
        }
    });

    checkupdate_cmd.setup(); // 指令初始化
}
// #endregion

Loadplugin();

// TAG: 导出CheckUpdate函数
// #region 导出CheckUpdate函数
/**
 * 导出CheckUpdate函数，供其他插件使用
 */
function ExportCheckUpdate() {
    return {
        update_url: "https://raw.githubusercontent.com/MengHanLOVE1027/lse-easycheckupdate/refs/heads/main/update_versions.json",
        plugin_version: plugin_version
    };
}
// 导出CheckUpdate函数到"ecu"命名空间
ll.exports(ExportCheckUpdate, "ecu", `${plugin_name}`);
// #endregion

// 插件调用方法
// 其实就传递了个update_url字段 awa
// function CheckUpdate() {
//     return {
//         update_url: "https://raw.githubusercontent.com/MengHanLOVE1027/lse-easycheckupdate/refs/heads/main/update_versions.json"
//         plugin_version: "v1.0.0"
//     }
// }
// if (!ll.hasExported("ecu", "EasyCheckUpdate")) {
//     pluginPrint("请安装 EasyCheckUpdate 插件以为本插件提供更新检查功能", "WARNING")
// } else {
//     ll.exports(CheckUpdate, "ecu", `${plugin_name}`)
// }
