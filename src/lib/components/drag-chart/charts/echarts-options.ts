import echarts from './base-echarts-settings'

interface OptionsType {
  echartsOptions: echarts.EChartsCoreOption
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

export const getBarOptions = (data): OptionsType => {
  const seriesData = new Array(data.legendData.length).fill({
    type: 'bar'
  })
  const source = data.xAxisData.map((d, index) => {
    return { product: d, ...data.yAxisData[index] }
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
    }
  }
}

export const getBarDelayOptions = (data): OptionsType => {
  const seriesData = data.legendData.map((d, index) => {
    return {
      name: d,
      type: 'bar',
      data: data.yAxisData[index],
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
    }
  }
}

export const getLineOptions = (data): OptionsType => {
  const seriesData = data.legendData.map((d, index) => {
    return {
      name: d,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: data.yAxisData[index]
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
    }
  }
}
