<template>
  <div class="board-detail-box">
    <div class="header padding-10">
      <el-page-header @back="$router.go(-1)">
        <template #icon>
          <SvgIcon icon="arrow-left"></SvgIcon>
        </template>
        <template #content>
          <span class="font-weight-500">{{ detailData.title }}</span>
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
      <ChartRender :data="detailData.cards" />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  // import { ChartRender } from '@jquank/rise-ui'
  import { ChartRender } from '@/lib/components/drag-chart'
  import { boardApi } from '@/_api/index'

  interface BoardDetailProps {
    title: string
    cards: []
  }

  const router = useRouter()
  const route = useRoute()
  const detailData = ref<BoardDetailProps>({
    title: '',
    cards: []
  })
  boardApi.getBoardById(+route.params.id).then((res) => {
    detailData.value = res.data
  })
  const editBoard = () => {
    router.push({
      name: 'boards-edit',
      params: { id: route.params.id }
    })
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
      position: relative;
      flex: 1;
      height: 100%;
    }
  }
</style>
