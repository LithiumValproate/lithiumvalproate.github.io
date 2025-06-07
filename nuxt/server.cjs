require('dotenv').config();
const express = require('express');
const {Client} = require('@notionhq/client');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const notion = new Client({auth: process.env.NOTION_KEY});
const commentsId = process.env.NOTION_COMMENTS;
const articleDatabaseId = process.env.NOTION_ARTICLE;

// 检查所有必要的环境变量是否已设置
if (!process.env.NOTION_KEY || !process.env.NOTION_COMMENTS || !process.env.NOTION_ARTICLE) {
    console.error('错误: 请确保在你的 .env 文件中设置了 NOTION_KEY, NOTION_COMMENTS, 和 NOTION_ARTICLE。');
    process.exit(1); // 带着错误码退出进程
}

// 为状态值定义常量，避免硬编码字符串
const COMMENT_STATUS = {
    READ: 'Read',
    PENDING: 'Pending',
};

// --- 获取文章内容的路由 ---
app.get('/article', async (req, res) => {
    if (!articleDatabaseId) {
        return res.status(500).json({message: '服务器未配置文章数据库ID (NOTION_ARTICLE_DB_ID)。'});
    }

    try {
        // --- 请确保你的 Notion 文章数据库中包含以下列名 ---
        const dateColumnName = 'Date';    // 发布日期列 (类型: Date)
        const titleColumnName = 'Title';           // 标题列 (类型: Title)
        const summaryColumnName = 'Summary';        // 摘要列 (类型: Rich Text)
        // ---------------------------------------------------

        // 第1步: 查询数据库，获取所有已发布的文章列表 (仅包含属性)
        const articleListResponse = await notion.databases.query({
            database_id: articleDatabaseId,
            sorts: [
                {
                    property: dateColumnName,
                    direction: 'descending',
                },
            ],
        });

        // 第2步: 并发获取每篇文章的详细内容 (所有内容块)
        const articlesWithContent = await Promise.all(
            articleListResponse.results.map(async (page) => {
                if (!page.properties) return null;

                // 获取页面内的所有内容块
                const blocksResponse = await notion.blocks.children.list({
                    block_id: page.id,
                });

                // 格式化内容块为纯文本数组


                // 组合文章的属性和内容，构成一个完整的文章对象
                return {
                    id: page.id,
                    title: page.properties[titleColumnName]?.title[0]?.plain_text || '无标题',
                    summary: page.properties[summaryColumnName]?.rich_text[0]?.plain_text || '',
                    date: page.properties[dateColumnName]?.date?.start || '',
                };
            })
        );

        // 过滤掉处理过程中可能出现的空结果
        const finalArticles = articlesWithContent.filter(Boolean);

        // 注意：现在这个接口返回的是一个文章对象【数组】
        res.json(finalArticles);

    } catch (err) {
        console.error('获取文章列表时出错:', err);
        res.status(500).json({message: '获取文章列表失败。'});
    }
});


// --- 提交评论的路由 ---
app.post('/comments', async (req, res) => {
    const {username, content} = req.body;

    // 简单的输入验证
    if (!username || !content || username.trim() === '' || content.trim() === '') {
        return res.status(400).json({success: false, message: '用户名和内容不能为空！'});
    }

    try {
        const response = await notion.pages.create({
            parent: {database_id: commentsId},
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
            database_id: commentsId,
            filter: {property: 'Status', status: {equals: 'Read'}}, // 直接使用字符串 'Read'
            sorts: [{property: 'Date', direction: 'descending'}]
        });

        const comments = response.results.map(page => {
            if (!page.properties) {
                return {};
            }

            // --- 请再次确认这里的列名和你的Notion数据库完全一致 ---
            const usernameColumnName = 'Username'; // 例如: '用户'
            const contentColumnName = 'Content';   // 例如: '内容'
            const dateColumnName = 'Date';         // 例如: '日期'
            // -----------------------------------------------------

            // 提取 title, rich_text 和 date 属性，同时进行健壮性检查
            const titleArray = page.properties[usernameColumnName]?.title;
            const richTextArray = page.properties[contentColumnName]?.rich_text;
            const dateObject = page.properties[dateColumnName]?.date;

            return {
                id: page.id,
                // 只有当 titleArray 存在时，才去读取 [0]
                username: titleArray?.[0]?.plain_text,

                // 只有当 richTextArray 存在时，才去读取 [0]
                content: richTextArray?.[0]?.plain_text,

                // 只有当 dateObject 存在时，才去读取 .start
                date: dateObject?.start || new Date().toISOString(),
            };
        });
        res.json(comments);
    } catch (err) {
        console.error('获取评论时出错:', err);
        res.status(500).json({message: '获取评论失败。'});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`服务器正在端口 ${port} 上运行`));
