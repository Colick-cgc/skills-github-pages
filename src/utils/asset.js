/**
 * 资源路径解析。
 * 数据文件（JSON）里的图片路径统一写成相对 public/ 的路径，例如
 *   "images/travel/xx.jpg"   （对应 public/images/travel/xx.jpg）
 * 渲染时用 asset() 拼上 base，这样本地 dev 与 GitHub Pages 子路径都能正确加载。
 *
 * 外链（http/https）与 data: 开头的 URL 原样返回。
 */
export function asset(p) {
  if (!p) return ''
  if (/^(https?:|data:|\/\/)/.test(p)) return p
  return import.meta.env.BASE_URL + String(p).replace(/^\//, '')
}
