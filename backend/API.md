# 后端 API 文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`

## API 端点

### 1. 健康检查

```
GET /health
```

**响应**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### 2. 文件上传

```
POST /api/files/upload
```

**请求**:
- Content-Type: `multipart/form-data`
- Body: `file` (文件字段)

**支持的文件类型**:
- PDF (`.pdf`)
- Word (`.doc`, `.docx`)
- 纯文本 (`.txt`)
- HTML (`.html`)

**响应**:
```json
{
  "success": true,
  "filename": "document.pdf",
  "content": "解析后的文本内容...",
  "size": 102400
}
```

---

### 3. URL 内容提取

```
POST /api/content/extract-url
```

**请求**:
```json
{
  "url": "https://example.com/article"
}
```

**响应**:
```json
{
  "success": true,
  "url": "https://example.com/article",
  "title": "文章标题",
  "content": "提取的文本内容..."
}
```

---

### 4. 生成教材 (流式响应)

```
POST /api/ai/generate
```

**请求**:
```json
{
  "content": "要生成教材的原始内容...",
  "config": {
    "level": "B1",
    "vocabRange": "2000-4000",
    "goals": ["词汇", "语法", "听力"],
    "outputLanguage": "中文",
    "subtitleFormat": "纯文本",
    "style": "完整版"
  }
}
```

**配置参数说明**:
- `level`: 难度级别 (A1, A2, B1, B2, C1, C2)
- `vocabRange`: 词汇量范围 (1000-2000, 2000-4000, 4000-6000, 6000-10000, 10000+)
- `goals`: 学习目标数组 (听力, 口语, 词汇, 语法, 写作, 演讲表达)
- `outputLanguage`: 输出语言 (中文, 英文, 双语)
- `subtitleFormat`: 字幕格式 (SRT, 纯文本)
- `style`: 输出风格 (完整版, 简化版)

**响应** (Server-Sent Events):
```
data: {"type":"text","content":"生成的内容片段..."}

data: {"type":"text","content":"更多内容..."}

data: {"type":"done"}
```

**错误响应**:
```
data: {"type":"error","error":"错误信息"}
```

---

## 错误处理

所有错误响应格式:
```json
{
  "error": "错误描述信息"
}
```

常见错误码:
- `400`: 请求参数错误
- `404`: 资源不存在
- `408`: 请求超时
- `500`: 服务器内部错误

---

## 使用示例

### JavaScript (Fetch API)

#### 上传文件
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/files/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.content);
```

#### 提取URL内容
```javascript
const response = await fetch('http://localhost:3000/api/content/extract-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});

const data = await response.json();
console.log(data.content);
```

#### 生成教材 (流式)
```javascript
const response = await fetch('http://localhost:3000/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: '原始内容...',
    config: {
      level: 'B1',
      vocabRange: '2000-4000',
      goals: ['词汇', '语法'],
      outputLanguage: '中文',
      style: '完整版'
    }
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.type === 'text') {
        console.log(data.content);
      } else if (data.type === 'done') {
        console.log('生成完成');
      }
    }
  }
}
```
