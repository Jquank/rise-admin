<template>
  <div class="grid-collapse-box" ref="gridCollapseRef">
    <component :is="elFormVnode ? elFormVnode : 'div'" ref="elFormRef">
      <el-row :gutter="10" class="slot-el-row">
        <el-col
          v-for="(vnode, index) in vnodesArr"
          :key="index"
          :xs="breakPoint.xs"
          :sm="breakPoint.sm"
          :md="breakPoint.md"
          :lg="breakPoint.lg"
          :xl="breakPoint.xl"
          ref="colRefs"
          :class="{
            'hidden-xs-only xs':
              defaultCollapse && index > 24 / breakPoint.xs - 2,
            'hidden-sm-only sm':
              defaultCollapse && index > 24 / breakPoint.sm - 2,
            'hidden-md-only md':
              defaultCollapse && index > 24 / breakPoint.md - 2,
            'hidden-lg-only lg':
              defaultCollapse && index > 24 / breakPoint.lg - 2,
            'hidden-xl-only xl':
              defaultCollapse && index > 24 / breakPoint.xl - 2
          }"
        >
          <component :is="vnode"></component>
        </el-col>
        <el-col
          :xs="breakPoint.xs"
          :sm="breakPoint.sm"
          :md="breakPoint.md"
          :lg="breakPoint.lg"
          :xl="breakPoint.xl"
          ref="lastColRef"
          class="expand-or-collapse"
        >
          <el-button @click="reset" v-if="showActionBtn">重置</el-button>
          <el-button
            @click="search"
            type="primary"
            :native-type="props.submitButton ? 'submit' : 'button'"
            v-if="showActionBtn"
            :loading="props.loading"
            >查询</el-button
          >
          <span @click="toggleCollapse" class="text">{{
            defaultCollapse ? $t('common.expand') : $t('common.collapse')
          }}</span>
          <SvgIcon
            @click="toggleCollapse"
            :icon="defaultCollapse ? 'arrow-down' : 'arrow-up'"
          ></SvgIcon>
        </el-col>
      </el-row>
    </component>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    useSlots,
    type VNode,
    type ComponentPublicInstance,
    watchEffect
  } from 'vue'
  import type { FormInstance } from 'element-plus'

  const props = defineProps({
    // 默认折叠
    defaultCollapseState: {
      type: Boolean,
      default: true
    },
    // 按钮的显示
    showActionBtn: {
      type: Boolean,
      default: true
    },
    // 查询按钮是否设置为native-type=submit
    submitButton: {
      type: Boolean,
      default: true
    },
    // 是否开启折叠动画
    animation: {
      type: Boolean,
      default: false
    },
    // 取消栅格，即默认设置跨度为24的栅格
    cancelGrid: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['search', 'reset'])

  const breakPoint = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 4
  }
  const defaultCollapse = ref(props.defaultCollapseState)
  const slots = useSlots()
  let defaultSlots = slots.default ? slots.default() : []
  let vnodesArr: VNode[] = []
  let elFormVnode: VNode // 去掉children后的el-form的vnode

  const colRefs = ref<ComponentPublicInstance[]>([])
  const elFormRef = ref<FormInstance | null>(null)
  const gridCollapseRef = ref<HTMLElement | null>(null)
  const lastColRef = ref<ComponentPublicInstance | null>(null)

  watchEffect(() => {
    if (props.cancelGrid) {
      Object.keys(breakPoint).forEach((k) => {
        ;(breakPoint[k as keyof typeof breakPoint] as number) = 24
      })
    }
  })

  /** 处理el-form和el-form-item的vnode */
  const handleElFormVnode = () => {
    let elFormItemVnodes: VNode[] = []
    if (defaultSlots.length) {
      // 过滤掉注释
      defaultSlots = defaultSlots.filter(
        (v) => String(v.type) !== String(Symbol('v-cmt'))
      )
      let index = defaultSlots.findIndex((v) => {
        return (
          typeof v.type === 'object' &&
          (v.type as unknown as { name: string }).name === 'ElForm'
        )
      })
      if (index > -1) {
        let originElFormVnode = defaultSlots.splice(
          index,
          1
        )[0] as unknown as VNode
        // 移除chilren
        elFormVnode = { ...originElFormVnode, children: null }
        // ElForm默认属性覆盖，这里不允许全局的disabled，会禁用掉查询按钮
        elFormVnode.props = { ...elFormVnode.props, disabled: false }
        if (originElFormVnode && originElFormVnode.children) {
          elFormItemVnodes = (
            originElFormVnode.children as { default: () => VNode[] }
          )
            .default()
            .filter((v) => String(v.type) !== String(Symbol('v-cmt')))
        }
        defaultSlots.splice(index, 0, ...elFormItemVnodes)
      }
      vnodesArr = defaultSlots
    }
  }
  handleElFormVnode()

  const search = () => {
    emits('search')
  }
  const reset = () => {
    // 这里默认帮忙reset掉ElFrom表单，如果不是ElFrom，请到组件中监听reset事件处理
    if (
      elFormRef.value &&
      typeof elFormRef.value === 'object' &&
      elFormRef.value.resetFields
    ) {
      elFormRef.value?.resetFields()
    }
    emits('reset')
    search()
  }
  const toggleCollapse = () => {
    if (props.animation) {
      transitionHeight(gridCollapseRef.value!, defaultCollapse.value)
    }
    defaultCollapse.value = !defaultCollapse.value
    colRefs.value.forEach((r) => {
      let classList = r.$el.classList
      Object.keys(breakPoint).forEach((k) => {
        if (classList.contains(`hidden-${k}-only`)) {
          classList.remove(`hidden-${k}-only`)
        } else {
          if (classList.contains(k)) {
            classList.add(`hidden-${k}-only`)
          }
        }
      })
    })
  }

  // 高度过渡动画
  function transitionHeight(
    dom: HTMLElement,
    collapse: boolean,
    duration = 200
  ) {
    if (!dom) return
    let initHeight = dom.scrollHeight || 0
    let endHeight = 0
    var start: number | undefined
    let first = true
    // 缓动函数
    let easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    }
    let step = function (timestamp: number) {
      if (first) {
        endHeight = dom.scrollHeight || 0
        first = false
      }

      if (!start) start = timestamp
      let time = timestamp - start
      let setHeight = easeInOutQuad(
        time,
        initHeight,
        endHeight - initHeight,
        duration
      )
      if (collapse ? endHeight - setHeight < 0 : endHeight - setHeight > 0) {
        setHeight = endHeight
      }
      dom.style.setProperty('height', setHeight + 'px')
      if (
        time < duration &&
        (collapse ? setHeight < endHeight : setHeight > endHeight)
      ) {
        window.requestAnimationFrame(step)
      } else {
        dom.style.setProperty('height', 'auto')
      }
    }
    window.requestAnimationFrame(step)
  }
</script>

<style lang="less" scoped>
  @import 'element-plus/theme-chalk/display.css';
  .grid-collapse-box {
    position: relative;
    height: auto;
    // transition: maxHeight 1s;
    .col-opacity-1 {
      opacity: 1;
    }
    .slot-el-row {
      width: 100%;
      .el-col {
        margin-bottom: 18px;
      }
    }
    :deep(.el-form-item) {
      margin: 0;
    }
    .expand-or-collapse {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: auto;
      color: var(--el-color-primary, #409eff);
      cursor: pointer;
      .text {
        padding: 0 5px 0 10px;
        user-select: none;
      }
    }
  }
</style>
