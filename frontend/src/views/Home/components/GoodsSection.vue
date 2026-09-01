<template>
  <section class="page-section">
    <div class="page-section__header">
      <h2 class="section-title">{{ title }}</h2>
      <router-link v-if="moreTo" :to="moreTo" class="section-more">更多</router-link>
    </div>

    <!-- 加载态：网格骨架（规范 §8.1） -->
    <BaseSkeleton v-if="loading" type="grid" :count="count" />

    <!-- 错误态：区块内嵌重试，不整页崩溃（规范 §8.3） -->
    <div v-else-if="error" class="goods-section__error">
      <BaseEmpty title="加载失败" :description="errorText" action-text="重试" @action="emit('retry')" />
    </div>

    <!-- 空态 -->
    <BaseEmpty v-else-if="!list.length" title="暂无商品" :description="emptyText" />

    <!-- 商品网格：4 列 / 3 列 / 2 列（规范 §4.2） -->
    <div v-else class="goods-section__grid">
      <GoodsCard v-for="goods in list" :key="goods.id" :goods="goods" @click="emit('click', goods)" />
    </div>
  </section>
</template>

<script setup>
/**
 * 首页商品区块（页面私有子组件）：标题 + 更多链接 + 骨架/空态/错误重试 + GoodsCard 网格
 * props: title / moreTo(router-link to) / list / loading / error / count / emptyText / errorText
 * event: click(goods) / retry
 */
import GoodsCard from '@/components/business/GoodsCard/index.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton/index.vue'
import BaseEmpty from '@/components/common/BaseEmpty/index.vue'

defineProps({
  title: { type: String, required: true },
  moreTo: { type: [String, Object], default: '' },
  list: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  count: { type: Number, default: 4 },
  emptyText: { type: String, default: '这里空空如也，稍后再来看看吧' },
  errorText: { type: String, default: '网络开小差了，请重试' }
})
const emit = defineEmits(['click', 'retry'])
</script>

<style scoped lang="scss">
.goods-section {
  &__error {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4);

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
