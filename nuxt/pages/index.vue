<template>
  <body>
  <!-- 添加加载和错误状态的UI提示 -->
  <div v-if="pPending" class="status-message">
    正在从 Notion 加载文章...
  </div>
  <div v-else-if="pError" class="status-message error">
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
        </div>
      </template>
      <!-- 如果没有文章，显示提示 -->
      <div v-else class="status-message">
        没有找到已发布的文章。
      </div>
    </div>

    <!-- 右侧栏保持不变 -->
    <div class="multi-column">
      <div class="visitor-map">
        <!-- 访客地图内容 -->
        <p class="text-gray-500">访客地图</p>
      </div>
      <div class="comment-board">
        <!-- 评论板内容 -->
        <!-- 添加加载和错误状态的UI提示 -->
        <div v-if="cPending" class="status-message">
          正在从 Notion 加载文章...
        </div>
        <div v-else-if="cError" class="status-message error">
          加载失败: {{ cError.message }} <br/>
          请确保你的后端服务正在运行，并且Notion中有已批准(Approved)的条目。
        </div>
        <div v-else-if="!comments || comments.length === 0" class="status-box">
          <p>还没有人评论，快来抢占第一个沙发吧！</p>
        </div>
        <ul v-else class="comment-list">
          <li v-for="comment in comments" :key="comment.id" class="comment-item">
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
import {computed} from 'vue';

// 1. 从你的后端API获取数据
// data 会被自动推断为一个 Ref
const {data: fetchedPosts, pending: pPending, error: pError} = await useFetch('http://localhost:3000/article', {
  lazy: true, // 异步加载，不阻塞页面渲染
  default: () => [] // 提供默认空数组，防止错误
});

/**
 * 格式化ISO日期为 YYYY-MM-DD
 * @param {string} isoString - ISO格式的日期字符串
 * @returns {string} - 格式化后的日期
 */
const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().split('T')[0];
};

// 2. 将获取的数据转换为组件期望的格式
// 使用 computed 属性，当 fetchedPosts 变化时，posts 会自动更新
const posts = computed(() => {
  // 确保 fetchedPosts.value 是一个数组
  if (!Array.isArray(fetchedPosts.value)) {
    return [];
  }
  return fetchedPosts.value.map(post => ({
    id: post.id,
    title: post.title, // 将 Notion 中的 'Username' 映射为 'title'
    date: formatDate(post.date), // 格式化日期
    summary: post.summary, // 将 Notion 中的 'Content' 映射为 'summary'
    category: 'article', // 可以保留或根据需要修改
  }));
});


// 3. 将格式化后的文章数据配对，用于布局
// 同样使用 computed，当 posts 变化时，postPairs 也会自动更新
const postPairs = computed(() => {
  const pairs = [];
  // 这个循环逻辑可以正确处理奇数和偶数数量的文章
  for (let i = 0; i < posts.value.length; i += 2) {
    if (posts.value[i + 1]) {
      // 如果存在下一个元素，则创建一对
      pairs.push([posts.value[i], posts.value[i + 1]]);
    } else {
      // 如果只剩下最后一个元素，则单独成为一对
      pairs.push([posts.value[i]]);
    }
  }
  return pairs;
});

// 1. 从 /comments API 获取原始评论数据
// 我们不仅获取数据，还获取加载状态(pending)和错误状态(error)
// 为了避免和文章获取的变量冲突，我们给它们加上 'Comments' 后缀
const {
  data: fetchedComments,
  pending: cPending,
  error: cError
} = await useFetch('http://localhost:3000/comments', {
  lazy: true,      // 异步加载，不阻塞页面渲染
  default: () => [] // 提供默认空数组，防止初始渲染时出错
});

// 2. 创建一个计算属性，用于处理和格式化获取到的评论数据
// 当 fetchedComments 发生变化时，这个 'comments' 数组会自动更新
const comments = computed(() => {
  // 确保我们处理的是一个数组
  if (!Array.isArray(fetchedComments.value)) {
    return [];
  }

  // 使用 .map 遍历每一条原始评论，并将其转换为我们需要的格式
  return fetchedComments.value.map(comment => {
    // 这里使用了可选链(?.)和空值合并(||)操作符
    // 即使 Notion 里的某些单元格是空的，代码也不会崩溃
    return {
      id: comment.id,
      username: comment.username || '匿名用户', // 如果没有用户名，显示默认值
      content: comment.content || '该用户没有留下任何内容。', // 如果没有内容，显示默认值
      date: formatDate(comment.date), // 格式化日期
    };
  });
});

// 现在，你可以在你的 <template> 中直接使用 'comments', 'commentsPending', 和 'commentsError' 了
// 例如，你可以用 v-for="comment in comments" 来展示评论列表

</script>

<style scoped>
/* 你的现有样式保持不变 */
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
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  max-height: 8em;
  overflow: hidden;
}

.article-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
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
}

.post-date {
  font-size: 0.8rem;
  margin-top: 0.3em;
  margin-bottom: 0.5rem;
  text-align: right;
  opacity: 0.8;
}

.post-summary {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.multi-column {
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.visitor-map, .comment-board {
  width: 100%;
  padding: 1rem;
  min-height: 200px;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.text-gray-500 {
  color: #6b7280;
}

/* 新增的状态提示样式 */
.status-message {
  width: 100%;
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.2rem;
  color: #6b7280;
}

.status-message.error {
  color: #ef4444;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
}
</style>
