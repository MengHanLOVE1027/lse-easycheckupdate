<div align="center">

![LSE-EasyCheckUpdate](https://socialify.git.ci/MengHanLOVE1027/lse-easycheckupdate/image?custom_language=JavaScript&description=1&font=Inter&forks=1&issues=1&language=1&logo=https://zh.minecraft.wiki/images/Chiseled_Bookshelf_%28stage_6%29_%28S%29_JE1.png?bbb31&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto)
  <!-- <a href="https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases">
    <img src="https://avatars.githubusercontent.com/u/99132833?v=4" alt="Logo" width="128" height="128">
  </a> -->
<h3>LSE-EasyCheckUpdate</h3>

<p>
  <b>A lightweight plugin update checker for LeviLamina servers. </b>

Powered by LeviLamina.<br>
</p>
</div>
<div align="center">

[![README](https://img.shields.io/badge/README-中文|Chinese-blue)](README.md) [![README_EN](https://img.shields.io/badge/README-英文|English-blue)](README_EN.md)

[![Github Version](https://img.shields.io/github/v/release/MengHanLOVE1027/lse-easycheckupdate)](https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases) [![GitHub License](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0) [![LSE Version](https://img.shields.io/badge/LSE-0.10.2+-yellow.svg)](https://github.com/LeviLamina/LeviLamina) [![Platform](https://img.shields.io/badge/Platform-LeviLamina-9cf.svg)](https://levimc.org/) [![Downloads](https://img.shields.io/github/downloads/MengHanLOVE1027/lse-easycheckupdate/total.svg)](https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases)

![](https://img.shields.io/github/v/release/MengHanLOVE1027/lse-easycheckupdate?style=flat-square&logo=github&color=orange&label=Version) ![](https://img.shields.io/github/downloads/MengHanLOVE1027/lse-easycheckupdate/total?style=flat-square&logo=github&color=33ccff&label=Downloads) ![](https://img.shields.io/github/languages/top/MengHanLOVE1027/lse-easycheckupdate?style=flat-square&logo=javascript&color=yellow) ![](https://img.shields.io/github/stars/MengHanLOVE1027/lse-easycheckupdate?style=flat-square&logo=github&color=yellow&label=Stars) ![](https://img.shields.io/github/last-commit/MengHanLOVE1027/lse-easycheckupdate?style=flat-square&color=lightgrey) ![](https://komarev.com/ghpvc/?username=MengHanLOVE1027&repo=lse-easycheckupdate&color=green&style=flat-square&label=Views)

</div>

---

## 📖 Introduction

LSE-EasyCheckUpdate is a plugin update checker specifically designed for LeviLamina servers, aiming to simplify the plugin update process and improve server management efficiency. It supports automatic and batch update checks, smart version selection, targeted version installation, ZIP auto-extraction, config version migration, i18n internationalization, and detailed update logs — providing a one-stop plugin update solution for server administrators.

---

## ✨ Core Features

| Feature | Description |
| ---- | ---- |
| 🔄 **Automatic Update Check** | Automatically check updates for all loaded plugins on load, with scheduled polling |
| 🧠 **Smart Version Selection** | Stable users automatically skip pre-releases; pre-release users follow upgrade chain step by step |
| 📋 **Version List** | View all available versions with stable/beta tags, current version and recommended markers |
| 🔍 **Version Details** | View complete info for a specific version (author, time, content, download URL) |
| 📦 **Batch Check** | Check all plugins that support EasyCheckUpdate at once |
| 🎯 **Targeted Version Install** | Install any published version by number — supports upgrade, downgrade, or reinstall |
| 📦 **ZIP Auto-Extraction** | Auto-download GitHub Release ZIP, smart root detection, extract and install all files |
| 🔗 **302 Redirect Handling** | Uses curl -L to automatically follow GitHub Release download redirects, with httpGet fallback |
| ⚙️ **Config Version Migration** | Auto-migrate config on plugin version update — backs up, merges, and fills in new keys |
| 🌐 **i18n Internationalization** | Built-in Chinese and English translations, switch language via config `language` field |
| 📢 **Real-time Notifications** | Notify server administrators via console and in-game chat when updates are detected |
| ⚡ **Fast Check** | Efficient semantic version comparison with complex pre-release tag support |
| 📝 **Detailed Logs** | Colored gradient log output, daily log files with multiple log levels |
| 🌍 **Multi-plugin Support** | Support all LSE plugins that export a `CheckUpdate` function |
| 📊 **Telemetry Statistics** | Integrated BStats for usage statistics (optional, can be disabled) |

---

## 🗂️ Directory Structure

```
Server Root/
├── logs/
│   └── EasyCheckUpdate/                    # Log directory
│       └── easycheckupdate_YYYYMMDD.log    # Main log file
└── plugins/
    └── EasyCheckUpdate/                    # Plugin resource directory
        ├── EasyCheckUpdate.js              # Main plugin file
        └── config/
            ├── EasyCheckUpdate.json        # Configuration file
            └── .config_backup.json         # Auto backup (generated during config migration)
```

---

## 🚀 Quick Start

### Installation Steps

1. **Download Plugin**
   - Download the latest version from [Release Page](https://github.com/MengHanLOVE1027/lse-easycheckupdate/releases)
   - Or get it from [MineBBS](https://www.minebbs.com/resources/easycheckupdate-ecu-lse.15501/)

2. **Install Plugin**
   ```bash
   # Extract the plugin archive to the server plugins directory
   ```
   Or install using lip command:
   ```sh
   lip install github.com/MengHanLOVE1027/lse-easycheckupdate
   ```

3. **Start Server**
   - Restart the server or use `/ll reload EasyCheckUpdate` command
   - The plugin will automatically generate default configuration files and required directories

---

## ⚙️ Configuration Details

Configuration file location: `plugins/EasyCheckUpdate/config/EasyCheckUpdate.json`

### 📋 Main Configuration Items

```json
{
  "Version": "0.2.2-beta.1",     // Config version (tracks plugin version, auto-managed — do NOT edit)
  "language": "zh_CN",           // Output language: "zh_CN" (Chinese) or "en_US" (English)

  // 📊 BStats telemetry configuration
  "Bstats": {
    "EnableModule": true,         // Enable BStats telemetry
    "logSentData": false,         // Log sent data (for debugging)
    "serverUUID": "Auto-generated UUID"  // Server unique identifier (auto-generated)
  },

  // 🔄 Update check configuration
  "check_update_on_load": true,   // Automatically check updates on plugin load
  "check_interval": 1800,         // Update check interval (seconds), default 30 minutes
  "check_delay": 10,              // First check delay (seconds)
  "last_check_time": 0            // Last check timestamp (auto-recorded)
}
```

### Configuration Description

| Config Item | Type | Default | Description |
| ------ | ---- | ------ | ---- |
| `Version` | String | Plugin ver | Config version — auto-updated with plugin version, **do NOT edit manually** |
| `language` | String | `zh_CN` | Output language: `zh_CN` or `en_US`. Run `/checkupdate reload` after changing |
| `Bstats.EnableModule` | Boolean | `true` | Enable/disable BStats telemetry |
| `Bstats.logSentData` | Boolean | `false` | Log telemetry payload in console (for debugging) |
| `Bstats.serverUUID` | String | Auto-generated | Server unique ID, auto-generated and saved on first run |
| `check_update_on_load` | Boolean | `true` | Whether to auto-check all plugins for updates on load |
| `check_delay` | Number | `10` | Delay before the first update check (seconds) |
| `check_interval` | Number | `1800` | Interval between periodic checks (seconds), default 30 min |
| `last_check_time` | Number | `0` | Timestamp of last check (auto-recorded) |

### ⚙️ Config Version Migration

EasyCheckUpdate has a built-in **config version management system**. When the plugin updates and the config structure changes, it automatically:

1. **Detects version**: Compares the config's `Version` field with the current plugin version
2. **Auto-backup**: Backs up the old config to `config/.config_backup.json` with timestamp and full snapshot
3. **Incremental migration**: Runs version-to-version migration handlers for compatibility
4. **Fills in new keys**: Deep-merges any new config items into the user's config (preserves existing settings)
5. **Updates version**: Sets `Version` to the current plugin version

> **Note**: If you accidentally delete any config item, the plugin will automatically restore it on the next load — no manual repair needed.

### 🔄 Automatic Update Check

The plugin supports automatically checking updates for all plugins when loaded, controllable via the config file.

#### Workflow

1. Plugin loading completed
2. Check `check_update_on_load` value
3. If enabled, log: `Will auto-check all plugins for updates in X seconds...`
4. Wait `check_delay` seconds
5. Run `checkAllPluginsUpdate()` to check all plugin updates
6. Record `last_check_time` and output check results
7. Repeat every `check_interval` seconds

#### Example Config

```json
{
  "check_update_on_load": true,  // Enable automatic check
  "check_delay": 10,             // Start checking after 10 seconds
  "check_interval": 1800,        // Check interval: 30 minutes
  "last_check_time": 0
}
```

#### Notes

- First check delay: 10-30 seconds recommended to give the server time to fully start
- Check interval: 1800-3600 seconds (30-60 min) recommended to avoid excessive requests
- Set `check_update_on_load` to `false` if automatic checks are not needed

### 🌐 Language Switching

1. Open the config file and change `language` to `"zh_CN"` or `"en_US"`
2. Run `/checkupdate reload` in-game or in console
3. All output (logs, in-game messages, command help) switches to the selected language immediately

---

## 🎮 Command Manual

### Update Check Commands

| Command | Permission | Description |
| ---- | ---- | ---- |
| `/checkupdate` or `/ecu` | OP | Display help information |
| `/checkupdate all` | OP | Check all plugins that support EasyCheckUpdate for updates |
| `/checkupdate reload` | OP | Reload plugin config (use this after changing the language setting) |
| `/checkupdate check <plugin>` | OP | Check a specific plugin for updates (check only, no auto-update) |
| `/checkupdate update <plugin> [version]` | OP | Update a plugin. Omit version to auto-select the best one |
| `/checkupdate info <plugin> [version\|page]` | OP | View version list (with pagination); add version number to see details |

### Command Examples

```bash
# Check all plugins
/checkupdate all

# Check a specific plugin
/checkupdate check EasyCheckUpdate

# Update to latest (auto-select best version)
/checkupdate update EasyCheckUpdate

# Install a specific version (upgrade, downgrade, or reinstall)
/checkupdate update EasyCheckUpdate 0.1.0

# View all available versions (page 1, 10 per page)
/checkupdate info EasyCheckUpdate

# View version list page 2
/checkupdate info EasyCheckUpdate p2

# View specific version details
/checkupdate info EasyCheckUpdate 0.2.1-beta.1

# Reload plugin configuration (apply language changes)
/checkupdate reload
```

### Version Selection Strategy

| Current Version Type | Upgrade Strategy |
| ---- | ---- |
| **Stable** (e.g. `1.0.0`) | Recommend the latest stable version only; skip all pre-releases |
| **Pre-release** (e.g. `1.0.0-beta.1`) | Recommend the latest pre-release version only |
| **Specific version** | Use `update <plugin> <version>` to install any published version — supports downgrades and reinstalls |
| **★Recommend marker** | Version list auto-marks recommended upgrade (★Recommended) and current version (Current) |

---

## 🔧 Developer Usage

Plugin developers can enable automatic update checking by exporting a `CheckUpdate` function.

### Exporting CheckUpdate Function

#### Method 1: Via `ecu` namespace (Recommended)

```javascript
// Export CheckUpdate function in your plugin
ll.exports(function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
}, "ecu", "YourPluginName");
```

#### Method 2: Direct export (Legacy compatible)

```javascript
ll.exports(function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
}, "YourPluginName", "CheckUpdate");
```

> **Note**: EasyCheckUpdate checks the `ecu` namespace first, then falls back to the direct export. Method 1 is recommended to avoid naming conflicts.

### Return Object Fields

| Field | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| `plugin_version` | String | Yes | Current plugin version, e.g. `"v1.0.0"` |
| `update_url` | String | Yes | URL to the update info JSON file |

### Update Information File Format

Your update info file (e.g. `update.json`) supports the following two formats.

#### Single Version Format (Legacy Compatible)

Suitable for simple scenarios with only the latest version.

```json
{
    "version": "1.0.0",
    "download_url": "https://github.com/User/Repo/releases/download/v1.0.0/Plugin-v1.0.0.zip",
    "update_content": "Update content description",
    "author": "Author Name",
    "update_time": "2024-01-01"
}
```

#### Multi-Version Format (Recommended)

Supports full version history, works with the `info` command for version list and per-version details.

```json
{
    "latest_version": "1.0.0",
    "versions": {
        "1.0.0": {
            "download_url": "https://github.com/User/Repo/releases/download/v1.0.0/Plugin-v1.0.0.zip",
            "update_content": "Stable release",
            "author": "Author Name",
            "update_time": "2024-02-01"
        },
        "1.0.0-beta.1": {
            "download_url": "https://github.com/User/Repo/releases/download/v1.0.0-beta.1/Plugin-v1.0.0-beta.1.zip",
            "update_content": "Beta release",
            "author": "Author Name",
            "update_time": "2024-01-15"
        },
        "0.9.0": {
            "download_url": "https://github.com/User/Repo/releases/download/v0.9.0/Plugin-v0.9.0.zip",
            "update_content": "Previous stable release",
            "author": "Author Name",
            "update_time": "2024-01-01"
        }
    }
}
```

> **About `download_url`**: Two file formats are supported:
> - **`.zip`** — GitHub Release ZIP package, auto-downloaded with `curl -L` and extracted
> - **`.js`** — Single file link, directly downloaded and replaced

### Complete Example

```javascript
const pluginName = "MyPlugin";
const pluginVersion = "v1.0.0";

// Export CheckUpdate function
ll.exports(function() {
    return {
        plugin_version: pluginVersion,
        update_url: `https://raw.githubusercontent.com/YourUsername/${pluginName}/main/update.json`
    };
}, "ecu", pluginName);
```

### Plugin Update Workflow

1. EasyCheckUpdate automatically detects all loaded LSE plugins
2. Checks each plugin for an exported `CheckUpdate` function (`ecu` namespace → direct export)
3. Calls `CheckUpdate` to get the current version and update info URL
4. Downloads the update info JSON from the returned `update_url`
5. Parses multi-version/single-version format, intelligently selects the best upgrade version
6. For ZIP format: Download → `curl -L` follow redirect → extract (tar/PowerShell) → smart root detection → install files → reload plugin
7. For JS format: Download → backup old file → replace → reload plugin

---

## 📄 License

This project is open-sourced under the **AGPL-3.0** license.

```
Copyright (c) 2023 梦涵LOVE

This program is free software: you can redistribute it and/or modify it,
but must comply with the terms of the AGPL-3.0 license.
```

For the full license text, please refer to the [LICENSE](LICENSE) file.

---

## 👥 Contributing Guide

Issues and Pull Requests are welcome!

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Create a Pull Request**

---

## 🌟 Support & Feedback

- **GitHub Issues**: [Submit Issue](https://github.com/MengHanLOVE1027/lse-easycheckupdate/issues)
- **MineBBS**: [Discussion Thread](https://www.minebbs.com/resources/easycheckupdate-ecu-lse.15501/)
- **Author**: 梦涵LOVE

---

<div align="center">

**⭐ If this project helps you, please give us a Star!**

[![Star History Chart](https://api.star-history.com/svg?repos=MengHanLOVE1027/lse-easycheckupdate&type=Date)](https://star-history.com/#MengHanLOVE1027/lse-easycheckupdate&Date)

</div>
