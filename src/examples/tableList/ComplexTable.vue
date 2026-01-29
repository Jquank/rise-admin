<template>
  <div class="standrad-list">
    <div
      class="standrad-list-box"
      :style="{ height: $route.name === 'complex-table' ? '100%' : '0' }">
      <RForm
        @search="handleSearch"
        isResponseGrid
        showLastCol
        buttonInRow
        defaultCollapse
        :config="formConfig"
        v-model="searchModel">
        <template #left-buttons>
          <el-button type="primary">导入</el-button>
          <el-button>导出</el-button>
        </template>
      </RForm>
      <div class="auto-height-table-box" v-loading="showTableLoading">
        <r-table
          ref="tableRef"
          height="100%"
          :columns="tableColumns"
          :data="tableData"
          :searchMethod="listSerach"
          :loading="showTableLoading"
          show-overflow-tooltip
          border>
        </r-table>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { houseApi } from '@/_api/index'
  // import { RPagination, RGridCollapse } from '@jquank/rise-ui'
  import { RTable, RForm } from '@/lib/index'
  const tableData = ref([])
  let pageParams
  const searchModel = reactive({
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    value6: '',
    value7: ''
  })

  const formConfig = [
    {
      prop: 'value1',
      label: '名称名称名称名称名称1111111111222222222222',
      type: 'input'
    },
    {
      prop: 'value2',
      label: '名称2',
      type: 'input'
    },
    {
      prop: 'value3',
      label: '名称名称名称名称名称1111111111222222222222',
      type: 'input'
    },
    {
      prop: 'value4',
      label: '名称名称名称名称名称1111111111222222222222',
      type: 'input'
    },
    {
      prop: 'value5',
      label: '名称名称名称名称名称1111111111222222222222',
      type: 'input'
    },
    {
      prop: 'value6',
      label: '名称名称名称名称名称1111111111222222222222',
      type: 'input'
    },
    {
      prop: 'value7',
      label: '名称名称名称名称名称1111111111222222222222',
      type: 'input'
    }
  ]

  const tableColumns = [
    {
      prop: 'username',
      label: '姓名'
    },
    {
      prop: 'tel',
      label: '电话'
    },
    {
      prop: 'createdAt',
      label: '创建时间'
    }
  ]

  const showTableLoading = ref(false)
  const listSerach = (page) => {
    showTableLoading.value = true
    pageParams = Object.assign({}, page)
    return houseApi
      .postHouseTenants(pageParams)
      .then((res) => {
        showTableLoading.value = false
        tableData.value = res.data.list
        return res.data.total
      })
      .catch(() => {
        showTableLoading.value = false
      })
  }
  const handleSearch = () => {
    pageParams.currentPage = 1
    listSerach(pageParams)
  }
  // const view = (row: { id: number }) => {
  //   console.log(router.getRoutes())
  //   router.push({
  //     name: 'complex-table-detail',
  //     params: { id: row.id }
  //   })
  // }
</script>

<style lang="less" scoped>
  .standrad-list {
    height: 100%;
    position: relative;
    .standrad-list-box {
      display: flex;
      flex-direction: column;
      height: 100%;

      .grid-collapse-box {
        padding: 18px 12px 0;
        background-color: var(--main-bg-color);
        // border-bottom: 1px solid var(--el-border-color-light);
      }
    }
  }
</style>
