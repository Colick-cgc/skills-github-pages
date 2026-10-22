/**
 * 日期格式化 / 统计辅助函数
 * 数据文件里的日期统一用 ISO 字符串 'YYYY-MM-DD'，方便排序与计算。
 */

/** 'YYYY-MM-DD' -> 'YYYY 年 M 月 D 日' */
export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}

/** 'YYYY-MM-DD' -> 'YYYY-MM-DD' 的短形式（去掉前导零） */
export function shortDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${y}.${Number(m)}.${Number(d)}`
}

/** 从多条记录中提取不重复标签，按出现次数降序 */
export function collectTags(records) {
  const count = new Map()
  records.forEach((r) =>
    (r.tags || []).forEach((t) => count.set(t, (count.get(t) || 0) + 1)),
  )
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
}

/** 计算最近 days 天（含今天）每天的更新条数，返回长度 days 的数组，下标 0 是最早那天 */
export function lastDaysActivity(records, days = 7) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  start.setDate(start.getDate() - (days - 1))
  const buckets = new Array(days).fill(0)
  records.forEach((r) => {
    if (!r.date) return
    const d = new Date(r.date + 'T00:00:00')
    const diff = Math.floor((d - start) / 86400000)
    if (diff >= 0 && diff < days) buckets[diff] += 1
  })
  return buckets
}

/** 距今「N 天前」的粗略描述，用于信息流 */
export function relativeDay(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.round((today - d) / 86400000)
  if (diff <= 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 30) return `${diff} 天前`
  return shortDate(iso)
}
