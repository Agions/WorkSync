# WorkSync

<div align="center">
  <img src="assets/logo.png" alt="WorkSync Logo" width="200"/>
  <p>
    <strong>现代化工时与薪资管理解决方案</strong>
  </p>
  <p>
    <a href="#功能特点">功能特点</a> •
    <a href="#技术栈">技术栈</a> •
    <a href="#预览">预览</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#项目结构">项目结构</a> •
    <a href="#常见问题">常见问题</a> •
    <a href="#更新日志">更新日志</a> •
    <a href="#贡献指南">贡献指南</a> •
    <a href="#许可证">许可证</a>
  </p>
  
  ![React Native](https://img.shields.io/badge/React%20Native-0.64+-61dafb?style=flat-square&logo=react)
  ![Redux](https://img.shields.io/badge/Redux-4.1.0-764abc?style=flat-square&logo=redux)
  ![Expo](https://img.shields.io/badge/Expo-44.0+-000020?style=flat-square&logo=expo)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
</div>

## 项目简介

WorkSync 是一个全面的工时与薪资管理移动应用，为企业提供员工打卡、工时记录、薪资查询和个人信息管理等功能。应用界面简洁美观，交互流畅，帮助企业实现人事管理数字化转型。

本应用适合以下场景：
- 中小型企业人事管理
- 远程办公团队工时记录
- 自由职业者工作时间跟踪
- 项目工时统计与分析

## 功能特点

### 考勤打卡
- ⏰ 实时显示当前时间和日期
- 📍 精确定位打卡位置，支持地理围栏
- ✅ 上下班打卡记录
- 🕒 工作时长自动计算
- 📊 周打卡记录查看
- 📱 支持移动端打卡，满足远程办公需求

### 个人信息管理
- 👤 个人基本信息编辑
- 🖼️ 头像上传与修改
- ⚙️ 应用设置（通知开关、深色模式、FaceID登录）
- 🧹 缓存管理
- 🔐 安全退出
- 🔒 个人数据加密存储

### 薪资管理
- 💰 月度薪资查询
- 📝 薪资详情查看
- 📈 年度收入统计
- 🔗 工时与薪资关联计算
- 📤 薪资条导出与分享
- 📱 移动端随时查看薪资信息

### 数据统计
- 📊 工时统计分析
- 📈 薪资趋势图表
- ✅ 任务完成率统计
- ⚠️ 考勤异常分析
- 📉 加班趋势分析

## 技术栈

- **前端框架**：React Native 0.64+
- **状态管理**：Redux + Redux Thunk
- **导航**：React Navigation 6
- **UI组件**：自定义组件 + React Native 原生组件
- **图标**：Iconfont 图标库
- **数据可视化**：React Native Charts Wrapper
- **日期处理**：Moment.js
- **数据存储**：AsyncStorage / Realm
- **定位服务**：Expo Location
- **用户认证**：JWT 令牌 + AsyncStorage
- **API 请求**：Axios

## 预览

> 注：项目截图待上传，以下为屏幕预览描述

### 主要界面

应用包含五个主要导航标签：
- **首页**：应用概览和快捷入口，展示今日工作概况和重要通知
- **任务**：工时任务管理，分类展示不同优先级任务
- **打卡**：考勤打卡功能，显示实时时间和当前位置信息
- **薪资**：薪资查询与统计，提供月度和年度收入图表分析
- **我的**：个人信息和设置，包含多种应用配置选项

### 主题风格

应用提供两种主题模式：
- 🌞 明亮模式：清晰简约，适合日常使用
- 🌙 暗黑模式：降低视觉疲劳，适合夜间使用

## 环境要求

- Node.js 12.0+
- npm 6.0+ 或 Yarn 1.22+
- iOS 11+ 或 Android 6.0+
- Expo CLI (如果使用 Expo 开发)
- Xcode 12+ (仅 iOS 开发)
- Android Studio 4.0+ (仅 Android 开发)

## 快速开始

### 安装步骤

1. 克隆项目仓库
```bash
git clone https://github.com/agions/WorkSync.git
cd WorkSync
```

2. 安装依赖包
```bash
npm install
# 或
yarn install
```

3. 创建环境配置文件
```bash
cp .env.example .env
```
> 请根据您的环境配置 .env 文件中的变量

4. 启动开发服务器
```bash
# 使用 Expo
npx expo start

# 直接启动 iOS
npm run ios
# 或
yarn ios

# 直接启动 Android
npm run android
# 或
yarn android
```

### 配置说明

在 `.env` 文件中配置以下环境变量：

```
API_URL=https://your-api-server.com
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 项目结构

```
WorkSync/
├── assets/                 # 静态资源文件
├── src/                    # 源代码
│   ├── components/         # 可复用组件
│   ├── navigation/         # 导航配置
│   ├── redux/              # Redux 状态管理
│   │   ├── actions/        # Redux actions
│   │   ├── reducers/       # Redux reducers
│   │   └── types.js        # Action 类型定义
│   ├── screens/            # 应用屏幕
│   │   ├── attendance/     # 打卡相关屏幕
│   │   ├── auth/           # 认证相关屏幕
│   │   ├── profile/        # 个人信息相关屏幕
│   │   ├── salary/         # 薪资相关屏幕
│   │   ├── stats/          # 统计相关屏幕
│   │   └── tasks/          # 任务相关屏幕
│   ├── services/           # API 服务
│   ├── utils/              # 工具函数
│   └── App.js              # 应用入口
├── .env                     # 环境变量
├── app.json                 # Expo 配置
├── babel.config.js          # Babel 配置
├── package.json             # 项目依赖
└── README.md                # 项目文档
```

## 常见问题

### Q: 应用是否支持离线模式？
**A:** 是的，WorkSync 支持基本的离线功能。打卡记录会暂存在本地，当网络恢复时自动同步到服务器。

### Q: 如何解决位置权限问题？
**A:** 对于 Android 或 iOS，确保已在设备设置中授予应用位置权限。应用首次启动时会请求定位权限，如拒绝需要在设备设置中手动开启。

### Q: 应用支持多语言吗？
**A:** 目前支持中文和英文，计划在未来版本中添加更多语言支持。

### Q: 打卡地点如何设置？
**A:** 管理员可以在后台设置允许打卡的地理围栏范围，普通用户无需手动设置打卡地点。

## 更新日志

- ✨ 实现基本打卡功能
- 👤 完成个人信息管理
- 💰 薪资查询功能
- 🌙 添加暗黑模式
- 📊 完善统计分析图表
- 🔧 修复多个性能问题
- 📱 优化移动端适配
- 🔐 增强账号安全性
- 🧩 添加人脸识别登录
- 🔧 改进用户界面
- 📱 支持平板设备

## 未来计划

- 📝 添加请假申请功能
- 👥 集成团队协作功能
- 💻 开发管理员后台
- 👆 支持指纹识别打卡
- 🌐 添加多语言支持
- 🖥️ 开发桌面端应用

## 贡献指南

我们非常欢迎和感谢所有的贡献者。以下是参与贡献的步骤：

1. Fork 本项目
2. 创建您的特性分支 `git checkout -b feature/your-feature-name`
3. 提交您的更改 `git commit -m 'Add some feature'`
4. 推送到分支 `git push origin feature/your-feature-name`
5. 创建新的 Pull Request

### 代码风格

- 遵循 ESLint 配置
- 使用函数组件和 React Hooks
- 遵循组件目录结构规范

## 支持与联系

如果您有任何问题或建议，可以通过以下方式联系我们：

- 提交 GitHub Issue
## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。


<div align="center">
  <sub>Built with ❤️ by Agions</sub>
</div>

