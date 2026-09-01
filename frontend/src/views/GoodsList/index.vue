<template>
  <div class="page-container page-main">
    <PageHeader
      title="商品列表"
      :description="resultDesc"
      :breadcrumb="[{ label: '首页', path: '/' }, { label: '商品列表' }]"
    >
      <template #extra>
        <el-button v-if="hasActiveFilters" text type="primary" @click="resetFilters">清空筛选</el-button>
      </template>
    </PageHeader>

    <!-- 筛选栏：关键词 + 分类 + 排序（SearchBar），价格区间 + 成色 + 重置 -->
    <section class="page-section">
      <div class="filter">
        <SearchBar
          v-model="keyword"
          v-model:category="category"
          v-model:sort="sort"
          :categories="CATEGORY_OPTIONS"
          :sort-options="SORT_OPTIONS"
          :loading="loading"
          @search="onSearch"
        />

        <div class="filter__row">
          <div class="filter__price">
            <span class="filter__label">价格</span>
            <el-input-number
              v-model="minPriceYuan"
              class="filter__num"
              :min="0"
              :precision="0"
              :controls="false"
              placeholder="最低"
              @change="onPriceChange"
            />
            <span class="filter__sep">–</span>
            <el-input-number
              v-model="maxPriceYuan"
              class="filter__num"
              :min="0"
              :precision="0"
              :controls="false"
              placeholder="最高"
              @change="onPriceChange"
            />
            <span class="filter__unit">元</span>
          </div>

          <el-select v-model="condition" class="filter__condition" placeholder="成色" clearable @change="onConditionChange">
            <el-option v-for="c in CONDITION_OPTIONS" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>

          <el-button class="filter__reset" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </section>

    <!-- 结果区：骨架 / 错误重试 / 空态 / 网格 + 分页 -->
    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">{{ resultTitle }}</h2>
        <span v-if="total" class="result-total tabular-nums">共 {{ total }} 件</span>
      </div>

      <BaseSkeleton v-if="loading" type="grid" :count="8" />

      <div v-else-if="error" class="result-state">
        <BaseEmpty title="加载失败" description="网络开小差了，请重试" action-text="重试" @action="fetchData" />
      </div>

      <BaseEmpty
        v-else-if="!list.length"
        title="没有找到相关商品"
        description="换个关键词或放宽筛选条件试试"
        action-text="去逛逛"
        @action="resetFilters"
      />

      <template v-else>
        <div class="goods-grid">
          <GoodsCard v-for="goods in list" :key="goods.id" :goods="goods" :highlight="highlightKeyword" @click="goDetail" />
        </div>
        <BasePagination :total="total" :page="page" :page-size="pageSize" @change="onPageChange" />
      </template>
    </section>
  </div>
</template>

<script setup>
// 商品列表 / 检索（负责人：范胜洲）——步骤 5 交付
// URL 为筛选唯一事实源：?keyword=&category=&condition=&minPrice=&maxPrice=&sort=&page=，
// 刷新/前进后退不丢筛选（规范 §8.5）；金额 URL 用「元」，进 store/接口转「分」。
// 接口：GET /api/products（v1.1 §7.1，实现方田博），数据在 goodsStore 中。
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/business/PageHeader/index.vue'
import SearchBar from '@/components/business/SearchBar/index.vue'
import GoodsCard from '@/components/business/GoodsCard/index.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton/index.vue'
import BaseEmpty from '@/components/common/BaseEmpty/index.vue'
import BasePagination from '@/components/common/BasePagination/index.vue'
import { useGoodsStore } from '@/store/goods'
import { CATEGORY_OPTIONS, CONDITION_OPTIONS, SORT_OPTIONS, CATEGORY, CONDITION } from '@/utils/dict'

const route = useRoute()
const router = useRouter()
const store = useGoodsStore()

// ---- 筛选状态（页面 ref，随 URL 同步；store 只承载请求参数与结果）----
const keyword = ref('')
const category = ref('')
const condition = ref('')
const sort = ref('latest')
const minPriceYuan = ref(null) // 展示层用「元」
const maxPriceYuan = ref(null)
const page = ref(1)

const loading = computed(() => store.loading)
const list = computed(() => store.list)
const total = computed(() => store.total)
const pageSize = computed(() => store.pageSize)
const highlightKeyword = computed(() => keyword.value.trim())

const hasActiveFilters = computed(
  () =>
    !!(
      keyword.value.trim() ||
      category.value ||
      condition.value ||
      minPriceYuan.value != null ||
      maxPriceYuan.value != null ||
      sort.value !== 'latest'
    )
)

const resultTitle = computed(() => (highlightKeyword.value ? `搜索“${highlightKeyword.value}”` : '全部商品'))

const resultDesc = computed(() => {
  const parts = []
  if (category.value) parts.push(`分类：${CATEGORY[category.value] || category.value}`)
  if (condition.value) parts.push(`成色：${CONDITION[condition.value] || condition.value}`)
  if (minPriceYuan.value != null || maxPriceYuan.value != null) {
    parts.push(`价格：${minPriceYuan.value ?? 0} – ${maxPriceYuan.value ?? '不限'} 元`)
  }
  return parts.length ? parts.join(' · ') : '筛选平台在售的全部闲置好物'
})

// ---- URL <-> 状态同步（URL 唯一事实源；值做防御校验，非法参数忽略）----
function parseQuery(q) {
  keyword.value = typeof q.keyword === 'string' ? q.keyword : ''
  category.value = CATEGORY_OPTIONS.some((o) => o.value === q.category) ? q.category : ''
  condition.value = CONDITION_OPTIONS.some((o) => o.value === q.condition) ? q.condition : ''
  sort.value = SORT_OPTIONS.some((o) => o.value === q.sort) ? q.sort : 'latest'
  minPriceYuan.value = q.minPrice != null && q.minPrice !== '' ? Number(q.minPrice) : null
  maxPriceYuan.value = q.maxPrice != null && q.maxPrice !== '' ? Number(q.maxPrice) : null
  const p = Number(q.page)
  page.value = Number.isInteger(p) && p > 0 ? p : 1
}

function buildQuery() {
  const q = {}
  const kw = keyword.value.trim()
  if (kw) q.keyword = kw
  if (category.value) q.category = category.value
  if (condition.value) q.condition = condition.value
  if (minPriceYuan.value != null && minPriceYuan.value !== '') q.minPrice = String(minPriceYuan.value)
  if (maxPriceYuan.value != null && maxPriceYuan.value !== '') q.maxPrice = String(maxPriceYuan.value)
  if (sort.value && sort.value !== 'latest') q.sort = sort.value
  if (page.value > 1) q.page = String(page.value)
  return q
}

function pushQuery() {
  router.replace({ path: '/products', query: buildQuery() })
}

watch(
  () => route.query,
  () => {
    parseQuery(route.query)
    // 金额转「分」入 store/接口；非有限数值置空（防御处理）
    const minCents = Number.isFinite(minPriceYuan.value) ? Math.round(minPriceYuan.value * 100) : null
    const maxCents = Number.isFinite(maxPriceYuan.value) ? Math.round(maxPriceYuan.value * 100) : null
    store.setFilters({
      keyword: keyword.value.trim(),
      category: category.value,
      condition: condition.value,
      minPrice: minCents,
      maxPrice: maxCents,
      sort: sort.value
    })
    store.setPage(page.value)
    store.fetchList()
  },
  { immediate: true }
)

// ---- 交互：改筛选 -> 重置页码 -> 更新 URL（watcher 触发请求）----
function onSearch() {
  page.value = 1
  pushQuery()
}

function onConditionChange() {
  page.value = 1
  pushQuery()
}

function onPriceChange() {
  // 最低价高于最高价时交换，避免必然无结果
  if (minPriceYuan.value != null && maxPriceYuan.value != null && minPriceYuan.value > maxPriceYuan.value) {
    ;[minPriceYuan.value, maxPriceYuan.value] = [maxPriceYuan.value, minPriceYuan.value]
  }
  page.value = 1
  pushQuery()
}

function onPageChange(p) {
  page.value = p
  pushQuery()
  // 翻页后回到列表顶部，避免停留在旧位置（规范 §8.5）
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetFilters() {
  keyword.value = ''
  category.value = ''
  condition.value = ''
  sort.value = 'latest'
  minPriceYuan.value = null
  maxPriceYuan.value = null
  page.value = 1
  pushQuery()
}

function fetchData() {
  return store.fetchList()
}

function goDetail(goods) {
  router.push(`/product/${goods.id}`)
}
</script>

<style scoped lang="scss">
.filter {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);

  &__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  &__price {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__label {
    font-size: var(--fs-body);
    color: var(--color-text-2);
  }

  &__num {
    width: 120px;
  }

  &__sep {
    color: var(--color-text-3);
  }

  &__unit {
    font-size: var(--fs-aux);
    color: var(--color-text-3);
  }

  &__condition {
    width: 140px;
  }

  &__reset {
    margin-left: auto;
  }
}

.result-total {
  font-size: var(--fs-aux);
  color: var(--color-text-3);
}

.result-state {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.goods-grid {
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
</style>
