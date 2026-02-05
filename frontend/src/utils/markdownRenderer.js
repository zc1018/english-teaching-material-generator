import { marked } from 'marked';

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
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
    // 匹配 ### 0. 或 ### 1. 等章节标题
    const match = line.match(/^###\s+(\d+)\.\s+(.+)$/);

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
