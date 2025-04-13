/** 合并列配置 */
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
