<template>
  <header class="header">
    <div class="left" style="font-size: 20px; font-weight: bold">琉璃雨</div>
    <div class="center">
      <button @click="toggleMenu" class="menuButton">
        <div style="display: flex; justify-content: center">
          <span class="bar" :class="showMenu ? 'nw' : 'se'"></span>
          <span class="bar" :class="showMenu ? 'ne' : 'sw'"></span>
        </div>
        <span class="bar" :class="showMenu ? 'mid' : 'mid0'"></span>
        <div style="display: flex; justify-content: center">
          <span class="bar" :class="showMenu ? 'ne' : 'sw'"></span>
          <span class="bar" :class="showMenu ? 'nw' : 'se'"></span>
        </div>
      </button>
    </div>
    <div class="right" style="border: 3px">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索"
          class="search-input"
          style="height: 19px"
      >
    </div>
  </header>
</template>

<script setup>
import {ref} from 'vue'

const searchQuery = ref('')
const showMenu = ref(false)

function toggleMenu() {
  showMenu.value = !showMenu.value
}
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 20px;
  color: ghostwhite;
}

.menuButton {
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
  background-color: ghostwhite;
}

.nw {
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.se {
  transform: rotate(0);
  transition: transform 0.3s ease;
}

.ne {
  transform: rotate(-45deg);
  transition: transform 0.3s ease;
}

.sw {
  transform: rotate(0);
  transition: transform 0.3s ease;
}

.mid0 {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.mid {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
