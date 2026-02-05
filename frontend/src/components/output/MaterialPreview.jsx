import { useState, useEffect, useRef } from 'react';
import CollapsibleSection from './CollapsibleSection';
import { renderMarkdown, extractSections } from '../../utils/markdownRenderer';
import { exportToPNG, exportToPDF, exportToHTML } from '../../services/exportService';
import { Download, Printer, FileText, Loader } from 'lucide-react';

export default function MaterialPreview({ markdown }) {
  const [sections, setSections] = useState([]);
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
    <div className="bento-card rounded-3xl p-10 mb-8 border-none shadow-sm">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8 no-print">
        <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
          <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
          生成的教材
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('image')}
            disabled={exporting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>图片</span>
          </button>
          <button
            onClick={() => handleExport('html')}
            disabled={exporting}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl font-bold hover:bg-teal-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span>HTML</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>打印</span>
          </button>
        </div>
      </div>

      {/* 章节列表 */}
      <div ref={contentRef} className="space-y-4">
        {sections.map((section, index) => (
          <CollapsibleSection
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-8 p-6 bg-primary-50 border border-primary-100 rounded-2xl no-print">
        <p className="text-sm text-primary-700 font-bold flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm">💡</span>
          提示: 您可以点击章节标题来展开/折叠内容, 或使用上方按钮导出教材。
        </p>
      </div>
    </div>
  );
}
