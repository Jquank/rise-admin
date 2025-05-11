<template>
  <div class="dashboard-edit">
    <div class="edit-header">
      <el-page-header @back="$router.go(-1)" class="padding-10">
        <template #icon>
          <SvgIcon icon="arrow-left"></SvgIcon>
        </template>
        <template #content>
          <span class="font-weight-500">{{ boardData.title }}</span>
          <SvgIcon icon="arrow-left" class="cursor-pointer ml-10"></SvgIcon>
        </template>
        <template #extra>
          <el-button @click="saveBoard" type="primary" class="mr-10"
            >保存</el-button
          >
        </template>
      </el-page-header>
    </div>
    <div class="edit-content">
      <DropRender
        :defaultSize="[1, 1]"
        :customCharts="{ button: ElButton }"
        @add="dropAdd"
        @selected="chartSelected"
        v-model="layoutData">
        <template #left>
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
                      <div class="custom-node ellipsis">
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
        </template>
        <template #right>
          <div class="edit-right">
            <el-form
              label-position="top"
              label-width="auto"
              :model="currentChartData"
              :disabled="configDisabled">
              <el-form-item label="名称:">
                <el-input
                  v-model="currentChartData.title"
                  maxlength="30"
                  show-word-limit />
              </el-form-item>
              <el-form-item label="类型:">
                <div class="icon-list">
                  <div
                    @click="iconTypeClick(item)"
                    v-for="item in iconList"
                    :key="item.icon"
                    :title="item.name"
                    :class="[
                      'icon-item',
                      configDisabled ? 'disabled' : '',
                      currentChartData.type === item.type ? 'active' : ''
                    ]">
                    <SvgIcon
                      :icon="item.icon"
                      :size="25"
                      color="var(--el-text-color-regular)"></SvgIcon>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </DropRender>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { userApi, type UserType } from '@/_api/index'
  import { ElButton } from 'element-plus'
  // import {
  //   DragWrapper,
  //   DropRender,
  //   ChartItemType,
  //   iconList as originIconList
  // } from '@jquank/rise-ui'
  import {
    DragWrapper,
    DropRender,
    ChartItemType,
    iconList as originIconList
  } from '@/lib/components/drag-chart'
  import { numberDataMocked, barDataMocked, lineDataMocked } from './mock'
  import { omit, cloneDeep, pick } from 'lodash-es'
  import { BoardApi } from '@/_api2/index'

  const route = useRoute()

  const iconList = originIconList.concat({
    icon: 'shuaxin',
    name: '自定义组件示例',
    type: 'button'
  })

  type IconItemType = (typeof iconList)[0]
  const mockData = {
    id: '1',
    title: '看板1',
    desc: '看板1描述',
    cards: [numberDataMocked, barDataMocked, lineDataMocked]
  }

  const activeName = ref('optional')
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
  // #endregion

  // #region DropArea

  const boardData = ref<any>({})
  const layoutData = ref<ChartItemType[]>([])

  BoardApi.getBoardById(+route.params.id).then((res: any) => {
    boardData.value = pick(res.data, ['id', 'title', 'desc'])
    layoutData.value = res.data.cards
  })

  // 获取单个图表数据
  const getChartData = async (
    params: unknown
  ): Promise<typeof numberDataMocked> => {
    console.log(params)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(cloneDeep(numberDataMocked))
      }, 200)
    })
  }
  const dropAdd = async (nodeData: unknown, i: string) => {
    const chartData = await getChartData(nodeData)
    console.log(layoutData.value, '9999')

    const item = layoutData.value.find((v) => v.i === i)
    if (item) {
      Object.assign(item, chartData, { posi: item.posi })
    }
    console.log(item, i, 'item')

    currentChartData.value = item
    configDisabled.value = false
  }

  /** 图表选中事件 */
  const chartSelected = (item: ChartItemType) => {
    configDisabled.value = false
    currentChartData.value = item
  }

  // #endregion

  // #region 图表配置相关
  /** 当前选中图表数据 */
  const currentChartData = ref<ChartItemType>({})
  /** 图表类型切换 */
  const iconTypeClick = async (item: IconItemType) => {
    if (configDisabled.value || currentChartData.value.type === item.type)
      return
    // 模拟类型切换查询数据
    await getChartData({
      ...currentChartData.value,
      type: item.type
    })
    const mockData = omit(cloneDeep(numberDataMocked), ['id', 'posi'])
    currentChartData.value = {
      ...currentChartData.value,
      ...mockData,
      config: currentChartData.value.config
    }
    layoutData.value = layoutData.value.map((v) => {
      if (v.i === currentChartData.value.i) {
        v = {
          ...v,
          ...mockData
        }
      }
      return v
    })
    console.log(layoutData.value, '222')
  }
  // #endregion
  const saveBoard = async () => {
    await BoardApi.putBoard({ ...boardData.value, cards: layoutData.value })
  }
</script>

<style lang="less" scoped>
  .dashboard-edit {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 300;
    background-color: var(--main-bg-color);
    .edit-header {
      border-bottom: 1px solid var(--el-border-color);
    }
    .edit-content {
      flex: 1;
      height: 100%;

      .edit-left {
        width: 200px;
        .custom-node {
          width: 100%;
          cursor: move;
        }
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
            margin-bottom: 8px;
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
