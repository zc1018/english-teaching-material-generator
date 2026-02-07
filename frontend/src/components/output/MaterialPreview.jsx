import { useState, useEffect, useRef } from 'react';
import TEDHeader from '../ted/TEDHeader';
import BilingualSection from '../ted/BilingualSection';
import { renderMarkdown, extractSections } from '../../utils/markdownRenderer';
import { exportToPNG, exportToPDF, exportToHTML } from '../../services/exportService';
import { Download, Printer, FileText, Loader } from 'lucide-react';
import '../../styles/ted-theme.css';

export default function MaterialPreview({ markdown }) {
  const [sections, setSections] = useState([]);
  const [languageMode, setLanguageMode] = useState('bilingual');
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (markdown) {
      const extracted = extractSections(markdown);
      const rendered = extracted.map(section => ({
        ...section,
        content: renderMarkdown(section.content)
      }));
      setSections(rendered);
    }
  }, [markdown]);

  const handleExport = async (type) => {
    if (!contentRef.current) return;

    setExporting(true);
    try {
      switch (type) {
        case 'pdf':
          await exportToPDF(contentRef.current);
          break;
        case 'image':
          await exportToPNG(contentRef.current);
          break;
        case 'html':
          const htmlContent = contentRef.current.innerHTML;
          exportToHTML(htmlContent);
          break;
        default:
          break;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setExporting(false);
    }
  };

  if (!markdown) return null;

  return (
    <div className="bento-card rounded-3xl p-0 mb-8 overflow-hidden">
      <div className="ted-container" ref={contentRef}>
        <TEDHeader onLanguageChange={setLanguageMode} />

        {sections.map((section, index) => (
          <BilingualSection
            key={index}
            title={section.title}
            content={section.content}
            languageMode={languageMode}
          />
        ))}

        <div className="export-buttons">
          <button
            className="export-button"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
          >
            {exporting ? <Loader className="animate-spin" size={20} /> : <Printer size={20} />}
            <span>导出 PDF</span>
          </button>

          <button
            className="export-button"
            onClick={() => handleExport('image')}
            disabled={exporting}
          >
            {exporting ? <Loader className="animate-spin" size={20} /> : <Download size={20} />}
            <span>导出图片</span>
          </button>

          <button
            className="export-button"
            onClick={() => handleExport('html')}
            disabled={exporting}
          >
            {exporting ? <Loader className="animate-spin" size={20} /> : <FileText size={20} />}
            <span>导出 HTML</span>
          </button>
        </div>
      </div>
    </div>
  );
}
