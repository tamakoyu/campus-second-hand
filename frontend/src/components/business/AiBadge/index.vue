<template>
  <span class="ai-badge" :class="[`ai-badge--${size}`, `ai-badge--${variant}`]">AI</span>
</template>

<script setup>
/**
 * AI 徽标：黑底白字（solid）或白底黑框（outline），禁止彩色（规范 §2.2/§9）
 * props: size(sm|md) / variant(solid|outline)
 */
defineProps({
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md'].includes(v) },
  variant: { type: String, default: 'solid', validator: (v) => ['solid', 'outline'].includes(v) }
})
</script>

<style scoped lang="scss">
.ai-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--fw-bold);
  letter-spacing: 0.06em;
  border-radius: var(--radius-sm);
  line-height: 1;

  &--sm {
    height: 20px;
    padding: 0 6px;
    font-size: 11px;
  }

  &--md {
    height: 24px;
    padding: 0 8px;
    font-size: var(--fs-caption);
  }

  &--solid {
    background: var(--color-ai);
    color: var(--color-text-inverse);
  }

  &--outline {
    border: 1px solid var(--color-ai-border);
    background: var(--color-bg-surface);
    color: var(--color-ai);
  }
}
</style>
