// AI 接口（《接口约定规范 v1.1》§6 真实路径 /api/ai/*、§8 /api/ai/recommend）
// 约定：AI 接口 20s 超时（aiRequest），失败不自动重试，由页面降级处理；
// 响应带 engine 字段：llm（大模型）/ rule（规则引擎兜底）。
import { request, aiRequest } from '@/utils/request'

/**
 * AI 商品识别：图片 -> 分类 + 成色（需登录，20s）
 * @param {{ imageBase64: string }} data base64 含 data:image/...;base64, 前缀
 * @returns {Promise<{category, categoryName, condition, conditionName, confidence, engine}>}
 */
export function identify(data) {
  return aiRequest.post('/ai/identify', data)
}

/**
 * AI 描述生成（需登录，20s）
 * @param {{ imageBase64: string, category: string, condition: string, keywords: string[] }} data
 * @returns {Promise<{description: string, engine: string}>}
 */
export function describe(data) {
  return aiRequest.post('/ai/describe', data)
}

/**
 * AI 智能估价（需登录，20s；规则引擎兜底）
 * @param {{ originalPrice: number, category: string, condition: string, imageBase64?: string }} data 金额单位分
 * @returns {Promise<{suggestPrice: number, priceRange: {min: number, max: number}, reason: string, engine: string}>}
 */
export function estimate(data) {
  return aiRequest.post('/ai/estimate', data)
}

/**
 * AI 智能问答（详情页，需登录，20s，非流式一次性 JSON）
 * @param {{ productId: number, question: string, history?: {role: string, content: string}[] }} data
 * @returns {Promise<{answer: string, fallback: boolean, suggestManual: boolean}>}
 */
export function chat(data) {
  return aiRequest.post('/ai/chat', data)
}

/**
 * AI 辅助审核（管理员 ADMIN，20s）
 * @param {{ title, description, imageBase64, price }} data
 * @returns {Promise<{pass: boolean, riskLevel: string, reasons: string[], engine: string}>}
 */
export function review(data) {
  return aiRequest.post('/ai/review', data)
}

/**
 * 猜你喜欢（联调核对步骤 9：后端实际实现为 GET /api/products/recommend，返回数组）
 * 当前后端无 scene=detail 同分类推荐、无 reason 字段，展示侧由 store 补兜底文案；
 * 返回 ProductListItemVO[]（金额单位分），失败时页面兜底不阻塞。
 * @param {{ limit?: number }} params limit 默认 10，最大 20
 * @returns {Promise<object[]>}
 */
export function recommend(params) {
  return request.get('/products/recommend', { params, silent: true })
}

const aiApi = { identify, describe, estimate, chat, review, recommend }
export default aiApi
