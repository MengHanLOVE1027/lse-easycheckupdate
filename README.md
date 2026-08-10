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

LSE-EasyCheckUpdate 是一个专为 LeviLamina 服务器设计的插件更新检查工具，旨在简化插件更新流程，提高服务器管理效率。支持自动及批量检查更新、智能版本选择、指定版本安装、ZIP 自动解压、配置文件版本迁移、i18n 国际化等丰富功能，为服务器管理员提供一站式插件更新解决方案。

---

## ✨ 核心特性

| 特性 | 描述 |
| ---- | ---- |
| 🔄 **自动检查更新** | 插件加载时自动检查所有已加载插件的更新，支持定时轮询 |
| 🧠 **智能版本选择** | 正式版用户自动跳过测试版；测试版用户沿升级链逐级升级 |
| 📋 **版本列表** | 查看插件所有可用版本，区分正式版/测试版，标注当前版本和推荐版本 |
| 🔍 **版本详情** | 查看指定版本的完整更新信息（作者、时间、更新内容、下载地址） |
| 📦 **批量检查** | 一次检查所有支持 EasyCheckUpdate 的插件 |
| 🎯 **指定版本安装** | 支持指定目标版本号进行安装，可升级、降级或重装任意已发布版本 |
| 📦 **ZIP 自动解压** | 自动下载 GitHub Release ZIP 包，智能检测根目录并解压安装所有文件 |
| 🔗 **302 重定向处理** | 使用 curl -L 自动跟随 GitHub Release 下载重定向，httpGet 作为备选 |
| ⚙️ **配置文件版本迁移** | 跟随插件版本自动升级配置文件，保留用户设置并补全新配置项 |
| 🌐 **i18n 国际化** | 内置中英文语言数据，根据配置文件 `language` 字段切换输出语言 |
| 📢 **实时通知** | 检查到更新时向服务器管理员发送控制台和游戏内通知 |
| ⚡ **快速检查** | 高效的语义版本号比较算法，支持带预发布标记的复杂版本号 |
| 📝 **详细日志** | 彩色渐变日志输出，按日期分割存储，支持多级日志 |
| 🌍 **多插件支持** | 支持所有导出 CheckUpdate 函数的 LSE 插件 |
| 📊 **遥测统计** | 集成 BStats，收集插件使用统计（可选关闭） |

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
            ├── EasyCheckUpdate.json        # 配置文件
            └── .config_backup.json         # 配置自动备份（版本迁移时生成）
```

---

## 🚀 快速开始

### 安装步骤

1. **下载插件**
   - 从 [Release 页面](https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases) 下载最新版本
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
   - 插件会自动生成默认配置文件和必要的目录结构

---

## ⚙️ 配置详解

配置文件位于：`plugins/EasyCheckUpdate/config/EasyCheckUpdate.json`

### 📋 主要配置项

```json
{
  "Version": "0.2.0-beta.4",     // 配置版本号（跟随插件版本，自动管理，请勿手动修改）
  "language": "zh_CN",           // 输出语言：zh_CN（中文）或 en_US（英文）

  // 📊 BStats 遥测配置
  "Bstats": {
    "EnableModule": true,         // 启用 BStats 遥测功能
    "logSentData": false,         // 记录发送的数据（调试用）
    "serverUUID": "自动生成的UUID"  // 服务器唯一标识符（自动生成）
  },

  // 🔄 更新检查配置
  "check_update_on_load": true,   // 插件加载时自动检查更新
  "check_interval": 1800,         // 检查更新间隔（秒），默认 30 分钟
  "check_delay": 10,              // 首次检查延迟（秒）
  "last_check_time": 0            // 上次检查时间戳（自动记录）
}
```

### 配置说明

| 配置项 | 类型 | 默认值 | 描述 |
| ------ | ---- | ------ | ---- |
| `Version` | String | 插件版本 | 配置版本号，随插件版本自动更新，**请勿手动修改** |
| `language` | String | `zh_CN` | 输出语言：`zh_CN` 或 `en_US`。修改后执行 `/checkupdate reload` 即可切换，无需重启 |
| `Bstats.EnableModule` | Boolean | `true` | 是否启用 BStats 遥测 |
| `Bstats.logSentData` | Boolean | `false` | 是否在日志中打印上报数据（调试用） |
| `Bstats.serverUUID` | String | 自动生成 | 服务器唯一标识符，首次运行时自动生成并保存 |
| `check_update_on_load` | Boolean | `true` | 是否在插件加载时自动检查所有插件更新 |
| `check_delay` | Number | `10` | 首次检查的延迟时间（秒） |
| `check_interval` | Number | `1800` | 定期检查间隔（秒），默认 30 分钟 |
| `last_check_time` | Number | `0` | 上次检查时间戳（自动记录，无需手动修改） |

### ⚙️ 配置文件版本迁移

EasyCheckUpdate 内置**配置文件版本管理系统**，当插件更新后配置结构发生变化时，会自动进行以下操作：

1. **检测版本**：对比配置文件中的 `Version` 与插件当前版本
2. **自动备份**：迁移前将旧配置备份到 `config/.config_backup.json`，包含时间戳和完整配置快照
3. **增量迁移**：执行版本间的增量迁移逻辑，确保兼容性
4. **补全新项**：自动将新版本新增的配置项合并到用户配置中（深度合并，保留用户已有设置）
5. **更新版本号**：将 `Version` 更新为当前插件版本

> **注意**：如果用户手误删除了某些配置项，插件也会在下次加载时自动补全，无需手动修复。

### 🔄 自动检查更新

插件支持在加载时自动检查所有插件的更新，此功能可通过配置文件控制。

#### 工作流程

1. 插件加载完成
2. 检查 `check_update_on_load` 配置
3. 如果启用，输出提示信息：`将在 X 秒后自动检查所有插件的更新...`
4. 等待 `check_delay` 秒
5. 自动执行 `checkAllPluginsUpdate()` 检查所有插件更新
6. 记录 `last_check_time` 并输出检查结果
7. 此后每隔 `check_interval` 秒再次检查

#### 示例配置

```json
{
  "check_update_on_load": true,  // 启用自动检查
  "check_delay": 10,             // 10 秒后开始检查
  "check_interval": 1800,        // 检查间隔 30 分钟
  "last_check_time": 0
}
```

#### 注意事项

- 首次检查延迟建议设置为 10-30 秒，给服务器启动留出足够时间
- 检查间隔建议 1800-3600 秒（30-60 分钟），避免频繁请求
- 不需要自动检查时可将 `check_update_on_load` 设为 `false`

### 🌐 语言切换

1. 打开配置文件，修改 `language` 字段为 `"zh_CN"` 或 `"en_US"`
2. 在游戏或控制台执行 `/checkupdate reload`
3. 所有输出（日志、游戏内通知、命令帮助）立即切换为对应语言

---

## 🎮 命令手册

### 更新检查命令

| 命令 | 权限 | 描述 |
| ---- | ---- | ---- |
| `/checkupdate` 或 `/ecu` | OP | 显示帮助信息 |
| `/checkupdate all` | OP | 检查所有支持 EasyCheckUpdate 的插件的更新 |
| `/checkupdate reload` | OP | 重载插件配置（切换语言后可执行此命令使之生效） |
| `/checkupdate <插件名>` | OP | 检查指定插件的更新（仅检查，不自动更新） |
| `/checkupdate update <插件名> [版本号]` | OP | 更新指定插件。不指定版本号则自动选择最佳版本 |
| `/checkupdate info <插件名> [版本号]` | OP | 查看版本列表；指定版本号可查看该版本的详细信息 |

### 命令示例

```bash
# 检查所有插件更新
/checkupdate all

# 检查指定插件
/checkupdate EasyCheckUpdate

# 更新到最新版本（自动选择最佳版本）
/checkupdate update EasyCheckUpdate

# 安装指定版本（可升级、降级或重装）
/checkupdate update EasyCheckUpdate 0.1.0

# 查看所有可用版本列表
/checkupdate info EasyCheckUpdate

# 查看指定版本详细信息
/checkupdate info EasyCheckUpdate 0.2.0-beta.3

# 重载插件配置（切换语言后生效）
/checkupdate reload
```

### 版本选择策略

| 用户当前版本类型 | 推荐升级策略 |
| ---- | ---- |
| **正式版** (如 `1.0.0`) | 自动跳过所有测试版，推荐最新的正式版 |
| **测试版** (如 `1.0.0-beta.1`) | 沿升级链逐级升级：`beta.1 → beta.2 → ... → 正式版` |
| **指定版本** | 使用 `update <插件名> <版本号>` 可安装任意已发布版本，支持降级和重装 |

---

## 🔧 开发者调用方式

插件开发者可以通过导出 `CheckUpdate` 函数来让 EasyCheckUpdate 自动检测插件的更新。

### 导出 CheckUpdate 函数

#### 方式一：通过 `ecu` 命名空间导出（推荐）

```javascript
// 在你的插件中导出 CheckUpdate 函数
ll.exports(function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
}, "ecu", "YourPluginName");
```

#### 方式二：直接导出 CheckUpdate 函数（兼容旧版）

```javascript
ll.exports(function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
}, "YourPluginName", "CheckUpdate");
```

> **说明**：EasyCheckUpdate 会优先从 `ecu` 命名空间查找，若未找到则尝试从插件自身导出中查找 `CheckUpdate` 函数。推荐使用方式一以避免命名冲突。

### 返回对象说明

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `plugin_version` | String | 是 | 插件当前版本号，如 `"v1.0.0"` |
| `update_url` | String | 是 | 更新信息 JSON 文件的 URL 地址 |

### 更新信息文件格式

你的更新信息文件（如 `update.json`）支持以下两种格式。

#### 单版本格式（兼容旧版）

适用于只有最新版本信息的简单场景。

```json
{
    "version": "1.0.0",
    "download_url": "https://github.com/User/Repo/releases/download/v1.0.0/Plugin-v1.0.0.zip",
    "update_content": "更新内容描述",
    "author": "作者名",
    "update_time": "2024-01-01"
}
```

#### 多版本格式（推荐）

支持完整版本历史记录，配合 `info` 命令可查看版本列表和任意版本详情。

```json
{
    "latest_version": "1.0.0",
    "versions": {
        "1.0.0": {
            "download_url": "https://github.com/User/Repo/releases/download/v1.0.0/Plugin-v1.0.0.zip",
            "update_content": "正式版发布",
            "author": "作者名",
            "update_time": "2024-02-01"
        },
        "1.0.0-beta.1": {
            "download_url": "https://github.com/User/Repo/releases/download/v1.0.0-beta.1/Plugin-v1.0.0-beta.1.zip",
            "update_content": "测试版发布",
            "author": "作者名",
            "update_time": "2024-01-15"
        },
        "0.9.0": {
            "download_url": "https://github.com/User/Repo/releases/download/v0.9.0/Plugin-v0.9.0.zip",
            "update_content": "上个正式版本",
            "author": "作者名",
            "update_time": "2024-01-01"
        }
    }
}
```

> **关于 `download_url`**：支持两种文件格式：
> - **`.zip`** — GitHub Release ZIP 包，自动使用 `curl -L` 下载并解压安装
> - **`.js`** — 单文件链接，直接下载替换

### 完整示例

```javascript
const pluginName = "MyPlugin";
const pluginVersion = "v1.0.0";

// 导出 CheckUpdate 函数
ll.exports(function() {
    return {
        plugin_version: pluginVersion,
        update_url: `https://raw.githubusercontent.com/YourUsername/${pluginName}/main/update.json`
    };
}, "ecu", pluginName);
```

### 插件更新工作流程

1. EasyCheckUpdate 自动检测所有已加载的 LSE 插件
2. 依次检查每个插件是否导出了 `CheckUpdate` 函数（`ecu` 命名空间 → 直接导出）
3. 调用 `CheckUpdate` 函数获取当前版本号和更新信息文件 URL
4. 从 `update_url` 下载更新信息 JSON
5. 解析多版本/单版本格式，根据当前版本类型智能选择最佳升级版本
6. 对于 ZIP 格式：下载 → `curl -L` 跟随重定向 → 解压（tar/PowerShell） → 智能检测根目录 → 安装文件 → 重载插件
7. 对于 JS 格式：下载 → 备份旧文件 → 替换 → 重载插件

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
- **MineBBS**: [讨论帖](https://www.minebbs.com/resources/easycheckupdate-ecu-lse.15501/)
- **作者**: 梦涵LOVE

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**

## Star History

<a href="https://www.star-history.com/?type=date&repos=MengHanLOVE1027%2Flse-easycheckupdate">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=MengHanLOVE1027/lse-easycheckupdate&type=date&theme=dark&legend=top-left&sealed_token=6yuLN0cH8S7Hj6hqJ1ykBBZqOb2w6M1AOj5pq74N8E9lDphZNuHPi32ceBBXIb_DoqkDOU5wx1Q1gus1vZxADHuV2nhgxzyYpdFMUr4dSnDEB3xr3n-UAwDu7YP-Pn6DW_qHamtTjz6cz8GpERQ8AU9Wsqv23xj2XlHhFlyDMtK4CyUtYpCL5Ka7V9ET" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=MengHanLOVE1027/lse-easycheckupdate&type=date&legend=top-left&sealed_token=6yuLN0cH8S7Hj6hqJ1ykBBZqOb2w6M1AOj5pq74N8E9lDphZNuHPi32ceBBXIb_DoqkDOU5wx1Q1gus1vZxADHuV2nhgxzyYpdFMUr4dSnDEB3xr3n-UAwDu7YP-Pn6DW_qHamtTjz6cz8GpERQ8AU9Wsqv23xj2XlHhFlyDMtK4CyUtYpCL5Ka7V9ET" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=MengHanLOVE1027/lse-easycheckupdate&type=date&legend=top-left&sealed_token=6yuLN0cH8S7Hj6hqJ1ykBBZqOb2w6M1AOj5pq74N8E9lDphZNuHPi32ceBBXIb_DoqkDOU5wx1Q1gus1vZxADHuV2nhgxzyYpdFMUr4dSnDEB3xr3n-UAwDu7YP-Pn6DW_qHamtTjz6cz8GpERQ8AU9Wsqv23xj2XlHhFlyDMtK4CyUtYpCL5Ka7V9ET" />
 </picture>
</a>

</div>
