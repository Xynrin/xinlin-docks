# 常见问题

## 基础问题

### Q: 辛林docks 是免费的吗？

**A:** 是的，辛林docks 是完全开源免费的，你可以自由使用、修改和分发。

### Q: 需要学习什么技术才能使用？

**A:** 只需要掌握基础的 Markdown 语法即可。如果你会写 Markdown，就能使用辛林docks。

### Q: 支持哪些浏览器？

**A:** 支持所有现代浏览器：
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

IE 浏览器不支持。

## 使用问题

### Q: 为什么页面显示空白？

**A:** 最常见的原因是直接打开了 `index.html` 文件，而没有使用 HTTP 服务器。

**解决方法：**
```bash
# 使用 Python 启动本地服务器
python -m http.server 8000

# 然后访问 http://localhost:8000
```

### Q: Markdown 文件修改后没有更新？

**A:** 可能是浏览器缓存导致的。

**解决方法：**
1. 强制刷新页面：`Ctrl + F5`（Windows）或 `Cmd + Shift + R`（Mac）
2. 清除浏览器缓存
3. 在开发者工具中禁用缓存

### Q: 如何修改网站标题？

**A:** 编辑 `index.html` 文件：

```html
<!-- 修改网站标题 -->
<div class="sidebar-header">
    <h1 class="site-title">你的网站名称</h1>
    <p class="site-desc">你的网站描述</p>
</div>
```

### Q: 如何修改页面顺序？

**A:** 编辑 `render.js` 中的 `docsConfig` 数组，调整对象的顺序即可：

```javascript
const docsConfig = [
    { id: 'second', title: '第二页', file: '02_second.md' },
    { id: 'first', title: '第一页', file: '01_first.md' }
];
```

## 样式问题

### Q: 如何修改主题颜色？

**A:** 编辑 `style.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #ff6600;  /* 修改为主色调 */
}
```

### Q: 如何修改字体？

**A:** 编辑 `style.css`：

```css
body {
    font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
}
```

### Q: 如何调整内容区宽度？

**A:** 编辑 `style.css`：

```css
:root {
    --content-max-width: 1200px;  /* 默认是 900px */
}
```

## 功能问题

### Q: 如何实现搜索功能？

**A:** 辛林docks 预留了搜索接口，你可以这样实现：

```javascript
// 在 render.js 中扩展搜索功能
function searchDocs(keyword) {
    const results = [];
    
    // 遍历所有页面
    docsConfig.forEach(doc => {
        // 加载并搜索内容
        fetch(`docs/${doc.file}`)
            .then(res => res.text())
            .then(content => {
                if (content.includes(keyword)) {
                    results.push(doc);
                }
            });
    });
    
    return results;
}
```

### Q: 如何实现深色模式？

**A:** 添加深色模式样式和切换逻辑：

```css
/* 在 style.css 末尾添加 */
body.dark-mode {
    --bg-white: #1a1a1a;
    --bg-gray: #2d2d2d;
    --text-dark: #e0e0e0;
    --text-medium: #b0b0b0;
    --border-color: #444444;
}
```

```javascript
// 切换深色模式
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// 页面加载时恢复设置
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
```

### Q: 如何添加代码复制按钮？

**A:** 修改 `render.js` 中的代码块渲染：

```javascript
renderer.code = function(code, language) {
    const validLanguage = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlighted = hljs.highlight(code, { language: validLanguage }).value;
    const uniqueId = 'code-' + Math.random().toString(36).substr(2, 9);
    
    return `
        <div class="code-block-wrapper">
            <div class="code-header">
                <span class="code-lang">${validLanguage}</span>
                <button class="copy-btn" onclick="copyCode('${uniqueId}')">复制</button>
            </div>
            <pre><code id="${uniqueId}" class="hljs language-${validLanguage}">${highlighted}</code></pre>
        </div>
    `;
};

// 复制功能
function copyCode(elementId) {
    const code = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('代码已复制！');
    });
}
```

## 部署问题

### Q: 如何部署到 GitHub Pages？

**A:** 

1. 在 GitHub 创建仓库
2. 上传项目文件
3. 进入 Settings → Pages
4. Source 选择 "Deploy from a branch"
5. Branch 选择 "main"，文件夹选择 "/ (root)"
6. 保存后等待几分钟，访问提供的链接

### Q: 如何绑定自定义域名？

**A:**

1. 在域名服务商添加 CNAME 记录，指向你的 GitHub Pages 地址
2. 在项目根目录创建 `CNAME` 文件，内容为你的域名：

```
www.example.com
```

3. 在 GitHub Pages 设置中配置自定义域名

### Q: 如何启用 HTTPS？

**A:** GitHub Pages、Cloudflare Pages、Vercel 等主流平台都自动提供 HTTPS，无需额外配置。

## 性能问题

### Q: 文档太多会影响性能吗？

**A:** 不会。辛林docks 采用按需加载策略，只加载当前页面的 Markdown 文件，不会因为文档数量增加而影响性能。

### Q: 如何优化加载速度？

**A:**

1. 使用 CDN 加速（已默认配置）
2. 压缩 Markdown 文件中的图片
3. 启用服务器 Gzip 压缩
4. 配置浏览器缓存

### Q: 支持大文件吗？

**A:** 支持，但建议单个 Markdown 文件不超过 1MB，以获得最佳体验。如果文档很长，建议拆分成多个页面。

## 其他问题

### Q: 如何贡献代码？

**A:** 欢迎提交 Pull Request 或 Issue。请确保：

1. 代码风格与项目保持一致
2. 添加必要的注释
3. 测试通过后再提交

### Q: 遇到 bug 怎么办？

**A:** 

1. 检查是否使用了最新版本
2. 查看浏览器控制台错误信息
3. 在 GitHub Issues 中搜索类似问题
4. 提交新的 Issue，描述问题和复现步骤

### Q: 如何获取帮助？

**A:** 

- 查看完整文档：[使用教程](?p=usage)
- 提交 GitHub Issue
- 发送邮件至：support@example.com

---

**还有问题？** 欢迎通过 GitHub Issues 反馈，我们会尽快回复！
