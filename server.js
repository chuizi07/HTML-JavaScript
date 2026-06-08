const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 默认路由 - 显示项目列表（必须在静态文件中间件之前）
app.get('/', (req, res) => {
  // 读取所有子目录作为项目列表
  const items = fs.readdirSync(__dirname);
  const projects = items.filter(item => {
    const itemPath = path.join(__dirname, item);
    return fs.statSync(itemPath).isDirectory() && 
           !item.startsWith('.') && 
           item !== 'node_modules';
  });

  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML-JavaScript 项目集合</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .project-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .project-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .project-card:hover {
            transform: translateY(-5px);
        }
        .project-card a {
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
            font-size: 18px;
        }
        .project-card a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>HTML-JavaScript 项目集合</h1>
    <div class="project-list">`;

  projects.forEach(project => {
    html += `
        <div class="project-card">
            <a href="/${project}/">${project}</a>
        </div>`;
  });

  html += `
    </div>
</body>
</html>`;

  res.send(html);
});

// 为每个项目目录设置路由（必须在静态文件中间件之前）
const items = fs.readdirSync(__dirname);
items.forEach(item => {
  const itemPath = path.join(__dirname, item);
  if (fs.statSync(itemPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
    // 检查是否存在 index.html 文件
    const indexPath = path.join(itemPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      app.get(`/${item}`, (req, res) => {
        res.sendFile(indexPath);
      });
      
      app.get(`/${item}/`, (req, res) => {
        res.sendFile(indexPath);
      });
    }
  }
});

// 设置静态文件目录（放在路由之后）
app.use(express.static(path.join(__dirname)));

// 处理404错误
app.use((req, res) => {
  res.status(404).send('<h1>404 - 页面未找到</h1><p>请求的页面不存在。</p><a href="/">返回首页</a>');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`按 Ctrl+C 停止服务器`);
});

module.exports = app;