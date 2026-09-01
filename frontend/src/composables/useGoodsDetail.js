// 商品详情数据（开发计划书步骤 6）：详情 + 相关推荐并行加载、互不阻塞
// 推荐位走 aiStore（场景缓存）；详情为页面私有数据，直接经 api 层获取。
import { ref } from 'vue'
import goodsApi from '@/api/goods'
import { useAiStore } from '@/store/ai'

/**
 * 商品详情编排
 * @param {import('vue').Ref<string>} productId 商品 id（路由参数）
 * @returns {{
 *   goods: import('vue').Ref<object|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<boolean>,
 *   load: () => Promise<void>,
 *   recommend: { items: object[], loading: boolean }
 * }}
 */
export function useGoodsDetail(productId) {
  const aiStore = useAiStore()

  const goods = ref(null)
  const loading = ref(false)
  const error = ref(false)

  // 请求序号：连续切换商品时丢弃过期响应
  let seq = 0

  async function load() {
    const id = ++seq
    loading.value = true
    error.value = false
    // 相关推荐并行请求（后端为 GET /api/products/recommend，无 scene 参数；失败静默兜底为空态）
    aiStore.fetchRecommend('detail', { limit: 8 })
    try {
      const data = await goodsApi.getDetail(productId.value)
      if (id !== seq) return
      goods.value = data
    } catch {
      if (id !== seq) return
      goods.value = null
      error.value = true
    } finally {
      if (id === seq) loading.value = false
    }
  }

  return { goods, loading, error, load, recommend: aiStore.recommendOf('detail') }
}
