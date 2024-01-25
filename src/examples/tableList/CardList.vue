<template>
  <div class="card-list-box">
    <el-affix :offset="60">
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
    </el-affix>

    <div v-loading="showTableLoading">
      <div class="card-list">
        <div v-for="(item, index) in tableData" :key="item">
          <el-card shadow="hover" @click="view(item)">
            <template #header>
              <span>{{ '看板' + (index + 1) }}</span>
            </template>
            <div>
              描述内容：Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Optio laboriosam deserunt enim?
            </div>
            <template #footer>
              <div style="display: flex; justify-content: space-between">
                <div>指标数：{{ index + 2 }}</div>
                <div>创建人：admin</div>
              </div>
            </template>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import GridCollapse from '@/components/GridCollapse.vue'
  import { listApi, ListType } from '@/api/index'

  const router = useRouter()
  const tableData = ref<ListType.Res_getList[]>([])
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
  const listSerach = () => {
    showTableLoading.value = true
    let params = Object.assign(
      {},
      { currentPage: 1, pageSize: 15 },
      searchModel
    )
    return listApi
      .getList(params)
      .then((res) => {
        showTableLoading.value = false
        tableData.value = res.data
      })
      .catch(() => {
        showTableLoading.value = false
      })
  }
  listSerach()
  const view = (row: { id: number }) => {
    router.push({ name: 'complex-table-detail', params: { id: row.id } })
  }
</script>

<style lang="less" scoped>
  .card-list-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    .card-list {
      min-height: 200px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 18px;
    }
    .el-affix--fixed .grid-collapse-box {
      border-bottom: 1px solid var(--el-border-color-light);
    }
    .grid-collapse-box {
      padding: 18px 12px 0;
      background-color: var(--main-bg-color);
      margin-bottom: 18px;
    }
  }
</style>
