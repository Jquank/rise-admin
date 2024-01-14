import { barData, lineData, barDelayData } from './mock'
import echarts from './baseEchartsSettings'

export enum EchartType {
  BarEchart = 'BarEchart',
  BarDelayEchart = 'BarDelayEchart',
  LineEchart = 'LineEchart'
}

interface OptionsType {
  echartsOptions: echarts.EChartsCoreOption
  baseData: {
    title: string
    value: string | undefined
  }
}

const defaultOptions = {
  splitLine: {
    lineStyle: {
      color: ['rgba(220, 223, 230, 0.3)']
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderColor: '#EEF1F7',
    borderWidth: 1
  },
  legend: {
    pageIconSize: 9,
    textStyle: { color: '#79bbff' }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 20
  }
}

export const getBarOptions = (): OptionsType => {
  const data = barData.data[0]
  const seriesData = new Array(data.legendData.length).fill({
    type: 'bar'
  })
  const source = data.xAxisData.map((d, index) => {
    return { product: d, ...data.yAxis[index] }
  })
  return {
    echartsOptions: {
      series: seriesData,
      tooltip: defaultOptions.tooltip,
      legend: defaultOptions.legend,
      dataset: {
        dimensions: ['product', ...data.legendData],
        source: source
      },
      grid: defaultOptions.grid,
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'value',
        splitLine: defaultOptions.splitLine
      }
    },
    baseData: {
      title: barData.title,
      value: barData.value
    }
  }
}

export const getBarDelayOptions = (): OptionsType => {
  const data = barDelayData.data[0]
  const seriesData = data.legendData.map((d, index) => {
    return {
      name: d,
      type: 'bar',
      data: data.yAxis[index],
      emphasis: {
        focus: 'series'
      },
      animationDelay: function (idx: number) {
        return idx * 10 + index * 100
      }
    }
  })
  return {
    echartsOptions: {
      series: seriesData,
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx: number) {
        return idx * 9
      },
      tooltip: defaultOptions.tooltip,
      legend: {
        data: data.legendData,
        ...defaultOptions.legend
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['stack']
          },
          dataView: {}
        }
      },
      grid: defaultOptions.grid,
      xAxis: {
        data: data.xAxisData,
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        splitLine: defaultOptions.splitLine
      }
    },
    baseData: {
      title: barDelayData.title,
      value: barDelayData.value
    }
  }
}

export const getLineOptions = (): OptionsType => {
  const data = lineData.data[0]
  const seriesData = data.legendData.map((d, index) => {
    return {
      name: d,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: data.yAxis[index]
    }
  })
  return {
    echartsOptions: {
      series: seriesData,
      tooltip: {
        axisPointer: {
          type: 'cross'
        },
        ...defaultOptions.tooltip
      },
      legend: {
        data: data.legendData,
        ...defaultOptions.legend
      },
      grid: defaultOptions.grid,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xAxisData
      },
      yAxis: {
        type: 'value',
        splitLine: defaultOptions.splitLine
      }
    },
    baseData: {
      title: lineData.title,
      value: lineData.value
    }
  }
}
