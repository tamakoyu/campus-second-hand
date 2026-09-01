<template>
  <span class="base-tag" :class="[`base-tag--${type}`, { 'base-tag--round': round }]">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
/**
 * 统一标签：状态/分类/成色/AI 标签（《前端公共组件清单》）
 * 成功态不用绿色：success 与 primary 同属黑色体系（规范 §2.3）；ai = 黑底白字徽标形态。
 * props: type / round / label（无 slot 时兜底文案）
 */
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (v) => ['primary', 'success', 'warning', 'danger', 'ai', 'default'].includes(v)
  },
  round: { type: Boolean, default: false },
  label: { type: String, default: '' }
})
</script>

<style scoped lang="scss">
.base-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 22px;
  padding: 0 var(--space-2);
  font-size: var(--fs-caption);
  line-height: 1;
  font-weight: var(--fw-medium);
  white-space: nowrap;
  border-radius: var(--radius-sm);

  &--round {
    border-radius: var(--radius-full);
  }

  // 默认：浅灰底黑字
  &--default {
    background: var(--color-bg-subtle);
    color: var(--color-text-2);
  }

  // primary / success：黑色实心（成功态禁用绿色，规范 §2.3）
  &--primary,
  &--success {
    background: var(--color-primary);
    color: var(--color-text-inverse);
  }

  &--warning {
    background: rgba(217, 119, 6, 0.12);
    color: var(--color-warning);
  }

  &--danger {
    background: rgba(229, 72, 77, 0.1);
    color: var(--color-danger);
  }

  // AI 徽标形态：黑底白字（规范 §2.2/§9）
  &--ai {
    height: 20px;
    padding: 0 6px;
    border-radius: var(--radius-sm);
    background: var(--color-ai);
    color: var(--color-text-inverse);
    font-size: 11px;
    font-weight: var(--fw-bold);
    letter-spacing: 0.04em;
  }
}
</style>
