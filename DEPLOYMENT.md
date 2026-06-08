# HTML-JavaScript 项目集合

这是一个包含多个 HTML/JavaScript/CSS 项目的集合，可以通过 Node.js 服务器进行部署和访问。

## 功能特点

- 自动检测并展示所有子项目
- 支持静态文件服务
- 响应式设计的项目列表页面
- 易于扩展和维护

## 安装和运行

### 前置条件

确保已安装 Node.js (推荐 v14 或更高版本)

### 安装依赖

```bash
npm install
```

### 启动服务器

```bash
# 生产环境
npm start

# 开发环境（带热重载）
npm run dev
```

服务器将在 `http://localhost:3000` 上运行（如果 PORT 环境变量已设置，则使用该端口）。

## 项目结构

```
HTML-JavaScript/
├── server.js          # 主服务器文件
├── package.json       # 项目配置和依赖
├── .gitignore         # Git 忽略文件
├── index.html         # 主页面入口
├── 3d-fireworks/      # 示例项目目录
├── 404page/           # 示例项目目录
├── accordion-card/    # 示例项目目录
└── ...                # 其他项目目录
```

## 添加新项目

只需在项目根目录下创建新的文件夹，并在其中放置 `index.html` 文件，服务器会自动检测并将其添加到主页的项目列表中。

## 部署

此应用可以部署到任何支持 Node.js 的平台，如：

- Heroku
- Vercel
- Netlify (使用 functions)
- AWS EC2
- DigitalOcean Droplets
- 或其他任何 Node.js 托管服务

## 技术栈

- **Node.js** - 服务器运行时
- **Express.js** - Web 框架
- **HTML/CSS/JavaScript** - 前端技术

## 许可证

ISC License