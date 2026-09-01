<template>
  <div class="ai-recommend">
    <div class="ai-recommend__head">
      <AiBadge size="sm" />
      <h3 class="ai-recommend__title">{{ title }}</h3>
    </div>

    <BaseSkeleton v-if="loading" type="grid" :count="Math.min(count, 4)" />

    <div v-else-if="items.length" class="ai-recommend__scroll scroll-x">
      <div class="ai-recommend__track">
        <div v-for="item in items" :key="item.id" class="ai-recommend__item">
          <GoodsCard
            class="ai-recommend__card"
            :goods="toGoods(item)"
            :show-seller="false"
            ai-tag
            @click="emit('click', item)"
          />
          <p v-if="item.reason" class="ai-recommend__reason">
            <AiBadge size="sm" variant="outline" />
            <span>{{ item.reason }}</span>
          </p>
        </div>
      </div>
    </div>

    <BaseEmpty v-else description="暂无推荐，逛逛别的吧" />
  </div>
</template>

<script setup>
/**
 * AI 推荐展示位：横向滚动卡片 + AI 标识 + 推荐理由（规范 §9、清单）
 * props: title / items([{id,title,price,cover,category,condition,reason}]) / loading / count
 * event: click(item)
 */
import GoodsCard from '@/components/business/GoodsCard/index.vue'
import AiBadge from '@/components/business/AiBadge/index.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton/index.vue'
import BaseEmpty from '@/components/common/BaseEmpty/index.vue'
import { CATEGORY, CONDITION } from '@/utils/dict'

const props = defineProps({
  title: { type: String, default: '猜你喜欢' },
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  count: { type: Number, default: 4 }
})
const emit = defineEmits(['click'])

// 推荐接口字段 -> GoodsCard 适配字段（接口返回无 categoryName/conditionName 时用字典补全）
function toGoods(item) {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    originalPrice: item.originalPrice,
    cover: item.cover,
    category: item.category,
    categoryName: item.category ? CATEGORY[item.category] : '',
    conditionName: item.condition ? CONDITION[String(item.condition)] : '',
    seller: null
  }
}
</script>

<style scoped lang="scss">
.ai-recommend {
  &__head {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }

  &__title {
    font-size: var(--fs-title-sm);
    line-height: var(--lh-title-sm);
    font-weight: var(--fw-semibold);
  }

  &__scroll {
    margin: 0 calc(var(--layout-side-padding) * -1);
    padding: 0 var(--layout-side-padding);
  }

  &__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(220px, 260px);
    gap: var(--space-4);
    width: max-content;
  }

  &__item {
    width: 100%;
  }

  &__reason {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    margin-top: var(--space-2);
    font-size: var(--fs-caption);
    line-height: var(--lh-caption);
    color: var(--color-text-3);
  }
}
</style>
