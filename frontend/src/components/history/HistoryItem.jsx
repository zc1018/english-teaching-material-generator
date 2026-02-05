import { Clock, Trash2, FileText } from 'lucide-react';

export default function HistoryItem({ item, onLoad, onDelete }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-800 truncate mb-1.5 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h4>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {item.preview}
          </p>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{formatDate(item.timestamp)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              <span>{item.config.level}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onLoad(item)}
            className="px-4 py-1.5 text-xs bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition-all shadow-sm shadow-indigo-100"
          >
            加载
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
