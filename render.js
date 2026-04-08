/**
 * xinlin-docks core renderer
 * Pure static Markdown docs system
 */

const SITE_NAME = '辛林docks';
const STORAGE_KEYS = {
    theme: 'xinlin-docks-theme'
};
const embeddedDocs = window.XINLIN_DOCS_DATA || {};
const isFileProtocol = window.location.protocol === 'file:';

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

let currentPageIndex = 0;
let tocItems = [];
let searchIndex = [];
let activeSearchResults = [];
let searchIndexPromise = null;
let searchDebounceTimer = null;
let lastSearchKeyword = '';

const elements = {
    navMenu: document.getElementById('nav-menu'),
    markdownContent: document.getElementById('markdown-content'),
    tocMenu: document.getElementById('toc-menu'),
    pageNavigation: document.getElementById('page-navigation'),
    loadingState: document.getElementById('loading-state'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    sidebarLeft: document.getElementById('sidebar-left'),
    overlay: document.getElementById('overlay'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    searchStatus: document.getElementById('search-status'),
    themeToggle: document.getElementById('theme-toggle')
};

function init() {
    configureMarked();
    currentPageIndex = getInitialPageIndex();
    renderNavMenu();
    applySavedTheme();
    bindEvents();
    void loadPage(currentPageIndex, { pushState: false });
    void ensureSearchIndex();
}

function configureMarked() {
    marked.setOptions({
        breaks: false,
        gfm: true,
        headerIds: false,
        mangle: false
    });
}

function getInitialPageIndex() {
    const pageId = new URLSearchParams(window.location.search).get('p');

    if (!pageId) {
        return 0;
    }

    const index = docsConfig.findIndex((doc) => doc.id === pageId);
    return index === -1 ? 0 : index;
}

function renderNavMenu() {
    elements.navMenu.innerHTML = docsConfig
        .map((doc, index) => {
            return `<a href="?p=${doc.id}" class="nav-item" data-index="${index}">${escapeHTML(doc.title)}</a>`;
        })
        .join('');

    updateNavMenuHighlight();
    updateNavMenuFilter(lastSearchKeyword);
}

function updateNavMenuHighlight() {
    const navItems = elements.navMenu.querySelectorAll('.nav-item');

    navItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentPageIndex);
    });
}

function updateNavMenuFilter(keyword) {
    const normalizedKeyword = normalizeText(keyword);
    const navItems = elements.navMenu.querySelectorAll('.nav-item');

    navItems.forEach((item, index) => {
        const doc = docsConfig[index];
        const isMatch =
            !normalizedKeyword ||
            normalizeText(`${doc.title} ${doc.id}`).includes(normalizedKeyword);

        item.classList.toggle('hidden', !isMatch);
    });
}

async function loadPage(index, options = {}) {
    if (index < 0 || index >= docsConfig.length) {
        console.error('Page index out of range:', index);
        return;
    }

    const previousIndex = currentPageIndex;
    const shouldPushState = options.pushState ?? index !== previousIndex;
    currentPageIndex = index;

    const config = docsConfig[index];

    showLoading();
    updateNavMenuHighlight();
    document.title = `${config.title} - ${SITE_NAME}`;

    try {
        const markdown = await loadDocContent(config.file);
        elements.markdownContent.innerHTML = marked.parse(markdown);

        enhanceRenderedContent();
        generateTOC();
        renderPageNavigation();
        updateURL(config.id, shouldPushState);
        window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (error) {
        console.error('Failed to load document:', error);
        elements.markdownContent.innerHTML = `
            <div class="error-message">
                <h2>加载失败</h2>
                <p>无法读取文档文件 <code>docs/${escapeHTML(config.file)}</code></p>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
        tocItems = [];
        elements.tocMenu.innerHTML = '<p class="toc-empty">当前页面暂无目录</p>';
        elements.pageNavigation.innerHTML = '';
    } finally {
        hideLoading();
    }
}

function enhanceRenderedContent() {
    syncHeadingAnchors();
    decorateExternalLinks();
    highlightCodeBlocks();
    enhanceCodeBlocks();
}

function syncHeadingAnchors() {
    const headingCounts = new Map();
    const headings = elements.markdownContent.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((heading, index) => {
        const baseId = createHeadingId(heading.textContent || '', index);
        const duplicateCount = headingCounts.get(baseId) || 0;
        const resolvedId = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`;

        headingCounts.set(baseId, duplicateCount + 1);
        heading.id = resolvedId;
    });
}

function createHeadingId(text, fallbackIndex) {
    const normalizedText = text
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');

    return normalizedText || `section-${fallbackIndex + 1}`;
}

function decorateExternalLinks() {
    const links = elements.markdownContent.querySelectorAll('a[href]');

    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (/^https?:\/\//i.test(href)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
}

function highlightCodeBlocks() {
    if (!window.hljs || typeof hljs.highlightElement !== 'function') {
        return;
    }

    elements.markdownContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

function enhanceCodeBlocks() {
    const preBlocks = elements.markdownContent.querySelectorAll('pre');

    preBlocks.forEach((pre) => {
        if (pre.parentElement && pre.parentElement.classList.contains('code-block-shell')) {
            return;
        }

        const shell = document.createElement('div');
        shell.className = 'code-block-shell';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'code-copy-btn';
        button.textContent = '复制代码';

        const codeElement = pre.querySelector('code') || pre;
        button.addEventListener('click', async () => {
            const success = await copyCode(codeElement);
            button.textContent = success ? '已复制' : '复制失败';
            button.classList.toggle('copied', success);
            button.classList.toggle('error', !success);

            window.setTimeout(() => {
                button.textContent = '复制代码';
                button.classList.remove('copied', 'error');
            }, 1600);
        });

        pre.parentNode.insertBefore(shell, pre);
        shell.appendChild(button);
        shell.appendChild(pre);
    });
}

function generateTOC() {
    const headings = elements.markdownContent.querySelectorAll('h2, h3');
    tocItems = [];

    if (!headings.length) {
        elements.tocMenu.innerHTML = '<p class="toc-empty">当前页面暂无目录</p>';
        return;
    }

    elements.tocMenu.innerHTML = Array.from(headings)
        .map((heading, index) => {
            tocItems.push({
                id: heading.id,
                element: heading,
                index
            });

            return `<a href="#${heading.id}" class="toc-item toc-${heading.tagName.toLowerCase()}" data-id="${heading.id}">${escapeHTML(heading.textContent || '')}</a>`;
        })
        .join('');

    updateTOCHighlight();
}

function updateTOCHighlight() {
    if (!tocItems.length) {
        return;
    }

    const scrollPosition = window.scrollY + 120;
    let currentIndex = 0;

    for (let i = 0; i < tocItems.length; i += 1) {
        if (scrollPosition >= tocItems[i].element.offsetTop) {
            currentIndex = i;
        }
    }

    const tocLinks = elements.tocMenu.querySelectorAll('.toc-item');
    tocLinks.forEach((link, index) => {
        link.classList.toggle('active', index === currentIndex);
    });
}

function renderPageNavigation() {
    const parts = [];

    if (currentPageIndex > 0) {
        const prevDoc = docsConfig[currentPageIndex - 1];
        parts.push(`
            <a href="?p=${prevDoc.id}" class="page-nav-btn prev" data-index="${currentPageIndex - 1}">
                <span class="page-nav-label">上一页</span>
                <span class="page-nav-title">${escapeHTML(prevDoc.title)}</span>
            </a>
        `);
    }

    if (currentPageIndex < docsConfig.length - 1) {
        const nextDoc = docsConfig[currentPageIndex + 1];
        parts.push(`
            <a href="?p=${nextDoc.id}" class="page-nav-btn next" data-index="${currentPageIndex + 1}">
                <span class="page-nav-label">下一页</span>
                <span class="page-nav-title">${escapeHTML(nextDoc.title)}</span>
            </a>
        `);
    }

    elements.pageNavigation.innerHTML = parts.join('');
}

function bindEvents() {
    let scrollTimeout = null;

    window.addEventListener('scroll', () => {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(updateTOCHighlight, 50);
    });

    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    elements.overlay.addEventListener('click', closeMobileMenu);

    elements.navMenu.addEventListener('click', (event) => {
        const item = event.target.closest('.nav-item');
        if (!item) {
            return;
        }

        event.preventDefault();
        const index = Number(item.dataset.index);
        if (!Number.isNaN(index)) {
            void loadPage(index);
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        }
    });

    elements.pageNavigation.addEventListener('click', (event) => {
        const button = event.target.closest('.page-nav-btn');
        if (!button) {
            return;
        }

        event.preventDefault();
        const index = Number(button.dataset.index);
        if (!Number.isNaN(index)) {
            void loadPage(index);
        }
    });

    elements.tocMenu.addEventListener('click', (event) => {
        const link = event.target.closest('.toc-item');
        if (!link) {
            return;
        }

        event.preventDefault();
        const heading = document.getElementById(link.dataset.id || '');

        if (heading) {
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        }
    });

    elements.searchResults.addEventListener('click', (event) => {
        const item = event.target.closest('.search-result-item');
        if (!item) {
            return;
        }

        const result = activeSearchResults[Number(item.dataset.resultIndex)];
        if (!result) {
            return;
        }

        void loadPage(result.index);
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });

    elements.searchInput.addEventListener('input', (event) => {
        const keyword = event.target.value;
        window.clearTimeout(searchDebounceTimer);
        searchDebounceTimer = window.setTimeout(() => {
            void searchDocs(keyword);
        }, 120);
    });

    elements.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.currentTarget.value = '';
            void searchDocs('');
        }
    });

    elements.themeToggle.addEventListener('click', () => {
        toggleDarkMode();
    });

    document.addEventListener('keydown', (event) => {
        const target = event.target;
        const isTypingTarget =
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            (target instanceof HTMLElement && target.isContentEditable);

        if (event.key === '/' && !isTypingTarget) {
            event.preventDefault();
            elements.searchInput.focus();
            elements.searchInput.select();
        }
    });

    window.addEventListener('popstate', () => {
        const index = getInitialPageIndex();
        if (index !== currentPageIndex) {
            void loadPage(index, { pushState: false });
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function showLoading() {
    elements.loadingState.classList.remove('hidden');
    elements.markdownContent.style.opacity = '0.25';
}

function hideLoading() {
    elements.loadingState.classList.add('hidden');
    elements.markdownContent.style.opacity = '1';
}

function updateURL(pageId, pushState = true) {
    const url = new URL(window.location.href);
    url.searchParams.set('p', pageId);

    if (pushState) {
        window.history.pushState({ pageId }, '', url);
        return;
    }

    window.history.replaceState({ pageId }, '', url);
}

async function ensureSearchIndex() {
    if (searchIndex.length) {
        return searchIndex;
    }

    if (searchIndexPromise) {
        return searchIndexPromise;
    }

    searchIndexPromise = Promise.all(
        docsConfig.map(async (doc, index) => {
            try {
                const markdown = await loadDocContent(doc.file);
                const plainText = markdownToPlainText(markdown);

                return {
                    ...doc,
                    index,
                    plainText,
                    normalizedTitle: normalizeText(doc.title),
                    normalizedContent: normalizeText(plainText)
                };
            } catch (error) {
                console.warn(`Failed to index ${doc.file}:`, error);
                return null;
            }
        })
    )
        .then((results) => {
            searchIndex = results.filter(Boolean);
            return searchIndex;
        })
        .finally(() => {
            searchIndexPromise = null;
        });

    return searchIndexPromise;
}

async function loadDocContent(fileName) {
    const hasEmbedded = Object.prototype.hasOwnProperty.call(embeddedDocs, fileName);

    if (isFileProtocol && hasEmbedded) {
        return embeddedDocs[fileName];
    }

    try {
        const response = await fetch(`docs/${fileName}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.text();
    } catch (error) {
        if (hasEmbedded) {
            return embeddedDocs[fileName];
        }

        throw error;
    }
}

async function searchDocs(keyword) {
    const query = typeof keyword === 'string' ? keyword.trim() : '';
    lastSearchKeyword = query;
    updateNavMenuFilter(query);

    if (!query) {
        clearSearchResults();
        return [];
    }

    setSearchStatus('正在搜索文档...');

    const index = await ensureSearchIndex();
    const normalizedQuery = normalizeText(query);

    const results = index
        .map((record) => createSearchResult(record, query, normalizedQuery))
        .filter(Boolean)
        .sort((left, right) => right.score - left.score)
        .slice(0, 8);

    renderSearchResults(results, query);
    return results;
}

function createSearchResult(record, rawQuery, normalizedQuery) {
    const titleMatchIndex = record.normalizedTitle.indexOf(normalizedQuery);
    const contentMatchIndex = record.normalizedContent.indexOf(normalizedQuery);

    if (titleMatchIndex === -1 && contentMatchIndex === -1) {
        return null;
    }

    let score = 0;
    if (titleMatchIndex !== -1) {
        score += 200 - Math.min(titleMatchIndex, 120);
    }
    if (contentMatchIndex !== -1) {
        score += 100 - Math.min(contentMatchIndex, 120);
    }

    return {
        ...record,
        score,
        snippet: buildSnippet(record.plainText, rawQuery)
    };
}

function renderSearchResults(results, keyword) {
    activeSearchResults = results;

    if (!results.length) {
        setSearchStatus(`没有找到“${keyword}”相关内容`);
        elements.searchResults.innerHTML = '<div class="search-empty">换个关键词试试看，比如页面标题、配置项或命令。</div>';
        return;
    }

    setSearchStatus(`找到 ${results.length} 条相关结果`);
    elements.searchResults.innerHTML = results
        .map((result, index) => {
            return `
                <button type="button" class="search-result-item" data-result-index="${index}">
                    <span class="search-result-title">${highlightSearchMatch(result.title, keyword)}</span>
                    <span class="search-result-snippet">${highlightSearchMatch(result.snippet, keyword)}</span>
                </button>
            `;
        })
        .join('');
}

function clearSearchResults() {
    activeSearchResults = [];
    setSearchStatus('');
    elements.searchResults.innerHTML = '';
}

function setSearchStatus(message) {
    elements.searchStatus.textContent = message;
}

function buildSnippet(text, query) {
    if (!text) {
        return '文档内容为空';
    }

    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    const matchIndex = normalizedText.indexOf(normalizedQuery);

    if (matchIndex === -1) {
        return text.slice(0, 88).trim() + (text.length > 88 ? '...' : '');
    }

    const start = Math.max(0, matchIndex - 28);
    const end = Math.min(text.length, matchIndex + query.length + 60);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';

    return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

function highlightSearchMatch(text, keyword) {
    const safeText = escapeHTML(text);
    if (!keyword) {
        return safeText;
    }

    const pattern = new RegExp(escapeRegExp(keyword), 'gi');
    return safeText.replace(pattern, (match) => `<mark>${match}</mark>`);
}

function markdownToPlainText(markdown) {
    return markdown
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, ' $1 ')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' $1 ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, ' $1 ')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^>\s?/gm, '')
        .replace(/[*_~|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const lookup = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return lookup[char];
    });
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    const theme =
        savedTheme ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    setTheme(theme, false);
}

function setTheme(theme, persist = true) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    elements.themeToggle.setAttribute('aria-pressed', String(isDark));
    elements.themeToggle.textContent = isDark ? '切换浅色' : '切换深色';

    if (persist) {
        localStorage.setItem(STORAGE_KEYS.theme, theme);
    }
}

function toggleDarkMode() {
    const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(nextTheme);
    return nextTheme;
}

async function copyCode(codeBlock) {
    const text = codeBlock ? codeBlock.textContent.trimEnd() : '';

    if (!text) {
        return false;
    }

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand('copy');
        document.body.removeChild(textarea);
        return copied;
    } catch (error) {
        console.error('Copy failed:', error);
        return false;
    }
}

function toggleMobileMenu() {
    elements.mobileMenuBtn.classList.toggle('active');
    elements.sidebarLeft.classList.toggle('active');
    elements.overlay.classList.toggle('active');
    document.body.style.overflow = elements.sidebarLeft.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    elements.mobileMenuBtn.classList.remove('active');
    elements.sidebarLeft.classList.remove('active');
    elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addPage(docConfig) {
    docsConfig.push(docConfig);
    searchIndex = [];
    activeSearchResults = [];
    renderNavMenu();

    if (lastSearchKeyword) {
        void searchDocs(lastSearchKeyword);
    }
}

function getCurrentPage() {
    return docsConfig[currentPageIndex];
}

function getAllPages() {
    return [...docsConfig];
}

document.addEventListener('DOMContentLoaded', init);

window.XinlinDocks = {
    search: searchDocs,
    toggleDarkMode,
    copyCode,
    addPage,
    getCurrentPage,
    getAllPages,
    loadPage
};
