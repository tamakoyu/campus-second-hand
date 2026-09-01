// 格式化工具（《前端开发规范 v1.0》§3.3：价格 ¥ 1,299，金额单位分）

/**
 * 价格：分 -> 元，千分位。如 129900 -> "¥ 1,299"
 * @param {number|null|undefined} cents 金额（分）
 * @returns {string}
 */
export function formatPrice(cents) {
  if (cents === null || cents === undefined || Number.isNaN(Number(cents))) return '--'
  const yuan = Number(cents) / 100
  const text = Number.isInteger(yuan)
    ? yuan.toLocaleString('zh-CN')
    : yuan.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `¥ ${text}`
}

/** 建议价区间：如 8000, 11000 -> "¥ 80 – 110"（规范 §3.3） */
export function formatPriceRange(minCents, maxCents) {
  if (minCents == null || maxCents == null) return '--'
  const min = formatPrice(minCents).replace('¥ ', '')
  const max = formatPrice(maxCents).replace('¥ ', '')
  return `¥ ${min} – ${max}`
}

/**
 * 时间展示：保持后端格式 yyyy-MM-dd HH:mm:ss；兼容含 T 的 ISO 串
 */
export function formatTime(str) {
  if (!str) return '--'
  return String(str).replace('T', ' ').slice(0, 19)
}

/**
 * 浏览量展示：过万显示 "1.2万"，否则原样
 */
export function formatViews(views) {
  const n = Number(views)
  if (!Number.isFinite(n)) return '--'
  if (n >= 10000) {
    return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}万`
  }
  return String(n)
}
