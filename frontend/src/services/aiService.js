import { API_BASE_URL } from '../constants/config';
import { parseSseData, parseSseEvents } from '../utils/sseParser.js';

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

    if (!response.body) {
      throw new Error('响应流不可用');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    console.log('[SSE] Stream reader started');

    while (true) {
      const { done, value } = await reader.read();
      console.log('[SSE] Read chunk:', { done, valueLength: value?.length });
      if (done) { console.log('[SSE] Stream done, exiting loop'); break; }

      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseEvents(buffer);
      buffer = parsed.rest;

      for (const eventData of parsed.events) {
        console.log('[SSE] Processing event data:', eventData.substring(0, 100));
        const data = parseSseData(eventData);
        if (!data) { console.log('[SSE] No data from parser'); continue; }
        console.log('[SSE] Parsed data type:', data.type);

        if (data.type === 'text') {
          console.log('[SSE] Received text chunk, length:', data.content?.length);
          onChunk(data.content ?? '');
        } else if (data.type === 'done') {
          console.log('[SSE] Received DONE signal, calling onComplete and returning');
          onComplete();
          return;
        } else if (data.type === 'error') {
          onError(new Error(data.error || '生成失败'));
          return;
        } else if (typeof data === 'string') {
          onChunk(data);
        }
      }
    }

    console.log('[SSE] Loop exited naturally, calling onComplete');
    onComplete();
  } catch (error) {
    onError(error);
  }
}
