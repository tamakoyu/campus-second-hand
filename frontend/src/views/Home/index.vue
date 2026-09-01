<template>
  <div class="page-container page-main">
    <!-- Hero：品牌声明 + 主搜索（步骤 4 顶部搜索入口，跳列表页带参数） -->
    <section class="hero">
      <span class="hero__badge">AI</span>
      <h1 class="hero__title">AI 智能校园二手交易平台</h1>
      <p class="hero__desc">AI 估价 · AI 发布助手 · AI 智能问答 · 信用担保交易</p>
      <SearchBar
        v-model="heroKeyword"
        class="hero__search"
        size="lg"
        placeholder="搜索想要的闲置好物，回车或点击搜索"
        @search="onHeroSearch"
      />
    </section>

    <!-- 公告条：静态文案占位（后端公告接口就绪后替换为接口数据） -->
    <section class="notice" aria-label="平台公告">
      <el-icon class="notice__icon"><InfoFilled /></el-icon>
      <p class="notice__text">仅限本校师生交易，请勿脱离平台私下转账，谨防诈骗</p>
    </section>

    <!-- 分类导航：按枚举字典渲染；/api/dicts 接口就绪后切换为接口数据（规范 §10） -->
    <nav class="category" aria-label="商品分类">
      <button v-for="item in categories" :key="item.value" type="button" class="category__item" @click="goCategory(item.value)">
        <el-icon class="category__icon"><component :is="item.icon" /></el-icon>
        <span class="category__label">{{ item.label }}</span>
      </button>
    </nav>

    <!-- AI 推荐位：猜你喜欢（GET /api/ai/recommend?scene=home，免登录降级热门） -->
    <section class="page-section">
      <AiRecommendCard :items="recommend.items" :loading="recommend.loading" :count="4" @click="goDetail" />
    </section>

    <!-- 最新商品 -->
    <GoodsSection
      title="最新上架"
      :list="latest.list"
      :loading="latest.loading"
      :error="latest.error"
      more-to="/products"
      empty-text="暂无在售商品，晚点再来看看吧"
      @click="goDetail"
      @retry="fetchLatest"
    />

    <!-- 热门商品 -->
    <GoodsSection
      title="热门商品"
      :list="hot.list"
      :loading="hot.loading"
      :error="hot.error"
      more-to="/products?sort=hot"
      empty-text="暂无热门商品，晚点再来看看吧"
      @click="goDetail"
      @retry="fetchHot"
    />
  </div>
</template>

<script setup>
// 首页（负责人：范胜洲）——步骤 4 交付：主搜索 / 公告 / 分类导航 / AI 推荐位 / 最新 / 热门
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { InfoFilled, Reading, Cellphone, CoffeeCup, Basketball, Suitcase, Grid } from '@element-plus/icons-vue'
import SearchBar from '@/components/business/SearchBar/index.vue'
import AiRecommendCard from '@/components/business/AiRecommendCard/index.vue'
import GoodsSection from './components/GoodsSection.vue'
import { useHomeData } from '@/composables/useHomeData'
import { CATEGORY } from '@/utils/dict'

const router = useRouter()
const heroKeyword = ref('')

// 分类导航（图标为 Element Plus 单色线性图标，与黑白体系一致；接口就绪后可换 /api/dicts）
const categories = [
  { value: 'book', label: CATEGORY.book, icon: Reading },
  { value: 'digital', label: CATEGORY.digital, icon: Cellphone },
  { value: 'living', label: CATEGORY.living, icon: CoffeeCup },
  { value: 'sports', label: CATEGORY.sports, icon: Basketball },
  { value: 'clothing', label: CATEGORY.clothing, icon: Suitcase },
  { value: 'other', label: CATEGORY.other, icon: Grid }
]

// 首页数据：推荐位（aiStore 缓存）+ 最新/热门（页面私有）
const { recommend, latest, hot, fetchAll, fetchLatest, fetchHot } = useHomeData()

onMounted(fetchAll)

// 主搜索：跳列表页并带筛选参数（URL 参数同步，规范 §8.5；列表页步骤 5 读取）
function onHeroSearch({ keyword, category, sort }) {
  const query = {}
  if (keyword) query.keyword = keyword
  if (category) query.category = category
  if (sort) query.sort = sort
  router.push({ path: '/products', query })
}

function goCategory(category) {
  router.push({ path: '/products', query: { category } })
}

function goDetail(goods) {
  router.push(`/product/${goods.id}`)
}
</script>

<style scoped lang="scss">
.hero {
  padding: var(--space-16) 0 var(--space-12);
  text-align: center;

  &__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 32px;
    padding: 0 var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--color-ai);
    color: var(--color-text-inverse);
    font-size: var(--fs-body);
    font-weight: var(--fw-bold);
    letter-spacing: 0.08em;
  }

  &__title {
    margin-top: var(--space-4);
    font-size: var(--fs-display);
    line-height: var(--lh-display);
    font-weight: var(--fw-semibold);
    letter-spacing: 0.02em;
  }

  &__desc {
    margin-top: var(--space-2);
    font-size: var(--fs-body-lg);
    color: var(--color-text-2);
  }

  &__search {
    max-width: 560px;
    margin: var(--space-8) auto 0;
  }
}

.notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  margin-bottom: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-subtle);
  font-size: var(--fs-aux);
  color: var(--color-text-2);

  &__icon {
    flex-shrink: 0;
    color: var(--color-text-2);
  }
}

.category {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-10);

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-5) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg-surface);
    transition: box-shadow var(--duration-fast) var(--ease-standard),
      transform var(--duration-fast) var(--ease-standard);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__icon {
    font-size: 26px;
    color: var(--color-text-1);
  }

  &__label {
    font-size: var(--fs-body);
    line-height: var(--lh-body);
    font-weight: var(--fw-medium);
    color: var(--color-text-1);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
