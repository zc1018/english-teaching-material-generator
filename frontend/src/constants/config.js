// API 基础配置
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 难度级别选项
export const LEVELS = [
  { value: 'A1', label: 'A1 - 初级', description: '基础词汇和简单句型' },
  { value: 'A2', label: 'A2 - 初中级', description: '日常对话和基本表达' },
  { value: 'B1', label: 'B1 - 中级', description: '工作和学习场景' },
  { value: 'B2', label: 'B2 - 中高级', description: '复杂话题和专业内容' },
  { value: 'C1', label: 'C1 - 高级', description: '流利表达和深度理解' },
  { value: 'C2', label: 'C2 - 精通', description: '接近母语水平' }
];

// 词汇量范围选项
export const VOCAB_RANGES = [
  { value: '1000-2000', label: '1000-2000', min: 1000, max: 2000 },
  { value: '2000-4000', label: '2000-4000', min: 2000, max: 4000 },
  { value: '4000-6000', label: '4000-6000', min: 4000, max: 6000 },
  { value: '6000-10000', label: '6000-10000', min: 6000, max: 10000 },
  { value: '10000+', label: '10000+', min: 10000, max: Infinity }
];

// 学习目标选项
export const LEARNING_GOALS = [
  { value: '听力', label: '听力', icon: '👂' },
  { value: '口语', label: '口语', icon: '🗣️' },
  { value: '词汇', label: '词汇', icon: '📚' },
  { value: '语法', label: '语法', icon: '📝' },
  { value: '写作', label: '写作', icon: '✍️' },
  { value: '演讲表达', label: '演讲表达', icon: '🎤' }
];

// 输出语言选项
export const OUTPUT_LANGUAGES = [
  { value: '中文', label: '中文' },
  { value: '英文', label: '英文' },
  { value: '双语', label: '双语' }
];

// 字幕格式选项
export const SUBTITLE_FORMATS = [
  { value: 'SRT', label: '带时间码(SRT)' },
  { value: '纯文本', label: '纯文本' }
];

// 输出风格选项
export const OUTPUT_STYLES = [
  { value: '完整版', label: '完整版', description: '详尽的内容和例句' },
  { value: '简化版', label: '简化版', description: '精简的重点内容' }
];

// 文件类型限制
export const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/html': ['.html']
};

// 文件大小限制 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
