<template>
    <div class="min-h-screen flex flex-col bg-white text-black">
      <!-- 顶部导航栏 -->
      <header class="flex items-center justify-between px-6 py-4 border-b relative">
        <!-- 左侧 Slogan -->
        <div class="text-lg font-semibold">琉璃雨</div>
  
        <!-- 中间菜单按钮和链接 -->
        <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
          <transition name="slide-fade-left">
            <NuxtLink v-if="showMenu" to="/archive" class="text-base hover:underline">全部内容</NuxtLink>
          </transition>
  
          <button @click="toggleMenu" class="w-8 h-8 relative flex items-center justify-center">
            <span :class="[
              'absolute h-0.5 w-6 bg-black transition-transform duration-300',
              showMenu ? 'rotate-45' : '-translate-y-2'
            ]"></span>
            <span :class="[
              'absolute h-0.5 w-6 bg-black transition-opacity duration-300',
              showMenu ? 'opacity-0' : 'opacity-100'
            ]"></span>
            <span :class="[
              'absolute h-0.5 w-6 bg-black transition-transform duration-300',
              showMenu ? '-rotate-45' : 'translate-y-2'
            ]"></span>
          </button>
  
          <transition name="slide-fade-right">
            <NuxtLink v-if="showMenu" to="/about" class="text-base hover:underline">关于本站</NuxtLink>
          </transition>
        </div>
  
        <!-- 右侧搜索框 -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章..."
          class="px-3 py-1 border rounded"
        />
      </header>
  
      <!-- 页面内容 -->
      <main class="flex-grow">
        <NuxtPage />
      </main>
  
      <!-- 页脚 -->
      <footer class="text-center text-sm text-gray-500 py-6 border-t">
        Momento mori | © 2025 Lithium Valproate | All rights reserved
      </footer>
    </div>
  </template>
  
  <script setup>
  const showMenu = ref(false)
  const searchQuery = ref('')
  
  function toggleMenu() {
    showMenu.value = !showMenu.value
  }
  </script>
  
  <style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .slide-fade-left-enter-active,
  .slide-fade-right-enter-active {
    transition: all 0.4s ease;
  }
  .slide-fade-left-enter-from {
    opacity: 0;
    transform: translateX(1rem);
  }
  .slide-fade-right-enter-from {
    opacity: 0;
    transform: translateX(-1rem);
  }
  .slide-fade-left-leave-to,
  .slide-fade-right-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  </style>
  