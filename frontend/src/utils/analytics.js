// 轻量埋点：AI 推荐位点击统计（计划书步骤 7「统计推荐位点击数据，后续可优化」）
// 当前落地为 localStorage 本地记录（无后端依赖，演示/自测可查），
// 后续可替换为后端埋点接口（V1.0 优化），调用方无需改动。
const STORAGE_KEY = 'recommend-clicks'
const MAX_RECORDS = 200

/**
 * 记录一次推荐位点击
 * @param {{ scene: 'home'|'detail', item: object, from?: string }} params
 */
export function trackRecommendClick({ scene, item, from = '' }) {
  try {
    if (!item || item.id == null) return
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    records.push({
      scene,
      productId: item.id,
      title: item.title,
      reason: item.reason || '',
      from,
      ts: Date.now()
    })
    // 只保留最近 MAX_RECORDS 条，防止无限增长
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_RECORDS)))
  } catch {
    // 埋点失败不影响主流程（隐私模式/存储被禁等场景静默）
  }
}
