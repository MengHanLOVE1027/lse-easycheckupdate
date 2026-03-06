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
