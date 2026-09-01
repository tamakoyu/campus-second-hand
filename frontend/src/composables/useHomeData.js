// 首页数据编排（开发计划书步骤 4）：AI 推荐位 + 最新商品 + 热门商品并行加载、互不阻塞
// 规范 §10：业务逻辑进 store / composables，页面只做组合编排。
// 推荐位走 aiStore（场景缓存，详情页复用）；最新/热门为首页私有数据，不进 goodsStore，避免污染列表筛选态。
import { ref } from 'vue'
import goodsApi from '@/api/goods'
import { useAiStore } from '@/store/ai'

/** 首页各区块展示条数（“更多”进列表页分页浏览） */
const HOME_PAGE_SIZE = 8

/**
 * 首页数据编排
 * @returns {{
 *   recommend: { items: object[], loading: boolean },
 *   latest: { list: object[], loading: boolean, error: boolean },
 *   hot: { list: object[], loading: boolean, error: boolean },
 *   fetchAll: () => void,
 *   fetchLatest: () => Promise<void>,
 *   fetchHot: () => Promise<void>
 * }}
 */
export function useHomeData() {
  const aiStore = useAiStore()

  const latest = ref({ list: [], loading: false, error: false })
  const hot = ref({ list: [], loading: false, error: false })

  // 请求序号：重试并发时丢弃过期响应，避免旧数据覆盖新数据
  const seq = { latest: 0, hot: 0 }

  async function fetchLatest() {
    const id = ++seq.latest
    latest.value = { ...latest.value, loading: true, error: false }
    try {
      const data = await goodsApi.getList({ sort: 'latest', page: 1, pageSize: HOME_PAGE_SIZE })
      if (id !== seq.latest) return
      latest.value = { list: data?.list || [], loading: false, error: false }
    } catch {
      if (id !== seq.latest) return
      latest.value = { list: [], loading: false, error: true }
    }
  }

  async function fetchHot() {
    const id = ++seq.hot
    hot.value = { ...hot.value, loading: true, error: false }
    try {
      const data = await goodsApi.getList({ sort: 'hot', page: 1, pageSize: HOME_PAGE_SIZE })
      if (id !== seq.hot) return
      hot.value = { list: data?.list || [], loading: false, error: false }
    } catch {
      if (id !== seq.hot) return
      hot.value = { list: [], loading: false, error: true }
    }
  }

  /** 并行加载全部区块；推荐位失败静默兜底为空态，不阻塞页面（联调约定 §5） */
  function fetchAll() {
    aiStore.fetchRecommend('home', { limit: HOME_PAGE_SIZE })
    fetchLatest()
    fetchHot()
  }

  return {
    recommend: aiStore.recommendOf('home'),
    latest,
    hot,
    fetchAll,
    fetchLatest,
    fetchHot
  }
}
