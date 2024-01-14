function findRootNode(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].condition === 3) {
      // 这里的'your condition'表示你想要的条件
      return arr[i]
    } else {
      const result = findRootNode(arr[i].children) // children属性存放了当前节点的子节点列表
      if (result !== null) {
        return result
      }
    }
  }
  return [] // 没有找到符合条件的根节点时返回null或者undefined等空值
}

// 测试样例
const treeArray = [
  { id: 1, name: 'A', condition: 1 },
  {
    id: 2,
    name: 'B',
    condition: 2,
    children: [{ id: 3, name: 'C', condition: 3 }]
  },
  { id: 4, name: 'D', condition: 4, children: [] }
]

console.log(findRootNode(treeArray)) // 输出{id: 1, name: "A", condition: true}
