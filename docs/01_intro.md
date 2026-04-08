# 辛林docks 项目介绍

## 什么是辛林docks？

**辛林docks** 是一个纯前端、零依赖（仅3个CDN库）、无需编译的 Markdown 文档系统。它完美复刻了菜鸟教程/W3School 的经典三栏布局，让你可以专注于写作，而无需关心技术细节。

> "写 Markdown 即生成文档" —— 这就是辛林docks的核心理念。

## 核心特性

### 完全静态
- 无需后端服务器
- 无需数据库
- 无需编译构建
- 纯 HTML + CSS + JavaScript

### 三栏经典布局
- **左侧**：文档目录导航
- **中间**：Markdown 内容渲染
- **右侧**：当前页面文章目录

### 极简使用
1. 在 `docs/` 目录下新建 `.md` 文件
2. 在 `render.js` 的配置数组中添加一项
3. 完成！系统自动生成页面

## 技术栈

| 技术 | 用途 | CDN 地址 |
|------|------|----------|
| github-markdown-css | Markdown 渲染样式 | jsDelivr |
| marked.js | Markdown 解析引擎 | jsDelivr |
| highlight.js | 代码语法高亮 | jsDelivr |

## 项目结构

```
xinlin-docks/
├── index.html          # 唯一入口文件
├── style.css           # 全局统一样式
├── render.js           # 核心渲染引擎
└── docs/               # 纯内容目录
    ├── 01_intro.md     # 项目介绍
    ├── 02_install.md   # 安装指南
    ├── 03_usage.md     # 使用教程
    ├── 04_config.md    # 配置说明
    └── 05_faq.md       # 常见问题
```

## 设计理念

### 内容与框架分离

所有文档内容只写在 `docs/` 下的 `.md` 文件中，框架代码与内容完全解耦：

- **内容作者**：只需关心 Markdown 写作
- **开发者**：只需维护框架代码
- **设计师**：只需修改样式文件

### 配置即页面

新增页面只需两步：

1. 在 `docs/` 目录下新建 `.md` 文件
2. 在 `render.js` 的 `docsConfig` 数组中添加一项

无需修改任何 HTML 结构！

## 适用场景

- 产品文档
- API 文档
- 技术博客
- 知识库
- 教程站点
- 个人笔记

## 快速开始

```bash
# 1. 克隆或下载项目
git clone https://github.com/yourname/xinlin-docks.git

# 2. 进入项目目录
cd xinlin-docks

# 3. 用任意静态服务器运行
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

然后打开浏览器访问 `http://localhost:8000` 即可。

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

**下一步**：查看 [安装指南](?p=install) 了解详细安装步骤。
