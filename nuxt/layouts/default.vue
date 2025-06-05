<template>
  <header class="header">
    <div class="logo">琉璃雨</div>

    <nav class="nav">
      <transition name="fade">
        <NuxtLink v-show="showMenu" to="/archive" class="nav-link">
          全部内容
        </NuxtLink>
      </transition>

      <button @click="toggleMenu" class="menu-button" aria-label="Toggle menu">
        <span :class="['bar', showMenu && 'top']"></span>
        <span :class="['bar', showMenu && 'middle']"></span>
        <span :class="['bar', showMenu && 'bottom']"></span>
      </button>

      <transition name="fade">
        <NuxtLink v-show="showMenu" to="/about" class="nav-link">
          关于网站
        </NuxtLink>
      </transition>
    </nav>

    <div class="search">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索"
          class="search-input"
      />
    </div>
  </header>

  <main>
    <NuxtPage/>
  </main>

  <footer class="footer">
    <span class="footer-text">Memento mori ｜ © 2025 Lithium Valproate</span>
  </footer>
</template>

<script setup>
import {ref} from 'vue'

const searchQuery = ref('')
const showMenu = ref(false)

function toggleMenu() {
  showMenu.value = !showMenu.value
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  color: ghostwhite;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav {
  display: flex;
  align-items: center;
}

/* --- 导航链接 & 过渡 --- */
.nav-link {
  margin: 0 10px;
  text-decoration: none;
  color: inherit;
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* --- 汉堡按钮 --- */
.menu-button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.bar {
  display: block;
  width: 100%;
  height: 3px;
  background: ghostwhite;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.top {
  transform: translateY(7px) rotate(45deg);
}

.middle {
  opacity: 0;
}

.bottom {
  transform: translateY(-7px) rotate(-45deg);
}

.search-input {
  height: 24px;
  padding: 2px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: dimgrey;
}

.footer .footer-text {
  max-width: 960px;
  margin: 0 auto;
}
</style>