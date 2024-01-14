import { cloneDeep } from 'lodash-es'

interface ArrItemType {
  children?: ArrItemType[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any
}

/**
 *  rgb颜色函数
 * @param rgb rgb(90,90,90) 或 rgb(90,90,90, 0.8)
 * @param diff 梯度值，正负都可
 * @returns rgb(98,98,98) 或 rgb(98,98,98, 0.8)
 */
export const rgbChange = (rgb: string, diff?: number) => {
  if (!diff) return rgb
  const d = diff
  const arr = rgb.split(/[,,(,)]/)
  const r = (Number(arr[1].trim()) + d).toFixed()
  const g = (Number(arr[2].trim()) + d).toFixed()
  const b = (Number(arr[3].trim()) + d).toFixed()
  const a = Number(arr[4] ? arr[4].trim() : null)
  return a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
}

/**
 *  转小驼峰
 * @param str 传入的字符串
 * @returns 小驼峰字符串
 */
export const toCamelCase = (str: string) => {
  return str.replace(/-([a-z])/g, function (_, p1) {
    return p1.toUpperCase()
  })
}

/**
 * 给layout下的路由path做拼接，适配el-menu
 * @param {Array}arr 数据源
 * @param {String}previousPath 树当前层级的上一层级的path
 */
export const splicePath = (arr: ArrItemType[], previousPath = '/') => {
  arr.forEach((v) => {
    v.path = previousPath + v.path
    if (v.children && v.children.length) splicePath(v.children, v.path + '/')
  })
}

/**
 * 从一个树形数组中根据某个值删除该节点及其子节点
 * @param arr 树形数组
 * @param value 属性值
 * @param prop 属性名
 * @returns void
 */
export const deleteNodeFromTreeList = (
  arr: ArrItemType[],
  value: string | number | boolean,
  prop: string
) => {
  if (!arr || !Array.isArray(arr) || !arr.length) return
  let propArr: string[] = []
  if (prop.includes('.')) {
    propArr = prop.split('.')
  }
  let i = 0
  while (i < arr.length) {
    const item = arr[i]
    if (
      propArr.length
        ? item[propArr[0]][propArr[1]] === value
        : item[prop] === value
    ) {
      arr.splice(i, 1)
      i--
    } else {
      if (item.children && item.children.length) {
        deleteNodeFromTreeList(item.children, value, prop)
      }
    }
    i++
  }
}

/**
 * 根据fn聚合数组中的某个值，形成新的数组
 * @param arr 数据源
 * @param prop 要聚合的属性
 * @param fn 聚合条件
 * @returns 聚合后的集合
 */
export const getCheckedKeysByProp = (
  arr: ArrItemType[],
  prop: string,
  fn: (arg: ArrItemType) => boolean
): string[] => {
  return arr.reduce((pre: string[], cur) => {
    if (fn(cur)) {
      pre.push(cur[prop])
    }
    if (cur.children && cur.children.length) {
      return pre.concat(getCheckedKeysByProp(cur.children, prop, fn))
    }
    return pre
  }, [])
}

/**
 * 根据条件找到当前节点的所有满足条件的相邻节点，形成新的数组
 * @param arr 数据源
 * @param prop 属性
 * @param value 值
 * @returns 满足条件的相邻节点
 */

export const findSiblingDetailNodeByValue = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { children?: T[]; [prop: string]: any }
>(
  arr: T[],
  prop: string,
  value: string | number | boolean
): T[] => {
  let res: T[] = []
  function dfs(arr: T[], prop: string, value: string | number | boolean) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item[prop] === value) {
        const path = item.path
        res = arr
          .filter((r) => r[prop] !== value)
          .filter((r) => r.path.includes('/:') && r.path.includes(path))
        if (res.length) return
      } else {
        if (item.children && item.children.length) {
          dfs(item.children, prop, value)
        }
      }
    }
  }
  dfs(arr, prop, value)
  return res
}

/**
 * 根据条件，找到满足当前条件节点的全路径节点所拼接的树形数据
 * @example arr = [{id:1},{id:2,children:[{id:3},{id:4}]},{id:5}];prop=id;value=[3, 5];
 * 得到[{id:2,children:[{id:3}]}, {id:5}]
 * @param arr 数据源
 * @param prop 属性
 * @param value 属性值
 * @returns 满足当前条件的节点及祖先节点所拼接的树形数据
 */

export const findPathTreeByValue = <
  T extends {
    children?: T[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any
  }
>(
  arr: T[],
  prop: string,
  value: Array<string | number>
): T[] => {
  if (!arr || !value.length) return []
  const temp: T[][] = []
  const result: T[] = []
  let resItem: T[] = []
  let path: T[] = []
  // 深度遍历并回溯，把满足当前条件的全路径节点存入resItem
  function dfs(root: T) {
    if (!root) return []
    path.push(root)
    if (value.includes(root[prop])) {
      resItem.push(...path)
    }
    if (root.children) {
      root.children.forEach((c) => {
        dfs(c)
      })
      // 找到相邻的详情路由（如果有）
      try {
        const sibings = root.children.filter(
          (r) => r.path.includes('/:') && r.path.includes(root.path)
        )
        if (sibings.length) {
          resItem.push(...sibings)
        }
      } catch (error) {
        /* empty */
      }
    }
    path.pop()
  }
  // 对数组每一项调用dfs，去重克隆后存入temp
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    resItem = []
    path = []
    dfs(item)
    if (resItem.length) {
      temp.push(cloneDeep([...new Set(resItem)]))
    }
  }
  for (let j = 0; j < temp.length; j++) {
    const arr = temp[j]
    // 反向遍历替换children，arr[0]即是所求
    for (let i = arr.length - 1; i > -1; i--) {
      const item = arr[i]
      const rest = arr.filter((r) => r !== item)
      const child = item.children
      if (child && child.length) {
        const res = child.filter((c) => rest.find((r) => r[prop] === c[prop]))
        if (res.length) {
          item.children = res
        }
      }
    }
    result.push(arr[0])
  }
  return result
}
