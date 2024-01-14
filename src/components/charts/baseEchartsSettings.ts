import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  TransformComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  TransformComponent,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
  BarChart,
  LineChart,
  PieChart
])

export default echarts
