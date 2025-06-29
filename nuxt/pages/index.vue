<template>
  <body>
  <!-- 添加加载和错误状态的UI提示 -->
  <div v-if="pPending" class="status-message loading">
    <div class="loading-spinner"></div>
    正在从 Notion 加载文章...
  </div>
  <div v-else-if="pError" class="status-message error">
    <div class="error-icon">⚠️</div>
    加载失败: {{ pError.message }} <br/>
    请确保你的后端服务正在运行，并且Notion中有已批准(Approved)的条目。
  </div>

  <!-- 数据成功加载后显示主内容 -->
  <div v-else class="content">
    <div class="article-list">
      <!-- v-if 确保在 postPairs 有内容时才渲染 -->
      <template v-if="postPairs.length > 0" v-for="(pair, i) in postPairs" :key="i">
        <div
            v-for="(post,j) in pair"
            :key="post.id"
            :class="['article-block',
                (j === 0 && i % 2 === 0) || ( j === 1 && i % 2 === 1)
                ? 'article-block-8' : 'article-block-4']">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-date">{{ post.date }}</p>
          <p class="post-summary">{{ post.summary }}</p>
          <div class="article-overlay"></div>
        </div>
      </template>
      <!-- 如果没有文章，显示提示 -->
      <div v-else class="status-message empty">
        <div class="empty-icon">📝</div>
        没有找到已发布的文章。
      </div>
    </div>

    <!-- 右侧栏保持不变 -->
    <div class="multi-column">
      <div class="widget discord">
        <h3 class="widget-title">社区讨论</h3>
        <iframe src="https://discord.com/widget?id=1367884898547011706&theme=dark"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                width="100%"
                height="300">
        </iframe>
      </div>
      <div class="widget visitor-map">
        <h3 class="widget-title">访客地图</h3>
        <p class="text-gray-500">暂无访客数据</p>
      </div>
      <div class="widget comment-board">
        <h3 class="widget-title">最新评论</h3>
        <!-- 添加加载和错误状态的UI提示 -->
        <div v-if="cPending" class="status-message loading">
          <div class="loading-spinner small"></div>
          正在加载评论...
        </div>
        <div v-else-if="cError" class="status-message error">
          评论加载失败
        </div>
        <div v-else-if="!comments || comments.length === 0" class="status-box">
          <div class="empty-icon">💬</div>
          <p>还没有人评论，快来抢占第一个沙发吧！</p>
        </div>
        <ul v-else class="comment-list">
          <li v-for="comment in comments.slice(0, 5)" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <span>{{ comment.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <strong class="comment-username">{{ comment.username }}</strong>
                <span class="comment-date">{{ comment.date }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  </body>
</template>

<script setup>
// 你的现有脚本保持不变
import {computed} from 'vue';

const {data: fetchedPosts, pending: pPending, error: pError} = await useFetch('http://localhost:3000/article', {
  lazy: true,
  default: () => []
});

const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().split('T')[0];
};

const posts = computed(() => {
  if (!Array.isArray(fetchedPosts.value)) {
    return [];
  }
  return fetchedPosts.value.map(post => ({
    id: post.id,
    title: post.title,
    date: formatDate(post.date),
    summary: post.summary,
    category: 'article',
  }));
});

const postPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < posts.value.length; i += 2) {
    if (posts.value[i + 1]) {
      pairs.push([posts.value[i], posts.value[i + 1]]);
    } else {
      pairs.push([posts.value[i]]);
    }
  }
  return pairs;
});

const {
  data: fetchedComments,
  pending: cPending,
  error: cError
} = await useFetch('http://localhost:3000/comments', {
  lazy: true,
  default: () => []
});

const comments = computed(() => {
  if (!Array.isArray(fetchedComments.value)) {
    return [];
  }
  return fetchedComments.value.map(comment => {
    return {
      id: comment.id,
      username: comment.username || '匿名用户',
      content: comment.content || '该用户没有留下任何内容。',
      date: formatDate(comment.date),
    };
  });
});
</script>

<style scoped>
.content {
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.article-list {
  width: 60%;
  margin-top: 1.5rem;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  gap: 1rem;
  max-width: 100%;
  flex-shrink: 1;
  min-width: 0;
}

.article-block {
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  color: #fff;
  background: linear-gradient(145deg, #367cff, #2a63cc);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  max-height: 8em;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.article-block:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

.article-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.article-block:hover .article-overlay {
  opacity: 1;
}

.article-block-8 {
  grid-column: span 8 / span 8;
}

.article-block-4 {
  grid-column: span 5 / span 5;
}

.post-title {
  margin-top: 0;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}

.post-date {
  font-size: 0.8rem;
  margin-top: 0.3em;
  margin-bottom: 0.5rem;
  text-align: right;
  opacity: 0.8;
  position: relative;
  z-index: 1;
}

.post-summary {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.multi-column {
  margin-top: 1.5rem;
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 1.5rem;
  align-self: flex-start;
}

.widget {
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

.widget-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.discord {
  background: #5865f2;
  color: white;
}

.discord .widget-title {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.discord iframe {
  width: 100%;
  min-height: 300px;
  height: 100%;
  border: none;
  border-radius: 0.5rem;
}

.text-gray-500 {
  color: #6b7280;
}

/* 状态提示样式优化 */
.status-message {
  width: 100%;
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.1rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.status-message.loading {
  color: ghostwhite;
}

.status-message.error {
  color: #ef4444;
  background-color: rgba(254, 242, 242, 0.9);
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
}

.status-message.empty {
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon, .empty-icon {
  font-size: 2rem;
}

.status-box {
  text-align: center;
  padding: 2rem 1rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.comment-username {
  font-size: 0.875rem;
  color: #374151;
}

.comment-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.comment-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .article-list, .multi-column {
    width: 100%;
  }

  .article-list {
    grid-template-columns: 1fr;
  }

  .article-block-8, .article-block-4 {
    grid-column: span 1;
  }
}
</style>