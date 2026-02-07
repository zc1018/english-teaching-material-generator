/**
 * 生成教材生成的提示词
 * @param {string} content - 原始内容
 * @param {object} config - 用户配置
 * @returns {string} - 完整的提示词
 */
/**
 * 生成教材生成的提示词
 * @param {string} content - 原始内容
 * @param {object} config - 用户配置
 * @returns {string} - 完整的提示词
 */
export function generatePrompt(content, config = {}) {
  const {
    level = '中高 B2',
    vocabRange = '6000–10000',
    goals = ['听力', '口语', '词汇'],
    outputLanguage = '解释为中英双语',
    style = '完整版'
  } = config;

  const goalsText = Array.isArray(goals) ? goals.join('] [') : goals;

  return `英语学习包生成

你现在是一名双语英语教练与教学设计师，擅长把长篇内容拆解成系统化学习包。请严格按下述「参数区」和「输出要求」生成内容。

**重要：所有英文内容必须紧跟中文翻译，格式为 "English text (中文翻译)"**

- 学习者水平

[${level}]

- 词汇量：

[${vocabRange}]

- 学习目标：[${goalsText}]

- 输出语言偏好： [双语 - 所有英文必须有中文翻译]

- 输出风格：[${style}]

【处理规则】

1) 清洗与切分：自动去除时间码/噪音（如"[Applause]"），按语义切分为句块（≤18词/块），保留关键原句。

2) 难度自适应：用你在「参数区」的水平/词汇量控制：

- 选择生词/短语时，覆盖率不超过学习者词汇量 10–15%；

- 例句给出三档重写：Simple（降级）、Natural（原生）、Stretch（略超出难度）。

3) 数量配额（总时长 ≤10 分钟：精词 12–18 个；>10 分钟：精词 20–30 个），短语/句型 8–12 组。

4) 引用标注：凡来自原字幕的例句，请在行尾标注时间码（若可用）。

5) 评估与练习：所有题目给出标准答案与简短解析；若选择"隐藏答案"，用可折叠块呈现。

6) **双语格式要求**：
   - 所有英文句子后必须紧跟中文翻译，格式：English sentence. (中文翻译。)
   - 标题格式：English Title (中文标题)
   - 列表项格式：English item (中文项)
   - 确保每一句英文都有对应的中文翻译

7) 统一格式：使用 Markdown 标题与表格，所有表头为中英双语。

【输出要求（严格按以下结构依次输出）】

# 0. 参数回显 (Parameter Echo)

- Level: … Vocabulary: … Goals: … Duration: …

- 难度评分 (Difficulty Score)：0–100 与一句话策略 (Strategy)：…

# 1. 内容总览 (Overview)

**内容摘要 (Summary)**

This talk explores... (本演讲探讨...)

The speaker argues that... (演讲者认为...)

**关键词 (Keywords)**: word1 (词1), word2 (词2), word3 (词3)

**核心观点 (Key Points)**:
1. First point. (第一点。)
2. Second point. (第二点。)
3. Third point. (第三点。)

# 2. 核心词汇表 (Core Vocabulary)

| Word | IPA | POS | 中文义项 | 常见搭配 Collocations | 原文例句 | 教师例句 |
|---|---|---|---|---|---|---|

> 词汇选择含：学术/演讲用语、高频动词短语、易错近义词；如有派生形/词缀，一并列出。

# 3. 高频短语与句型 (Phrases & Patterns)

| 表达 | 用法说明 | 变体/同义替换 | 原文摘录 | 迁移例句 |
|---|---|---|---|---|

# 4. 语法与表达微课 (Mini-Lessons)

**1. Grammar Point (语法点)**
- Rule: ... (规则：...)
- Example: English example. (中文例句。)
- Explanation: ... (解释：...)

**2. Expression Pattern (表达模式)**
- Pattern: ... (模式：...)
- Usage: ... (用法：...)

# 5. 听力训练 (Listening)

**听前热身 (Warm-up)**
1. Question 1? (问题1？)
2. Question 2? (问题2？)
3. Question 3? (问题3？)

**听中填空 (Gap Fill)**
"The future is not just about [____], it is about [____]."
"未来不仅关乎[____]，更关乎[____]。"

<details><summary>答案与解析 (Key)</summary>
Answer 1 (答案1), Answer 2 (答案2)
</details>

**细节判断 (True/False)**
1. Statement 1. (陈述1。) - True/False
2. Statement 2. (陈述2。) - True/False

<details><summary>答案与定位 (Key)</summary>
1. True - Explanation (解释)
2. False - Explanation (解释)
</details>

# 6. 口语与写作 (Speaking & Writing)

**复述提纲 (Retelling Outline)**
- Introduction: ... (引言：...)
- Body: ... (主体：...)
- Conclusion: ... (结论：...)

**即兴演讲 (Impromptu)**
Topic: "My Ideal Teacher" (话题："我理想的老师")
Use these words: mentor (导师), guide (引导), inspire (激励)

**写作任务 (Writing Task)**
Write a paragraph about... (写一段关于...的文字)
Opening sentence: ... (开头句：...)

# 7. 场景扩展与模拟对话 (Scenarios & Dialogues)

**扩展情景 (Extended Scenario)**: Discussing a TED Talk with a friend (与朋友讨论TED演讲)

**模拟对话 (Dialogue)**
**A**: Did you watch that TED talk? (你看了那个TED演讲吗？)
**B**: Yes, it was fascinating! (看了，太精彩了！)
**A**: I agree. The part about AI was interesting. (我同意。关于AI的部分很有趣。)

<details><summary>中英对照稿 (Transcript)</summary>

**A**: Did you watch that TED talk? (你看了那个TED演讲吗？)
**B**: Yes, it was fascinating! (看了，太精彩了！)

</details>

# 8. 跟读与语音 (Shadowing & Prosody)

**断句稿 (Script)**
We need / to **reimagine** / what school / **could be**.
我们需要 / **重新想象** / 学校 / **可以是什么样**。

**语音要点 (Tips)**
1. **reimagine**: Secondary stress on "re". (**reimagine**："re"有次重音。)
2. **could be**: Link the "d" and "b". (**could be**：连读"d"和"b"。)

# 9. 巩固复习材料 (Review Kit)

**Anki 卡片 (Flashcards)**
- Front: revolution; Back: 革命 (revolution)
- Front: potential; Back: 潜力 (potential)

**7天计划 (7-Day Plan)**
- Day 1: Watch talk without subtitles. (第1天：无字幕观看演讲。)
- Day 2: Learn Core Vocabulary. (第2天：学习核心词汇。)
- Day 3: Practice listening exercises. (第3天：练习听力练习。)

**教材生成完成！(Material Generation Complete!)**

【质量校验】

- 术语准确、例句地道、避免直译；不得虚构 TED 原文内容；所有来自原文的句子标注时间码（如可用）。

- 难度与长度严格服从「参数区」。

- **所有英文内容必须有中文翻译，格式为 "English (中文)"**

- 若输入为双语字幕，请以英文为准生成内容，中文仅用于解释。

【输入区】

<<<TED_TRANSCRIPT_START

${content}

TED_TRANSCRIPT_END>>>

（结束）

生成 Ted 风格的中英文页面`;
}
