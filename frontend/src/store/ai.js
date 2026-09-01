// AI 问答会话状态 + 推荐位数据（详情页 AI 问答 / 首页推荐位）
import { defineStore } from 'pinia'
import aiApi from '@/api/ai'
import goodsApi from '@/api/goods'

/** 商品上下文欢迎语（步骤 8：AI 能回答“这个商品”相关问题；随 history 一并传给后端） */
const GREETING = { role: 'assistant', content: '你好，我是这个商品的 AI 助手，成色、价格、交易方式都可以问我～' }

export const useAiStore = defineStore('ai', {
  state: () => ({
    // 问答会话：{ [productId]: { messages: [{role, content, manual?}], loading: boolean } }
    chats: {},
    // 推荐位：{ home: { items, loading, degraded }, detail: {...} }（degraded=接口失败已降级为最新商品）
    recommends: {
      home: { items: [], loading: false, degraded: false },
      detail: { items: [], loading: false, degraded: false }
    }
  }),

  getters: {
    /** 指定商品当前的问答消息列表 */
    messagesOf: (state) => (productId) => state.chats[productId]?.messages || [],
    /** 指定商品问答是否加载中 */
    chatLoadingOf: (state) => (productId) => !!state.chats[productId]?.loading,
    /** 指定场景推荐位数据 */
    recommendOf: (state) => (scene) => state.recommends[scene] || { items: [], loading: false, degraded: false }
  },

  actions: {
    /** 初始化某商品的会话（首次进入详情页时调用）；自带商品上下文欢迎语 */
    initChat(productId) {
      if (!this.chats[productId]) {
        this.chats[productId] = { messages: [GREETING], loading: false }
      }
    },

    /**
     * 发送问题（AI 非流式，打字动画由 AiChat 组件模拟）
     * @returns {Promise<{answer, fallback, suggestManual}>}
     */
    async sendQuestion(productId, question) {
      this.initChat(productId)
      const chat = this.chats[productId]
      chat.messages.push({ role: 'user', content: question })
      chat.loading = true
      try {
        const history = chat.messages
          .filter((m) => !m.manual)
          .slice(0, -1)
          .map((m) => ({ role: m.role, content: m.content }))
        const data = await aiApi.chat({ productId, question, history })
        chat.messages.push({ role: 'assistant', content: data.answer, fallback: data.fallback, suggestManual: data.suggestManual })
        return data
      } catch (err) {
        // AI 失败兜底：不抛错，由页面/组件展示兜底文案（联调约定 §5：失败不自动重试）
        chat.messages.push({
          role: 'assistant',
          content: 'AI 暂时走神了，可以联系卖家咨询',
          fallback: true,
          suggestManual: true
        })
        return null
      } finally {
        chat.loading = false
      }
    },

    /** 清空某商品会话（清空后重新展示欢迎语） */
    clearChat(productId) {
      if (this.chats[productId]) this.chats[productId].messages = [GREETING]
    },

    /**
     * 拉取推荐位（联调核对步骤 9：后端为 GET /api/products/recommend?limit=，返回数组）。
     * 失败时静默降级为最新商品（计划书步骤 7），并标记 degraded 供 UI 提示。
     * @param {'home'|'detail'} scene 仅用于场景缓存与文案，不再作为请求参数
     */
    async fetchRecommend(scene, { limit = 8 } = {}) {
      const slot = this.recommends[scene] || (this.recommends[scene] = { items: [], loading: false, degraded: false })
      slot.loading = true
      try {
        const list = await aiApi.recommend({ limit })
        // 后端返回数组（无 reason），补推荐理由文案供推荐位展示
        slot.items = (Array.isArray(list) ? list : []).map((item) => ({
          ...item,
          reason: item.reason || (scene === 'detail' ? '为你推荐' : '猜你喜欢')
        }))
        slot.degraded = false
        return slot.items
      } catch {
        // 推荐接口失败：降级为最新商品（两处兜底都失败则为空态）
        slot.items = await this.fetchLatestFallback(limit)
        slot.degraded = true
        return slot.items
      } finally {
        slot.loading = false
      }
    },

    /** 推荐降级兜底：最新商品（映射为推荐位 items 结构，reason=最新上架） */
    async fetchLatestFallback(limit) {
      try {
        const data = await goodsApi.getList({ sort: 'latest', page: 1, size: limit })
        return (data?.list || []).map((g) => ({
          id: g.id,
          title: g.title,
          price: g.price,
          originalPrice: g.originalPrice,
          cover: g.cover,
          category: g.category,
          condition: g.condition,
          reason: '最新上架'
        }))
      } catch {
        return []
      }
    }
  }
})
