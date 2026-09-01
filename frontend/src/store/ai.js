// AI 问答会话状态 + 推荐位数据（详情页 AI 问答 / 首页推荐位）
import { defineStore } from 'pinia'
import aiApi from '@/api/ai'

export const useAiStore = defineStore('ai', {
  state: () => ({
    // 问答会话：{ [productId]: { messages: [{role, content, manual?}], loading: boolean } }
    chats: {},
    // 推荐位：{ home: { items: [], loading }, detail: { items: [], loading } }
    recommends: {
      home: { items: [], loading: false },
      detail: { items: [], loading: false }
    }
  }),

  getters: {
    /** 指定商品当前的问答消息列表 */
    messagesOf: (state) => (productId) => state.chats[productId]?.messages || [],
    /** 指定商品问答是否加载中 */
    chatLoadingOf: (state) => (productId) => !!state.chats[productId]?.loading,
    /** 指定场景推荐位数据 */
    recommendOf: (state) => (scene) => state.recommends[scene] || { items: [], loading: false }
  },

  actions: {
    /** 初始化某商品的会话（首次进入详情页时调用） */
    initChat(productId) {
      if (!this.chats[productId]) {
        this.chats[productId] = { messages: [], loading: false }
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

    /** 清空某商品会话 */
    clearChat(productId) {
      if (this.chats[productId]) this.chats[productId].messages = []
    },

    /**
     * 拉取推荐位（home 免登录；detail 传 productId）。失败时静默，页面展示兜底。
     * @param {'home'|'detail'} scene
     */
    async fetchRecommend(scene, { productId, limit = 8 } = {}) {
      const slot = this.recommends[scene] || (this.recommends[scene] = { items: [], loading: false })
      slot.loading = true
      try {
        const data = await aiApi.recommend({ scene, productId, limit })
        slot.items = data?.items || []
        return slot.items
      } catch {
        slot.items = []
        return []
      } finally {
        slot.loading = false
      }
    }
  }
})
