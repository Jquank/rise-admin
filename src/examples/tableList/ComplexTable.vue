<template>
  <div class="standrad-list">
    <GridCollapse
      class="grid-collapse-box"
      :loading="showTableLoading"
      @search="listSerach"
    >
      <el-form label-width="auto" :model="searchModel">
        <el-form-item prop="value1" label="分组1分组1">
          <el-input v-model="searchModel.value1" />
        </el-form-item>
        <el-form-item prop="value2" label="分组2">
          <el-input v-model="searchModel.value2" />
        </el-form-item>
        <el-form-item prop="value3" label="分组3">
          <el-input v-model="searchModel.value3" />
        </el-form-item>
        <el-form-item prop="value4" label="分组4">
          <el-input v-model="searchModel.value4" />
        </el-form-item>
        <el-form-item prop="value5" label="分组5">
          <el-input v-model="searchModel.value5" />
        </el-form-item>
        <el-form-item prop="value6" label="分组6">
          <el-input v-model="searchModel.value6" />
        </el-form-item>
      </el-form>
    </GridCollapse>
    <div class="auto-height-table-box" v-loading="showTableLoading">
      <el-table :data="tableData" height="100%">
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          fixed="left"
        />
        <el-table-column prop="id" label="ID" min-width="80" align="center" />
        <el-table-column
          prop="name"
          label="名称"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="state"
          label="状态"
          min-width="80"
          align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.state === true ? '在线' : '忙碌' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="创建时间"
          width="170"
          align="center"
        />
        <el-table-column
          prop="note"
          label="备注"
          min-width="150"
          align="center"
        />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-dropdown
              @click="view(scope.row)"
              size="small"
              trigger="hover"
              split-button
              type="primary"
            >
              查看
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>编辑</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <ListPagination :callback="listSerach" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import GridCollapse from '@/components/GridCollapse.vue'
  import { getStandardList } from '@/api/modules/listPage/standardList'
  import ListPagination from '@/components/ListPagination.vue'

  const router = useRouter()
  const tableData = ref([])
  let pageParams: PageParams
  const searchModel = reactive({
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    value6: '',
    value7: ''
  })

  const showTableLoading = ref(false)
  const listSerach = (page: PageParams) => {
    if (page) pageParams = page
    showTableLoading.value = true
    let params = Object.assign({}, pageParams, searchModel)
    return getStandardList(params)
      .then((res) => {
        showTableLoading.value = false
        tableData.value = res.data
        return 100
      })
      .catch(() => {
        showTableLoading.value = false
      })
  }
  const view = (row: { id: number }) => {
    router.push({ name: 'complex-table-detail', params: { id: row.id } })
  }
</script>

<style lang="less" scoped>
  .standrad-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    .grid-collapse-box {
      padding: 18px 12px 0;
      background-color: var(--main-bg-color);
      margin-bottom: 18px;
    }
  }
</style>
