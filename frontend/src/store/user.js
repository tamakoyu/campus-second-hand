// 用户态 / token / 实名（《接口约定规范 v1.1》§4-§5）
import { defineStore } from 'pinia'
import authApi from '@/api/auth'
import { getToken, setToken, clearToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: null, // {id, studentNo, name, avatar, creditScore, realNameVerified, role, ...}
    loading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.userInfo?.role === 'ADMIN',
    realNameVerified: (state) => !!state.userInfo?.realNameVerified,
    displayName: (state) => state.userInfo?.name || '同学'
  },

  actions: {
    /** 登录：拿 token 并存本地 + 用户信息入 store */
    async login(account, password) {
      const data = await authApi.login({ account, password })
      this.token = data.accessToken
      setToken(data.accessToken)
      this.userInfo = data.user
      return data
    },

    /** 拉取当前用户信息（守卫/刷新页面后恢复登录态） */
    async fetchMe() {
      this.loading = true
      try {
        this.userInfo = await authApi.getMe()
      } finally {
        this.loading = false
      }
    },

    /** 退出登录：调后端 + 清本地 */
    async logout() {
      try {
        await authApi.logout()
      } catch {
        // 后端登出失败也继续清本地，保证前端可退出
      }
      this.clear()
    },

    /** 仅清本地登录态（401 时由请求拦截器触发） */
    clear() {
      this.token = ''
      this.userInfo = null
      clearToken()
    }
  }
})
