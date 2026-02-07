import { marked } from 'marked';

const renderer = new marked.Renderer();

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeUrl = (href = '') => {
  const trimmed = href.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) {
      return trimmed;
    }
  } catch {
    return '';
  }

  return '';
};

renderer.html = () => '';
renderer.link = (href, title, text) => {
  const safeHref = sanitizeUrl(href);
  if (!safeHref) return text || '';
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<a href="${safeHref}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

renderer.image = (href, title, text) => {
  const safeHref = sanitizeUrl(href);
  if (!safeHref) return '';
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  const alt = text ? escapeHtml(text) : '';
  return `<img src="${safeHref}" alt="${alt}"${titleAttr} />`;
};

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  renderer
});

/**
 * 将Markdown转换为HTML
 * @param {string} markdown - Markdown文本
 * @returns {string} - HTML字符串
 */
export function renderMarkdown(markdown) {
  if (!markdown) return '';
  return marked(markdown);
}

/**
 * 从Markdown中提取章节
 * @param {string} markdown - 完整的Markdown文本
 * @returns {Array} - 章节数组
 */
export function extractSections(markdown) {
  if (!markdown) return [];

  const sections = [];
  const lines = markdown.split('\n');
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    // 匹配 #, ## 或 ### 开头的章节标题 (例如: "# 0.", "## 1.")
    const match = line.match(/^#{1,3}\s+(\d+)\.\s+(.+)$/);

    if (match) {
      // 保存上一个章节
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }

      // 开始新章节
      currentSection = {
        id: match[1],
        title: match[2],
        content: ''
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // 保存最后一个章节
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}
