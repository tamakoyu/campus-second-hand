<template>
  <div class="base-empty">
    <div class="base-empty__image">
      <img v-if="image" :src="image" alt="" class="base-empty__img" />
      <svg v-else viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="14" y="22" width="92" height="62" rx="8" stroke="#D9D9D9" stroke-width="2" />
        <path d="M14 42h92" stroke="#D9D9D9" stroke-width="2" />
        <path d="M38 22v-6a6 6 0 0 1 6-6h32a6 6 0 0 1 6 6v6" stroke="#D9D9D9" stroke-width="2" />
        <path d="M50 58h20" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" />
        <path d="M50 66h12" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>
    <p v-if="title" class="base-empty__title">{{ title }}</p>
    <p v-if="description" class="base-empty__desc">{{ description }}</p>
    <el-button v-if="actionText" class="base-empty__action" type="primary" @click="emit('action')">
      {{ actionText }}
    </el-button>
  </div>
</template>

<script setup>
/**
 * 空状态：线性插画 + 主文案 + 次文案 + 主操作（规范 §8.2）
 * props: image / title / description / actionText；event: action
 */
defineProps({
  image: { type: String, default: '' },
  title: { type: String, default: '暂无数据' },
  description: { type: String, default: '这里空空如也，稍后再来看看吧' },
  actionText: { type: String, default: '' }
})
const emit = defineEmits(['action'])
</script>

<style scoped lang="scss">
.base-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-12) var(--space-6);
  text-align: center;

  &__img {
    width: 120px;
    height: 96px;
    object-fit: contain;
  }

  &__title {
    margin-top: var(--space-4);
    font-size: var(--fs-body-lg);
    line-height: var(--lh-body-lg);
    font-weight: var(--fw-medium);
    color: var(--color-text-1);
  }

  &__desc {
    margin-top: var(--space-1);
    font-size: var(--fs-body);
    line-height: var(--lh-body);
    color: var(--color-text-3);
  }

  &__action {
    margin-top: var(--space-6);
  }
}
</style>
