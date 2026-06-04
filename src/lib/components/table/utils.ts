/**
 * 合并表格列配置
 *
 * @description
 * 将 `config` 中的自定义列合并到后端返回的 `columns` 数组中。
 * - 匹配到相同 `prop` 的列 → `Object.assign` 合并（覆盖原有属性）
 * - 未匹配到时：
 *   - `'index'` 或 `'selection'` → 插入到列首
 *   - 其他 → 追加到列尾
 *
 * @example
 * ```ts
 * const columnConfig = {
 *   prop2: { sortable: 'custom' },
 *   index: { type: 'index', label: '序号', width: 55 },
 * }
 * const columns = mergeColumnConfig(serverColumns, columnConfig)
 * ```
 *
 * @param columns 后端返回的原始列配置数组
 * @param config  要合并/追加的列配置对象，key 为列的 prop
 * @returns 合并后的列配置数组
 */
export const mergeColumnConfig = (columns, config) => {
  Object.keys(config).forEach((key) => {
    const item = config[key]
    const column = columns.find((v) => v.prop === key)
    if (column) {
      Object.assign(column, item)
    } else {
      if (['index', 'selection'].includes(key)) {
        columns.unshift(item)
      } else {
        columns.push(item)
      }
    }
  })
  return columns
}

