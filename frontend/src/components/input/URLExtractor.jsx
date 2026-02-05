import { useState } from 'react';
import { Link, Search, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function URLExtractor({ onUrlContent }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [extractedTitle, setExtractedTitle] = useState('');

  const handleExtract = async () => {
    if (!url.trim()) {
      setError('请输入URL');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/content/extract-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '提取失败');
      }

      const data = await response.json();
      setSuccess(true);
      setExtractedTitle(data.title);
      onUrlContent(data.content);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleExtract();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入网页URL (例如: https://example.com/article)"
            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl
                       focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 focus:outline-none
                       text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>
        <button
          onClick={handleExtract}
          disabled={loading || !url.trim()}
          className="px-8 py-3.5 bg-primary-500 text-white rounded-2xl font-bold
                     hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>提取中...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>提取内容</span>
            </>
          )}
        </button>
      </div>

      {success && extractedTitle && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-700">提取成功!</p>
            <p className="text-sm text-green-600 mt-1">{extractedTitle}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">提取失败</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 提示: 某些网站可能因为CORS限制无法直接提取。如果提取失败,请尝试复制网页内容到"文本粘贴"标签页。
        </p>
      </div>
    </div>
  );
}
