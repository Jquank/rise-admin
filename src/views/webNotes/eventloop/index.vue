<template>
  <div class="eventloop-box">
    <h3>
      模拟耗时任务卡顿页面，使用requestIdleCallback或requestAnimationFrame解决
    </h3>
    <el-button @click="reset" type="primary">重置</el-button>
    <div class="eventloop">
      <div class="custom container">
        <div class="title">同步执行(卡顿)</div>
        <div ref="box1" class="box"></div>
        <el-button @click="fn1" type="primary">点击执行任务</el-button>
      </div>
      <div class="idle container">
        <div class="title">requestIdleCallback</div>
        <div ref="box2" class="box"></div>
        <el-button @click="fn2" type="primary">点击执行任务</el-button>
      </div>
      <div class="frame container">
        <div class="title">requestAnimationFrame</div>
        <div ref="box3" class="box"></div>
        <el-button @click="fn3" type="primary">点击执行任务</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  let n1 = 9999
  let n2 = 19999
  let n3 = 19999
  const box1 = ref<HTMLElement | null>(null)
  const box2 = ref<HTMLElement | null>(null)
  const box3 = ref<HTMLElement | null>(null)
  // 模拟同步耗时任务
  const calc1 = () => {
    while (n1 > 0) {
      let r = Math.random() < 0.5 ? Math.random() : Math.random()
      console.log(r)
      n1--
    }
  }
  // 模拟耗时任务，使用requestIdleCallback执行， 空闲时间大于1ms才执行任务，否则进入下一事件循环等待空闲时间
  const calc2 = (deadline: IdleDeadline) => {
    while (n2 > 0 && deadline.timeRemaining() > 1) {
      let r = Math.random() < 0.5 ? Math.random() : Math.random()
      console.log(r)
      n2--
    }
    requestIdleCallback(calc2)
  }
  // 模拟耗时任务，使用requestAnimationFrame执行
  const calc3 = () => {
    let start = Date.now()
    // 此处时间设置与屏幕刷新率匹配
    while (n3 > 0 && Date.now() - start < 6.9) {
      let r = Math.random() < 0.5 ? Math.random() : Math.random()
      console.log(r)
      n3--
    }
    requestAnimationFrame(calc3)
  }
  const fn1 = () => {
    if (box1.value) {
      box1.value.style.width = '100%'
    }
    calc1()
  }
  const fn2 = () => {
    if (box2.value) {
      box2.value.style.width = '100%'
    }

    requestIdleCallback(calc2)
  }
  const fn3 = () => {
    if (box3.value) {
      box3.value.style.width = '100%'
    }
    requestAnimationFrame(calc3)
  }
  const reset = () => {
    location.reload()
  }
</script>

<style lang="less" scoped>
  .eventloop-box {
    background-color: var(--main-bg-color);
  }
  .eventloop {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    margin-top: 20px;

    .container {
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.12),
        0 0 6px rgba(0, 0, 0, 0.04);
      padding: 10px;
    }
    .title {
      text-align: center;
      margin-bottom: 10px;
    }
    .box {
      height: 150px;
      width: 10px;
      background-color: aqua;
      margin-bottom: 20px;
      transition: 1s;
    }
  }
</style>
