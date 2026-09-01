<template>
  <div class="base-card" :class="{ 'base-card--hoverable': hoverable }" :style="{ padding }">
    <div v-if="title || $slots.header" class="base-card__header">
      <slot name="header">
        <h3 v-if="title" class="base-card__title">{{ title }}</h3>
      </slot>
      <span v-if="extra" class="base-card__extra">{{ extra }}</span>
    </div>
    <div class="base-card__body"><slot /></div>
    <div v-if="$slots.footer" class="base-card__footer"><slot name="footer" /></div>
  </div>
</template>

<script setup>
/**
 * 通用卡片容器：标题区 + 内容区 + 操作区（《前端公共组件清单》）
 * props: title / extra(右上角) / padding / hoverable；slot: default / header / footer
 */
defineProps({
  title: { type: String, default: '' },
  extra: { type: String, default: '' },
  padding: { type: String, default: 'var(--space-4)' },
  hoverable: { type: Boolean, default: false }
})
</script>

<style scoped lang="scss">
.base-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  transition: box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);

  &--hoverable:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  &__title {
    font-size: var(--fs-title-sm);
    line-height: var(--lh-title-sm);
    font-weight: var(--fw-semibold);
  }

  &__extra {
    font-size: var(--fs-aux);
    color: var(--color-text-2);
  }

  &__footer {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-divider);
  }
}
</style>
