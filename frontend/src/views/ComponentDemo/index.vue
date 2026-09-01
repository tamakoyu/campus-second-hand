<template>
  <div class="page-container page-main">
    <PageHeader
      title="公共组件示例页"
      description="步骤 3 交付物：通用组件库 + 业务组件演示（黑白极简体系）"
      :breadcrumb="[{ label: '首页', path: '/' }, { label: '组件示例' }]"
    >
      <template #extra><el-button type="primary" @click="goHome">返回首页</el-button></template>
    </PageHeader>

    <!-- BaseCard / BaseTag -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">BaseCard / BaseTag</h2></div>
      <div class="demo-grid demo-grid--2">
        <BaseCard title="卡片标题" extra="更多 ›" hoverable>
          通用卡片容器：1px 描边 + 圆角 + 留白，hoverable 时上浮并叠加阴影。
        </BaseCard>
        <div class="demo-tags">
          <BaseTag>默认</BaseTag><BaseTag type="primary">主标签</BaseTag><BaseTag type="success">成功 ✓</BaseTag>
          <BaseTag type="warning">待审核</BaseTag><BaseTag type="danger">已下架</BaseTag>
          <BaseTag type="ai">AI</BaseTag><BaseTag round>九成新</BaseTag>
        </div>
      </div>
    </section>

    <!-- BasePrice -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">BasePrice（金额单位：分）</h2></div>
      <div class="demo-prices">
        <BasePrice :price="19900" size="sm" />
        <BasePrice :price="39900" :original="59900" />
        <BasePrice :price="19900" :original="39900" :suggest="{ min: 16000, max: 24000 }" size="lg" />
      </div>
    </section>

    <!-- BaseImage -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">BaseImage（懒加载 / 失败兜底 / 预览）</h2></div>
      <div class="demo-imgs">
        <BaseImage class="demo-imgs__item" :src="imgUrl('kbd')" alt="机械键盘" preview />
        <BaseImage class="demo-imgs__item" :src="imgUrl('book')" alt="教材" />
        <BaseImage class="demo-imgs__item" src="" alt="加载失败示例" />
      </div>
    </section>

    <!-- BaseSkeleton -->
    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">BaseSkeleton</h2>
        <el-button size="small" @click="skeletonLoading = !skeletonLoading">{{ skeletonLoading ? '显示内容' : '显示骨架' }}</el-button>
      </div>
      <BaseSkeleton v-if="skeletonLoading" type="grid" :count="4" />
      <BaseSkeleton v-else type="detail" :rows="4" />
    </section>

    <!-- BaseEmpty -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">BaseEmpty</h2></div>
      <div class="demo-grid demo-grid--2">
        <BaseEmpty title="没有找到相关商品" description="换个关键词试试" action-text="去逛逛" @action="toast('去逛逛（action 事件）')" />
        <BaseEmpty description="默认空态（无操作按钮）" />
      </div>
    </section>

    <!-- BasePagination -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">BasePagination（共 {{ total }} 件，每页 12 条）</h2></div>
      <BasePagination :total="total" :page="page" :page-size="12" @change="onPageChange" />
    </section>

    <!-- BaseModal -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">BaseModal（按钮顺序 [取消] [确定]）</h2></div>
      <el-button @click="modalVisible = true">打开普通确认框</el-button>
      <el-button type="danger" plain @click="dangerModalVisible = true">打开危险确认框</el-button>
      <BaseModal v-model="modalVisible" title="确认收藏" confirm-text="收藏" @confirm="toast('已收藏（confirm 事件）')">
        收藏后可在个人中心查看，确定收藏该商品吗？
      </BaseModal>
      <BaseModal v-model="dangerModalVisible" title="确认下架" confirm-text="下架" danger @confirm="toast('已下架（danger confirm）')">
        下架后买家将无法再看到该商品，确定下架吗？
      </BaseModal>
    </section>

    <!-- SearchBar -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">SearchBar</h2></div>
      <SearchBar
        v-model="searchKeyword"
        v-model:category="searchCategory"
        v-model:sort="searchSort"
        :categories="categoryOptions"
        :sort-options="sortOptions"
        @search="onSearch"
      />
    </section>

    <!-- GoodsCard -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">GoodsCard</h2></div>
      <div class="demo-grid demo-grid--4">
        <GoodsCard v-for="g in goodsList" :key="g.id" :goods="g" favoritable @click="onGoodsClick" @favorite="onFavorite" />
      </div>
    </section>

    <!-- AiBadge / AiPanel / AiChat -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">AiBadge / AiPanel / AiChat（本地模拟）</h2></div>
      <div class="demo-grid demo-grid--2">
        <div class="demo-ai-left">
          <div class="demo-tags">
            <AiBadge size="sm" /><AiBadge size="md" /><AiBadge size="sm" variant="outline" />
          </div>
          <div class="demo-panel-wrap">
            <el-button size="small" @click="panelVisible = !panelVisible">{{ panelVisible ? '收起面板' : '展开 AI 面板' }}</el-button>
            <AiPanel v-show="panelVisible" :goods-summary="goodsSummary" class="demo-panel">
              <div class="demo-panel-inner">AI 面板内容插槽：可放 AiChat 或估价结果等。</div>
            </AiPanel>
          </div>
        </div>
        <div class="demo-chat">
          <AiChat
            :messages="chatMessages"
            :loading="chatLoading"
            :quick-questions="quickQuestions"
            @send="onChatSend"
            @transfer-human="onTransfer"
            @clear="chatMessages = []"
          />
        </div>
      </div>
    </section>

    <!-- AiRecommendCard -->
    <section class="page-section">
      <div class="page-section__header"><h2 class="section-title">AiRecommendCard（横向滚动）</h2></div>
      <AiRecommendCard title="猜你喜欢" :items="recommendItems" @click="onRecommendClick" />
    </section>
  </div>
</template>

<script setup>
/**
 * 公共组件示例页（步骤 3 交付物）
 * 演示数据为本地 mock，仅用于组件走查；接入页面开发（步骤 4-8）时替换为真实接口。
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader/index.vue'
import SearchBar from '@/components/business/SearchBar/index.vue'
import GoodsCard from '@/components/business/GoodsCard/index.vue'
import AiBadge from '@/components/business/AiBadge/index.vue'
import AiPanel from '@/components/business/AiPanel/index.vue'
import AiChat from '@/components/business/AiChat/index.vue'
import AiRecommendCard from '@/components/business/AiRecommendCard/index.vue'
import BaseCard from '@/components/common/BaseCard/index.vue'
import BaseEmpty from '@/components/common/BaseEmpty/index.vue'
import BaseSkeleton from '@/components/common/BaseSkeleton/index.vue'
import BasePagination from '@/components/common/BasePagination/index.vue'
import BaseTag from '@/components/common/BaseTag/index.vue'
import BasePrice from '@/components/common/BasePrice/index.vue'
import BaseImage from '@/components/common/BaseImage/index.vue'
import BaseModal from '@/components/common/BaseModal/index.vue'
import { CATEGORY_OPTIONS, SORT_OPTIONS } from '@/utils/dict'

const router = useRouter()
const categoryOptions = CATEGORY_OPTIONS
const sortOptions = SORT_OPTIONS

function goHome() { router.push('/') }
function toast(msg) { ElMessage({ message: msg, type: 'success' }) }

// 图片（外链失败时 BaseImage 会展示兜底插画）
function imgUrl(seed) { return 'https://picsum.photos/seed/' + seed + '/400/300' }

// 骨架切换
const skeletonLoading = ref(false)

// 分页
const total = ref(128)
const page = ref(1)
function onPageChange(p) { page.value = p; toast('切到第 ' + p + ' 页') }

// 弹窗
const modalVisible = ref(false)
const dangerModalVisible = ref(false)

// 搜索
const searchKeyword = ref('')
const searchCategory = ref('')
const searchSort = ref('')
function onSearch(payload) { toast('搜索：' + JSON.stringify(payload)) }

// 商品卡片
const goodsList = [
  { id: 1, title: '九成新机械键盘，青轴 87 键，附原装数据线', price: 19900, originalPrice: 39900, cover: imgUrl('kbd'), category: 'digital', categoryName: '数码产品', condition: '90', conditionName: '九成新', views: 86, createdAt: '2026-09-01 10:00:00', seller: { id: 1, name: '张三', avatar: '', creditScore: 100, realNameVerified: true } },
  { id: 2, title: '高数教材上册（全新未翻）', price: 1500, originalPrice: 4800, cover: imgUrl('book'), category: 'book', categoryName: '教材图书', condition: '100', conditionName: '全新', views: 32, createdAt: '2026-09-01 09:30:00', seller: { id: 2, name: '李四', avatar: '', creditScore: 112, realNameVerified: true } },
  { id: 3, title: '小米台灯 1S，八成新', price: 4500, originalPrice: 8900, cover: imgUrl('lamp'), category: 'living', categoryName: '生活用品', condition: '80', conditionName: '八成新', views: 15, createdAt: '2026-08-31 20:00:00', seller: { id: 3, name: '王五', avatar: '', creditScore: 95, realNameVerified: true } },
  { id: 4, title: '耐克运动鞋 42 码，穿过一次', price: 12900, originalPrice: 69900, cover: imgUrl('shoes'), category: 'sports', categoryName: '运动户外', condition: '90', conditionName: '九成新', views: 210, createdAt: '2026-08-30 12:00:00', seller: { id: 4, name: '赵六', avatar: '', creditScore: 88, realNameVerified: true } }
]
function onGoodsClick(g) { toast('点击商品：' + g.title) }
function onFavorite(g) { toast((g.favorited ? '取消收藏：' : '收藏：') + g.title); g.favorited = !g.favorited }

// AI 相关
const goodsSummary = { title: '九成新机械键盘', price: 19900, conditionName: '九成新' }
const panelVisible = ref(true)
const quickQuestions = ['成色怎么样？', '可以刀吗？', '怎么交易？']
const chatMessages = ref([
  { role: 'assistant', content: '你好，我是这个商品的 AI 助手。关于商品成色、价格、交易方式都可以问我～' }
])
const chatLoading = ref(false)
function onChatSend(text) {
  chatMessages.value.push({ role: 'user', content: text })
  chatLoading.value = true
  setTimeout(() => {
    chatMessages.value.push({
      role: 'assistant',
      content: '这款商品支持小刀，建议您在站内私信与卖家进一步协商哦～',
      fallback: false,
      suggestManual: true
    })
    chatLoading.value = false
  }, 900)
}
function onTransfer(payload) { toast('转人工私信：question=' + payload.question) }

// 推荐位
const recommendItems = [
  { id: 11, title: '罗技无线鼠标，九成新', price: 6900, cover: imgUrl('mouse'), category: 'digital', condition: '90', reason: '与「机械键盘」同类' },
  { id: 12, title: '显示器支架臂', price: 3500, cover: imgUrl('arm'), category: 'digital', condition: '80', reason: '热门推荐' },
  { id: 13, title: '宿舍落地灯', price: 2800, cover: imgUrl('lamp2'), category: 'living', condition: '90', reason: '热门推荐' },
  { id: 14, title: '考研数学讲义（九成新）', price: 1200, cover: imgUrl('math'), category: 'book', condition: '90', reason: '与「机械键盘」同类' }
]
function onRecommendClick(item) { toast('推荐位点击：' + item.title) }
</script>

<style scoped lang="scss">
.demo-grid {
  display: grid;
  gap: var(--space-4);

  &--2 { grid-template-columns: repeat(2, 1fr); }
  &--4 { grid-template-columns: repeat(4, 1fr); }

  @media (max-width: 1024px) {
    &--4 { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    &--2, &--4 { grid-template-columns: 1fr; }
  }
}

.demo-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.demo-prices {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.demo-imgs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);

  &__item {
    aspect-ratio: 4 / 3;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
}

.demo-ai-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.demo-panel {
  margin-top: var(--space-3);
}

.demo-panel-inner {
  padding: var(--space-4);
  font-size: var(--fs-body);
  color: var(--color-text-2);
}

.demo-chat {
  height: 520px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-ai);
}
</style>
