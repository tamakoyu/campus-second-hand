<template>
  <div class="page-container page-main">
    <PageHeader
      :title="pageTitle"
      :description="pageDesc"
      :breadcrumb="[{ label: '首页', path: '/' }, { label: '商品列表', path: '/products' }, { label: '商品详情' }]"
    />

    <!-- 加载：详情分块骨架（规范 §8.1，推荐位骨架在 AiRecommendCard 内） -->
    <BaseSkeleton v-if="loading" type="detail" :rows="6" />

    <!-- 错误：40401 商品不存在/已下架 或网络异常 -->
    <div v-else-if="error" class="detail-error">
      <BaseEmpty
        title="商品不存在或已下架"
        description="去列表页看看其他好物吧"
        action-text="返回列表"
        @action="goList"
      />
    </div>

    <template v-else-if="goods">
      <!-- 信息区 + 卖家区 -->
      <section class="page-section detail-main">
        <div class="detail-main__media">
          <BaseImage class="detail-main__img" :src="goods.cover" :alt="goods.title" preview />
        </div>

        <div class="detail-main__info">
          <h1 class="detail-info__title">{{ goods.title }}</h1>

          <div class="detail-info__price">
            <BasePrice :price="goods.price" :original="goods.originalPrice" size="lg" />
            <div v-if="goods.estimatedPrice != null" class="detail-info__suggest">
              <AiBadge size="sm" />
              <span class="detail-info__suggest-text tabular-nums">AI 建议价 {{ formatPrice(goods.estimatedPrice) }}</span>
            </div>
            <el-button
              class="detail-info__estimate"
              size="small"
              :loading="aiStore.estimate.loading"
              @click="onEstimate"
            >
              <AiBadge size="sm" /> 实时估价
            </el-button>
          </div>

          <!-- AI 估价结果：建议价 + 区间 + 理由（POST /api/ai/estimate，规则引擎兜底） -->
          <div v-if="aiStore.estimate.data" class="estimate">
            <p class="estimate__main">
              <AiBadge size="sm" />
              <span class="estimate__price tabular-nums">{{ formatPrice(aiStore.estimate.data.suggestPrice) }}</span>
              <span v-if="aiStore.estimate.data.priceRange" class="estimate__range tabular-nums">
                区间 {{ formatPriceRange(aiStore.estimate.data.priceRange.min, aiStore.estimate.data.priceRange.max) }}
              </span>
              <BaseTag v-if="aiStore.estimate.data.engine === 'rule'" type="warning">规则引擎</BaseTag>
            </p>
            <p v-if="aiStore.estimate.data.reason" class="estimate__reason">{{ aiStore.estimate.data.reason }}</p>
          </div>
          <div v-else-if="aiStore.estimate.error" class="estimate estimate--error">估价失败，请稍后重试</div>

          <div class="detail-info__meta">
            <BaseTag v-if="goods.conditionName" round>{{ goods.conditionName }}</BaseTag>
            <BaseTag v-if="goods.categoryName" type="default">{{ goods.categoryName }}</BaseTag>
            <span class="detail-info__stat tabular-nums">浏览 {{ formatViews(goods.views) }}</span>
            <span class="detail-info__stat">发布于 {{ formatTime(goods.createdAt) }}</span>
          </div>

          <!-- 交易操作区：收藏（POST /api/favorites/{id} toggle）/ 私信卖家 / 分享 -->
          <div class="detail-info__actions">
            <el-button class="detail-info__btn" :class="{ 'detail-info__btn--faved': goods.favorited }" :loading="favoriteLoading" @click="onFavorite">
              <el-icon class="detail-info__btn-icon"><StarFilled v-if="goods.favorited" /><Star v-else /></el-icon>
              {{ goods.favorited ? '已收藏' : '收藏' }}
            </el-button>
            <el-button type="primary" class="detail-info__btn" @click="onContact">
              <el-icon class="detail-info__btn-icon"><ChatDotRound /></el-icon>私信卖家
            </el-button>
            <el-button class="detail-info__btn" @click="onShare">
              <el-icon class="detail-info__btn-icon"><Share /></el-icon>分享
            </el-button>
          </div>

          <!-- 卖家信息区 -->
          <div v-if="goods.seller" class="seller">
            <div class="seller__avatar">{{ sellerAvatarText }}</div>
            <div class="seller__main">
              <div class="seller__line">
                <span class="seller__name">{{ goods.seller.name }}</span>
                <BaseTag v-if="goods.seller.realNameVerified" type="primary">已实名</BaseTag>
              </div>
              <p class="seller__credit tabular-nums">信用分 {{ goods.seller.creditScore }} · {{ creditLevel(goods.seller.creditScore) }}</p>
            </div>
            <el-button class="seller__contact" plain @click="onContact">联系卖家</el-button>
          </div>
        </div>
      </section>

      <!-- 描述区：超长展开/收起 -->
      <section class="page-section">
        <div class="page-section__header"><h2 class="section-title">商品描述</h2></div>
        <div class="desc" :class="{ 'desc--collapsed': descCollapsed && descLong }">
          <p class="desc__text">{{ goods.description || '卖家暂时没有填写描述' }}</p>
        </div>
        <button v-if="descLong" type="button" class="desc__toggle" @click="descCollapsed = !descCollapsed">
          {{ descCollapsed ? '展开全文' : '收起' }}
        </button>
      </section>

      <!-- 相关推荐：GET /api/ai/recommend?scene=detail（同分类 + 热门兜底；接口失败降级最新商品） -->
      <section class="page-section">
        <AiRecommendCard
          title="相关推荐"
          :items="recommend.items"
          :loading="recommend.loading"
          :degraded="recommend.degraded"
          :count="4"
          @click="onRecommendClick"
        />
      </section>
    </template>

    <!-- AI 问答悬浮按钮（规范 §9：黑底白字 AI 徽标，黑白体系） -->
    <button v-if="goods && !chatVisible" type="button" class="ai-float" @click="chatVisible = true" aria-label="打开 AI 问答">
      <AiBadge size="sm" />
      <span class="ai-float__text">AI 问答</span>
    </button>

    <!-- AI 问答悬浮面板：商品上下文 + 快捷问题 + 打字动画 + 转人工 -->
    <div v-if="goods" class="ai-chat-panel" :class="{ 'is-open': chatVisible }">
      <AiPanel
        class="ai-chat-panel__inner"
        :visible="chatVisible"
        :goods-summary="goodsSummary"
        closable
        @close="chatVisible = false"
      >
        <AiChat
          class="ai-chat-panel__chat"
          :messages="chatMessages"
          :loading="chatLoading"
          :quick-questions="QUICK_QUESTIONS"
          @send="onSendQuestion"
          @transfer-human="onTransferHuman"
          @clear="aiStore.clearChat(productId)"
        />
      </AiPanel>
    </div>
  </div>
</template>

<script setup>
// 商品详情 + AI 智能问答（负责人：范胜洲）——步骤 6 交付
// 接口：GET /api/products/{id}（views +1）+ GET /api/ai/recommend?scene=detail + POST /api/ai/chat（需登录）
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, StarFilled, ChatDotRound, Share } from '@element-plus/icons-vue'
import PageHeader from '@/components/business/PageHeader/index.vue'
import AiRecommendCard from '@/components/business/AiRecommendCard/index.vue'
import AiBadge from '@/components/business/AiBadge/index.vue'
import AiPanel from '@/components/business/AiPanel/index.vue'
import AiChat from '@/components/business/AiChat/index.vue'
import BaseImage from '@/components/common/BaseImage/index.vue'
import BasePrice from '@/components/common/BasePrice/index.vue'
import BaseTag from '@/components/common/BaseTag/index.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton/index.vue'
import BaseEmpty from '@/components/common/BaseEmpty/index.vue'
import { useGoodsDetail } from '@/composables/useGoodsDetail'
import goodsApi from '@/api/goods'
import { useAiStore } from '@/store/ai'
import { useUserStore } from '@/store/user'
import { creditLevel } from '@/utils/dict'
import { formatViews, formatTime, formatPrice, formatPriceRange } from '@/utils/format'
import { trackRecommendClick } from '@/utils/analytics'

const route = useRoute()
const router = useRouter()
const aiStore = useAiStore()
const userStore = useUserStore()

const productId = computed(() => String(route.params.id || ''))
const { goods, loading, error, load, recommend } = useGoodsDetail(productId)

const chatVisible = ref(false)
const descCollapsed = ref(true)
const favoriteLoading = ref(false)

/** 预设快捷问题（计划书步骤 6） */
const QUICK_QUESTIONS = ['成色怎么样？', '可以刀吗？', '怎么交易？', '支持自提吗？']

// 切换商品（相关推荐点击）时重置交互态并重新加载
watch(
  productId,
  () => {
    descCollapsed.value = true
    chatVisible.value = false
    aiStore.initChat(productId.value)
    load()
  },
  { immediate: true }
)

const pageTitle = computed(() => goods.value?.title || '商品详情')
const pageDesc = computed(() =>
  goods.value ? [goods.value.conditionName, goods.value.categoryName].filter(Boolean).join(' · ') : '查看商品信息并与 AI 智能问答互动'
)
const goodsSummary = computed(() => ({
  title: goods.value?.title || '',
  price: goods.value?.price,
  conditionName: goods.value?.conditionName
}))
const chatMessages = computed(() => aiStore.messagesOf(productId.value))
const chatLoading = computed(() => aiStore.chatLoadingOf(productId.value))
const sellerAvatarText = computed(() => (goods.value?.seller?.name || '同').slice(0, 1))
const descLong = computed(() => (goods.value?.description || '').length > 120)

// ---- AI 问答交互（登录校验 + store 管理会话；sendQuestion 内部已做失败兜底）----
function onSendQuestion(text) {
  if (!userStore.isLoggedIn) {
    ElMessage({ message: '登录后即可向 AI 提问', type: 'warning' })
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  aiStore.sendQuestion(productId.value, text)
}

// 转人工私信：带商品 id 与当前问题（联调约定 §8）
function onTransferHuman(payload) {
  if (!userStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  router.push({ path: '/message', query: { productId: productId.value, question: payload?.question || '' } })
}

// ---- 交易操作区 ----
function onContact() {
  if (!userStore.isLoggedIn) {
    ElMessage({ message: '登录后即可联系卖家', type: 'warning' })
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  router.push({ path: '/message', query: { productId: productId.value } })
}

// 收藏：toggle（POST /api/favorites/{productId} -> {favorited}，联调核对步骤 9）
async function onFavorite() {
  if (!userStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  favoriteLoading.value = true
  try {
    const data = await goodsApi.toggleFavorite(productId.value)
    if (goods.value) goods.value.favorited = data.favorited
    ElMessage({ message: data.favorited ? '已收藏' : '已取消收藏', type: 'success' })
  } catch {
    // 失败提示由 request 拦截器统一处理
  } finally {
    favoriteLoading.value = false
  }
}

// AI 实时估价（POST /api/ai/estimate，需登录；金额单位分，规则引擎兜底）
function onEstimate() {
  if (!userStore.isLoggedIn) {
    ElMessage({ message: '登录后即可使用 AI 估价', type: 'warning' })
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  aiStore.fetchEstimate({
    originalPrice: goods.value?.originalPrice ?? goods.value?.price,
    category: goods.value?.category,
    condition: goods.value?.condition != null ? Number(goods.value.condition) : null
  })
}

async function onShare() {
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: goods.value?.title || '校园二手好物', url })
      return
    }
    await navigator.clipboard.writeText(url)
    ElMessage({ message: '链接已复制，快去分享吧', type: 'success' })
  } catch {
    // 用户取消分享或剪贴板不可用时静默
  }
}

function goDetail(item) {
  router.push(`/product/${item.id}`)
}

// 相关推荐点击：埋点（步骤 7）后跳详情
function onRecommendClick(item) {
  trackRecommendClick({ scene: 'detail', item, from: 'detail-related' })
  goDetail(item)
}

function goList() {
  router.push('/products')
}
</script>

<style scoped lang="scss">
.detail-main {
  display: grid;
  grid-template-columns: 460px 1fr;
  gap: var(--space-8);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  &__media {
    position: sticky;
    top: calc(var(--layout-header-height) + var(--space-4));
  }

  &__img {
    aspect-ratio: 4 / 3;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
}

.detail-info {
  &__title {
    font-size: var(--fs-title-lg);
    line-height: var(--lh-title-lg);
    font-weight: var(--fw-semibold);
  }

  &__price {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-4);
  }

  &__suggest {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
  }

  &__suggest-text {
    font-size: var(--fs-aux);
    color: var(--color-text-2);
  }

  &__estimate {
    margin-left: auto;
  }

  &__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }

  &__stat {
    font-size: var(--fs-aux);
    color: var(--color-text-3);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-6);
  }

  &__btn-icon {
    margin-right: 2px;
    vertical-align: -2px;
  }

  &__btn--faved {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.estimate {
  margin-top: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-subtle);

  &__main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  &__price {
    font-size: var(--fs-title-sm);
    line-height: var(--lh-title-sm);
    font-weight: var(--fw-bold);
    color: var(--color-primary);
  }

  &__range {
    font-size: var(--fs-aux);
    color: var(--color-text-2);
  }

  &__reason {
    margin-top: var(--space-1);
    font-size: var(--fs-aux);
    line-height: var(--lh-aux);
    color: var(--color-text-2);
  }

  &--error {
    font-size: var(--fs-aux);
    color: var(--color-danger);
  }
}

.seller {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);

  &__avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    color: var(--color-text-inverse);
    font-size: var(--fs-body-lg);
    font-weight: var(--fw-medium);
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__line {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__name {
    font-size: var(--fs-body-lg);
    font-weight: var(--fw-medium);
  }

  &__credit {
    margin-top: 2px;
    font-size: var(--fs-aux);
    color: var(--color-text-3);
  }

  &__contact {
    flex-shrink: 0;
  }
}

.desc {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);

  &__text {
    font-size: var(--fs-body-lg);
    line-height: var(--lh-body-lg);
    color: var(--color-text-1);
    white-space: pre-wrap;
    word-break: break-word;
  }

  &--collapsed .desc__text {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__toggle {
    margin-top: var(--space-2);
    font-size: var(--fs-aux);
    color: var(--color-text-2);
    transition: color var(--duration-fast) var(--ease-standard);

    &:hover {
      color: var(--color-primary);
    }
  }
}

.detail-error {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

// AI 问答悬浮按钮（黑底白字，规范 §9）
.ai-float {
  position: fixed;
  right: var(--space-6);
  bottom: var(--space-6);
  z-index: 91;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 48px;
  padding: 0 var(--space-4);
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-ai);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-ai);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard);

  &:hover {
    transform: translateY(-2px);
  }

  &__text {
    font-size: var(--fs-body);
    font-weight: var(--fw-medium);
  }
}

// AI 问答悬浮面板（右侧抽屉式，位于悬浮按钮上方）
.ai-chat-panel {
  position: fixed;
  right: var(--space-6);
  bottom: 88px;
  z-index: 90;
  display: none;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 560px;
  max-height: calc(100vh - 120px);

  &.is-open {
    display: block;
  }

  &__inner {
    height: 100%;
  }

  &__chat {
    height: 100%;
  }
}
</style>
