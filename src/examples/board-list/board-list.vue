<template>
  <div class="board-list-box">
    <el-affix :offset="60">
      <RGridCollapse
        class="grid-collapse-box"
        :loading="showTableLoading"
        @search="listSerach">
        <el-form label-suffix=" :" :model="searchModel">
          <el-form-item label="名称" prop="name">
            <el-input v-model="searchModel.name" placeholder="请输入看板名称" />
          </el-form-item>
          <el-form-item label="创建人" prop="creator">
            <el-input v-model="searchModel.creator" placeholder="请选择" />
          </el-form-item>
        </el-form>
      </RGridCollapse>
    </el-affix>

    <div v-loading="showTableLoading">
      <div class="card-list">
        <div v-for="(item, index) in tableData" :key="item">
          <el-card
            shadow="hover"
            @click="view(item)"
            :class="item.active ? 'active' : ''">
            <template #header>
              <div v-ellipsis-tooltip class="ellipsis">
                {{ item.title }}
              </div>
            </template>
            <div
              v-ellipsis-tooltip.multiline
              class="multiline-ellipsis"
              style="height: 67.5px">
              {{ item.desc }}
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
  import { RGridCollapse } from '@jquank/rise-ui'
  import { boardApi } from '@/_api2/index'
  const router = useRouter()
  const tableData = ref([])
  const searchModel = reactive({
    name: '',
    creator: ''
  })
  const showTableLoading = ref(false)
  const listSerach = () => {
    showTableLoading.value = true
    return boardApi
      .getBoard()
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
    router.push({ name: 'boards-detail', params: { id: row.id } })
  }
</script>

<style lang="less" scoped>
  .board-list-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    .card-list {
      min-height: 200px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 18px;
      .active {
        border: 1px solid var(--el-color-primary);
      }
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
