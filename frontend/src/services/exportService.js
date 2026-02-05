import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * 导出为PNG图片
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {string} filename - 文件名
 */
export async function exportToPNG(element, filename = 'teaching-material.png') {
  try {
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Export to PNG failed:', error);
    throw new Error('导出图片失败');
  }
}

/**
 * 导出为PDF
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {string} filename - 文件名
 */
export async function exportToPDF(element, filename = 'teaching-material.pdf') {
  try {
    const canvas = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4宽度(mm)
    const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;

    pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Export to PDF failed:', error);
    throw new Error('导出PDF失败');
  }
}

/**
 * 导出为HTML文件
 * @param {string} content - HTML内容
 * @param {string} filename - 文件名
 */
export function exportToHTML(content, filename = 'teaching-material.html') {
  try {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>英语教材</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3 { color: #2563eb; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    code {
      background-color: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    @media print {
      body { max-width: 100%; }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
    `;

    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export to HTML failed:', error);
    throw new Error('导出HTML失败');
  }
}
