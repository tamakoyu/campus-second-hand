// 全局守卫：标题 / 登录态（requiresAuth）/ 管理员（requiresAdmin）（《前端目录结构说明》§3）
import { useUserStore } from '@/store/user'
import { getToken } from '@/utils/auth'

export function setupGuards(router) {
  router.beforeEach(async (to) => {
    document.title = to.meta.title ? `${to.meta.title} · AI 校园二手` : 'AI 智能校园二手交易平台'

    const token = getToken()
    if (!token) {
      // 未登录访问需要登录的页面 -> 跳登录并记录回跳地址
      if (to.meta.requiresAuth) {
        return { path: '/login', query: { redirect: to.fullPath } }
      }
      return true
    }

    // 已登录访问登录/注册页 -> 回首页
    if (to.path === '/login' || to.path === '/register') {
      return { path: '/' }
    }

    // 刷新后恢复用户信息（失败时 401 由请求拦截器统一处理）
    const userStore = useUserStore()
    if (!userStore.userInfo) {
      try {
        await userStore.fetchMe()
      } catch {
        // 忽略：拦截器已提示/跳转
      }
    }

    if (to.meta.requiresAdmin && userStore.userInfo?.role !== 'ADMIN') {
      return { path: '/404' }
    }
    return true
  })
}
