# 使用教程

## 创建新页面

### 第一步：创建 Markdown 文件

在 `docs/` 目录下新建一个 `.md` 文件：

```bash
touch docs/06_newpage.md
```

### 第二步：编写内容

使用标准 Markdown 语法编写文档：

```markdown
# 页面标题

## 第一节

这是正文内容。

### 子标题

- 列表项 1
- 列表项 2
- 列表项 3

## 第二节

```javascript
// 代码块
console.log('Hello, World!');
```
```

### 第三步：添加配置

打开 `render.js`，在 `docsConfig` 数组中添加一项：

```javascript
const docsConfig = [
    // ... 现有配置
    {
        id: 'newpage',           // 页面唯一标识（URL参数）
        title: '新页面标题',      // 显示在菜单中的标题
        file: '06_newpage.md'    // Markdown 文件名
    }
];
```

### 第四步：完成！

刷新页面，左侧菜单会自动显示新页面入口。

## Markdown 语法支持

辛林docks 支持所有标准 Markdown 语法：

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

### 段落和强调

```markdown
这是普通段落。

**这是粗体文字**

*这是斜体文字*

~~这是删除线~~
```

### 列表

```markdown
## 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2

## 有序列表
1. 第一步
2. 第二步
3. 第三步
```

### 链接和图片

```markdown
## 链接
[访问官网](https://example.com)

## 图片
![图片描述](images/example.png)
```

### 代码

```markdown
## 行内代码
使用 `console.log()` 输出信息。

## 代码块
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}
```
```

### 表格

```markdown
| 特性 | 支持 | 说明 |
|------|------|------|
| Markdown | 是 | 标准语法 |
| 代码高亮 | 是 | 100+ 语言 |
| 表格 | 是 | 完整支持 |
```

### 引用和分隔线

```markdown
> 这是一段引用文字。

---

以上内容用分隔线分开。
```

## 页面排序

页面顺序由 `docsConfig` 数组中的顺序决定：

```javascript
const docsConfig = [
    { id: 'first', title: '第一页', file: '01_first.md' },
    { id: 'second', title: '第二页', file: '02_second.md' },
    { id: 'third', title: '第三页', file: '03_third.md' }
];
```

要调整顺序，只需重新排列数组中的对象顺序。

## 页面导航

### 翻页导航

每个页面底部会自动显示上一页/下一页按钮，基于 `docsConfig` 的顺序。

### 文章目录

页面右侧会自动生成目录，包含所有 `h2` 和 `h3` 标题。

## 自定义样式

### 修改全局样式

编辑 `style.css` 文件，所有页面会同步生效。

### 常用自定义

```css
/* 修改主色调 */
:root {
    --primary-color: #ff6600;  /* 改为橙色 */
}

/* 修改内容区最大宽度 */
:root {
    --content-max-width: 1200px;
}

/* 修改字体 */
body {
    font-family: "Microsoft YaHei", sans-serif;
}
```

## 最佳实践

### 文件命名

```
01_intro.md      # 数字前缀便于排序
02_install.md
03_usage.md
```

### 页面 ID 命名

```javascript
// 使用小写字母和下划线
{ id: 'quick_start', title: '快速开始', file: 'quick_start.md' }

// 避免使用特殊字符
// ❌ { id: 'quick-start', ... }
// ❌ { id: 'quick start', ... }
```

### 标题层级

```markdown
# 页面主标题（h1）- 每个页面一个

## 大章节（h2）- 会生成目录

### 小章节（h3）- 会生成目录

#### 更小的标题（h4）- 不会生成目录
```

## 高级技巧

### 页面内锚点

标题会自动生成锚点，可以直接链接：

```markdown
[跳转到第二节](#第二节)
```

### 外部链接

所有以 `http://` 或 `https://` 开头的链接会自动在新标签页打开。

### HTML 嵌入

支持直接在 Markdown 中嵌入 HTML：

```markdown
<div class="custom-box">
    <p>自定义内容</p>
</div>
```

---

**下一步**：查看 [配置说明](?p=config) 了解高级配置选项。
