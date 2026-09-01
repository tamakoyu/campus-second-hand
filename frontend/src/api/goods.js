// 商品接口（《接口约定规范 v1.1》§7 /products/*，实现方：田博）
import { request } from '@/utils/request'

/**
 * 商品列表 / 检索（免登录，只读）
 * @param {object} params
 * @param {string} [params.keyword] 关键词（匹配标题）
 * @param {string} [params.category] book/digital/living/sports/clothing/other
 * @param {string} [params.condition] 100/90/80/70
 * @param {number} [params.minPrice] 最低价（分）
 * @param {number} [params.maxPrice] 最高价（分）
 * @param {string} [params.sort] latest(默认)/price_asc/price_desc/hot
 * @param {number} [params.page] 从 1 起，默认 1
 * @param {number} [params.size] 每页条数，默认 10，最大 100（后端 ProductQueryDTO 字段为 size，响应仍为 pageSize）
 * @returns {Promise<{list: object[], total: number, page: number, pageSize: number}>}
 */
export function getList(params) {
  return request.get('/products', { params })
}

/**
 * 商品详情（免登录，只读；每次请求 views +1）
 * @param {number|string} id
 * @returns {Promise<object>} 不存在/已下架 -> 40401
 */
export function getDetail(id) {
  return request.get(`/products/${id}`)
}

// 收藏接口已确认（步骤 9 联调）：POST /api/favorites/{productId} toggle，返回 {favorited}
/**
 * 收藏 / 取消收藏（toggle；需登录，联调期后端默认 userId=1）
 * @param {number|string} productId
 * @returns {Promise<{favorited: boolean}>}
 */
export function toggleFavorite(productId) {
  return request.post(`/favorites/${productId}`)
}

const goodsApi = { getList, getDetail, toggleFavorite }
export default goodsApi
