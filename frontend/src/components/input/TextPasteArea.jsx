import { useState } from 'react';
import { FileText, X } from 'lucide-react';

export default function TextPasteArea({ onTextContent }) {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    onTextContent(value);
  };

  const handleClear = () => {
    setText('');
    onTextContent('');
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="在此粘贴或输入文本内容..."
          className="w-full h-64 px-5 py-4 border border-slate-200 rounded-2xl
                     focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 focus:outline-none resize-none
                     text-slate-800 placeholder-slate-400 font-medium transition-all"
        />
        {text && (
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-2 bg-white hover:bg-gray-100
                       rounded-lg transition-colors shadow-sm"
            title="清空"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>
            {wordCount} 词 · {charCount} 字符
          </span>
        </div>
        {text && (
          <span className="text-green-600 font-medium">
            ✓ 内容已就绪
          </span>
        )}
      </div>

      {text.length > 10000 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700">
            ⚠️ 文本较长,生成时间可能会增加
          </p>
        </div>
      )}
    </div>
  );
}
