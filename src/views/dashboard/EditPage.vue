<template>
  <div class="dashboard-edit">
    <div class="edit-header">
      <el-page-header @back="$router.go(-1)" class="padding-10">
        <template #icon>
          <SvgIcon icon="arrow-left"></SvgIcon>
        </template>
        <template #content>
          <span class="font-weight-500">看板1</span>
          <SvgIcon icon="arrow-left" class="cursor-pointer ml-10"></SvgIcon>
        </template>
        <template #extra>
          <el-button type="primary" class="mr-10">保存</el-button>
        </template>
      </el-page-header>
    </div>
    <div class="edit-content">
      <div class="edit-left">
        <el-tabs v-model="activeName">
          <el-tab-pane label="可选指标" name="optional">
            <el-tree
              ref="treeRef"
              :props="defaultProps"
              :data="treeData"
              node-key="id"
              default-expand-all>
              <template #default="{ node, data }">
                <DragWrapper
                  :nodeData="node"
                  v-if="!data.children || !data.children.length">
                  <div
                    class="custom-node ellipsis"
                    @click="nodeClick(node, data)">
                    <span>{{ node.label }}</span>
                  </div>
                </DragWrapper>
                <div v-else class="custom-node ellipsis">
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="收藏指标" name="favorite">Config</el-tab-pane>
        </el-tabs>
      </div>
      <el-scrollbar class="edit-center" view-class="drop-area-scrollbar-view">
        <DropArea
          :customGraphs="{ button: ElButton }"
          @add="dropAdd"
          @active="chartActive"
          v-model="layoutData"></DropArea>
      </el-scrollbar>
      <div class="edit-right">
        <el-form
          label-position="top"
          label-width="auto"
          :model="chartConfig"
          :disabled="configDisabled">
          <el-form-item label="名称:">
            <el-input
              v-model="chartConfig.name"
              maxlength="20"
              show-word-limit />
          </el-form-item>
          <el-form-item label="类型:">
            <div class="icon-list">
              <div
                @click="iconTypeClick(item)"
                v-for="item in iconList"
                :key="item.name"
                :class="[
                  'icon-item',
                  configDisabled ? 'disabled' : '',
                  activeType === item.type ? 'active' : ''
                ]">
                <SvgIcon
                  :icon="item.name"
                  :size="25"
                  color="var(--el-text-color-regular)"></SvgIcon>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { roleApi, type RoleType, userApi, type UserType } from '@/_api/index'
  import DragWrapper from '@/components/dragChart/DragWrapper.vue'
  import { numberDataMock } from '@/components/charts/mock'
  import DropArea from '@/components/dragChart/DropArea.vue'
  import { ElButton } from 'element-plus'
  import { iconList } from '@/components/dragChart/icon'

  interface IconType {
    name: string
    type: number
  }
  const activeName = ref('optional')
  const props = defineProps({
    nodeData: {
      type: Object,
      default: () => ({})
    }
  })
  const configDisabled = ref(true)
  // #region 指标树
  const treeData = ref<UserType.Res_getUserDepartmentTree[]>([])
  const treeRef = ref()
  const defaultProps = {
    label: 'name'
  }
  const getTreeData = async () => {
    const { data } = await userApi.getUserDepartmentTree()
    treeData.value = data
  }
  getTreeData()
  const nodeClick = () => {}
  // #endregion

  // #region DropArea
  const layoutData = ref<any[]>([])
  const activeType = ref(-1)
  const dropAdd = (nodeData: any, pos: any, callback: any) => {
    const { posi } = pos
    setTimeout(() => {
      layoutData.value.push({ ...numberDataMock, posi })
      callback()
    }, 300)
  }
  const chartActive = (item: any) => {
    if (item.i) {
      activeType.value = item.type
      configDisabled.value = false
    }
  }
  // #endregion

  // #region 图表配置相关
  const chartConfig = reactive({
    name: ''
  })
  const iconTypeClick = (item: IconType) => {
    if (configDisabled.value || activeType.value === item.type) return
    activeType.value = item.type
  }
  // #endregion
</script>

<style lang="less">
  .edit-center {
    .drop-area-scrollbar-view {
      height: 100%;
    }
  }
</style>

<style lang="less" scoped>
  .dashboard-edit {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: var(--main-bg-color);
    .edit-header {
      border-bottom: 1px solid var(--el-border-color);
    }
    .edit-content {
      flex: 1;
      height: 100%;
      display: flex;

      .edit-left {
        width: 200px;
        .custom-node {
          width: 100%;
        }
      }
      .edit-center {
        flex: 1;
        height: 100%;
        background-color: var(--section-bg-color);
      }
      .edit-right {
        width: 300px;
        padding: 18px 10px;
        .icon-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 100%;

          .icon-item {
            line-height: 1;
            cursor: pointer;
            padding: 5px;
            background-color: var(--el-disabled-bg-color);
            margin-left: 6px;
          }
          .disabled {
            cursor: not-allowed;
            background-color: var(--el-disabled-bg-color);
          }
          .active {
            background-color: var(--el-color-primary-light-7);
          }
        }
      }
    }
  }
</style>
