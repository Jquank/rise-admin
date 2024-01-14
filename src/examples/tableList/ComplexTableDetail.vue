<template>
  <div class="detail padding-18 bg-main">
    <el-page-header @back="$router.go(-1)" class="pb-10">
      <template #icon>
        <SvgIcon icon="arrow-left"></SvgIcon>
      </template>
      <template #content>
        <span class="font-weight-600">基本详情页</span>
      </template>
    </el-page-header>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(item, index) in data"
        :key="index"
        :title="item.title"
        :name="index"
      >
        <el-row>
          <el-col v-for="(v, index) in item.content" :key="index" :span="8">
            <div>{{ v.key + ': ' + v.value }}</div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const data = new Array(4).fill({
    title: '基本信息',
    content: [
      { key: '指标名称', value: '近七日下单数' },
      { key: '计量单位', value: '个' },
      { key: '统计粒度', value: '日' },
      { key: '业务含义', value: 'xxxxxxxxxx' },
      { key: '业务负责人', value: '张三' }
    ]
  })
  const activeNames = ref(data.map((_, i) => i))
</script>
