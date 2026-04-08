# 安装指南

## 环境要求

辛林docks 对运行环境的要求极低：

| 要求 | 说明 |
|------|------|
| 服务器 | 任意静态文件服务器 |
| 后端语言 | 不需要 |
| 数据库 | 不需要 |
| Node.js | 不需要 |
| 构建工具 | 不需要 |

## 安装方式

### 方式一：直接下载（推荐）

1. 下载项目压缩包
2. 解压到你的网站目录
3. 完成！

### 方式二：Git 克隆

```bash
git clone https://github.com/yourname/xinlin-docks.git
cd xinlin-docks
```

### 方式三：手动创建

按照 [项目结构](?p=intro#项目结构) 手动创建文件即可。

## 本地预览

由于浏览器安全策略，直接打开 `index.html` 可能无法正常加载 Markdown 文件。建议使用以下方式预览：

### Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Node.js

```bash
# 使用 npx（无需安装）
npx serve .

# 或安装 http-server
npm install -g http-server
http-server -p 8000
```

### PHP

```bash
php -S localhost:8000
```

### VS Code

安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件，右键点击 `index.html` 选择 "Open with Live Server"。

## 目录权限

确保以下目录和文件可被 Web 服务器读取：

```
xinlin-docks/
├── index.html    # 644
├── style.css     # 644
├── render.js     # 644
└── docs/         # 755
    └── *.md      # 644
```

## 验证安装

启动本地服务器后，在浏览器中访问：

```
http://localhost:8000
```

如果看到以下内容，说明安装成功：

1. 左侧显示文档目录菜单
2. 中间显示项目介绍内容
3. 右侧显示文章目录

## 常见问题

### 页面空白，无内容显示

**原因**：直接打开 `index.html` 文件，未使用 HTTP 服务器

**解决**：使用上述任意一种方式启动本地服务器

### Markdown 文件加载失败

**原因**：文件路径错误或文件不存在

**解决**：
1. 检查 `docs/` 目录是否存在
2. 检查 Markdown 文件名是否与配置一致
3. 检查浏览器控制台错误信息

### 样式显示异常

**原因**：CDN 资源加载失败

**解决**：
1. 检查网络连接
2. 尝试刷新页面
3. 检查浏览器开发者工具的 Network 面板

## 下一步

安装完成后，查看 [使用教程](?p=usage) 了解如何创建和管理文档页面。
