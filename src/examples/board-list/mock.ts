const xAxisData = []
const data1 = []
const data2 = []
for (let i = 100; i > 0; i--) {
  const t = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000)
  xAxisData.push(t.getMonth() + 1 + '/' + t.getDate())
  data1.push(Math.floor(Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
  data2.push(Math.floor(Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5)
}
export const lineDataMocked = {
  posi: '{"x":0,"y":0,"w":3,"h":3,"i":"0"}', // 卡片的位置信息，由前端给
  title: '上周搜索次数',
  value: '10010.00',
  type: '3',
  unit: '万次',
  data: {
    // 对比维度或堆叠维度
    legendData: ['百度', '谷歌', '必应'],
    // x轴数据
    xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    // y轴数据
    yAxisData: [
      [120, 132, 101, 134, 90, 230, 210],
      [220, 182, 191, 234, 290, 330, 310],
      [150, 232, 201, 154, 190, 330, 410]
    ]
  },
  config: {},
  meta: {} // 指标（节点）源数据
}

export const numberDataMocked = {
  posi: '{"x":3,"y":0,"w":1,"h":1,"i":"1"}', // 卡片的位置信息，由前端给
  title: '商品销售数量',
  value: '1200.00',
  // 图表类型，0，1，2，3，4...
  type: '50',
  unit: '个',
  // 图表数据
  data: {
    // 环比上涨
    up: '15%',
    // 环比下降
    down: '10%'
  },
  // 配置数据
  config: {}
}

export const barDataMocked = {
  posi: '{"x":0,"y":3,"w":2,"h":5,"i":"2"}',
  title: '商品销售数量',
  unit: '个',
  value: '1200.00',
  type: '1',
  data: {
    // 对比维度或堆叠维度
    legendData: ['2022-01', '2022-02', '2022-03'],
    // x轴数据
    xAxisData: ['app', '门店', '京东', '美团'],
    // y轴数据
    yAxisData: [
      { '2022-01': 43.3, '2022-02': 85.8, '2022-03': 93.7 },
      { '2022-01': 83.1, '2022-02': 73.4, '2022-03': 55.1 },
      { '2022-01': 72.4, '2022-02': 53.9, '2022-03': 39.1 },
      { '2022-01': 72.4, '2022-02': 53.9, '2022-03': 39.1 }
    ]
  },
  config: {},
  meta: {}
}
