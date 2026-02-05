import { useState, useEffect } from 'react';
import { X, History, Trash2, Database } from 'lucide-react';
import HistoryItem from './HistoryItem';
import { getHistory, deleteMaterial, clearHistory, getStorageInfo } from '../../utils/localStorage';

export default function HistorySidebar({ isOpen, onClose, onLoadMaterial }) {
  const [history, setHistory] = useState([]);
  const [storageInfo, setStorageInfo] = useState({ count: 0, sizeFormatted: '0 B' });

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    const items = getHistory();
    const info = getStorageInfo();
    setHistory(items);
    setStorageInfo(info);
  };

  const handleDelete = (id) => {
    if (confirm('确定要删除这条记录吗?')) {
      deleteMaterial(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗?此操作不可恢复!')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleLoad = (item) => {
    onLoadMaterial(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* 侧边栏 */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 font-sans">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <History className="w-6 h-6 text-primary-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">历史记录</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 统计信息 */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Database className="w-4 h-4" />
              <span>{storageInfo.count} 条记录</span>
              <span className="text-gray-400">·</span>
              <span>{storageInfo.sizeFormatted}</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>清空</span>
              </button>
            )}
          </div>
        </div>

        {/* 历史列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center py-20">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无历史记录</p>
              <p className="text-sm text-gray-400 mt-2">
                生成的教材会自动保存在这里
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(item => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  onLoad={handleLoad}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
