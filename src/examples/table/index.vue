<template>
  <r-table
    ref="tableRef"
    :columns="columns"
    :data="tableData"
    :searchMethod="listSerach"
    class="r-table-demo"
    :loading="showTableLoading"
    show-overflow-tooltip
    border>
    <template #default-prop1="column">
      <el-table-column v-bind="column" label="哈哈哈" />
    </template>
    <template #column-prop2="scope">
      <span>{{ scope.row.prop2 + 'bbbb' }}</span>
    </template>
    <template #column-prop3-header="{ column }">
      <span>{{ column.label + 'aaaaaaaaa' }}</span>
    </template>
  </r-table>
</template>

<script setup lang="ts">
  import { RTable, mergeColumnConfig } from '@jquank/rise-ui'
  import { ref } from 'vue'
  const tableRef = ref(null)
  const tableData = ref([])
  const columns = ref([])
  const showTableLoading = ref(false)

  const columnConfig = {
    index: {
      type: 'index',
      label: '序号',
      width: 55,
      align: 'center'
    },
    prop2: {
      sortable: 'custom'
    },
    prop4: {
      sortable: 'custom',
      filters: [
        { text: '111', value: '111' },
        { text: '222', value: '222' }
      ],
      'filter-placement': 'bottom-end'
    }
  }

  const getData = async (
    params
  ): Promise<{
    data: unknown[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: Record<string, any>[]
    total: number
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const columns = generateCloumns(10)
        resolve({
          columns: columns,
          data: generateData(columns, params.pageSize),
          total: 100
        })
      }, 1000)
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let searchParams = {}
  const listSerach = async (params) => {
    console.log(params)
    if (params) {
      searchParams = { ...params }
    }
    showTableLoading.value = true
    try {
      const res = await getData(searchParams)
      columns.value = mergeColumnConfig(res.columns, columnConfig)
      tableData.value = res.data
      return res.total
    } finally {
      showTableLoading.value = false
    }
  }
  const generateCloumns = (length = 10): Array<Record<string, unknown>> => {
    return Array.from({ length }).map((_, rowIndex) => {
      return {
        label: `label${rowIndex}`,
        prop: `prop${rowIndex}`
      }
    })
  }
  const generateData = (cloumns, length = 200) => {
    return Array.from({ length }).map((_, rowIndex) => {
      const obj = {}
      cloumns.forEach((item, index) => {
        obj[item.prop] = `data-${rowIndex}-${index}`
      })
      return obj
    })
  }
</script>

<style lang="less" scoped>
  .r-table-demo {
    background-color: var(--main-bg-color);
  }
</style>
