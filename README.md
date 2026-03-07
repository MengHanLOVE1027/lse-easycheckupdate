<div align="center">

![LSE-EasyCheckUpdate](https://socialify.git.ci/MengHanLOVE1027/lse-easycheckupdate/image?custom_language=JavaScript&description=1&font=Inter&forks=1&issues=1&language=1&logo=https://zh.minecraft.wiki/images/Chiseled_Bookshelf_%28stage_6%29_%28S%29_JE1.png?bbb31&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto)
  <!-- <a href="https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases">
    <img src="https://avatars.githubusercontent.com/u/99132833?v=4" alt="Logo" width="128" height="128">
  </a> -->
<h3>LSE-EasyCheckUpdate</h3>

<p>
  <b>一个基于 LeviLamina 的轻量级插件更新检查工具。 </b>

Powered by LeviLamina.<br>
</p>
</div>
<div align="center">

[![README](https://img.shields.io/badge/README-中文|Chinese-blue)](README.md) [![README_EN](https://img.shields.io/badge/README-英文|English-blue)](README_EN.md)

[![Github Version](https://img.shields.io/github/v/release/MengHanLOVE1027/lse-easycheckupdate)](https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases) [![GitHub License](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0) [![LSE Version](https://img.shields.io/badge/LSE-0.10.2+-yellow.svg)](https://github.com/LeviLamina/LeviLamina) [![Platform](https://img.shields.io/badge/Platform-LeviLamina-9cf.svg)](https://levimc.org/) [![Downloads](https://img.shields.io/github/downloads/MengHanLOVE1027/lse-easycheckupdate/total.svg)](https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases)

</div>

---

## 📖 简介

LSE-EasyCheckUpdate 是一个专为 LeviLamina 服务器设计的插件更新检查工具，旨在简化插件更新流程，提高服务器管理效率。它支持自动检查插件更新、批量更新插件、版本比较和详细的更新日志等功能，为服务器管理员提供便捷的插件更新解决方案。

---

## ✨ 核心特性

| 特性              | 描述                              |
| ----------------- | --------------------------------- |
| 🔄**自动检查更新** | 自动检查所有已加载插件的更新      |
| 📦**批量更新**     | 支持批量更新多个插件              |
| 📢**实时通知**     | 检查到更新时向管理员发送通知      |
| ⚡**快速检查**     | 高效的版本比较算法                |
| 🔄**版本比较**     | 支持复杂的版本号比较              |
| 📝**详细日志**     | 彩色日志输出，按日期分割存储      |
| 🌍**多插件支持**   | 支持所有导出CheckUpdate函数的插件 |
| 📊**遥测统计**     | 集成BStats，收集使用统计          |

---

## 🗂️ 目录结构

```
服务器根目录/
├── logs/
│   └── EasyCheckUpdate/                    # 日志目录
│       └── easycheckupdate_YYYYMMDD.log    # 主日志文件
└── plugins/
    └── EasyCheckUpdate/                    # 插件资源目录
        ├── EasyCheckUpdate.js              # 插件主文件
        └── config/
            └── EasyCheckUpdate.json        # 配置文件
```

---

## 🚀 快速开始

### 安装步骤

1. **下载插件**
   - 从 [Release页面](https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases) 下载最新版本
   - 或从 [MineBBS](https://www.minebbs.com/resources/easycheckupdate-ecu-lse.15501/) 获取

2. **安装插件**
   ```bash
   # 将插件压缩包解压到服务器 plugins 目录
   ```
   或者使用 lip 命令安装：
   ```sh
   lip install github.com/MengHanLOVE1027/lse-easycheckupdate
   ```

3. **启动服务器**
   - 重启服务器或使用 `/ll reload EasyCheckUpdate` 命令
   - 插件会自动生成默认配置文件

---

## ⚙️ 配置详解

配置文件位于：`plugins/lse-easycheckupdate/config/EasyCheckUpdate.json`

### 📋 主要配置项

```json
{
  // 📊 BStats遥测配置
  "Bstats": {
    "EnableModule": true,        // 启用BStats遥测功能
    "logSentData": false,        // 记录发送的数据（调试用）
    "serverUUID": "自动生成的UUID"  // 服务器唯一标识符（自动生成）
  },
  
  // 🔄 更新检查配置
  "check_update_on_load": true,  // 插件加载时自动检查更新
  "check_interval": 1800,        // 检查更新间隔（秒），默认30分钟
  "check_delay": 10,             // 首次检查延迟（秒）
  "last_check_time": 0           // 上次检查时间戳（自动记录）
}
```

### 🔄 自动检查更新

插件支持在加载时自动检查所有插件的更新，此功能可通过配置文件控制。

#### 配置说明

| 配置项 | 类型 | 默认值 | 描述 |
| ------ | ---- | ------ | ---- |
| `check_update_on_load` | Boolean | `true` | 是否在插件加载时自动检查更新 |
| `check_delay` | Number | `10` | 首次检查的延迟时间（秒） |
| `check_interval` | Number | `1800` | 检查更新间隔（秒），默认30分钟 |
| `last_check_time` | Number | `0` | 上次检查时间戳（自动记录，无需手动修改） |

#### 工作流程

1. 插件加载完成
2. 检查 `check_update_on_load` 配置
3. 如果启用，输出提示信息：`将在 X 秒后自动检查所有插件的更新...`
4. 等待 `check_delay` 秒
5. 自动执行 `checkAllPluginsUpdate()` 检查所有插件更新
6. 输出检查结果：`检查完成，共检查了 X 个支持更新检查的插件`

#### 示例

```json
{
  "check_update_on_load": true,  // 启用自动检查
  "check_delay": 10,             // 10秒后开始检查
  "check_interval": 1800,        // 检查间隔30分钟
  "last_check_time": 0
}
```

#### 注意事项

- 首次检查延迟时间建议设置为 10-30 秒，给服务器启动留出足够时间
- 检查间隔时间建议设置为 1800-3600 秒（30-60 分钟），避免频繁检查
- 如果不需要自动检查，可将 `check_update_on_load` 设置为 `false`

## 🎮 命令手册

### 更新检查命令

| 命令                           | 权限 | 描述                     |
| ------------------------------ | ---- | ------------------------ |
| `/checkupdate` 或 `/ecu`      | OP   | 显示帮助信息             |
| `/checkupdate all`             | OP   | 检查所有插件的更新       |
| `/checkupdate reload`          | OP   | 重载插件配置             |
| `/checkupdate update <插件名>` | OP   | 更新指定插件             |
| `/checkupdate <插件名>`        | OP   | 检查指定插件的更新       |

---

## 🔧 开发者调用方式

插件开发者可以通过导出 `CheckUpdate` 函数来让 EasyCheckUpdate 自动检测插件的更新。

### 导出 CheckUpdate 函数

在你的插件中导出 `CheckUpdate` 函数，该函数返回一个包含更新信息的对象。

#### 方式一：通过 "ecu" 命名空间导出

```javascript
// 在你的插件中导出 CheckUpdate 函数
ll.export("ecu", "YourPluginName", function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
});
```

#### 方式二：直接导出 CheckUpdate 函数

```javascript
// 在你的插件中导出 CheckUpdate 函数
ll.export("YourPluginName", "CheckUpdate", function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
});
```

### 更新信息文件格式

你的更新信息文件（如 update.json）需要包含以下信息。

#### 单版本格式

```json
{
    "version": "1.0.0",
    "download_url": "https://your-download-url.com/plugin.zip",
    "update_content": "更新内容描述",
    "author": "作者名",
    "update_time": "2024-01-01"
}
```

#### 多版本格式

```json
{
    "latest_version": "1.0.0",
    "versions": {
        "1.0.0": {
            "download_url": "https://your-download-url.com/plugin-v1.0.0.zip",
            "update_content": "更新内容描述",
            "author": "作者名",
            "update_time": "2024-01-01"
        }
    }
}
```

### 完整示例

```javascript
// 你的插件代码
const pluginName = "MyPlugin";
const pluginVersion = "v1.0.0";

// 导出 CheckUpdate 函数
ll.export("ecu", pluginName, function() {
    return {
        plugin_version: pluginVersion,
        update_url: `https://raw.githubusercontent.com/YourUsername/${pluginName}/main/update.json`
    };
});

// 或者使用第二种方式
ll.export(pluginName, "CheckUpdate", function() {
    return {
        plugin_version: pluginVersion,
        update_url: `https://raw.githubusercontent.com/YourUsername/${pluginName}/main/update.json`
    };
});
```

### 工作流程

1. EasyCheckUpdate 插件会自动检测所有已加载的插件
2. 检查插件是否导出了 `CheckUpdate` 函数
3. 如果导出了，调用该函数获取更新信息
4. 从返回的 `update_url` 下载更新信息
5. 比较版本号，如果有新版本则通知管理员

---

## 📄 许可证

本项目采用 **AGPL-3.0** 许可证开源。

```
版权所有 (c) 2023 梦涵LOVE

本程序是自由软件：您可以自由地重新发布和修改它，
但必须遵循AGPL-3.0许可证的条款。
```

完整许可证文本请参阅 [LICENSE](LICENSE) 文件。

---

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

1. **Fork 项目仓库**
2. **创建功能分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **提交更改**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **创建 Pull Request**

---

## 🌟 支持与反馈

- **GitHub Issues**: [提交问题](https://github.com/MengHanLOVE1027/lse-easycheckupdate/issues)
- **MineBBS**: [讨论帖](https://www.minebbs.com/resources/easycheckupdate-eb-minecraft.7771/)
- **作者**: 梦涵LOVE

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**

[![Star History Chart](https://api.star-history.com/svg?repos=MengHanLOVE1027/lse-easycheckupdate&type=Date)](https://star-history.com/#MengHanLOVE1027/lse-easycheckupdate&Date)

</div>
