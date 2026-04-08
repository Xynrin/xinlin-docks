# 配置说明

## 核心配置文件

辛林docks 的所有核心配置都在 `render.js` 文件中。

## 文档配置数组

### 基本结构

```javascript
const docsConfig = [
    {
        id: 'intro',           // 页面唯一标识
        title: '项目介绍',      // 页面标题
        file: '01_intro.md'    // Markdown 文件路径
    }
];
```

### 配置项说明

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 页面唯一标识，用于 URL 参数 `?p=id` |
| `title` | string | 是 | 显示在菜单和页面标题中的名称 |
| `file` | string | 是 | Markdown 文件路径，相对于 `docs/` 目录 |

### 完整示例

```javascript
const docsConfig = [
    {
        id: 'intro',
        title: '项目介绍',
        file: '01_intro.md'
    },
    {
        id: 'install',
        title: '安装指南',
        file: '02_install.md'
    },
    {
        id: 'usage',
        title: '使用教程',
        file: '03_usage.md'
    },
    {
        id: 'config',
        title: '配置说明',
        file: '04_config.md'
    },
    {
        id: 'faq',
        title: '常见问题',
        file: '05_faq.md'
    }
];
```

## 样式配置

### CSS 变量

所有可配置的样式变量都在 `style.css` 的 `:root` 中：

```css
:root {
    /* 主色调 */
    --primary-color: #0066cc;
    --primary-hover: #0052a3;
    --primary-light: #e6f2ff;
    
    /* 背景色 */
    --bg-white: #ffffff;
    --bg-gray: #f8f8f8;
    --bg-code: #2d2d2d;
    
    /* 文字颜色 */
    --text-dark: #333333;
    --text-medium: #666666;
    --text-light: #999999;
    
    /* 边框颜色 */
    --border-color: #e0e0e0;
    --border-light: #eeeeee;
    
    /* 尺寸 */
    --sidebar-left-width: 230px;
    --sidebar-right-width: 280px;
    --content-max-width: 900px;
    
    /* 字体 */
    --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...;
}
```

### 自定义主题示例

#### 深色主题

```css
:root {
    --primary-color: #4da6ff;
    --bg-white: #1a1a1a;
    --bg-gray: #2d2d2d;
    --text-dark: #e0e0e0;
    --text-medium: #b0b0b0;
    --border-color: #444444;
}
```

#### 绿色主题

```css
:root {
    --primary-color: #2ecc71;
    --primary-hover: #27ae60;
    --primary-light: #e8f8f0;
}
```

## marked.js 配置

### 解析选项

```javascript
marked.setOptions({
    breaks: true,           // 支持换行
    gfm: true,              // GitHub Flavored Markdown
    headerIds: true,        // 为标题生成 ID
    mangle: false,          // 不转义 HTML
    sanitize: false,        // 不清理 HTML
    smartLists: true,       // 智能列表
    smartypants: true       // 智能标点
});
```

### 自定义渲染器

可以扩展 `render.js` 中的自定义渲染器来实现更多功能：

```javascript
// 自定义代码块（添加复制按钮）
renderer.code = function(code, language) {
    const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(code, { language: validLanguage }).value;
    return `
        <div class="code-block-wrapper">
            <button class="copy-btn" onclick="copyCode(this)">复制</button>
            <pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>
        </div>
    `;
};
```

## 扩展功能接口

### 全局 API

辛林docks 暴露了一个全局对象 `window.XinlinDocks`，提供以下接口：

```javascript
// 搜索文档
XinlinDocks.search('关键词');

// 切换深色模式
XinlinDocks.toggleDarkMode();

// 复制代码
XinlinDocks.copyCode(codeBlockElement);

// 动态添加页面
XinlinDocks.addPage({
    id: 'newpage',
    title: '新页面',
    file: 'newpage.md'
});

// 获取当前页面信息
const current = XinlinDocks.getCurrentPage();
console.log(current.title);  // 当前页面标题

// 获取所有页面
const allPages = XinlinDocks.getAllPages();

// 跳转到指定页面
XinlinDocks.loadPage(2);  // 加载第3个页面（索引从0开始）
```

## 响应式断点

### 默认断点

```css
/* 大屏幕 - 显示三栏 */
@media screen and (min-width: 1201px) { }

/* 中等屏幕 - 隐藏右侧目录 */
@media screen and (max-width: 1200px) { }

/* 小屏幕 - 隐藏左右侧边栏 */
@media screen and (max-width: 768px) { }
```

### 自定义断点

修改 `style.css` 中的媒体查询即可。

## 部署配置

### GitHub Pages

无需额外配置，直接上传即可。

### Cloudflare Pages

1. 连接 Git 仓库
2. 构建设置保持默认（无需构建命令）
3. 部署目录设置为项目根目录

### Vercel

1. 导入项目
2. 框架预设选择 "Other"
3. 构建命令留空
4. 输出目录设置为 `./`

### Nginx

```nginx
server {
    listen 80;
    server_name docs.example.com;
    root /var/www/xinlin-docks;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 缓存静态资源
    location ~* \.(css|js|md)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 性能优化

### CDN 加速

所有外部依赖均使用 jsDelivr CDN：

```html
<!-- github-markdown-css -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.2.0/github-markdown.min.css">

<!-- marked.js -->
<script src="https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js"></script>

<!-- highlight.js -->
<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js"></script>
```

### 懒加载

如需实现图片懒加载，可在 `render.js` 中添加：

```javascript
// 图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}
```

---

**下一步**：查看 [常见问题](?p=faq) 解决使用中的疑问。
