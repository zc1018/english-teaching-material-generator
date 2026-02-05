# 英语教材生成器

一个基于 AI 的英语教学材料生成工具,可以将任何文档、网页或文本转换为结构化的英语教学材料。

## 功能特性

- 📄 **多种输入方式**: 支持文件上传(Word/PDF/TXT/HTML)、文本粘贴、URL提取
- 🎯 **灵活配置**: 支持6个难度级别(A1-C2)、词汇量范围、学习目标等自定义配置
- 🤖 **AI 生成**: 使用 Claude AI 自动生成9个章节的完整教学材料
- 📥 **多种导出**: 支持导出为 PDF、PNG 图片、HTML 文件
- 📚 **历史记录**: 本地保存生成历史,快速加载历史教材

## 技术栈

### 后端
- Node.js + Express
- @anthropic-ai/sdk (Claude AI)
- Multer (文件上传)
- Cheerio (HTML解析)
- Mammoth (Word文档解析)
- PDF-parse (PDF解析)

### 前端
- React 19 + Vite 7
- Tailwind CSS 4
- React Dropzone (文件上传)
- Marked (Markdown渲染)
- html-to-image (图片导出)
- jsPDF (PDF导出)
- Lucide React (图标库)

## 项目结构

```
英语教材生成器/
├── backend/          # 后端服务
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/         # 前端应用
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 开发进度

- [x] 项目初始化
- [ ] 后端API开发
- [ ] 前端界面开发
- [ ] AI集成
- [ ] 导出功能
- [ ] 历史记录
- [ ] 测试与优化
- [ ] 部署上线

## 开始使用

### 后端启动

```bash
cd backend
npm install
npm run dev
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

## 环境变量

后端需要配置以下环境变量:

```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```

## 许可证

MIT
