// TAG: 全局常量模块
// #region 全局常量模块
// 声明常量
const plugin_name = "EasyCheckUpdate",
    plugin_name_smallest = "easycheckupdate",
    plugin_version = "0.2.0-beta.3",
    plugin_description = "一个基于 LSE 的插件更新检查工具 / A plugin update checker based on LSE.",
    plugin_github_link = "https://github.com/MengHanLOVE1027/lse-easycheckupdate",
    plugin_minebbs_link = "https://www.minebbs.com/resources/easycheckupdate-ecu-lse.15501/",
    plugin_update_url = "https://raw.githubusercontent.com/MengHanLOVE1027/lse-easycheckupdate/main/update_versions.json",
    plugin_license = "AGPL-3.0",
    plugin_path = `./plugins/${plugin_name}`;

// 声明全局变量
let pluginConfig = null;
let bstatsInstance = null;
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
                    if (this.debugMode) bstatsRandomGradientLog(`从 server.properties 读取到 online-mode: ${value}`);
                    return value === 'true' ? 1 : 0;
                }
            }
            if (this.debugMode) logger.warn("server.properties 中未找到 'online-mode'，将使用默认值 1。");
        } catch (e) {
            if (this.debugMode) logger.error(`读取 server.properties 失败: ${e.message}，将使用默认值 1。`);
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
                    logger.error("读取bstats配置文件失败: " + e.message);
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
                    logger.error("保存配置文件失败: " + e.message);
                }
            }
        } catch (e) {
            logger.error("同步BStats配置失败: " + e.message);
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
        if (!this.enabled) {
            bstatsRandomGradientLog("遥测模块已禁用，跳过上报。");
            return;
        }
        const payload = this.collectData();
        if (this.debugMode) {
            bstatsRandomGradientLog("准备上报数据包内容:");
            bstatsRandomGradientLog(JSON.stringify(payload, null, 2));
        }
        try {
            network.httpPost(this.baseUrl, JSON.stringify(payload), "application/json", (status, result) => {
                if (status === 200) {
                    bstatsRandomGradientLog("遥测数据上报成功。");
                } else {
                    logger.warn(`上报失败，状态码: ${status}, 返回结果: ${result}`);
                }
            });
        } catch (e) {
            if (this.debugMode) {
                logger.error("网络请求异常: " + e.message);
            }
        }
    }

    start() {
        // 延长到 10 秒，给异步命令足够的时间返回结果
        setTimeout(() => this.submit(), 10 * 1000);
        setInterval(() => this.submit(), 30 * 60 * 1000);
        setTimeout(() => {
            bstatsRandomGradientLog(`${this.pluginName}遥测模块已启动。首次数据将在 10 秒后发送。`);
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
 * 字符串格式化函数
 * @param {String} str 包含 %s 占位符的字符串
 * @param {...any} args 要替换的参数
 * @returns {String} 格式化后的字符串
 */
function formatString(str, ...args) {
    // 确保str是字符串类型
    if (typeof str !== 'string') {
        console.error(`formatString: str is not a string, type: ${typeof str}, value: ${str}`)
        return String(str)
    }
    // 支持 %s 和 %d 格式化占位符
    return str.replace(/%[sd]/g, () => args.shift())
}

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
        case "SUCESS":
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
        logger.error(`写入日志文件失败: ${e}`)
    }
}

/**
 * 加载插件
 */
function Loadplugin() {
    // 初始化插件配置
    // 确保插件目录存在
    if (!File.exists(plugin_path)) {
        File.createDir(plugin_path);
    }
    // 确保配置目录存在
    const configDir = `${plugin_path}/config`;
    if (!File.exists(configDir)) {
        File.createDir(configDir);
    }

    // 使用LSE的配置文件加载方式
    const configPath = `${plugin_path}/config/${plugin_name}.json`;

    // 尝试导入配置文件
    try {
        // 如果配置文件存在，读取它
        if (File.exists(configPath)) {
            const configContent = File.readFrom(configPath);
            pluginConfig = JSON.parse(configContent);
        } else {
            // 创建默认配置
            pluginConfig = {
                "Bstats": {
                    "EnableModule": true,
                    "logSentData": false
                },
                "check_update_on_load": true,
                "check_interval": 1800,
                "check_delay": 10,
                "last_check_time": 0
            };
            // 保存默认配置
            File.writeTo(configPath, JSON.stringify(pluginConfig, null, 4));
        }
    } catch (e) {
        pluginPrint(`加载配置文件失败: ${e.message}`, "ERROR");
        // 使用默认配置
        pluginConfig = {
            "Bstats": {
                "EnableModule": true,
                "logSentData": false
            },
            "check_update_on_load": true,
            "check_interval": 1800,
            "check_delay": 10,
            "last_check_time": 0
        };
    }

    // NOTE: 输出插件LOGO
    logger.setTitle(`\x1b[32m${plugin_name}\x1b[0m`) // 设置日志头
    pluginPrint(`
███████╗ █████╗ ███████╗██╗   ██╗██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
█████╗  ███████║███████╗ ╚████╔╝ ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗  
██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝  
███████╗██║  ██║███████║   ██║   ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗
╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝`)
    pluginPrint(`作者：梦涵LOVE          版本：v${plugin_version}`)
    pluginPrint("================================================================================")
    pluginPrint(`${plugin_name} - ${plugin_description}`)
    pluginPrint("感谢您使用Easy系列插件！")
    pluginPrint(`本插件使用 ${plugin_license} 许可证协议发布`)
    pluginPrint(`GitHub 仓库：${plugin_github_link}`)
    pluginPrint(`插件MineBBS资源帖：${plugin_minebbs_link}`)
    pluginPrint("Easy系列插件交流群：1083195477")
    pluginPrint(`作者：梦涵LOVE | 版本：v${plugin_version}`)

    let bstatsConf = pluginConfig && pluginConfig.Bstats ? pluginConfig.Bstats : {}; // 获取BStats配置
    pluginPrint("BStats状态：" + (bstatsConf.EnableModule ? "已启用" : "已禁用"))
    pluginPrint("================================================================================")

    // 初始化BStats
    try {
        bstatsInstance = new BStatsImpl(29850);
        bstatsInstance.start();
    } catch (e) {
        pluginPrint("BStats初始化失败: " + e, "ERROR");
    }

    // 注册指令
    try {
        RegisterCmd();
        pluginPrint("指令注册成功", "SUCCESS");
    } catch (e) {
        pluginPrint("指令注册失败: " + e, "ERROR");
    }

    // 自动检查更新
    if (pluginConfig && pluginConfig.check_update_on_load) {
        const delay = pluginConfig.check_delay || 10;
        pluginPrint(`将在 ${delay} 秒后自动检查所有插件的更新...`);
        setTimeout(() => {
            checkAllPluginsUpdate();
        }, delay * 1000);
    }
}

// TAG: 更新检查模块
// #region 更新检查模块
/**
 * 比较两个版本号
 * @param {String} version1 版本号1
 * @param {String} version2 版本号2
 * @returns {Number} -1 表示 version1 < version2，0 表示 version1 == version2，1 表示 version1 > version2
 */
function compareVersions(version1, version2) {
    // 移除版本号前的 'v' 或 'V' 前缀
    const v1 = version1.replace(/^[vV]/, '');
    const v2 = version2.replace(/^[vV]/, '');

    // 分割版本号
    const v1Parts = v1.split('.');
    const v2Parts = v2.split('.');

    // 确保两个版本号的长度相同
    const maxLength = Math.max(v1Parts.length, v2Parts.length);
    while (v1Parts.length < maxLength) v1Parts.push('0');
    while (v2Parts.length < maxLength) v2Parts.push('0');

    // 逐个比较版本号部分
    for (let i = 0; i < maxLength; i++) {
        const num1 = parseInt(v1Parts[i]);
        const num2 = parseInt(v2Parts[i]);

        if (isNaN(num1) || isNaN(num2)) {
            // 如果无法转换为数字，则按字符串比较
            if (v1Parts[i] < v2Parts[i]) return -1;
            if (v1Parts[i] > v2Parts[i]) return 1;
        } else {
            if (num1 < num2) return -1;
            if (num1 > num2) return 1;
        }
    }
    return 0;
}

/**
 * 检测版本号是否为预发布版本（包含 alpha、beta、rc 等标记）
 * @param {String} version 版本号
 * @returns {Boolean} 是否为预发布版本
 */
function isPreRelease(version) {
    const v = version.replace(/^[vV]/, '');
    return /[a-zA-Z]/.test(v);
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
 * 打印插件的版本列表（多版本格式）
 * @param {String} pluginName 插件名称
 * @param {Object} versions 版本信息对象
 * @param {String} currentVersion 当前版本
 * @param {String|null} recommendedVer 推荐升级版本，null表示无更新
 * @param {Boolean} userIsPreRelease 用户当前是否为预发布版本
 */
function printVersionList(pluginName, versions, currentVersion, recommendedVer, userIsPreRelease) {
    pluginPrint(`插件 ${pluginName} 的可用版本列表:`);
    const sorted = Object.keys(versions).sort((a, b) => compareVersions(b, a)); // 降序排列
    for (const ver of sorted) {
        // 正式版用户不显示测试版
        if (!userIsPreRelease && isPreRelease(ver)) continue;
        const tag = isPreRelease(ver) ? "测试版" : "正式版";
        const marker = ver === currentVersion ? " [当前版本]" : "";
        const latest = ver === recommendedVer ? " ★推荐" : "";
        pluginPrint(`  v${ver} (${tag})${latest}${marker}`);
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
    pluginPrint(`正在检查插件 ${pluginName} 的更新...`);

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
            pluginPrint(`正在从 ${updateUrl} 获取插件 ${pluginName} 的更新信息...`);

            // 下载更新信息
            network.httpGet(updateUrl, (status, response) => {
                try {
                    if (status !== 200) {
                        pluginPrint(`从 ${updateUrl} 获取插件 ${pluginName} 的更新信息时出错，状态码: ${status}`, "WARNING");
                        return;
                    }

                    const updateData = JSON.parse(response);
                    let latestVersion, downloadUrl, updateContent, author, updateTime;

                    // 检查是否包含必要的信息
                    // 支持两种格式：单版本格式和多版本格式
                    if (updateData.version && updateData.download_url) {
                        // 单版本格式
                        latestVersion = updateData.version;
                        downloadUrl = updateData.download_url;
                        updateContent = updateData.update_content || "无更新内容";
                        author = updateData.author || "未知作者";
                        updateTime = updateData.update_time || "未知时间";
                    } else if (updateData.latest_version && updateData.versions) {
                        // 多版本格式
                        const versions = updateData.versions;

                        // 仅支持对象格式的 versions
                        if (Array.isArray(versions) || typeof versions !== 'object') {
                            pluginPrint(`插件 ${pluginName} 的更新信息格式不正确`, "WARNING");
                            return;
                        }

                        // 如果指定了目标版本，直接使用
                        if (targetVersion) {
                            const targetInfo = versions[targetVersion];
                            if (!targetInfo) {
                                pluginPrint(`插件 ${pluginName} 未找到指定版本 v${targetVersion}`, "WARNING");
                                return;
                            }
                            latestVersion = targetVersion;
                            downloadUrl = targetInfo.download_url;
                            updateContent = targetInfo.update_content || "无更新内容";
                            author = targetInfo.author || "未知作者";
                            updateTime = targetInfo.update_time || "未知时间";
                        } else {
                            // 智能选择最佳版本：正式版用户跳过测试版，测试版用户沿升级链逐级升级
                            const userIsPreRelease = isPreRelease(currentVersion);
                            let candidateVer = null;

                            for (const ver of Object.keys(versions)) {
                                // 正式版用户跳过预发布版本
                                if (!userIsPreRelease && isPreRelease(ver)) continue;
                                // 只考虑比当前版本新的
                                if (compareVersions(ver, currentVersion) <= 0) continue;
                                // 取最小的（最近的升级步骤）
                                if (!candidateVer || compareVersions(ver, candidateVer) < 0) {
                                    candidateVer = ver;
                                }
                            }

                            if (!candidateVer) {
                                pluginPrint(`插件 ${pluginName} 已是最新版本: ${currentVersion}`);
                                return;
                            }

                            const versionInfo = versions[candidateVer];
                            latestVersion = candidateVer;
                            downloadUrl = versionInfo.download_url;
                            if (!downloadUrl) {
                                pluginPrint(`插件 ${pluginName} 的更新信息缺少下载链接`, "WARNING");
                                return;
                            }
                            updateContent = versionInfo.update_content || "无更新内容";
                            author = versionInfo.author || "未知作者";
                            updateTime = versionInfo.update_time || "未知时间";
                        }
                    } else {
                        pluginPrint(`插件 ${pluginName} 的更新信息文件缺少必要信息`, "WARNING");
                        return;
                    }

                    // 使用版本比较函数比较版本号
                    const versionComparison = compareVersions(latestVersion, currentVersion);
                    if (versionComparison > 0) {
                        pluginPrint("================================================================================", "INFO");
                        pluginPrint(`插件 ${pluginName} 有新版本: v${latestVersion} (当前版本: ${currentVersion})`);
                        pluginPrint(`作者: ${author}`);
                        pluginPrint(`更新时间: ${updateTime}`);
                        pluginPrint(`更新内容: ${updateContent}`);
                        pluginPrint(`下载地址: ${downloadUrl}`);
                        pluginPrint("================================================================================", "INFO");

                        // 如果启用了自动更新，则下载并更新插件
                        if (autoUpdate) {
                            downloadAndUpdatePlugin(pluginName, `v${latestVersion}`, downloadUrl);
                        }
                    } else if (versionComparison < 0) {
                        pluginPrint(`插件 ${pluginName} 的当前版本 ${currentVersion} 比最新版本 v${latestVersion} 更新`, "INFO");
                    } else {
                        pluginPrint(`插件 ${pluginName} 已是最新版本: ${currentVersion}`);
                    }
                } catch (e) {
                    pluginPrint(`解析插件 ${pluginName} 的更新信息时出错: ${e.message}`, "WARNING");
                } finally {
                    signalComplete();
                }
            });
        } catch (e) {
            pluginPrint(`检查插件 ${pluginName} 的更新时出错: ${e.message}`, "ERROR");
            signalComplete();
        }
    } else {
        pluginPrint(`未找到插件 ${pluginName} 的 update_url 字段，无法检查更新`, "WARNING");
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
}

/**
 * 递归删除目录及其所有内容
 * @param {String} dirPath 目录路径
 */
function removeDir(dirPath) {
    if (!File.exists(dirPath)) return;
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
                    removeDir(fullPath);
                }
            }
        }
        // 删除空目录自身
        try { File.delete(dirPath); } catch (e) { /* 忽略 */ }
    } catch (e) {
        pluginPrint(`清理目录 ${dirPath} 时出错: ${e.message}`, "WARNING");
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
            pluginPrint(`已使用 tar 解压完成`, "INFO");
            onComplete(null);
            return;
        }

        // tar 失败，尝试 PowerShell
        pluginPrint(`tar 解压失败(exit=${exitCode})，尝试 PowerShell...`, "INFO");
        const psCmd = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`;
        system.cmd(psCmd, (exitCode2, output2) => {
            if (exitCode2 === 0) {
                pluginPrint(`已使用 PowerShell 解压完成`, "INFO");
                onComplete(null);
            } else {
                pluginPrint(`PowerShell 解压也失败(exit=${exitCode2}): ${output2}`, "ERROR");
                onComplete(`解压失败: tar 和 PowerShell 均无法解压`);
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
function installFromExtract(extractDir, targetPluginDir, pluginName) {
    // 查找源根目录：若解压后只有一个子目录，以该子目录为源根
    let sourceRoot = extractDir;
    try {
        const entries = File.getFilesList(extractDir);
        const topDirs = [];
        const topFiles = [];
        for (const entry of entries) {
            const fullPath = `${extractDir}/${entry}`;
            if (File.exists(fullPath)) {
                // 通过是否有扩展名简单区分文件和目录
                if (entry.includes('.')) {
                    topFiles.push(entry);
                } else {
                    topDirs.push(entry);
                }
            }
        }
        if (topDirs.length === 1 && topFiles.length <= 1) {
            // 典型 GitHub Release ZIP 结构：外层一个文件夹
            sourceRoot = `${extractDir}/${topDirs[0]}`;
            pluginPrint(`检测到压缩包根目录: ${topDirs[0]}`, "INFO");
        }
    } catch (e) {
        pluginPrint(`扫描解压目录时出错: ${e.message}`, "WARNING");
    }

    // 确保目标插件目录存在
    ensureDir(targetPluginDir);

    // 复制所有文件
    try {
        const sourceFiles = File.getFilesList(sourceRoot);
        let copiedCount = 0;
        for (const fileName of sourceFiles) {
            const srcPath = `${sourceRoot}/${fileName}`;
            const dstPath = `${targetPluginDir}/${fileName}`;
            try {
                if (File.exists(dstPath)) {
                    // 如果是目录，跳过（LSE File API 不支持目录级操作）
                    // 先尝试删除再复制
                    try { File.delete(dstPath); } catch (e) { /* 可能为目录 */ }
                }
                File.copy(srcPath, dstPath);
                copiedCount++;
                pluginPrint(`  复制: ${fileName}`, "INFO");
            } catch (copyErr) {
                // 可能是子目录，尝试递归复制
                if (File.exists(srcPath)) {
                    try {
                        const subFiles = File.getFilesList(srcPath);
                        ensureDir(dstPath);
                        for (const subFile of subFiles) {
                            const subSrc = `${srcPath}/${subFile}`;
                            const subDst = `${dstPath}/${subFile}`;
                            try {
                                if (File.exists(subDst)) { try { File.delete(subDst); } catch (e) { } }
                                File.copy(subSrc, subDst);
                                copiedCount++;
                                pluginPrint(`  复制: ${fileName}/${subFile}`, "INFO");
                            } catch (e2) { /* 忽略深层错误 */ }
                        }
                    } catch (e2) { /* 忽略无法处理的条目 */ }
                }
            }
        }
        pluginPrint(`已安装 ${copiedCount} 个文件到 ${targetPluginDir}`, "SUCCESS");
    } catch (e) {
        pluginPrint(`复制文件时出错: ${e.message}`, "ERROR");
    }
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
        pluginPrint(`正在从 ${downloadUrl} 下载插件 ${pluginName} 版本 ${version}...`);

        const isZip = downloadUrl.toLowerCase().endsWith('.zip') ||
            downloadUrl.toLowerCase().includes('.zip?');

        // 临时目录和文件路径
        const tempBaseDir = `./plugins/_temp`;
        const tempWorkDir = `${tempBaseDir}/${pluginName}`;
        const extractDir = `${tempWorkDir}/extract`;
        const zipPath = `${tempWorkDir}/update.zip`;

        // 目标插件目录
        const targetPluginDir = `./plugins/${pluginName}`;

        if (isZip) {
            // ── ZIP 流程 ──
            ensureDir(tempBaseDir);
            ensureDir(tempWorkDir);

            network.httpGet(downloadUrl, (status, response) => {
                if (status !== 200) {
                    pluginPrint(`下载插件 ${pluginName} 失败，状态码: ${status}`, "ERROR");
                    return;
                }

                try {
                    // 保存 ZIP 到临时文件
                    File.writeTo(zipPath, response);
                    pluginPrint(`ZIP 已下载到 ${zipPath}，正在解压...`);

                    // 解压
                    extractZip(zipPath, extractDir, (err) => {
                        // 清理临时 ZIP 文件
                        if (File.exists(zipPath)) {
                            try { File.delete(zipPath); } catch (e) { }
                        }

                        if (err) {
                            pluginPrint(`插件 ${pluginName} ${err}`, "ERROR");
                            // 清理
                            removeDir(tempWorkDir);
                            return;
                        }

                        // 安装文件
                        installFromExtract(extractDir, targetPluginDir, pluginName);

                        // 清理临时目录
                        removeDir(tempWorkDir);
                        // 如果 _temp 目录为空，也清理掉
                        try {
                            const tempEntries = File.getFilesList(tempBaseDir);
                            if (tempEntries.length === 0) {
                                try { File.delete(tempBaseDir); } catch (e) { }
                            }
                        } catch (e) { }

                        pluginPrint(`插件 ${pluginName} 已更新到 v${version}，正在重载插件...`, "INFO");

                        // 重载插件
                        setTimeout(() => {
                            try {
                                mc.runcmdEx(`ll reload ${pluginName}`);
                                pluginPrint(`插件 ${pluginName} 已重载`, "SUCCESS");
                            } catch (error) {
                                pluginPrint(`重载插件失败: ${error.message}`, "ERROR");
                                pluginPrint(`请手动执行: ll reload ${pluginName}`, "WARNING");
                            }
                        }, 1000);
                    });
                } catch (e) {
                    pluginPrint(`更新插件 ${pluginName} 时出错: ${e.message}`, "ERROR");
                    removeDir(tempWorkDir);
                }
            });
        } else {
            // ── 单文件流程（兼容旧格式） ──
            const tempDir = tempBaseDir;
            ensureDir(tempDir);

            let fileName = downloadUrl.split('/').pop();
            if (!fileName.endsWith('.js')) {
                fileName = `${pluginName}-${version}.js`;
            }

            const tempFile = `${tempDir}/${fileName}`;
            network.httpGet(downloadUrl, (status, response) => {
                if (status !== 200) {
                    pluginPrint(`下载插件 ${pluginName} 失败，状态码: ${status}`, "ERROR");
                    return;
                }

                try {
                    File.writeTo(tempFile, response);
                    pluginPrint(`文件已下载到 ${tempFile}`);

                    // 查找插件文件路径
                    const pluginsDir = "./plugins";
                    let pluginFilePath;

                    const files = File.getFilesList(pluginsDir);
                    for (const file of files) {
                        if (file === pluginName || file.toLowerCase() === pluginName.toLowerCase()) {
                            const pluginDir = `${pluginsDir}/${file}`;
                            const pluginFiles = File.getFilesList(pluginDir);
                            for (const pluginFile of pluginFiles) {
                                if (pluginFile === `${pluginName}.js` || pluginFile.toLowerCase() === `${pluginName.toLowerCase()}.js`) {
                                    pluginFilePath = `${pluginDir}/${pluginFile}`;
                                    break;
                                }
                            }
                            if (pluginFilePath) break;
                        }
                        if (file.toLowerCase().includes(pluginName.toLowerCase())) {
                            const pluginDir = `${pluginsDir}/${file}`;
                            const pluginFiles = File.getFilesList(pluginDir);
                            for (const pluginFile of pluginFiles) {
                                if (pluginFile.toLowerCase().includes(pluginName.toLowerCase())) {
                                    pluginFilePath = `${pluginDir}/${pluginFile}`;
                                    break;
                                }
                            }
                            if (pluginFilePath) break;
                        }
                    }

                    if (pluginFilePath) {
                        // 备份旧文件
                        const backupPath = pluginFilePath + '.bak';
                        try {
                            File.copy(pluginFilePath, backupPath);
                            pluginPrint(`已备份旧文件到 ${backupPath}`);
                        } catch (backupError) {
                            pluginPrint(`备份文件失败: ${backupError.message}`, "WARNING");
                        }

                        // 替换文件
                        if (File.exists(pluginFilePath)) {
                            File.delete(pluginFilePath);
                        }
                        File.copy(tempFile, pluginFilePath);
                        pluginPrint(`已更新插件文件: ${pluginFilePath}`);

                        // 清理临时文件
                        if (File.exists(tempFile)) {
                            File.delete(tempFile);
                            pluginPrint(`已清理临时文件: ${tempFile}`);
                        }

                        pluginPrint(`插件 ${pluginName} 已更新，正在重载插件...`, "INFO");

                        setTimeout(() => {
                            try {
                                mc.runcmdEx(`ll reload ${pluginName}`);
                                pluginPrint(`插件 ${pluginName} 已重载`, "SUCCESS");
                            } catch (error) {
                                pluginPrint(`重载插件失败: ${error.message}`, "ERROR");
                                pluginPrint(`请手动执行: ll reload ${pluginName}`, "WARNING");
                            }
                        }, 1000);
                    } else {
                        pluginPrint(`无法找到插件 ${pluginName} 的文件路径`, "WARNING");
                    }
                } catch (e) {
                    pluginPrint(`更新插件 ${pluginName} 时出错: ${e.message}`, "ERROR");
                }
            });
        }
    } catch (e) {
        pluginPrint(`从URL下载插件 ${pluginName} 时出错: ${e.message}`, "ERROR");
    }
}

/**
 * 重载插件
 * @returns {Array} 重载结果
 */
function ReloadPlugin() {
    try {
        // 重新加载配置
        const configPath = `${plugin_path}/config/${plugin_name}.json`;
        if (File.exists(configPath)) {
            const configContent = File.readFrom(configPath);
            pluginConfig = JSON.parse(configContent);
            pluginPrint("配置文件已重新加载", "SUCCESS");
        } else {
            pluginPrint("配置文件不存在，使用默认配置", "WARNING");
        }

        return [`配置文件: ${configPath}`, "重载成功"];
    } catch (e) {
        pluginPrint(`重载插件失败: ${e.message}`, "ERROR");
        return [`重载失败: ${e.message}`];
    }
}

/**
 * 检查所有插件的更新
 */
function checkAllPluginsUpdate() {
    pluginPrint("正在检查所有插件的更新...");

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
                    pluginPrint(`检查完成，共检查了 ${checkedCount} 个支持更新检查的插件`, "SUCCESS");
                }
            });
        }
    }

    // 边界情况：没有任何插件支持更新检查
    if (pending === 0) {
        pluginPrint("没有找到支持更新检查的插件", "INFO");
    }
}

// TAG: 注册指令模块
// #region 注册指令模块
/**
 * 注册指令
 */
function RegisterCmd() {
    // 注册checkupdate指令
    const checkupdate_cmd = mc.newCommand("checkupdate", "检查插件更新", PermType.GameMasters);
    checkupdate_cmd.setAlias("ecu"); // 设置别名

    // 设置枚举
    checkupdate_cmd.setEnum("ReloadAction", ["reload"]); // 重载动作
    checkupdate_cmd.setEnum("UpdateAction", ["update"]); // 更新动作
    checkupdate_cmd.setEnum("AllAction", ["all"]); // 检查所有动作
    checkupdate_cmd.setEnum("InfoAction", ["info"]); // 查看版本详情

    // 设置参数
    checkupdate_cmd.mandatory("action", ParamType.Enum, "ReloadAction", 1); // 重载动作参数
    checkupdate_cmd.mandatory("action", ParamType.Enum, "UpdateAction", 1); // 更新动作参数
    checkupdate_cmd.mandatory("action", ParamType.Enum, "AllAction", 1); // 检查所有动作参数
    checkupdate_cmd.mandatory("action", ParamType.Enum, "InfoAction", 1); // 查看版本详情参数
    checkupdate_cmd.optional("plugin", ParamType.RawText); // 可选插件名称参数
    checkupdate_cmd.optional("version", ParamType.RawText); // 可选版本号参数
    // info 子命令专用参数（独立于上面的可选 plugin/version）
    checkupdate_cmd.mandatory("infoPlugin", ParamType.RawText);
    checkupdate_cmd.optional("infoVersion", ParamType.RawText);

    // 设置overload
    checkupdate_cmd.overload([]); // 无参数，显示帮助
    checkupdate_cmd.overload(["ReloadAction"]); // 重载插件
    checkupdate_cmd.overload(["AllAction"]); // 检查所有插件
    checkupdate_cmd.overload(["UpdateAction", "plugin"]); // 更新指定插件
    checkupdate_cmd.overload(["UpdateAction", "plugin", "version"]); // 更新到指定版本
    checkupdate_cmd.overload(["InfoAction", "infoPlugin"]); // 查看插件版本列表
    checkupdate_cmd.overload(["InfoAction", "infoPlugin", "infoVersion"]); // 查看指定版本详情
    checkupdate_cmd.overload(["plugin"]); // 检查指定插件

    // 指令回调处理
    checkupdate_cmd.setCallback((_cmd, origin, output, results) => {
        // 检查权限
        if (origin.typeName == "Player") {
            const pl = mc.getPlayer(origin.player.realName);
            if (!pl.isOP()) {
                pl.tell("§c你没有权限使用此命令");
                return output.success();
            }
        }

        // 处理命令
        // 检查是否有动作参数
        if (!results.action) {
            // 无参数，显示帮助信息
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell("§a[EasyCheckUpdate] §f命令帮助:\n/checkupdate - 显示此帮助信息\n/checkupdate all - 检查所有插件的更新\n/checkupdate reload - 重载插件\n/checkupdate <插件名称> - 检查指定插件的更新\n/checkupdate update <插件名称> [版本号] - 更新指定插件\n/checkupdate info <插件名称> [版本号] - 查看版本列表或版本详情");
            } else {
                pluginPrint("命令帮助:\n/checkupdate - 显示此帮助信息\n/checkupdate all - 检查所有插件的更新\n/checkupdate reload - 重载插件\n/checkupdate <插件名称> - 检查指定插件的更新\n/checkupdate update <插件名称> [版本号] - 更新指定插件\n/checkupdate info <插件名称> [版本号] - 查看版本列表或版本详情");
            }
            return output.success();
        }

        if (results.action === "reload") {
            // 重载插件
            const result = ReloadPlugin();
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell(`§a[EasyCheckUpdate] §f${result}`);
            } else {
                pluginPrint(result);
            }
            return output.success();
        } else if (results.action === "update") {
            // 检查并自动更新指定插件（可指定目标版本）
            const pluginName = results.plugin;
            if (!pluginName) {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell("§c用法: /checkupdate update <插件名称> [版本号]");
                } else {
                    pluginPrint("用法: /checkupdate update <插件名称> [版本号]");
                }
                return output.success();
            }

            const targetVer = results.version || null;
            const pluginInfo = getPluginUpdateInfo(pluginName);
            if (pluginInfo) {
                const currentVersion = pluginInfo.plugin_version || "unknown";
                checkPluginUpdate(pluginName, currentVersion, true, null, null, targetVer);
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§a正在检查并更新插件 ${pluginName}，请查看控制台获取详细信息`);
                }
            } else {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§c未找到插件: ${pluginName}`);
                } else {
                    pluginPrint(`未找到插件: ${pluginName}`, "ERROR");
                }
            }
            return output.success();
        } else if (results.action === "info") {
            // 查看插件版本信息：info <插件名> [版本号]
            const pluginName = results.infoPlugin;
            const versionName = results.infoVersion || null;
            if (!pluginName) {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell("§c用法: /checkupdate info <插件名称> [版本号]");
                } else {
                    pluginPrint("用法: /checkupdate info <插件名称> [版本号]");
                }
                return output.success();
            }

            const pluginInfo = getPluginUpdateInfo(pluginName);
            if (!pluginInfo || !pluginInfo.update_url) {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§c未找到插件: ${pluginName}`);
                } else {
                    pluginPrint(`未找到插件: ${pluginName}`, "ERROR");
                }
                return output.success();
            }

            // 异步拉取版本信息
            network.httpGet(pluginInfo.update_url, (status, response) => {
                if (status !== 200) {
                    pluginPrint(`获取插件 ${pluginName} 的更新信息失败，状态码: ${status}`, "WARNING");
                    return;
                }
                try {
                    const updateData = JSON.parse(response);
                    if (!updateData.versions || typeof updateData.versions !== 'object') {
                        pluginPrint(`插件 ${pluginName} 的更新信息格式不正确`, "WARNING");
                        return;
                    }
                    const versions = updateData.versions;

                    if (versionName) {
                        // 查看指定版本详情
                        const verInfo = versions[versionName];
                        if (!verInfo) {
                            pluginPrint(`插件 ${pluginName} 未找到版本 v${versionName}`, "WARNING");
                            return;
                        }
                        const tag = isPreRelease(versionName) ? "测试版" : "正式版";
                        pluginPrint(`插件 ${pluginName} 版本 v${versionName} 的详细信息:`);
                        pluginPrint(`  作者: ${verInfo.author || "未知作者"}`);
                        pluginPrint(`  更新时间: ${verInfo.update_time || "未知时间"}`);
                        pluginPrint(`  类型: ${tag}`);
                        pluginPrint(`  更新内容:`);
                        pluginPrint(`    ${verInfo.update_content || "无更新内容"}`);
                        pluginPrint(`  下载地址: ${verInfo.download_url || "无"}`);
                    } else {
                        // 显示版本列表
                        const currentVersion = pluginInfo.plugin_version || "unknown";
                        const userIsPre = isPreRelease(currentVersion);
                        printVersionList(pluginName, versions, currentVersion, null, userIsPre);
                    }
                } catch (e) {
                    pluginPrint(`解析版本信息时出错: ${e.message}`, "WARNING");
                }
            });
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                if (versionName) {
                    pl.tell(`§a正在查询插件 ${pluginName} 版本 v${versionName} 的详细信息，请查看控制台`);
                } else {
                    pl.tell(`§a正在查询插件 ${pluginName} 的版本列表，请查看控制台`);
                }
            }
            return output.success();
        } else if (results.action === "all") {
            // 检查所有插件的更新
            checkAllPluginsUpdate();
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell("§a正在检查所有插件的更新，请查看控制台获取详细信息");
            }
            return output.success();
        } else if (results.plugin) {
            // 检查指定插件的更新（仅检查，不自动更新）
            const pluginName = results.plugin;
            const pluginInfo = getPluginUpdateInfo(pluginName);

            if (pluginInfo) {
                const currentVersion = pluginInfo.plugin_version || "unknown";
                checkPluginUpdate(pluginName, currentVersion);
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§a正在检查插件 ${pluginName} 的更新，请查看控制台获取详细信息`);
                }
            } else {
                if (origin.typeName == "Player") {
                    const pl = mc.getPlayer(origin.player.realName);
                    pl.tell(`§c未找到插件: ${pluginName}`);
                } else {
                    pluginPrint(`未找到插件: ${pluginName}`, "ERROR");
                }
            }
            return output.success();
        } else {
            // 显示帮助信息
            if (origin.typeName == "Player") {
                const pl = mc.getPlayer(origin.player.realName);
                pl.tell("§a[EasyCheckUpdate] §f命令帮助:\n/checkupdate - 显示此帮助信息\n/checkupdate all - 检查所有插件的更新\n/checkupdate reload - 重载插件\n/checkupdate <插件名称> - 检查指定插件的更新\n/checkupdate update <插件名称> [版本号] - 更新指定插件\n/checkupdate info <插件名称> [版本号] - 查看版本列表或版本详情");
            } else {
                pluginPrint("命令帮助:\n/checkupdate - 显示此帮助信息\n/checkupdate all - 检查所有插件的更新\n/checkupdate reload - 重载插件\n/checkupdate <插件名称> - 检查指定插件的更新\n/checkupdate update <插件名称> [版本号] - 更新指定插件\n/checkupdate info <插件名称> [版本号] - 查看版本列表或版本详情");
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