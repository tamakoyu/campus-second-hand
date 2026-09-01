<template>
  <div class="base-skeleton" :class="`base-skeleton--${type}`" :aria-hidden="true">
    <!-- 列表/推荐位网格骨架 -->
    <template v-if="type === 'grid'">
      <div v-for="i in count" :key="i" class="base-skeleton__card">
        <div class="base-skeleton__block base-skeleton__media" />
        <div class="base-skeleton__block base-skeleton__line base-skeleton__line--60" />
        <div class="base-skeleton__block base-skeleton__line base-skeleton__line--40" />
      </div>
    </template>

    <!-- 详情页分块骨架：左图右文 -->
    <template v-else-if="type === 'detail'">
      <div class="base-skeleton__detail">
        <div class="base-skeleton__block base-skeleton__media--detail" />
        <div class="base-skeleton__detail-info">
          <div v-for="i in rows" :key="i" class="base-skeleton__block base-skeleton__line"
            :style="{ width: (i === rows ? 40 : 100) + '%' }" />
        </div>
      </div>
    </template>

    <!-- 单行骨架（评论/列表项等） -->
    <template v-else>
      <div v-for="i in rows" :key="i" class="base-skeleton__line-row">
        <div class="base-skeleton__block base-skeleton__line" :style="{ width: (i === rows ? 40 : 100) + '%' }" />
      </div>
    </template>
  </div>
</template>

<script setup>
/**
 * 骨架屏：grid（网格，默认 4 列）/ detail（详情分块）/ line（单行）（规范 §8.1）
 * props: type / count（grid 列数）/ rows（detail、line 行数）
 */
defineProps({
  type: { type: String, default: 'grid', validator: (v) => ['grid', 'detail', 'line'].includes(v) },
  count: { type: Number, default: 4 },
  rows: { type: Number, default: 4 }
})
</script>

<style scoped lang="scss">
.base-skeleton {
  &--grid {
    display: grid;
    grid-template-columns: repeat(v-bind(count), 1fr);
    gap: var(--space-4);
  }

  &__card {
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
  }

  &__detail {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: var(--space-8);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__detail-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-top: var(--space-2);
  }

  &__line-row {
    padding: var(--space-3) 0;
  }

  &__block {
    border-radius: var(--radius-sm);
    background: linear-gradient(90deg, #f0f0f0 25%, #fafafa 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.4s ease infinite;
  }

  &__media {
    aspect-ratio: 4 / 3;
    margin-bottom: var(--space-3);
    border-radius: var(--radius-md);
  }

  &__media--detail {
    aspect-ratio: 4 / 3;
    border-radius: var(--radius-lg);
  }

  &__line {
    height: 14px;
    margin-bottom: var(--space-2);

    &--60 { width: 60%; }
    &--40 { width: 40%; }
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
</style>
