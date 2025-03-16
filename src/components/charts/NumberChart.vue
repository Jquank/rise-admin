<template>
  <div class="chart-inner">
    <ChartTitle :title="props.data.title" :value="props.data.value" />
    <div class="number-footer">
      <span>
        <SvgIcon icon="shangjiantou" color="rgb(82, 196, 26)" />
        {{ 11 }}</span
      >
      <span class="last-span">
        <SvgIcon icon="xiajiantou" color="rgb(250, 84, 28)" />
        {{ 22 }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import ChartTitle from './ChartTitle.vue'
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    }
  })
  onMounted(() => {
    console.log(props.data, 'ppppp')
  })

  // const data = reactive({
  //   title: ['商品销售总量', '近七日销售额', '搜索次数', '优惠券发放量'][
  //     +props.i!
  //   ],
  //   value: Math.floor(Math.random() * 10000) + '.00',
  //   up: Math.floor(Math.random() * 100) + '%',
  //   down: Math.floor(Math.random() * 100) + '%'
  // })
</script>

<style lang="less" scoped>
  :deep(.number-value) {
    margin-top: -20px;
  }
  .number-footer {
    align-self: flex-end;
    cursor: default;
    .last-span {
      margin-left: 15px;
    }
  }
</style>
