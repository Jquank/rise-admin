<template>
  <div class="board-detail-box">
    <el-page-header @back="$router.go(-1)" class="pb-10">
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
    <ChartRender style="margin: -24px" />
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import ChartRender from '@/components/dragChart/chart-render.vue'

  const router = useRouter()
  const id = router.currentRoute.value.params.id
  const editBoard = () => {
    console.log('编辑')
    router.push({ name: 'boards-edit', params: { id } })
  }
</script>

<style lang="less" scoped>
  .board-detail-box {
    width: 100%;
    padding: 0;
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-content__right {
        text-align: right;
      }
    }
  }
</style>
