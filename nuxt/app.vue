<template>
  <header class="header">
    <div class="left"
         style="font-size: 20px; font-weight: bold">
      琉璃雨</div>
    <div class="center">
      <button>按钮</button>
    </div>
    <div class="right">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索"
        class="search-input"
      >
    </div>
  </header>
</template>

<script setup>
import {ref} from 'vue'

const searchQuery = ref('')
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
</style>