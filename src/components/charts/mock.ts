export const barData = {
  id: '', // 所有图标数据的id，如果后端是每个图表一个接口，可删除
  posi: [{}], // 卡片的位置信息，由前端给
  title: '商品销售数量',
  value: '1200.00',
  // 图表类型，EchartComponent、 NumberChart...
  type: '2',
  size: 'middle',
  data: [
    {
      // 图表类型，0，1，2，3，4...
      type: 1,
      // 单位
      unit: '',
      // 对比维度或堆叠维度
      legendData: ['2022-01', '2022-02', '2022-03'],
      // x轴数据
      xAxisData: ['app', '门店', '京东', '美团'],
      // y轴数据
      yAxis: [
        { '2022-01': 43.3, '2022-02': 85.8, '2022-03': 93.7 },
        { '2022-01': 83.1, '2022-02': 73.4, '2022-03': 55.1 },
        { '2022-01': 72.4, '2022-02': 53.9, '2022-03': 39.1 },
        { '2022-01': 72.4, '2022-02': 53.9, '2022-03': 39.1 }
      ],
      // 环比上涨
      up: '15%',
      // 环比下降
      down: '10%'
    }
  ]
}

const xAxisData = []
const data1 = []
const data2 = []
for (let i = 100; i > 0; i--) {
  const t = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000)
  xAxisData.push(t.getMonth() + 1 + '/' + t.getDate())
  data1.push(Math.floor(Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
  data2.push(Math.floor(Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5)
}
export const barDelayData = {
  id: '', // 所有图标数据的id，如果后端是每个图表一个接口，可删除
  posi: [{}], // 卡片的位置信息，由前端给
  title: '近百日男女有效下单数量',
  value: '8500.00',
  data: [
    {
      // 图表类型，0，1，2，3，4...
      type: 1,
      // 单位
      unit: '',
      // 对比维度或堆叠维度
      legendData: ['男', '女'],
      // x轴数据
      xAxisData: xAxisData,
      // y轴数据
      yAxis: [data1, data2]
    }
  ]
}

export const lineData = {
  id: '', // 所有图标数据的id，如果后端是每个图表一个接口，可删除
  posi: [{}], // 卡片的位置信息，由前端给
  title: '上周搜索次数',
  value: '10010.00',
  data: [
    {
      // 图表类型，0，1，2，3，4...
      type: 3,
      // 单位
      unit: '',
      // 对比维度或堆叠维度
      legendData: ['百度', '谷歌', '必应'],
      // x轴数据
      xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      // y轴数据
      yAxis: [
        [120, 132, 101, 134, 90, 230, 210],
        [220, 182, 191, 234, 290, 330, 310],
        [150, 232, 201, 154, 190, 330, 410]
      ]
    }
  ]
}

export const numberData = {
  id: '', // 所有图标数据的id，如果后端是每个图表一个接口，可删除
  posi: [{}], // 卡片的位置信息，由前端给
  title: '商品销售数量',
  value: '1200.00',
  data: [
    {
      // 图表类型，0，1，2，3，4...
      type: 1,
      // 图表大小
      size: 'SMALL',
      // 单位
      unit: '',
      // 对比维度或堆叠维度
      legendData: [],
      // x轴数据
      xAxisData: [],
      // y轴数据
      yAxis: []
    }
  ]
}

export const numberDataMock = {
  id: '', // 卡片id。默认为空
  posi: '{}', // 卡片的位置信息，由前端给
  title: '商品销售数量',
  value: '1200.00',
  // 图表类型，0，1，2，3，4...
  type: '50',
  // 图表大小
  size: 'SMALL',
  // 单位
  unit: '',
  // 图表数据
  data: {
    // 对比维度或堆叠维度
    legendData: [],
    // x轴数据
    xAxisData: [],
    // y轴数据
    yAxis: [],
    // 环比上涨
    up: '15%',
    // 环比下降
    down: '10%'
  },
  // 配置数据
  config: {}
}
