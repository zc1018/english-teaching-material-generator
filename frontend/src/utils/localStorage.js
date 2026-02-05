const STORAGE_KEY = 'teaching_materials_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * 保存教材到历史记录
 * @param {object} material - 教材数据
 * @returns {string} - 生成的ID
 */
export function saveMaterial(material) {
  try {
    const history = getHistory();
    const id = Date.now().toString();

    const newItem = {
      id,
      timestamp: Date.now(),
      title: generateTitle(material.content),
      content: material.content,
      config: material.config,
      markdown: material.markdown,
      preview: material.content.substring(0, 200)
    };

    // 添加到历史记录开头
    history.unshift(newItem);

    // 限制历史记录数量
    if (history.length > MAX_HISTORY_ITEMS) {
      history.splice(MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return id;
  } catch (error) {
    console.error('Save material error:', error);
    throw new Error('保存失败');
  }
}

/**
 * 获取所有历史记录
 * @returns {Array} - 历史记录数组
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Get history error:', error);
    return [];
  }
}

/**
 * 获取单个历史记录
 * @param {string} id - 记录ID
 * @returns {object|null} - 历史记录对象
 */
export function getMaterial(id) {
  try {
    const history = getHistory();
    return history.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Get material error:', error);
    return null;
  }
}

/**
 * 删除历史记录
 * @param {string} id - 记录ID
 */
export function deleteMaterial(id) {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Delete material error:', error);
    throw new Error('删除失败');
  }
}

/**
 * 清空所有历史记录
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Clear history error:', error);
    throw new Error('清空失败');
  }
}

/**
 * 生成标题
 * @param {string} content - 内容
 * @returns {string} - 标题
 */
function generateTitle(content) {
  const firstLine = content.split('\n')[0];
  const title = firstLine.substring(0, 50);
  return title || '未命名教材';
}

/**
 * 获取存储使用情况
 * @returns {object} - 存储信息
 */
export function getStorageInfo() {
  try {
    const history = getHistory();
    const dataSize = new Blob([JSON.stringify(history)]).size;
    return {
      count: history.length,
      size: dataSize,
      sizeFormatted: formatBytes(dataSize)
    };
  } catch (error) {
    return { count: 0, size: 0, sizeFormatted: '0 B' };
  }
}

/**
 * 格式化字节数
 * @param {number} bytes - 字节数
 * @returns {string} - 格式化后的字符串
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
