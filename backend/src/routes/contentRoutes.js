import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { isUrlSafe } from '../utils/urlSafety.js';

const router = express.Router();
const turndownService = new TurndownService();

function createUnsafeError(message) {
  const error = new Error(message);
  error.status = 403;
  return error;
}

async function fetchWithRedirects(startUrl, requestOptions, maxRedirects = 3) {
  let currentUrl = startUrl;

  for (let i = 0; i <= maxRedirects; i += 1) {
    const safe = await isUrlSafe(currentUrl);
    if (!safe) {
      throw createUnsafeError('不允许访问该URL（安全限制）');
    }

    const response = await axios.get(currentUrl, {
      ...requestOptions,
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.location;
      if (!location) {
        const error = new Error('重定向缺少目标地址');
        error.status = 400;
        throw error;
      }
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return response;
  }

  const error = new Error('重定向次数过多');
  error.status = 400;
  throw error;
}

// 从URL提取内容
router.post('/extract-url', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: '缺少URL参数' });
    }

    // 验证URL格式和安全性
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: '无效的URL格式' });
    }

    // 获取网页内容（含重定向安全检查）
    const response = await fetchWithRedirects(url, {
      timeout: 10000,
      maxContentLength: 10 * 1024 * 1024, // 限制响应大小为 10MB
      maxBodyLength: 10 * 1024 * 1024,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 解析HTML
    const $ = cheerio.load(response.data);

    // 移除脚本和样式
    $('script, style, nav, header, footer, aside').remove();

    // 提取主要内容
    let content = '';
    const mainSelectors = ['article', 'main', '.content', '#content', '.post', '.entry'];

    for (const selector of mainSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.html();
        break;
      }
    }

    // 如果没有找到主要内容区域,使用body
    if (!content) {
      content = $('body').html();
    }

    // 转换为Markdown
    const markdown = turndownService.turndown(content);

    // 清理文本
    const cleanedText = markdown
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.json({
      success: true,
      url,
      title: $('title').text() || '',
      content: cleanedText
    });

  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      return res.status(404).json({ error: '无法访问该URL' });
    }
    if (error.code === 'ETIMEDOUT') {
      return res.status(408).json({ error: '请求超时' });
    }
    next(error);
  }
});

export default router;
