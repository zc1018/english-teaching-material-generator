import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { generatePrompt } from '../services/promptGenerator.js';

const router = express.Router();

// 配置 Anthropic 客户端
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
  baseURL: process.env.ANTHROPIC_BASE_URL
});

// 生成教材
router.post('/generate', async (req, res) => {
  let isClientDisconnected = false;
  let heartbeatInterval = null;

  try {
    const { content, config } = req.body;
    console.log('📋 Request received:', { contentLength: content?.length || 0, config });

    // 验证 content
    if (!content) {
      return res.status(400).json({ error: '缺少内容' });
    }

    if (typeof content !== 'string') {
      return res.status(400).json({ error: '内容必须是字符串' });
    }

    // 限制内容长度
    const maxContentLength = 50000;
    if (content.length > maxContentLength) {
      return res.status(400).json({
        error: `内容过长，最大支持 ${maxContentLength} 个字符，当前 ${content.length} 个字符`
      });
    }

    // 验证 API 配置
    if (!process.env.ANTHROPIC_AUTH_TOKEN) {
      console.error('❌ Missing ANTHROPIC_AUTH_TOKEN in .env');
      return res.status(500).json({ error: 'API 配置错误：缺少 API Key' });
    }

    // 生成提示词
    const prompt = generatePrompt(content, config);
    console.log('📝 Prompt generated, length:', prompt.length);

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    console.log('✅ SSE headers set');

    // 发送初始心跳
    res.write(': connected\n\n');
    console.log('💓 Initial heartbeat sent');

    // 设置定期心跳，保持连接活跃
    heartbeatInterval = setInterval(() => {
      if (!isClientDisconnected && !res.destroyed) {
        res.write(': heartbeat\n\n');
        console.log('💓 Heartbeat sent');
      }
    }, 5000);

    // 清理函数
    const cleanup = () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    };

    // 监听客户端断开连接
    req.on('close', () => {
      isClientDisconnected = true;
      cleanup();
      console.log('⚠️  Client disconnected, cleaned up');
    });

    console.log('🚀 调用 Claude API...');
    console.log('📖 配置:', {
      baseURL: process.env.ANTHROPIC_BASE_URL,
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929'
    });

    const apiStartTime = Date.now();

    // 使用 Anthropic SDK 调用 Claude API
    const stream = anthropic.messages.stream({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const apiResponseTime = Date.now() - apiStartTime;
    console.log(`✅ Claude API stream created, took ${apiResponseTime}ms`);

    // 添加更多事件监听
    stream.on('connect', () => {
      console.log('🔗 Stream connected');
    });

    stream.on('streamEvent', (event) => {
      console.log('📡 Stream event:', event.type);
    });

    stream.on('message', (message) => {
      console.log('📨 Message received:', message);
    });

    stream.on('contentBlock', (block) => {
      console.log('📦 Content block:', block);
    });

    // 处理流式响应
    stream.on('text', (text, snapshot) => {
      console.log('📝 Text chunk received, length:', text.length);
      console.log('🔍 Response status:', {
        resDestroyed: res.destroyed,
        resWritable: res.writable,
        headersSent: res.headersSent
      });

      // 移除 isClientDisconnected 检查，总是尝试发送
      if (!res.destroyed && res.writable) {
        try {
          const data = JSON.stringify({ type: 'text', content: text });
          console.log('📤 Writing data, length:', data.length);
          const writeResult = res.write(`data: ${data}\n\n`);
          console.log('✅ Write result:', writeResult);
        } catch (e) {
          console.error('❌ Error writing to response:', e);
        }
      } else {
        console.log('⚠️  Cannot write - response destroyed or not writable');
      }
    });

    stream.on('end', () => {
      cleanup();
      if (!res.destroyed && res.writable) {
        try {
          console.log('✅ Stream ended successfully');
          res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
          res.end();
        } catch (error) {
          console.error('Error ending response:', error);
        }
      }
    });

    stream.on('error', (error) => {
      cleanup();
      console.error('Stream error:', error);
      if (!isClientDisconnected) {
        try {
          if (!res.headersSent) {
            res.status(500).json({ error: error.message });
          } else {
            res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
            res.end();
          }
        } catch (e) {
          console.error('Error writing error to response:', e);
        }
      }
    });

  } catch (error) {
    console.error('Generate error:', error);
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else if (!isClientDisconnected) {
      try {
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
      } catch (e) {
        console.error('Error writing error to response:', e);
      }
    }
  }
});

export default router;
