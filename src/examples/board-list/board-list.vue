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
                {{
                  `看板111看板111看板111看板111看板111看板111看板111
                  看板111看板111看板111看板111看板111看板111看板111`.slice(
                    0,
                    Math.floor(Math.random() * 100)
                  )
                }}
              </div>
            </template>
            <div
              v-ellipsis-tooltip.multiline
              class="multiline-ellipsis"
              style="height: 67.5px">
              {{
                `描述内容：Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Optio laboriosam deserunt enim?Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Optio laboriosam deserunt enim?Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Optio
              laboriosam deserunt enim?Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Optio laboriosam deserunt enim?Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Optio laboriosam deserunt
              enim?Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Optio laboriosam deserunt enim?`.slice(
                  0,
                  Math.floor(Math.random() * 500)
                )
              }}
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
  import { listApi, ListType } from '@/api/index'
  import { RGridCollapse } from '@/lib/components/grid-collapse'
  const router = useRouter()
  const tableData = ref<ListType.Res_getList[]>([])
  const searchModel = reactive({
    name: '',
    creator: ''
  })
  const showTableLoading = ref(false)
  const listSerach = () => {
    showTableLoading.value = true
    let params = Object.assign({}, { currentPage: 1, pageSize: 8 }, searchModel)
    return listApi
      .getList(params, { baseURL: import.meta.env.VITE_HTTP_URL2 || '' })
      .then((res) => {
        showTableLoading.value = false
        tableData.value = res.data
        tableData.value[0].active = true
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
