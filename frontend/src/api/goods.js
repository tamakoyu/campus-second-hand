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
 * @param {number} [params.pageSize] 默认 10，最大 100
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

// 收藏相关接口（API 规范尚未定义，V0.5 前由后端补进 §9/附录后在此实现）
// export function favorite(id) { return request.post(`/products/${id}/favorite`) }
// export function unfavorite(id) { return request.delete(`/products/${id}/favorite`) }
// export function getFavorites(params) { return request.get('/favorites', { params }) }

const goodsApi = { getList, getDetail }
export default goodsApi
