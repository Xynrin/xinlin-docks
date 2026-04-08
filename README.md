# 辛林docks

> 纯前端、零依赖、无需编译的 Markdown 文档系统

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 特性

- **完全静态** - 无需后端、数据库或构建工具
- **三栏布局** - 经典菜鸟教程/W3School 风格
- **配置即页面** - 新增页面只需修改一个数组
- **纯原生技术** - HTML5 + CSS3 + ES6+
- **仅3个CDN依赖** - github-markdown-css、marked.js、highlight.js

## 快速开始

### 1. 下载项目

```bash
git clone https://github.com/Xynrin/xinlin-docks.git
cd xinlin-docks
```

### 2. 启动本地服务器

```bash
python -m http.server 8000
```

### 3. 访问

打开浏览器访问 `http://localhost:8000`

## 项目结构

```
xinlin-docks/
├── index.html          # 唯一入口文件
├── style.css           # 全局统一样式
├── render.js           # 核心渲染引擎
├── README.md           # 项目说明
└── docs/               # 文档内容目录
    ├── 01_intro.md
    ├── 02_install.md
    ├── 03_usage.md
    ├── 04_config.md
    └── 05_faq.md
```

## 新增页面

### 第一步：创建 Markdown 文件

```bash
touch docs/06_newpage.md
```

### 第二步：添加配置

编辑 `render.js`，在 `docsConfig` 数组中添加：

```javascript
const docsConfig = [
    // ... 现有配置
    {
        id: 'newpage',
        title: '新页面',
        file: '06_newpage.md'
    }
];
```

### 第三步：完成！

刷新页面，新页面会自动出现在左侧菜单中。



## 扩展功能

### 添加深色模式

```javascript
// 在 render.js 中添加
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
```

```css
/* 在 style.css 中添加 */
body.dark-mode {
    --bg-white: #1a1a1a;
    --bg-gray: #2d2d2d;
    --text-dark: #e0e0e0;
}
```

### 添加搜索功能

```javascript
// 使用全局 API
XinlinDocks.search('关键词');
```

### 添加代码复制按钮

```javascript
// 修改 renderer.code
renderer.code = function(code, language) {
    // ... 添加复制按钮逻辑
};
```

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 技术栈

| 技术 | 用途 |
|------|------|
| github-markdown-css | Markdown 渲染样式 |
| marked.js | Markdown 解析引擎 |
| highlight.js | 代码语法高亮 |

## 自定义配置

### 修改主题颜色

编辑 `style.css`：

```css
:root {
    --primary-color: #ff6600;
}
```

### 修改内容区宽度

```css
:root {
    --content-max-width: 1200px;
}
```

### 修改侧边栏宽度

```css
:root {
    --sidebar-left-width: 250px;
    --sidebar-right-width: 300px;
}
```

## 许可证

MIT License

## 致谢

- [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)
- [marked](https://github.com/markedjs/marked)
- [highlight.js](https://github.com/highlightjs/highlight.js)

---

**辛林docks** - 让文档写作回归简单
