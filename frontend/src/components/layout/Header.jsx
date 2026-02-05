import { BookOpen, History } from 'lucide-react';

export default function Header({ onShowHistory }) {
  return (
    <header className="bento-card rounded-2xl p-6 mb-8 border-none shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-500 p-3 rounded-xl shadow-indigo-200 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              英语教材生成器
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              把任何内容变成英语教材
            </p>
          </div>
        </div>
        <button
          onClick={onShowHistory}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          <History className="w-5 h-5 text-slate-500" />
          <span>历史记录</span>
        </button>
      </div>
    </header>
  );
}
