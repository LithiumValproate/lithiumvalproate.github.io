require('dotenv').config();
const express = require('express');
const {Client} = require('@notionhq/client');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const notion = new Client({auth: process.env.NOTION_KEY});
const databaseId = process.env.NOTION_DB_ID;

app.post('/comment', async (req, res) => {
    const {username, content} = req.body;

    try {
        const response = await notion.pages.create({
            parent: {database_id: databaseId},
            properties: {
                'Username': {
                    title: [{text: {content: username}}],
                },
                'Content': {
                    rich_text: [{text: {content}}],
                },
                'Date': {
                    date: {start: new Date().toISOString()},
                },
                'Status': {
                    select: {name: 'Pending'},
                },
            },
        });
        res.json({success: true, id: response.id});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
});

app.get('/comments', async (req, res) => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Status',
                select: {equals: 'Approved'}
            },
            sorts: [{property: 'Date', direction: 'descending'}]
        });
        // 简单提取评论内容
        const comments = response.results.map(page => ({
            id: page.id,
            username: page.properties.Username.title[0]?.plain_text || '',
            content: page.properties.Content.rich_text[0]?.plain_text || '',
            date: page.properties.Date.date.start,
        }));
        res.json(comments);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));