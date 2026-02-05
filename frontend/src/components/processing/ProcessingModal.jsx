import { X, Loader } from 'lucide-react';

export default function ProcessingModal({ isOpen, onClose, progress, currentText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 max-w-3xl w-full max-h-[80vh] overflow-hidden border border-slate-100">
        {/* 头部 */}
        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Loader className="w-6 h-6 text-primary-500 animate-spin" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              正在生成教材...
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 进度条 */}
        <div className="p-8 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3 text-xs font-black text-slate-400 uppercase tracking-widest">
            <span>生成进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/20"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 实时内容 */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="prose prose-sm max-w-none">
            <div
              className="text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: currentText }}
            />
          </div>
        </div>

        {/* 提示 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            💡 AI正在根据您的配置生成教材,请稍候...
          </p>
        </div>
      </div>
    </div>
  );
}
