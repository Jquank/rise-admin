<template>
  <div class="board-detail-box">
    <div class="header padding-10">
      <el-page-header @back="$router.go(-1)">
        <template #icon>
          <SvgIcon icon="arrow-left"></SvgIcon>
        </template>
        <template #content>
          <span class="font-weight-500">看板1</span>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button @click="editBoard" type="primary" class="mr-10"
              >编辑</el-button
            >
          </div>
        </template>
      </el-page-header>
    </div>
    <el-scrollbar class="content">
      <ChartRender :data="mockData.cards" />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ChartRender } from '@jquank/rise-ui'
  import { numberDataMocked, barDataMocked, lineDataMocked } from './mock'
  const mockData = {
    id: '1',
    title: '看板1',
    desc: '看板1描述',
    cards: [numberDataMocked, barDataMocked, lineDataMocked]
  }

  const router = useRouter()
  const id = router.currentRoute.value.params.id
  const editBoard = () => {
    router.push({ name: 'boards-edit', params: { id } })
  }
</script>

<style lang="less" scoped>
  .board-detail-box {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 299;
    background-color: var(--main-bg-color);
    .header {
      border-bottom: 1px solid var(--el-border-color);
    }
    .content {
      flex: 1;
      height: 100%;
      background-color: var(--section-bg-color);
    }
  }
</style>
