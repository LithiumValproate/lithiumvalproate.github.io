<template>
  <body>
  <div class="content">
    <div class="article-list">
      <template v-for="(pair, i) in postPairs" :key="i">
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
    </div>
    <div class="multi-column">
      <div class="visitor-map">

      </div>
      <div class="comment-board">

      </div>
    </div>
  </div>
  </body>
</template>

<script setup>
const posts = [
  {
    id: 1,
    title: 'test1',
    date: '2025-04-14',
    summary: 'test1_summary',
    category: 'article',
  },
  {
    id: 2,
    title: 'test2',
    date: '2025-04-14',
    summary: 'test2_summary',
    category: 'article',
  },
]

const postPairs = []
for (let i = 0; i < posts.length - 1; i += 2) {
  postPairs.push([posts[i], posts[i + 1]])
}
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
}

.article-list {
  width: 66.6667%;
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
  max-block-size: 10em;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  color: #fff;
  background-color: dodgerblue;
}

.article-block-8 {
  grid-column: span 8 / span 8;
}

.article-block-4 {
  grid-column: span 5 / span 5;
}

.post-title {
  margin-bottom: 1rem;
}

.post-date {
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
  text-align: right;
}

.post-summary {
  margin-top: 0.5rem;
}

.multi-column {
  width: 33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70%;
  gap: 2rem;
}

.visitor-map {
  width: 90%;
  min-height: 150px;
  background: #f8f9fa;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-board {
  width: 90%;
  min-height: 150px;
  background: #f8f9fa;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>