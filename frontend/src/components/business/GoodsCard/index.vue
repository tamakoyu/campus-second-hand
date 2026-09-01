<template>
  <article
    class="goods-card"
    tabindex="0"
    role="link"
    @click="emit('click', goods)"
    @keyup.enter="emit('click', goods)"
    @keyup.space.prevent="emit('click', goods)"
  >
    <div class="goods-card__media">
      <BaseImage class="goods-card__img" :src="goods.cover" :alt="goods.title" :preview="false" />
      <span v-if="aiTag" class="goods-card__ai"><AiBadge size="sm" /></span>
      <button
        v-if="favoritable"
        type="button"
        class="goods-card__fav"
        :class="{ 'goods-card__fav--active': goods.favorited }"
        :aria-label="goods.favorited ? '取消收藏' : '收藏'"
        @click.stop="emit('favorite', goods)"
      >
        <svg v-if="goods.favorited" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 21s-6.7-4.3-9.3-8.2C.9 10.2 2 6.8 5 5.5 7.2 4.5 9.6 5.4 12 8c2.4-2.6 4.8-3.5 7-2.5 3 1.3 4.1 4.7 2.3 7.3C18.7 16.7 12 21 12 21z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 21s-6.7-4.3-9.3-8.2C.9 10.2 2 6.8 5 5.5 7.2 4.5 9.6 5.4 12 8c2.4-2.6 4.8-3.5 7-2.5 3 1.3 4.1 4.7 2.3 7.3C18.7 16.7 12 21 12 21z"/>
        </svg>
      </button>
    </div>

    <div class="goods-card__body">
      <h3 class="goods-card__title">{{ goods.title }}</h3>
      <BasePrice class="goods-card__price" :price="goods.price" :original="goods.originalPrice" size="sm" />
      <div class="goods-card__tags">
        <BaseTag v-if="goods.conditionName" round>{{ goods.conditionName }}</BaseTag>
        <BaseTag v-if="goods.categoryName" type="default">{{ goods.categoryName }}</BaseTag>
      </div>
      <div v-if="showSeller && goods.seller" class="goods-card__seller">
        <span class="goods-card__avatar">{{ avatarText }}</span>
        <span class="goods-card__seller-name">{{ goods.seller.name }}</span>
        <span class="goods-card__credit tabular-nums">信用 {{ goods.seller.creditScore }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
/**
 * 商品卡片：图 + 标题 + 价格 + 成色/分类标签 + 卖家信用行；hover 上浮（清单、规范 §4.2）
 * props: goods（字段适配后的对象）/ showSeller / aiTag / favoritable
 * event: click(goods) / favorite(goods)
 */
import { computed } from 'vue'
import BaseImage from '@/components/common/BaseImage/index.vue'
import BasePrice from '@/components/common/BasePrice/index.vue'
import BaseTag from '@/components/common/BaseTag/index.vue'
import AiBadge from '@/components/business/AiBadge/index.vue'

const props = defineProps({
  goods: { type: Object, required: true },
  showSeller: { type: Boolean, default: true },
  aiTag: { type: Boolean, default: false },
  favoritable: { type: Boolean, default: false }
})
const emit = defineEmits(['click', 'favorite'])

const avatarText = computed(() => (props.goods?.seller?.name || '同').slice(0, 1))
</script>

<style scoped lang="scss">
.goods-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  cursor: pointer;
  transition: box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);

    .goods-card__img {
      transform: scale(1.02);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    background: var(--color-bg-subtle);
  }

  &__img {
    width: 100%;
    height: 100%;
    transition: transform var(--duration-base) var(--ease-standard);
  }

  &__ai {
    position: absolute;
    top: var(--space-2);
    left: var(--space-2);
  }

  &__fav {
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.92);
    color: var(--color-text-2);
    box-shadow: var(--shadow-sm);
    transition: color var(--duration-fast) var(--ease-standard);

    &:hover {
      color: var(--color-danger);
    }

    &--active {
      color: var(--color-primary);
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    flex: 1;
  }

  &__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: calc(var(--lh-body) * 2);
    font-size: var(--fs-body);
    line-height: var(--lh-body);
    font-weight: var(--fw-medium);
  }

  &__price {
    margin-top: auto;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    flex-wrap: wrap;
  }

  &__seller {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-divider);
    margin-top: var(--space-1);
  }

  &__avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: var(--radius-full);
    background: var(--color-primary-soft);
    color: var(--color-text-1);
    font-size: var(--fs-caption);
    font-weight: var(--fw-medium);
  }

  &__seller-name {
    font-size: var(--fs-aux);
    color: var(--color-text-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__credit {
    margin-left: auto;
    font-size: var(--fs-caption);
    color: var(--color-text-3);
  }
}
</style>
