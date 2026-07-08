<script setup lang="ts">
/**
 * 通用页面头部组件
 * 显示标题和可选的返回按钮
 */

withDefaults(defineProps<{
  /** 页面标题 */
  title: string
  /** 是否显示返回按钮 */
  showBack?: boolean
}>(), {
  showBack: false
})

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <div class="page-header">
    <div class="header-back" v-if="showBack" @click="emit('back')">
      <span class="back-icon">&lt;</span>
    </div>
    <h1 class="header-title">{{ title }}</h1>
    <div class="header-right">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 88px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  padding: 0 var(--spacing-sm);
  padding-top: env(safe-area-inset-top);
}

.header-back {
  position: absolute;
  left: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
}

.back-icon {
  font-size: 36px;
  font-weight: 300;
  color: #fff;
}

.header-title {
  font-size: 34px;
  font-weight: 600;
  letter-spacing: 1px;
}

.header-right {
  position: absolute;
  right: var(--spacing-sm);
}
</style>
