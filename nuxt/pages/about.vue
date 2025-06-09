<template>
  <div class="container">
    <div
        class="avatar-ring-container"
        :style="{ width: containerSize + 'px', height: containerSize + 'px' }"
    >
      <!-- 中间的圆形大头像 -->
      <div class="center-avatar">
        <img
            src="~/public/avatar.png"
            alt="头像"
            class="avatar-image"
            :style="{ width: centerAvatarSize + 'px', height: centerAvatarSize + 'px' }"
            onerror="this.onerror=null;this.src='https://placehold.co/120x120/e0e0e0/000000?text=Error';"
        >
      </div>

      <!-- 循环生成周围的小图标 -->
      <div
          v-for="(site, index) in siteList"
          :key="site.name"
          class="ring-item"
          :style="getRingItemStyle(index)"
      >
        <div class="ring-item-wrapper" :style="getWrapperStyle(index)">
          <NuxtLink :to="site.link">
            <img
                :src="getIcon(site.name)"
                :alt="site.name"
                class="avatar-image small-avatar"
                :style="{ width: smallAvatarSize + 'px', height: smallAvatarSize + 'px' }"
                onerror="this.onerror=null;this.src='https://placehold.co/50x50/e0e0e0/000000?text=E';"
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link.js";
import {ref, computed} from 'vue';

// --- 配置项 ---
const radius = 150; // 环形布局的半径 (px)
const centerAvatarSize = 150; // 中心头像的大小 (px)
const smallAvatarSize = 65; // 周围小图标的大小 (px)

//  账户列表
const siteList = ref([
  {name: 'bilibili', link: 'https://space.bilibili.com/319983881'},
  {name: 'instagram', link: 'https://www.instagram.com/yu.ki.ri.neko'},
  {name: 'github', link: 'https://github.com/LithiumValproate'},
  {name: 'luogu', link: ''},
  {name: 'codeforces', link: 'https://codeforces.com/profile/Cyclopropy1'},
  {name: 'leetcode', link: 'https://leetcode.com/u/LithiumValproate/'},
  {name: 'x', link: 'https://x.com/SiovenStars'},
  {name: 'discord', link: 'https://discord.gg/9aMGbVDg'},
  {name: 'twitch', link: 'https://www.twitch.tv/sh10riniku'},
  {name: 'youtube', link: 'https://www.youtube.com/@sh10riniku'}
]);

//  获取文件名函数
const getIcon = name => {
  if (name) {
    return `/${name}.png`;
  }
  return '';
};

// 计算总容器的大小，确保所有图标都能被容纳
const containerSize = computed(() => (radius + smallAvatarSize) * 2);
const totalIcons = computed(() => siteList.value.length);

/**
 * 计算每个环绕项的样式
 * @param {number} index - 图标在数组中的索引
 * @returns {object} - 返回一个包含 transform 样式的对象
 */
const getRingItemStyle = (index: number) => {
  // 计算每个图标应该旋转的角度
  const angle = (360 / totalIcons.value) * index;
  return {
    // 关键：先旋转，再沿着Y轴（新的Y轴）平移指定的半径距离
    transform: `rotate(${angle}deg) translateY(-${radius}px)`
  };
};

/**
 * 计算内部 wrapper 的样式，用于反向旋转，使图标保持直立
 * @param {number} index - 图标在数组中的索引
 * @returns {object} - 返回一个包含 transform 样式的对象
 */
const getWrapperStyle = (index: number) => {
  const angle = (360 / totalIcons.value) * index;
  return {
    // 应用一个与父元素相反的旋转角度
    transform: `rotate(-${angle}deg)`
  };
};
</script>

<style scoped>
/* 外部容器，用于居中展示 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px; /* 确保有足够空间展示 */
  font-family: sans-serif;
}

/* 环形布局的根容器 */
.avatar-ring-container {
  position: relative; /* 必须是相对定位，作为所有绝对定位子元素的锚点 */
}

/* 中心头像 */
.center-avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; /* 确保在最上层 */
}

/* 通用头像样式 */
.avatar-image {
  border-radius: 50%; /* 圆形 */
  object-fit: cover; /* 保证图片不变形 */
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 环绕项的容器 */
.ring-item {
  position: absolute;
  top: 50%;
  left: 50%;
  /* 调整 transform-origin，使其围绕容器中心旋转 */
  transform-origin: 0 0;
}

/* 内部 wrapper，用于动画和交互效果 */
.ring-item-wrapper {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.ring-item-wrapper:hover {
  transform: scale(1.15) !important; /* !important 用于覆盖内联样式中的旋转 */
}

.small-avatar {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>