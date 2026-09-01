// 用户信息 / 信用分 / 减碳 / 环保积分接口（占位）
// 当前用户信息请用 authApi.getMe()（API v1.1 §5.4，含 creditScore/carbonAmount 扩展字段）。
// 减碳 + 环保积分接口 9/5 出文档 + 骨架（负责人：林天楚），就绪后在此实现。

// 预计接口（以规范更新为准）：
// export function getCreditRecord(params) { return request.get('/user/credit', { params }) }
// export function getCarbonProfile() { return request.get('/user/carbon') }
// export function getFavoriteList(params) { return request.get('/user/favorites', { params }) }

const userApi = {}
export default userApi
