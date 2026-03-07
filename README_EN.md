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

</div>

---

## 📖 Introduction

LSE-EasyCheckUpdate is a plugin update checker specifically designed for LeviLamina servers, aiming to simplify the plugin update process and improve server management efficiency. It supports automatic plugin update checking, batch plugin updates, version comparison, and detailed update logs, providing server administrators with a convenient plugin update solution.

---

## ✨ Core Features

| Feature              | Description                              |
| ----------------- | --------------------------------- |
| 🔄**Automatic Update Check** | Automatically check updates for all loaded plugins      |
| 📦**Batch Update**     | Support batch update for multiple plugins              |
| 📢**Real-time Notifications**     | Send notifications to administrators when updates are detected      |
| ⚡**Fast Check**     | Efficient version comparison algorithm                |
| 🔄**Version Comparison**     | Support complex version number comparison              |
| 📝**Detailed Logs**     | Colored log output, daily log storage      |
| 🌍**Multi-plugin Support**   | Support all plugins that export CheckUpdate function |
| 📊**Telemetry Statistics**     | Integrated BStats for usage statistics          |

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
            └── EasyCheckUpdate.json        # Configuration file
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
   - The plugin will automatically generate default configuration files

---

## ⚙️ Configuration Details

Configuration file location: `plugins/lse-easycheckupdate/config/EasyCheckUpdate.json`

### 📋 Main Configuration Items

```json
{
  // 📊 BStats telemetry configuration
  "Bstats": {
    "EnableModule": true,        // Enable BStats telemetry
    "logSentData": false,        // Log sent data (for debugging)
    "serverUUID": "Auto-generated UUID"  // Server unique identifier (auto-generated)
  },

  // 🔄 Update check configuration
  "check_update_on_load": true,  // Automatically check updates on plugin load
  "check_interval": 1800,        // Update check interval (seconds), default 30 minutes
  "check_delay": 10,             // First check delay (seconds)
  "last_check_time": 0           // Last check timestamp (auto-recorded)
}
```

### 🔄 Automatic Update Check

The plugin supports automatically checking updates for all plugins when loaded, which can be controlled through the configuration file.

#### Configuration Description

| Configuration Item | Type | Default Value | Description |
| ------ | ---- | ------ | ---- |
| `check_update_on_load` | Boolean | `true` | Whether to automatically check updates when plugin loads |
| `check_delay` | Number | `10` | Delay time for first check (seconds) |
| `check_interval` | Number | `1800` | Update check interval (seconds), default 30 minutes |
| `last_check_time` | Number | `0` | Last check timestamp (auto-recorded, no manual modification needed) |

#### Workflow

1. Plugin loading completed
2. Check `check_update_on_load` configuration
3. If enabled, output prompt: `Will automatically check all plugin updates in X seconds...`
4. Wait for `check_delay` seconds
5. Automatically execute `checkAllPluginsUpdate()` to check all plugin updates
6. Output check result: `Check completed, checked X plugins that support update checking`

#### Example

```json
{
  "check_update_on_load": true,  // Enable automatic check
  "check_delay": 10,             // Start checking after 10 seconds
  "check_interval": 1800,        // Check interval 30 minutes
  "last_check_time": 0
}
```

#### Notes

- First check delay time is recommended to be set to 10-30 seconds, giving the server startup enough time
- Check interval time is recommended to be set to 1800-3600 seconds (30-60 minutes) to avoid frequent checking
- If automatic check is not needed, set `check_update_on_load` to `false`

## 🎮 Command Manual

### Update Check Commands

| Command                           | Permission | Description                     |
| ------------------------------ | ---- | ------------------------ |
| `/checkupdate` or `/ecu`      | OP   | Display help information             |
| `/checkupdate all`             | OP   | Check updates for all plugins       |
| `/checkupdate reload`          | OP   | Reload plugin configuration             |
| `/checkupdate update <plugin>` | OP   | Update specified plugin             |
| `/checkupdate <plugin>`        | OP   | Check updates for specified plugin       |

---

## 🔧 Developer Usage

Plugin developers can enable automatic update checking for their plugins by exporting a `CheckUpdate` function.

### Exporting CheckUpdate Function

Export a `CheckUpdate` function in your plugin that returns an object containing update information.

#### Method 1: Export via "ecu" namespace

```javascript
// Export CheckUpdate function in your plugin
ll.export("ecu", "YourPluginName", function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
});
```

#### Method 2: Directly export CheckUpdate function

```javascript
// Export CheckUpdate function in your plugin
ll.export("YourPluginName", "CheckUpdate", function() {
    return {
        plugin_version: "v1.0.0",
        update_url: "https://your-update-url.com/update.json"
    };
});
```

### Update Information File Format

Your update information file (e.g., update.json) needs to contain the following information.

#### Single Version Format

```json
{
    "version": "1.0.0",
    "download_url": "https://your-download-url.com/plugin.zip",
    "update_content": "Update content description",
    "author": "Author Name",
    "update_time": "2024-01-01"
}
```

#### Multi-Version Format

```json
{
    "latest_version": "1.0.0",
    "versions": {
        "1.0.0": {
            "download_url": "https://your-download-url.com/plugin-v1.0.0.zip",
            "update_content": "Update content description",
            "author": "Author Name",
            "update_time": "2024-01-01"
        }
    }
}
```

### Complete Example

```javascript
// Your plugin code
const pluginName = "MyPlugin";
const pluginVersion = "v1.0.0";

// Export CheckUpdate function
ll.export("ecu", pluginName, function() {
    return {
        plugin_version: pluginVersion,
        update_url: `https://raw.githubusercontent.com/YourUsername/${pluginName}/main/update.json`
    };
});

// Or use the second method
ll.export(pluginName, "CheckUpdate", function() {
    return {
        plugin_version: pluginVersion,
        update_url: `https://raw.githubusercontent.com/YourUsername/${pluginName}/main/update.json`
    };
});
```

### Workflow

1. EasyCheckUpdate plugin automatically detects all loaded plugins
2. Checks if the plugin has exported a `CheckUpdate` function
3. If exported, calls the function to get update information
4. Downloads update information from the returned `update_url`
5. Compares version numbers and notifies administrator if a new version is available

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
