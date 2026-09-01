<template>
  <div class="base-price" :class="[`base-price--${size}`, { 'base-price--bold': bold }]">
    <span class="base-price__now tabular-nums">{{ formatPrice(price) }}</span>
    <span v-if="original != null" class="base-price__original tabular-nums">{{ formatPrice(original) }}</span>
    <span v-if="suggest" class="base-price__suggest tabular-nums">建议价 {{ formatPriceRange(suggest.min, suggest.max) }}</span>
  </div>
</template>

<script setup>
/**
 * 价格展示：现价/原价/建议价区间；金额单位「分」自动转元（规范 §3.3、联调约定 §2）
 * props: price / original / suggest({min,max}) / size(sm|md|lg) / bold
 */
import { formatPrice, formatPriceRange } from '@/utils/format'

defineProps({
  price: { type: Number, default: null },
  original: { type: Number, default: null },
  suggest: { type: Object, default: null },
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  bold: { type: Boolean, default: true }
})
</script>

<style scoped lang="scss">
.base-price {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  flex-wrap: wrap;

  &__now {
    color: var(--color-primary);
    font-weight: var(--fw-bold); // 700 仅限价格与关键数字（规范 §3.3）
  }

  &__original {
    color: var(--color-text-3);
    text-decoration: line-through;
  }

  &__suggest {
    color: var(--color-text-3);
  }

  &--sm {
    .base-price__now { font-size: var(--fs-body); line-height: var(--lh-body); }
    .base-price__original, .base-price__suggest { font-size: var(--fs-caption); }
  }

  &--md {
    .base-price__now { font-size: var(--fs-title-sm); line-height: var(--lh-title-sm); }
    .base-price__original, .base-price__suggest { font-size: var(--fs-aux); }
  }

  &--lg {
    .base-price__now { font-size: var(--fs-title-lg); line-height: var(--lh-title-lg); }
    .base-price__original, .base-price__suggest { font-size: var(--fs-body); }
  }

  &--bold .base-price__now {
    font-weight: var(--fw-bold);
  }
}
</style>
