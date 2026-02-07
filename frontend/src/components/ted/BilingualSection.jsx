export default function BilingualSection({ title, content, languageMode = 'bilingual' }) {
  // 解析标题中的中英文
  const parseTitle = (titleText) => {
    // 移除 HTML 标签
    const cleanTitle = titleText.replace(/<[^>]*>/g, '');

    // 匹配多种格式:
    // "English Title 中文标题"
    // "English Title (中文标题)"
    // "English Title（中文标题）"
    // "1. English Title 中文标题"

    // 先移除数字前缀
    const withoutNumber = cleanTitle.replace(/^\d+\.\s*/, '');

    // 尝试匹配括号格式
    const bracketMatch = withoutNumber.match(/^(.+?)\s*[（(](.+?)[）)]$/);
    if (bracketMatch) {
      return { en: bracketMatch[1].trim(), zh: bracketMatch[2].trim() };
    }

    // 尝试分离中英文（通过检测中文字符）
    const words = withoutNumber.split(/\s+/);
    const englishParts = [];
    const chineseParts = [];

    words.forEach(word => {
      if (/[\u4e00-\u9fa5]/.test(word)) {
        chineseParts.push(word);
      } else {
        englishParts.push(word);
      }
    });

    if (chineseParts.length > 0) {
      return {
        en: englishParts.join(' '),
        zh: chineseParts.join(' ')
      };
    }

    return { en: withoutNumber, zh: '' };
  };

  const parsedTitle = parseTitle(title);

  // 智能处理内容：保持 HTML 结构，但分离中英文
  const processContent = (htmlContent) => {
    // 如果内容主要是表格，保持原样显示
    if (htmlContent.includes('<table')) {
      return { type: 'table', content: htmlContent };
    }

    // 创建临时 DOM 来解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // 处理段落和列表项
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (!text) return { en: '', zh: '' };

        // 检测括号中的中文翻译: "English text (中文翻译)"
        const bracketMatch = text.match(/^(.+?)\s*[（(](.+?)[）)]$/);
        if (bracketMatch && /[\u4e00-\u9fa5]/.test(bracketMatch[2])) {
          return {
            en: bracketMatch[1].trim(),
            zh: bracketMatch[2].trim()
          };
        }

        // 检测是否包含中文
        const hasChinese = /[\u4e00-\u9fa5]/.test(text);
        const hasEnglish = /[a-zA-Z]/.test(text);

        if (hasChinese && hasEnglish) {
          // 混合内容，尝试分离
          const parts = text.split(/([。！？；，、])/);
          const enParts = [];
          const zhParts = [];

          parts.forEach(part => {
            if (/[\u4e00-\u9fa5]/.test(part)) {
              zhParts.push(part);
            } else if (part.trim()) {
              enParts.push(part);
            }
          });

          return {
            en: enParts.join(' ').trim(),
            zh: zhParts.join('').trim()
          };
        } else if (hasChinese) {
          return { en: '', zh: text };
        } else {
          return { en: text, zh: '' };
        }
      }

      return { en: '', zh: '' };
    };

    // 收集所有文本节点
    const walker = doc.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const englishParts = [];
    const chineseParts = [];

    let node;
    while (node = walker.nextNode()) {
      const result = processNode(node);
      if (result.en) englishParts.push(result.en);
      if (result.zh) chineseParts.push(result.zh);
    }

    // 如果成功分离了中英文
    if (englishParts.length > 0 || chineseParts.length > 0) {
      return {
        type: 'separated',
        en: englishParts.join(' '),
        zh: chineseParts.join(' ')
      };
    }

    // 否则返回原内容
    return { type: 'original', content: htmlContent };
  };

  const processedContent = processContent(content);

  const getContentClass = () => {
    if (languageMode === 'english') return 'bilingual-content single-en';
    if (languageMode === 'chinese') return 'bilingual-content single-zh';
    return 'bilingual-content';
  };

  const shouldShowEnglish = languageMode !== 'chinese';
  const shouldShowChinese = languageMode !== 'english';

  return (
    <div className="ted-section">
      <h2 className="ted-section-title">
        {shouldShowEnglish && <span className="en">{parsedTitle.en}</span>}
        {shouldShowEnglish && shouldShowChinese && parsedTitle.zh && <span> / </span>}
        {shouldShowChinese && parsedTitle.zh && <span className="zh">{parsedTitle.zh}</span>}
      </h2>

      {/* 表格内容：保持原样 */}
      {processedContent.type === 'table' && (
        <div className="ted-content">
          <div dangerouslySetInnerHTML={{ __html: processedContent.content }} />
        </div>
      )}

      {/* 分离的中英文内容 */}
      {processedContent.type === 'separated' && (
        <div className={getContentClass()}>
          {shouldShowEnglish && processedContent.en && (
            <div className="english-column">
              <div className="ted-content">
                <div dangerouslySetInnerHTML={{ __html: processedContent.en }} />
              </div>
            </div>
          )}

          {shouldShowChinese && processedContent.zh && (
            <div className="chinese-column">
              <div className="ted-content">
                <div dangerouslySetInnerHTML={{ __html: processedContent.zh }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 原始内容：无法分离时 */}
      {processedContent.type === 'original' && (
        <div className="ted-content">
          <div dangerouslySetInnerHTML={{ __html: processedContent.content }} />
        </div>
      )}
    </div>
  );
}
