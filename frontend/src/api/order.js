// 订单 / 担保交易接口（占位）
// 《接口约定规范 v1.1》§9：收藏/订单/管理后台接口 V0.5 / V1.0 前补进规范；
// 后端定义后在此实现，页面一律经本模块调用（唯一网络出口）。

// 预计接口（以规范更新为准）：
// export function createOrder(data) { return request.post('/orders', data) }      // 担保下单（货款托管）
// export function getOrders(params) { return request.get('/orders', { params }) }  // 我的订单（0待付款/1待发货/2待收货/3已完成/4已取消）
// export function payOrder(id) { return request.post(`/orders/${id}/pay`) }
// export function shipOrder(id) { return request.post(`/orders/${id}/ship`) }
// export function confirmOrder(id) { return request.post(`/orders/${id}/confirm`) }
// export function cancelOrder(id) { return request.post(`/orders/${id}/cancel`) }

const orderApi = {}
export default orderApi
