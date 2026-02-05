import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CollapsibleSection({ section, index }) {
  const [isOpen, setIsOpen] = useState(true);

  const sectionIcons = {
    '0': '⚙️',
    '1': '📋',
    '2': '📚',
    '3': '💬',
    '4': '📝',
    '5': '👂',
    '6': '✍️',
    '7': '🎭',
    '8': '🗣️',
    '9': '🔄'
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 print-avoid-break">
      {/* 章节标题 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 hover:from-primary-100 hover:to-purple-100 transition-colors no-print"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sectionIcons[section.id] || '📄'}</span>
          <h3 className="text-lg font-bold text-gray-800">
            {section.id}. {section.title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* 打印时显示的标题 */}
      <div className="hidden print:block p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">
          {section.id}. {section.title}
        </h3>
      </div>

      {/* 章节内容 */}
      {isOpen && (
        <div className="p-6 bg-white">
          <div
            className="prose prose-sm max-w-none
                       prose-headings:text-gray-800
                       prose-p:text-gray-700
                       prose-strong:text-gray-900
                       prose-table:text-sm
                       prose-th:bg-gray-50
                       prose-th:font-semibold
                       prose-td:border-gray-200"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      )}

      {/* 打印时始终显示内容 */}
      <div className="hidden print:block p-6 bg-white">
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    </div>
  );
}
