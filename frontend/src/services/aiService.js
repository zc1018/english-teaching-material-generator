import { API_BASE_URL } from '../constants/config';

/**
 * 生成教材 (流式响应)
 * @param {string} content - 原始内容
 * @param {object} config - 配置选项
 * @param {function} onChunk - 接收文本片段的回调
 * @param {function} onComplete - 完成时的回调
 * @param {function} onError - 错误时的回调
 */
export async function generateMaterial(content, config, onChunk, onComplete, onError) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, config })
    });

    if (!response.ok) {
      throw new Error('生成失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'text') {
              onChunk(data.content);
            } else if (data.type === 'done') {
              onComplete();
              return;
            } else if (data.type === 'error') {
              onError(new Error(data.error));
              return;
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error);
  }
}
