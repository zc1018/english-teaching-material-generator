import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import InputTabs from './components/input/InputTabs';
import FileUploadZone from './components/input/FileUploadZone';
import TextPasteArea from './components/input/TextPasteArea';
import URLExtractor from './components/input/URLExtractor';
import ConfigPanel from './components/config/ConfigPanel';
import ProcessingModal from './components/processing/ProcessingModal';
import MaterialPreview from './components/output/MaterialPreview';
import HistorySidebar from './components/history/HistorySidebar';
import { Sparkles, History } from 'lucide-react';
import { generateMaterial } from './services/aiService';
import { saveMaterial } from './utils/localStorage';

function App() {
  const [activeTab, setActiveTab] = useState('file');
  const [content, setContent] = useState('');
  const [config, setConfig] = useState({
    level: 'B1',
    vocabRange: '2000-4000',
    goals: ['词汇', '语法'],
    outputLanguage: '中文',
    subtitleFormat: '纯文本',
    style: '完整版'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [progress, setProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedMarkdown('');
    setCurrentText('');
    setProgress(0);

    let fullText = '';

    try {
      await generateMaterial(
        content,
        config,
        // onChunk
        (chunk) => {
          fullText += chunk;
          setCurrentText(fullText);
          // 简单的进度估算
          const estimatedProgress = Math.min(95, (fullText.length / 5000) * 100);
          setProgress(Math.round(estimatedProgress));
        },
        // onComplete
        () => {
          setProgress(100);
          setGeneratedMarkdown(fullText);
          setIsGenerating(false);
          // 保存到历史记录
          try {
            saveMaterial({
              content,
              config,
              markdown: fullText
            });
          } catch (error) {
            console.error('Save to history failed:', error);
          }
        },
        // onError
        (error) => {
          console.error('Generation error:', error);
          alert('生成失败: ' + error.message);
          setIsGenerating(false);
        }
      );
    } catch (error) {
      console.error('Generation error:', error);
      alert('生成失败: ' + error.message);
      setIsGenerating(false);
    }
  };

  const handleLoadMaterial = (item) => {
    setContent(item.content);
    setConfig(item.config);
    setGeneratedMarkdown(item.markdown);
    setActiveTab('text');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Header onShowHistory={() => setShowHistory(true)} />

        <main className="bento-card rounded-3xl p-10 mb-8">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
            输入内容
          </h2>

          <InputTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-8">
            {activeTab === 'file' && (
              <FileUploadZone onFileContent={handleContentChange} />
            )}
            {activeTab === 'text' && (
              <TextPasteArea onTextContent={handleContentChange} />
            )}
            {activeTab === 'url' && (
              <URLExtractor onUrlContent={handleContentChange} />
            )}
          </div>

          {content && (
            <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest text">Preview</p>
              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium">
                {content.substring(0, 200)}...
              </p>
            </div>
          )}
        </main>

        {content && (
          <div className="bento-card rounded-3xl p-10 mb-8">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
              配置选项
            </h2>
            <ConfigPanel config={config} onChange={setConfig} />

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-10 py-5 bg-primary-500 text-white rounded-2xl font-bold text-lg
                           shadow-xl shadow-indigo-200 hover:bg-primary-600 hover:-translate-y-1
                           transition-all active:translate-y-0 active:shadow-indigo-100
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                <span>{isGenerating ? '生成中...' : '生成教材'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 处理中模态框 */}
        <ProcessingModal
          isOpen={isGenerating}
          onClose={() => setIsGenerating(false)}
          progress={progress}
          currentText={currentText}
        />

        {/* 教材预览 */}
        {generatedMarkdown && (
          <MaterialPreview markdown={generatedMarkdown} />
        )}

        {/* 历史侧边栏 */}
        <HistorySidebar
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onLoadMaterial={handleLoadMaterial}
        />

        <Footer />
      </div>
    </div>
  );
}

export default App;
