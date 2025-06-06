require('dotenv').config();
const express = require('express');
const {Client} = require('@notionhq/client');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({origin: 'https://matsu.rip/'}));
app.use(bodyParser.json());

const notion = new Client({auth: process.env.NOTION_KEY});
const databaseId = process.env.NOTION_DB;
const articlePageId = process.env.NOTION_AT;

// 检查所有必要的环境变量是否已设置
if (!process.env.NOTION_KEY || !process.env.NOTION_DB || !process.env.NOTION_AT) {
    console.error('错误: 请确保在你的 .env 文件中设置了 NOTION_KEY, NOTION_DB, 和 NOTION_AT。');
    process.exit(1); // 带着错误码退出进程
}

// 为状态值定义常量，避免硬编码字符串
const COMMENT_STATUS = {
    READ: 'Read',
    PENDING: 'Pending',
};

// --- 获取文章内容的路由 ---
app.get('/article', async (req, res) => {
    if (!articlePageId) {
        return res.status(500).json({message: '服务器未配置文章页面ID。'});
    }

    try {
        // 并发请求页面的属性和页面的内容块，以提高效率
        const [pageDetails, blocksResponse] = await Promise.all([
            notion.pages.retrieve({page_id: articlePageId}),
            notion.blocks.children.list({block_id: articlePageId})
        ]);

        // 1. 提取页面标题 (假设你的标题属性名为 'Name' 或 '标题')
        // 注意：这里的 'Name' 需要与你 Notion 页面中的标题属性名完全一致。
        const titleProperty = pageDetails.properties.Name || pageDetails.properties.标题;
        const title = titleProperty?.title[0]?.plain_text || '无标题';

        // 2. 提取并格式化页面内容块
        const content = blocksResponse.results.map(block => {
            const {type} = block;
            if (block[type] && block[type].rich_text) {
                const text = block[type].rich_text.map(rt => rt.plain_text).join('');
                return {type, text}; // 返回块的类型和组合后的文本内容
            }
            return {type, text: ''}; // 对于没有文本的块（如分隔线）
        });

        // 3. 组合成最终的文章对象
        const article = {
            id: pageDetails.id,
            title,
            content, // 这是一个包含了类型和文本的对象数组
        };

        res.json(article);

    } catch (err) {
        console.error('获取文章内容时出错:', err); // 在服务器端记录详细错误
        res.status(500).json({message: '获取文章内容失败。'});
    }
});


// --- 提交评论的路由 ---
app.post('/comment', async (req, res) => {
    const {username, content} = req.body;

    // 简单的输入验证
    if (!username || !content || username.trim() === '' || content.trim() === '') {
        return res.status(400).json({success: false, message: '用户名和内容不能为空！'});
    }

    try {
        const response = await notion.pages.create({
            parent: {database_id: databaseId},
            properties: {
                'Username': {title: [{text: {content: username}}]},
                'Content': {rich_text: [{text: {content}}]},
                'Date': {date: {start: new Date().toISOString()}},
                'Status': {select: {name: 'Pending'}}, // 直接使用字符串，与数据库一致
            },
        });
        res.json({success: true, id: response.id});
    } catch (err) {
        console.error("创建评论时出错:", err);
        res.status(500).json({success: false, message: '提交评论失败，请稍后再试。'});
    }
});

// --- 获取已批准评论的路由 ---
app.get('/comments', async (req, res) => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {property: 'Status', select: {equals: 'Read'}}, // 直接使用字符串 'Read'
            sorts: [{property: 'Date', direction: 'descending'}]
        });

        const comments = response.results.map(page => ({
            id: page.id,
            username: page.properties.Username.title[0]?.plain_text || '',
            content: page.properties.Content.rich_text[0]?.plain_text || '',
            date: page.properties.Date.date.start,
        }));
        res.json(comments);
    } catch (err) {
        console.error('获取评论时出错:', err);
        res.status(500).json({message: '获取评论失败。'});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`服务器正在端口 ${port} 上运行`));
