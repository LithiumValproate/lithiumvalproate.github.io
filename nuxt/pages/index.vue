<template>
  <div class="flex min-h-screen p-4 gap-4">
    <!-- 左侧：文章列表 -->
    <div class="w-2/3 space-y-4">
      <h1 class="text-3xl font-bold mb-4">文章列表</h1>
      <div v-for="post in posts" :key="post.id" class="p-4 rounded-2xl shadow bg-white">
        <h2 class="text-xl font-semibold">{{ post.title }}</h2>
        <p class="text-sm text-gray-500">{{ post.date }}</p>
        <p class="mt-2 text-gray-700">{{ post.summary }}</p>
      </div>
    </div>

    <!-- 右侧：站点信息区 -->
    <div class="w-1/3 space-y-4">
      <!-- 访问数据 -->
      <div class="p-4 rounded-2xl shadow bg-white">
        <h2 class="text-xl font-semibold mb-2">网站数据</h2>
        <p>总访问量：1234</p>
        <p>今日访问：56</p>
        <p>访客位置：日本 🇯🇵、中国 🇨🇳、美国 🇺🇸</p>
      </div>

      <!-- 留言 -->
      <div class="p-4 rounded-2xl shadow bg-white">
        <h2 class="text-xl font-semibold mb-2">留言板</h2>
        <p>（此处可接入评论系统）</p>
      </div>

      <!-- 外部链接 -->
      <div class="p-4 rounded-2xl shadow bg-white">
        <h2 class="text-xl font-semibold mb-2">外部链接</h2>
        <ul class="list-disc list-inside text-blue-600">
          <li><a href="https://github.com/yourname" target="_blank">GitHub</a></li>
          <li><a href="https://matsu.rip" target="_blank">个人网站</a></li>
        </ul>
      </div>
    </div>

    <!-- 网易云音乐播放器 -->
    <div class="fixed bottom-4 right-4">
      <iframe frameborder="no" border="0" marginwidth="0" marginheight="0"
              width="330" height="86"
              src="https://music.163.com/outchain/player?type=2&id=1234567890&auto=0&height=66">
      </iframe>
    </div>
  </div>
</template>

<script setup>
const posts = [
  {
    id: 1,
    title: '第一篇博客文章',
    date: '2025-04-14',
    summary: '这是文章的简介内容，展示文章摘要部分。',
  },
  {
    id: 2,
    title: '第二篇博客文章',
    date: '2025-04-12',
    summary: '简短总结，用于快速浏览内容。',
  },
]
</script>
