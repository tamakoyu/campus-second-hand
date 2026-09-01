// Axios 统一封装：baseURL / token 注入 / 统一错误提示 / 401 跳登录 / 解包 {code,message,data}
// 依据：《前端开发规范 v1.0》§10、《前端联调约定 v1.0》§2-§5、《接口约定规范 v1.1》§3-§4
import axios from 'axios'
import { ElMessage } from 'element-plus'
// ElMessage 的按需样式（unplugin 只处理模板组件，JS 内使用的组件需手动引入样式）
import 'element-plus/es/components/message/style/css'
import { getToken, clearToken } from './auth'

const DEFAULT_TIMEOUT = 10_000 // 普通业务接口 10s
const AI_TIMEOUT = 20_000 // AI 接口 20s（identify/describe/estimate/chat/review）

/**
 * 创建 axios 实例
 * @param {number} timeout 超时时间（ms）
 * @param {{ ai?: boolean }} options ai=true 时超时提示用 AI 文案
 */
function createInstance(timeout, { ai = false } = {}) {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  })
  // 供拦截器识别来源（超时文案区分）
  instance.defaults.aiTimeout = ai

  // ---- 请求拦截：统一注入 Bearer token ----
  instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  // ---- 响应拦截：解包 + 全局错误处理 ----
  instance.interceptors.response.use(
    (response) => {
      const body = response.data
      // 非标准响应（如文件流）原样返回
      if (body === null || typeof body !== 'object' || !('code' in body)) return body
      if (body.code === 0) return body.data
      handleBizError(body, response.config)
      return Promise.reject(new ApiError(body.code, body.message, response.config))
    },
    (error) => {
      handleHttpError(error)
      return Promise.reject(error)
    }
  )
  return instance
}

class ApiError extends Error {
  constructor(code, message, config) {
    super(message || '请求失败')
    this.name = 'ApiError'
    this.code = code
    this.config = config
  }
}

function handleBizError(body, config) {
  // 401xx：清除 token 并跳登录（联调约定 §4）
  if (body.code >= 40100 && body.code < 40200) {
    clearToken()
    redirectToLogin()
  }
  if (!config?.silent) {
    ElMessage.error(body.message || '请求失败')
  }
}

function handleHttpError(error) {
  const config = error.config || {}
  // 调用方标记 silent 时不弹全局提示（如推荐位失败兜底，不阻塞页面）
  if (config.silent) return
  if (error.response) {
    const { status, data } = error.response
    if (status === 401) {
      clearToken()
      redirectToLogin()
    }
    ElMessage.error(data?.message || defaultMessage(status))
  } else if (error.code === 'ECONNABORTED') {
    ElMessage.error(config.aiTimeout ? 'AI 服务响应较慢，请稍后重试' : '请求超时，请重试')
  } else {
    ElMessage.error('网络开小差了，请重试')
  }
}

function defaultMessage(status) {
  const map = { 400: '参数有误，请检查后重试', 403: '无权限执行该操作', 404: '资源不存在', 429: '请求过于频繁，请稍后再试', 500: '服务器开小差了，请稍后再试' }
  return map[status] || '请求失败，请重试'
}

function redirectToLogin() {
  const { pathname, search } = window.location
  if (!pathname.startsWith('/login')) {
    const redirect = encodeURIComponent(pathname + search)
    window.location.href = `/login?redirect=${redirect}`
  }
}

/** 普通业务请求实例（10s 超时） */
export const request = createInstance(DEFAULT_TIMEOUT)
/** AI 接口请求实例（20s 超时） */
export const aiRequest = createInstance(AI_TIMEOUT, { ai: true })

export default request
