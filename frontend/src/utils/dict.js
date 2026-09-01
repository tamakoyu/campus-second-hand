// 枚举字典（《前端联调约定 v1.0》§7，与后端校验一致；后端 /api/dicts 就绪后可从接口拉取替换）

/** 商品分类 */
export const CATEGORY = {
  book: '教材图书',
  digital: '数码产品',
  living: '生活用品',
  sports: '运动户外',
  clothing: '服饰鞋包',
  other: '其他'
}

/** 成色 */
export const CONDITION = {
  '100': '全新',
  '90': '九成新',
  '80': '八成新',
  '70': '七成新及以下'
}

/** 订单状态 */
export const ORDER_STATUS = {
  '0': '待付款',
  '1': '待发货',
  '2': '待收货',
  '3': '已完成',
  '4': '已取消'
}

/** 信用分等级（≥110 优秀 / 90-109 良好 / <90 一般） */
export function creditLevel(score) {
  const s = Number(score)
  if (!Number.isFinite(s)) return '--'
  if (s >= 110) return '优秀'
  if (s >= 90) return '良好'
  return '一般'
}

/** 分类下拉选项（SearchBar 等复用） */
export const CATEGORY_OPTIONS = Object.entries(CATEGORY).map(([value, label]) => ({ value, label }))

/** 成色下拉选项 */
export const CONDITION_OPTIONS = Object.entries(CONDITION).map(([value, label]) => ({ value, label }))

/** 排序选项（列表页） */
export const SORT_OPTIONS = [
  { value: 'latest', label: '最新发布' },
  { value: 'hot', label: '最热' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' }
]
