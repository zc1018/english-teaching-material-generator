import { Upload, FileText, Link } from 'lucide-react';

export default function InputTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'file', label: '文件上传', icon: Upload },
    { id: 'text', label: '文本粘贴', icon: FileText },
    { id: 'url', label: 'URL提取', icon: Link }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200
              ${isActive
                ? 'bg-primary-500 text-white shadow-lg shadow-indigo-100'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
