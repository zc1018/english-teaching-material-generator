import fs from 'fs/promises';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

/**
 * 解析上传的文件
 * @param {string} filePath - 文件路径
 * @param {string} mimeType - 文件MIME类型
 * @returns {Promise<string>} - 解析后的文本内容
 */
export async function parseFile(filePath, mimeType) {
  try {
    switch (mimeType) {
      case 'application/pdf':
        return await parsePDF(filePath);

      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await parseWord(filePath);

      case 'text/html':
        return await parseHTML(filePath);

      case 'text/plain':
        return await parsePlainText(filePath);

      default:
        throw new Error('不支持的文件类型');
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error(`文件解析失败: ${error.message}`);
  }
}

/**
 * 解析PDF文件
 */
async function parsePDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text.trim();
}

/**
 * 解析Word文档
 */
async function parseWord(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value.trim();
}

/**
 * 解析HTML文件
 */
async function parseHTML(filePath) {
  const html = await fs.readFile(filePath, 'utf-8');
  const $ = cheerio.load(html);

  // 移除脚本和样式
  $('script, style').remove();

  // 获取body内容
  const bodyHtml = $('body').html() || html;

  // 转换为Markdown
  const markdown = turndownService.turndown(bodyHtml);

  return markdown.trim();
}

/**
 * 解析纯文本文件
 */
async function parsePlainText(filePath) {
  const text = await fs.readFile(filePath, 'utf-8');
  return text.trim();
}
