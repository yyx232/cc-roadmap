// ============================================================
// CC学习路线推荐系统 - 学生版
// ============================================================

// ---------- 配置 ----------
const DEEPSEEK_API_KEY = 'DEEPSEEK_API_KEY_PLACEHOLDER';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// ---------- 问卷数据 ----------
const questions = [
    {
        id: 'major',
        title: '你目前在读什么专业/方向？',
        options: [
            { value: 'cs', label: '计算机 / 软件 / AI 相关' },
            { value: 'engineering', label: '理工科（非计算机）' },
            { value: 'business', label: '商科 / 经管' },
            { value: 'humanities', label: '文科 / 社科' },
            { value: 'art', label: '艺术 / 设计' },
            { value: 'other', label: '其他' },
        ]
    },
    {
        id: 'year',
        title: '你目前几年级？',
        options: [
            { value: 'freshman', label: '大一' },
            { value: 'sophomore', label: '大二' },
            { value: 'junior', label: '大三' },
            { value: 'senior', label: '大四' },
            { value: 'grad', label: '研究生' },
            { value: 'graduated', label: '已毕业' },
        ]
    },
    {
        id: 'tech_level',
        title: '你对编程/技术的熟悉程度？',
        options: [
            { value: 'zero', label: '完全零基础，没写过代码' },
            { value: 'beginner', label: '会一点（写过简单代码 / 跟着教程做过）' },
            { value: 'intermediate', label: '比较熟练（能独立完成小项目）' },
            { value: 'advanced', label: '很熟练（有实习或工作经验）' },
        ]
    },
    {
        id: 'cc_knowledge',
        title: '你了解或使用过 Claude Code 吗？',
        options: [
            { value: 'never', label: '从没听说过' },
            { value: 'heard', label: '听说过但没用过' },
            { value: 'tried', label: '用过几次' },
            { value: 'regular', label: '经常使用' },
        ]
    },
    {
        id: 'goal',
        title: '你最想用 AI 工具达成什么目标？',
        options: [
            { value: 'job', label: '找个好工作 / 实习' },
            { value: 'side_income', label: '赚点零花钱 / 副业收入' },
            { value: 'efficiency', label: '提升学习效率，考试/论文/作业' },
            { value: 'project', label: '做一个自己的项目 / 产品' },
            { value: 'explore', label: '纯好奇，想了解一下' },
        ]
    },
    {
        id: 'time',
        title: '你每周能投入多少时间来学习？',
        options: [
            { value: 'minimal', label: '不到 2 小时' },
            { value: 'low', label: '2-5 小时' },
            { value: 'medium', label: '5-10 小时' },
            { value: 'high', label: '10 小时以上' },
        ]
    },
];

// ---------- 知识路线库 ----------
// 根据关键维度匹配路线节点
const routeLibrary = {
    // 技术基础 → 学习起点
    startingPoint: {
        zero: { level: '入门', desc: '从零开始认识AI工具', timeEstimate: '2周' },
        beginner: { level: '基础', desc: '已经会一点编程，直接上手CC', timeEstimate: '1周' },
        intermediate: { level: '进阶', desc: '跳过基础，直接学工作流和自动化', timeEstimate: '3天' },
        advanced: { level: '高级', desc: '直接学高阶玩法和变现路径', timeEstimate: '1天' },
    },
    // 目标 → 学习重点
    focusByGoal: {
        job: {
            title: '就业导向',
            milestones: [
                '用CC做一个能写进简历的项目（2周内）',
                '学会用CC准备面试（模拟面试、刷题辅助）',
                '在GitHub上建立你的CC项目展示',
                '找实习/校招时把CC技能写进简历',
            ],
            moneyPath: '找到AI相关实习/工作后，薪资比传统岗位高30-50%',
            tags: ['就业', '项目实战', '简历'],
        },
        side_income: {
            title: '副业导向',
            milestones: [
                '学会CC基础操作（1周）',
                '找到你的专业+CC的结合点（你学什么专业就用CC做什么）',
                '在闲鱼/淘宝/朋友圈接小单（帮人写代码、做网站、处理数据）',
                '积累3-5个案例后提价，从50元/单做到500元/单',
            ],
            moneyPath: '起步接小单（50-200元/单）→ 积累作品 → 提价到500-2000元/单',
            tags: ['副业', '接单', '变现'],
        },
        efficiency: {
            title: '效率导向',
            milestones: [
                '学会用CC处理你的课程作业（写论文大纲、整理笔记、做题）',
                '搭建个人知识管理系统（用CC整理你的学习资料）',
                '用在考试复习上（让CC给你出题、讲解错题）',
                '学会后成为班里"最会用AI的人"',
            ],
            moneyPath: '效率提升后腾出时间，可以接单或做项目赚零花钱',
            tags: ['学习', '效率', '在校'],
        },
        project: {
            title: '项目导向',
            milestones: [
                '学CC基础（跳过细节，直接上手做东西）',
                '用CC从零搭一个你的想法（网站/工具/自动化脚本）',
                '发布到GitHub → 写成文章发到知乎/掘金',
                '有用户反馈后迭代 → 变成一个真正的产品',
            ],
            moneyPath: '项目做出来了 → 开源赚影响力 / 收费赚第一桶金',
            tags: ['项目', '产品', '创造'],
        },
        explore: {
            title: '探索导向',
            milestones: [
                '先用CC做一个你感兴趣的小东西（比如自动化整理文件、生成报告）',
                '体验后决定：继续深入还是到此为止',
                '如果感兴趣，切换到上面任意一条路线',
            ],
            moneyPath: '先体验再决定方向',
            tags: ['入门', '体验', '探索'],
        },
    },
    // CC了解程度 → 入门步骤
    ccEntry: {
        never: '先看CC是啥：一个AI编程助手，你跟它说话它帮你写代码/做项目/赚钱。安装只需一条命令。',
        heard: '你已经知道CC了，下一步是装上它、跑起来。我推荐从做一个"你自己的小工具"开始。',
        tried: '你用过几次但可能没找到感觉。你需要的是一个完整项目经历——从头到尾做出来一个东西。',
        regular: '你已经是熟练用户了。下一步是学工作流自动化、接单变现、或者教别人。',
    },
};

// ---------- 状态 ----------
let currentQuestion = 0;
let answers = {};

// ---------- 页面导航 ----------
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ---------- 问卷逻辑 ----------
function startQuiz() {
    answers = {};
    currentQuestion = 0;
    showPage('page-quiz');
    renderQuestion();
    updateProgress();
}

function renderQuestion() {
    const q = questions[currentQuestion];
    const area = document.getElementById('question-area');
    const selectedValue = answers[q.id] || '';

    area.innerHTML = `
        <div class="question-title">${currentQuestion + 1}. ${q.title}</div>
        ${q.options.map(opt => `
            <button class="option ${selectedValue === opt.value ? 'selected' : ''}"
                    onclick="selectOption('${q.id}', '${opt.value}')">
                ${opt.label}
            </button>
        `).join('')}
    `;

    document.getElementById('btn-back').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    const btnNext = document.getElementById('btn-next');
    btnNext.textContent = currentQuestion === questions.length - 1 ? '查看我的路线 →' : '下一题 →';
    btnNext.disabled = !selectedValue;
    updateProgress();
}

function selectOption(qId, value) {
    answers[qId] = value;
    renderQuestion();
}

function nextQuestion() {
    if (!answers[questions[currentQuestion].id]) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        // 完成问卷
        showPage('page-loading');
        generateRoute();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function updateProgress() {
    const answered = Object.keys(answers).length;
    const pct = (answered / questions.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('step-indicator').textContent =
        `第 ${currentQuestion + 1} / ${questions.length} 题`;
}

// ---------- 本地路线生成 ----------
function generateLocalRoute() {
    const start = routeLibrary.startingPoint[answers.tech_level] || routeLibrary.startingPoint.zero;
    const focus = routeLibrary.focusByGoal[answers.goal] || routeLibrary.focusByGoal.explore;
    const ccEntry = routeLibrary.ccEntry[answers.cc_knowledge] || routeLibrary.ccEntry.never;

    const yearUrgency = ['senior', 'grad', 'graduated'].includes(answers.year) ? '高' : '正常';
    const timeAvailable = answers.time;

    return { start, focus, ccEntry, yearUrgency, timeAvailable };
}

// ---------- DeepSeek API 调用 ----------
async function callDeepSeek(systemPrompt, userMessage) {
    if (DEEPSEEK_API_KEY === 'YOUR_DEEPSEEK_API_KEY_HERE') {
        return null; // 未配置API Key，使用本地路线
    }
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-v4-flash',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage },
                ],
                thinking: { type: 'disabled' },
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (err) {
        console.error('DeepSeek API error:', err);
        return null;
    }
}

async function generateRoute() {
    const local = generateLocalRoute();

    // 构建用户画像（人类可读）
    const labels = {
        major: {cs:'计算机/AI相关', engineering:'理工科(非计算机)', business:'商科/经管', humanities:'文科/社科', art:'艺术/设计', other:'其他'},
        year: {freshman:'大一', sophomore:'大二', junior:'大三', senior:'大四', grad:'研究生', graduated:'已毕业'},
        tech_level: {zero:'完全零基础，没写过代码', beginner:'会一点，跟教程写过', intermediate:'能独立完成小项目', advanced:'有实习或工作经验'},
        cc_knowledge: {never:'从没听说过CC', heard:'听说过但没用过', tried:'用过几次', regular:'经常使用'},
        goal: {job:'找好工作/实习', side_income:'赚零花钱/副业', efficiency:'提升学习效率', project:'做自己的项目', explore:'探索了解'},
        time: {minimal:'每周不到2小时', low:'每周2-5小时', medium:'每周5-10小时', high:'每周10小时以上'},
    };

    const profileSummary = `
【用户画像】
- 专业方向：${labels.major[answers.major] || answers.major}
- 年级：${labels.year[answers.year] || answers.year}
- 编程水平：${labels.tech_level[answers.tech_level] || answers.tech_level}
- Claude Code了解程度：${labels.cc_knowledge[answers.cc_knowledge] || answers.cc_knowledge}
- 主要目标：${labels.goal[answers.goal] || answers.goal}
- 可投入时间：${labels.time[answers.time] || answers.time}
    `.trim();

    const systemPrompt = `你是一个帮助大学生学习Claude Code的实战导师。用户是一所中国大学的在读学生。你的任务是根据用户的真实情况，给出一条只有TA能走的、不和别人重复的学习路线。

【红线——以下内容绝对不能出现】
- "安装Node.js和Git"——这属于环境搭建基础，不需要你说
- "写一个Hello World脚本"——太简单，没价值
- "写一个待办事项应用"——烂大街的教程项目，没有个性化
- "上传GitHub作作品集"——每个学生都知道的事
- 任何像通用教程一样的话

【你必须做到的】
1. 结合用户的专业：如果用户学的是化学，就不要让他做网页；如果学的是设计，就教他用CC生成设计稿。专业和CC必须有交叉点。
2. 根据用户的年级给不同建议：大一大二侧重探索+积累，大三侧重实习作品，大四侧重就业变现。
3. 根据技术水平调整起点：零基础从"让CC帮你做你本来就在做的事"开始；有基础的直接跳到工作流变现。
4. 路径要窄：不要给5条路让用户选，给1条最适合TA的路。
5. 每一步都要有"为什么这一步适合TA"的理由，不是光说做什么。
6. 给的例子要带TA的专业背景。比如给数学系的例子是"用CC做数据建模"，给中文系的是"用CC做文本分析"。
7. 回复控制在300字以内。不要废话。不要客套。直接给路线。`;

    const aiAnalysis = await callDeepSeek(systemPrompt, profileSummary);

    // 渲染结果
    renderResult(local, aiAnalysis);
}

function renderResult(local, aiAnalysis) {
    showPage('page-result');
    const container = document.getElementById('result-content');

    const goalLabels = {
        job: '找个好工作/实习', side_income: '赚零花钱/副业', efficiency: '提升学习效率',
        project: '做一个自己的项目', explore: '探索了解',
    };

    const majorLabels = {
        cs: '计算机/AI', engineering: '理工科', business: '商科/经管',
        humanities: '文科/社科', art: '艺术/设计', other: '其他',
    };

    const techLabels = {
        zero: '零基础', beginner: '有基础', intermediate: '熟练', advanced: '很熟练',
    };

    let html = '';

    // 用户画像摘要
    html += `<div class="route-block">
        <h3>📌 你的画像</h3>
        <p>${majorLabels[answers.major] || answers.major} · ${techLabels[answers.tech_level] || answers.tech_level} · 目标：${goalLabels[answers.goal] || answers.goal}</p>
        <p>${local.ccEntry}</p>
    </div>`;

    // 本地路线
    html += `<div class="route-block">
        <h3>🗺️ 你的路线：${local.focus.title}</h3>
        <p><strong>起点：</strong>${local.start.desc}（预计${local.start.timeEstimate}）</p>
        <p><strong>关键里程碑：</strong></p>
        <ul>${local.focus.milestones.map(m => `<li>${m}</li>`).join('')}</ul>
        <p><strong>💰 变现路径：</strong>${local.focus.moneyPath}</p>
        <div style="margin-top:12px;">
            ${local.focus.tags.map(t => `<span class="tag tag-purple">${t}</span>`).join('')}
            <span class="tag tag-yellow">每周${answers.time}</span>
            <span class="tag tag-blue">紧迫度：${local.yearUrgency}</span>
        </div>
    </div>`;

    // AI深度分析（如果有）
    if (aiAnalysis) {
        html += `<div class="route-block">
            <h3>🤖 AI深度分析</h3>
            <div style="white-space: pre-wrap;">${aiAnalysis}</div>
        </div>`;
    } else {
        html += `<div class="route-block" style="border-color: #3a3020;">
            <h3>⚠️ AI分析未启用</h3>
            <p style="color:#909090;">DeepSeek API Key 未配置。以上路线基于知识库生成，如需AI深度分析，请配置 API Key。</p>
            <p style="color:#707070;font-size:0.85rem;">获取 API Key：<a href="https://platform.deepseek.com/api_keys" style="color:#6c5ce7;" target="_blank">platform.deepseek.com/api_keys</a></p>
        </div>`;
    }

    // 下一步行动
    html += `<div class="route-block">
        <h3>⚡ 现在就开始</h3>
        <p><strong>第一步（今天）：</strong>${getFirstStep()}</p>
        <p><strong>本周目标：</strong>${getWeekGoal()}</p>
    </div>`;

    container.innerHTML = html;
}

function getFirstStep() {
    const cc = answers.cc_knowledge;
    if (cc === 'never' || cc === 'heard') {
        return '在你的电脑上安装Claude Code。打开终端，运行：npm install -g @anthropic-ai/claude-code，然后输入 claude 启动。';
    }
    if (cc === 'tried') {
        return '想一个小任务——比如"帮我整理这个学期的课程表，生成一个网页版的"。然后打开CC，把你的需求告诉它。';
    }
    return '在CC里输入：/skills，看看你现在有哪些能力。然后想一个你专业相关的问题，用CC来辅助解决。';
}

function getWeekGoal() {
    const goal = answers.goal;
    if (goal === 'job') return '用CC做一个能放进简历的小项目，推到GitHub上。';
    if (goal === 'side_income') return '在闲鱼或朋友圈发一个"AI辅助编程"的服务帖，接到第一个单。';
    if (goal === 'efficiency') return '用CC完成一门课的期末作业，从大纲到终稿全程用AI辅助。';
    if (goal === 'project') return '用CC从零搭建一个网页/工具，部署上线，可以发给朋友看。';
    return '用CC做一件你感兴趣的事，然后决定要不要深入。';
}

// ---------- 搜索功能 ----------
async function searchHelp() {
    const query = document.getElementById('search-input').value.trim();
    const resultDiv = document.getElementById('search-result');

    if (!query) {
        resultDiv.innerHTML = '<p style="color:#707070;">输入你遇到的问题，我来搜索解决方案。</p>';
        return;
    }

    resultDiv.innerHTML = '<p style="color:#707070;">🔍 搜索中...</p>';

    if (DEEPSEEK_API_KEY === 'YOUR_DEEPSEEK_API_KEY_HERE') {
        resultDiv.innerHTML = `<p style="color:#ff9800;">⚠️ 需要配置 DeepSeek API Key 才能使用搜索功能。</p>
            <p style="color:#707070;font-size:0.85rem;">获取免费额度：<a href="https://platform.deepseek.com/api_keys" style="color:#6c5ce7;" target="_blank">platform.deepseek.com/api_keys</a></p>`;
        return;
    }

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-v4-flash',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个帮助学生学习Claude Code的助手。根据用户的问题，给出具体、可操作的解决方案。如果问题超出你的知识范围，诚实告知并建议去哪里找答案。用中文回答，控制在300字以内。'
                    },
                    { role: 'user', content: query },
                ],
                thinking: { type: 'disabled' },
                temperature: 0.5,
                max_tokens: 1000,
            }),
        });
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || '搜索无结果，请换个问法试试。';
        resultDiv.innerHTML = `<strong>🔍 搜索结果：</strong><br><br>${answer.replace(/\n/g, '<br>')}`;
    } catch (err) {
        resultDiv.innerHTML = '<p style="color:#f44336;">搜索失败，请检查网络或API Key配置。</p>';
    }
}

// ---------- 工具函数 ----------
function restart() {
    answers = {};
    currentQuestion = 0;
    showPage('page-home');
}

function copyResult() {
    const content = document.getElementById('result-content').innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert('路线已复制到剪贴板！');
    }).catch(() => {
        alert('复制失败，请手动选中文字复制。');
    });
}

// 回车搜索
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchHelp();
        });
    }
});
