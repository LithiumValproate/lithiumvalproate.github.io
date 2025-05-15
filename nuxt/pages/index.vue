<template>
  <div class="max-w-6xl mx-auto px-4 py-8 flex gap-6">
    <!-- 左侧 2/3：文章列表 -->
    <div class="w-2/3 space-y-6 overflow-auto">
      <div class="grid grid-cols-12 gap-6">
        <template v-for="(pair, i) in postPairs" :key="i">
          <div
            v-for="(post, j) in pair"
            :key="post.id"
            :class="[
              (j === 0 && i % 2 === 0) || (j === 1 && i % 2 === 1) ? 'col-span-8' : 'col-span-4',
              'p-4 rounded-xl shadow text-white',
              post.category === 'article' ? 'bg-blue-500' : post.category === 'game' ? 'bg-red-500' : post.category === 'media' ? 'bg-green-500' : 'bg-gray-700'
            ]"
          >
            <h2 class="text-xl font-bold mb-1">{{ post.title }}</h2>
            <p class="text-sm opacity-80 mb-2">{{ post.date }}</p>
            <p class="text-sm">{{ post.summary }}</p>
          </div>
        </template>
      </div>
    </div>

    <!-- 右侧 1/3：固定访客地图 + 留言区 -->
    <div class="w-1/3 space-y-6 sticky top-24 self-start h-fit">
      <!-- 访问地图 + 统计 -->
      <div class="bg-white p-4 rounded-xl shadow text-sm">
        <h3 class="text-lg font-semibold mb-2">访客地图</h3>
        <!-- 地图占位，可用 echarts 或 leaflet 替代 -->
        <div class="w-full aspect-video bg-gray-200 rounded mb-2 text-center flex items-center justify-center">
          世界地图 (暂缓)
        </div>
        <div class="text-gray-700">
          <p>今日访问：114514</p>
          <p>总访问量：1919810</p>
        </div>
      </div>

      <!-- 留言板 -->
      <div class="bg-white p-4 rounded-xl shadow">
        <h3 class="text-lg font-semibold mb-2">留言板</h3>
        <!-- 简易输入框 -->
        <textarea rows="3" placeholder="锐评，，，"
          class="w-full p-2 border rounded mb-2"></textarea>
        <button class="px-4 py-1 bg-black text-white text-sm rounded">提交</button>
      </div>
    </div>

    <!-- 网易云播放器 -->
    <div class="fixed bottom-4 right-4">
      <iframe frameborder="no" border="0" marginwidth="0" marginheight="0"
              width="330" height="86"
              src="https://music.163.com/outchain/player?type=2&id=1234567890&auto=1&height=66">
      </iframe>
    </div>
  </div>
</template>

<script setup>
const rawPosts = [
  {
    title: '皐月初末',
    date: '2025-05-06',
    summary: '在哭',
    category: 'article',
  },
  {
    title: '神中metaphor',
    date: '2025-04-30',
    summary: '看懂的也是神人了',
    category: 'article',
  },
  {
    title: 'Kon-KR #4.5',
    date: '2025-04-22',
    summary: '<UNK>',
    category: 'article',
  },
  {
    title: 'Kon-KR #4',
    date: '2025-04-20',
    summary: '<UNK>',
    category: 'article',
  },
  {
    title: 'Kon-KR #3',
    date: '2025-04-18',
    summary: '<UNK>',
    category: 'article',
  },
  {
    title: '卯月望',
    date: '2025-04-15',
    summary: '<UNK>',
    category: 'article',
  },
  {
    title: '听Duvet，我想到了什么',
    date: '2025-04-14',
    summary: '我们活着是为了什么，追求什么呢？',
    category: 'article',
  },
  {
    title: 'Kon-KR #2',
    date: '2025-04-13',
    summary: '漫步',
    category: 'article',
  },
  {
    title: '四月十',
    date: '2025-04-12',
    summary: '回忆数摇',
    category: 'article',
  },
  {
    title: 'CS-59头等 #4',
    date: '2025-04-11',
    summary: '很低级的一局',
    category: 'game',
  },
  {
    title: 'CS-59头等 #3',
    date: '2025-04-11',
    summary: '六杀',
    category: 'game',
  },
  {
    title: 'CS-59头等 #2',
    date: '2025-04-11',
    summary: '十级房那咋了',
    category: 'game',
  },
  {
    title: 'Kon-KR #1',
    date: '2025-04-11',
    summary: '序幕',
    category: 'article',
  },
  {
    title: 'CS-59头等 #1',
    date: '2025-04-10',
    summary: '哪边天命少哪边赢',
    category: 'game',
  },
]

const posts = computed(() => rawPosts
  .slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((post, index) => ({
    ...post,
    id: index + 1
  })))

const postPairs = []

for (let i = 0; i < posts.length; i += 2) {
  const pair = [posts[i]]
  if (posts[i + 1]) pair.push(posts[i + 1])
  postPairs.push(pair)
}
</script>

<style scoped>
/* 可选补充样式 */
</style>