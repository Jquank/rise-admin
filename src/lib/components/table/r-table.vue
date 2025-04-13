<template>
  <el-auto-resizer class="r-table-box">
    <template #default="{ width }">
      <el-table
        ref="tableRef"
        :data="props.data"
        @sort-change="sortChange"
        v-bind="$attrs"
        v-loading="props.loading"
        :class="{
          'height-fill-up': props.heightFillUp
        }">
        <template v-for="(column, index) in props.columns" :key="column.prop">
          <!-- #default-prop，请传入el-table-column组件 -->
          <slot
            v-if="isDefaultRender(column.prop)"
            :name="`default-${column.prop}`"
            v-bind="{
              width: getColumnWidth(width, index, column),
              ...column
            }"></slot>
          <!-- #column-prop， 渲染到el-table-column的default -->
          <!-- #column-prop-xxx， 渲染到el-table-column的自带其它插槽 -->
          <el-table-column
            v-else
            v-bind="{
              width: getColumnWidth(width, index, column),
              ...column
            }">
            <template
              v-for="(originSlotName, lastName) in getCloumnSlots(column.prop)"
              #[lastName]="scope">
              <slot :name="originSlotName" v-bind="scope"> </slot>
            </template>
          </el-table-column>
        </template>
        <!-- 渲染table插槽 -->
        <template #empty>
          <el-empty :image-size="120" />
        </template>
        <template
          v-for="(_, slotName) in tableSlots"
          v-slot:[slotName]="scope"
          :key="slotName">
          <slot :name="slotName" v-bind="scope"></slot>
        </template>
      </el-table>
      <RPagination
        :key="pageKey"
        v-if="props.usePagination && props.searchMethod"
        :callback="injectedSearchMethod" />
    </template>
  </el-auto-resizer>
</template>

<script setup lang="ts">
  import { ref, PropType, useSlots, watch } from 'vue'
  import { RPagination, type SearchMethod } from '../pagination/index'
  interface Column {
    prop: string
    label: string
    width?: string | number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  const props = defineProps({
    /** 表格列配置数组，同el-table-column */
    columns: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Array as PropType<Column[]>,
      default: () => []
    },
    /** 表格数据源 */
    data: {
      type: Array,
      default: () => []
    },
    /** 是否用分页，为true时，请传入searchMethod */
    usePagination: {
      type: Boolean,
      default: true
    },
    /** 获取数据的方法，有分页时，请返回总页数 如：return 100 */
    searchMethod: {
      type: Function as PropType<SearchMethod>
    },
    /** 是否loading */
    loading: {
      type: Boolean,
      default: false
    },
    /** 相同列宽，优先级低于column.width */
    columnWidth: {
      type: Number || String
    },
    /** 初始表格高度是否撑满父容器 */
    heightFillUp: {
      type: Boolean,
      default: true
    }
  })
  const tableRef = ref(null)
  const pageKey = ref(0)
  const extraParams = ref()

  const injectedSearchMethod = ref<SearchMethod>(props.searchMethod)

  watch(
    () => extraParams.value,
    (val) => {
      console.log('extraParams', val)

      if (!val) return
      // 包裹原函数，自动合并排序参数
      injectedSearchMethod.value = (pageParams) => {
        return props.searchMethod({
          ...pageParams, // 分页组件传入的 { currentPage, pageSize }
          ...val // 额外参数如 { sortProp, sortOrder }
        })
      }
    },
    { immediate: true }
  )

  // 没分页时，自动调用searchMethod
  watch(
    () => props.usePagination,
    (val) => {
      if (!val && props.searchMethod) {
        props.searchMethod()
      }
    },
    { immediate: true }
  )

  // 计算未设置宽度的的列的宽度（todo:可以取前十条数据字符数的平均值算一个合理宽度）
  const getColumnWidth = (boxWidth: number, index: number, column: Column) => {
    if (column.width) return column.width
    if (props.columnWidth) return props.columnWidth
    const len = props.columns.filter((item) => !item.width).length
    // 所有设置了宽度的列的宽度之和
    const allWidth = props.columns.reduce((prev, cur) => {
      return (
        parseFloat(String(prev || '0')) + parseFloat(String(cur.width || '0'))
      )
    }, 0)
    // 计算平均宽度
    const w = Math.floor((boxWidth - allWidth) / len)
    const defaultWidth = 150
    const firstNoWidthIndex = props.columns.findIndex((item) => !item.width)
    // 找到第一个未设置宽度的列的索引，设置auto，防止Math.floor产生的误差，其他列设置计算后的平均宽度
    if (firstNoWidthIndex === index) {
      return w < defaultWidth ? defaultWidth : 'auto'
    } else {
      return w < defaultWidth ? defaultWidth : w
    }
  }

  const slots = useSlots()

  // 列插槽 #cloumn-xxx
  const prefixCloumnSlots = ref([])
  // table插槽
  const tableSlots = ref({})

  // 处理插槽
  const handleSlots = () => {
    for (const name in slots) {
      if (name.startsWith('default-')) {
        // empty
      } else if (name.startsWith('column-')) {
        const nameArr = name.split('-')
        const len = nameArr.length
        const lastName = nameArr[len - 1]
        prefixCloumnSlots.value.push({
          originSlotName: name,
          len,
          lastName
        })
      } else {
        tableSlots.value[name] = slots[name]
      }
    }
  }
  handleSlots()

  // #default-xxx, 优先级高于 #cloumn-xxx
  const isDefaultRender = (prop: string) => {
    return Object.keys(slots).some((name) => name === `default-${prop}`)
  }
  // 获取列插槽
  const getCloumnSlots = (prop: string) => {
    if (!prop) return {}
    const currentSlots = prefixCloumnSlots.value.filter((v) =>
      v.originSlotName.includes(prop)
    )
    if (currentSlots.length === 0) return {}
    const obj = {}
    for (let i = 0; i < currentSlots.length; i++) {
      const item = currentSlots[i]
      // 必须满足列插槽命名规范#column-xxx 或 #column-xxx-xxx
      if (item.len < 2 || item.len > 3) return {}
      if (item.len === 2) {
        // #column-xxx 渲染el-table-column的default插槽
        obj['default'] = item.originSlotName
      }
      if (item.len === 3) {
        // #column-xxx-xxx 渲染el-table-column的自带其它插槽
        obj[item.lastName] = item.originSlotName
      }
    }
    return obj
  }

  const sortChange = ({ prop, order }) => {
    if (!props.searchMethod) return
    if (!props.usePagination) {
      props.searchMethod({ prop, order })
    } else {
      extraParams.value = { prop, order }
    }
  }

  const resetTable = () => {
    tableRef.value.clearSort()
    tableRef.value.clearFilter()
    extraParams.value = {}
    pageKey.value++
  }

  defineExpose({
    get elTableRef() {
      return tableRef.value
    },
    resetTable
  })
</script>

<style lang="less" scoped>
  .r-table-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .height-fill-up {
      flex: 1;
      height: 0;
    }
  }
</style>
