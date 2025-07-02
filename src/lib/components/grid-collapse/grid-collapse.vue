<template>
  <div class="grid-collapse-box" ref="gridCollapseRef">
    <component :is="elFormVnode ? elFormVnode : 'div'" ref="elFormRef">
      <el-row :gutter="20" class="slot-el-row">
        <el-col
          v-for="(vnode, index) in vnodesArr"
          :key="index"
          :xs="getColSpan(vnode, 'xs')"
          :sm="getColSpan(vnode, 'sm')"
          :md="getColSpan(vnode, 'md')"
          :lg="getColSpan(vnode, 'lg')"
          :xl="getColSpan(vnode, 'xl')"
          ref="colRefs"
          :class="{
            'hidden-xs-only xs': hiddenCol(index, 'xs'),
            'hidden-sm-only sm': hiddenCol(index, 'sm'),
            'hidden-md-only md': hiddenCol(index, 'md'),
            'hidden-lg-only lg': hiddenCol(index, 'lg'),
            'hidden-xl-only xl': hiddenCol(index, 'xl')
          }">
          <component :is="vnode"></component>
        </el-col>
        <el-col
          :xs="originBreakPoint.xs"
          :sm="originBreakPoint.sm"
          :md="originBreakPoint.md"
          :lg="originBreakPoint.lg"
          :xl="originBreakPoint.xl"
          ref="lastColRef"
          class="expand-or-collapse">
          <div class="button-col">
            <div class="left">
              <slot name="left-buttons" v-if="props.buttonInRow"></slot>
            </div>
            <div class="right">
              <slot name="right-buttons"></slot>
              <el-button
                @click="search"
                type="primary"
                :native-type="props.submitButton ? 'submit' : 'button'"
                v-if="showActionBtn"
                :loading="props.loading"
                >查询</el-button
              >
              <el-button @click="reset" v-if="showActionBtn">重置</el-button>
              <span @click="toggleCollapse" class="text">{{
                defaultCollapseState
                  ? $t('common.expand')
                  : $t('common.collapse')
              }}</span>
              <SvgIcon
                @click="toggleCollapse"
                :icon="
                  defaultCollapseState ? 'arrow-down' : 'arrow-up'
                "></SvgIcon>
            </div>
          </div>
        </el-col>
      </el-row>
    </component>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    reactive,
    useSlots,
    type ComponentPublicInstance,
    computed,
    onMounted
  } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { cloneDeep } from 'lodash-es'
  import { transitionHeight } from '../../utils'

  interface VNode2 {
    type: { name: string; __name: string }
    default: () => VNode2 | VNode2[]
    children?: VNode2 | VNode2[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props?: Record<string, any>
  }

  const props = defineProps({
    /** 是否默认折叠 */
    defaultCollapse: {
      type: Boolean,
      default: true
    },
    /** 按钮的显示 */
    showActionBtn: {
      type: Boolean,
      default: true
    },
    /** 查询按钮是否设置为native-type=submit */
    submitButton: {
      type: Boolean,
      default: true
    },
    /** 是否开启折叠动画 */
    animation: {
      type: Boolean,
      default: true
    },
    /** 查询重置按钮的loading */
    loading: {
      type: Boolean,
      default: false
    },
    /** 按钮是否独占一行，使用于有额外按钮的情况 */
    buttonInRow: {
      type: Boolean,
      default: false
    },
    /** 默认一行的列数 */
    colNumber: {
      type: Number,
      default: 0
    }
  })
  const emits = defineEmits(['search', 'reset'])

  const originBreakPoint = reactive({
    xs: 24,
    sm: 12,
    md: 12,
    lg: 8,
    xl: 6
  })
  const breakPoint = reactive(cloneDeep(originBreakPoint))
  const defaultCollapseState = ref(props.defaultCollapse)
  const slots = useSlots()
  let defaultSlots = (slots.default
    ? slots.default()
    : []) as unknown as VNode2[]
  let vnodesArr: VNode2[] = []
  let elFormVnode: VNode2 // 去掉children后的el-form的vnode

  const colRefs = ref<ComponentPublicInstance[]>([])
  const elFormRef = ref<FormInstance | null>(null)
  const gridCollapseRef = ref<HTMLElement | null>(null)
  const lastColRef = ref<ComponentPublicInstance | null>(null)

  /** 按钮列所占栅格数量，为0则单独起一行，为1则占最后一个栅格 */
  const buttonColCount = computed(() => {
    if (props.buttonInRow) {
      Object.keys(originBreakPoint).forEach((k) => {
        originBreakPoint[k] = 24
      })
      return 0
    }
    return 1
  })

  /** 隐藏栅格的条件 */
  const hiddenCol = (index: number, key: keyof typeof breakPoint) => {
    return (
      defaultCollapseState.value &&
      index + 1 > Math.ceil(24 / breakPoint[key] - buttonColCount.value)
    )
  }

  const getColSpan = (_: VNode2, type: string) => {
    if (props.colNumber) {
      return 24 / props.colNumber
    }
    return breakPoint[type]
  }

  const handleVnodeChildren = (c: VNode2 | VNode2[]) => {
    if (!c) return null
    if (typeof c === 'object' && 'default' in c) {
      return handleVnodeChildren(c.default())
    }
    if (Array.isArray(c) && c.length) {
      if (
        c.some(
          (item) =>
            item?.type?.name === 'ElFormItem' ||
            item?.type?.__name === 'ElFormItem'
        )
      ) {
        return c
      } else {
        return handleVnodeChildren(c[0].children)
      }
    }
  }

  /** 处理el-form和el-form-item的vnode */
  const handleElFormVnode = () => {
    let elFormItemVnodes: VNode2[] = []
    if (defaultSlots.length) {
      // 过滤掉注释
      defaultSlots = defaultSlots.filter(
        (v) => String(v.type) !== String(Symbol('v-cmt'))
      )
      let index = defaultSlots.findIndex((v) => {
        const type = v.type as { name: string; __name: string }
        return (
          typeof type === 'object' &&
          (type.name === 'ElForm' || type.__name === 'ElForm')
        )
      })
      // 如果默认插槽传入了el-form，单独处理其栅格布局
      if (index > -1) {
        let originElFormVnode = defaultSlots.splice(index, 1)[0]
        console.log(originElFormVnode)
        // 移除chilren
        elFormVnode = { ...originElFormVnode, children: null }
        elFormVnode.props.model
        // ElForm默认属性覆盖，这里不允许全局的disabled，会禁用掉查询按钮
        // elFormVnode.props = { ...elFormVnode.props, disabled: false }
        elFormItemVnodes = handleVnodeChildren(originElFormVnode.children)
        defaultSlots.splice(index, 0, ...elFormItemVnodes)
      }
      vnodesArr = defaultSlots
      console.log(vnodesArr)
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
      transitionHeight(gridCollapseRef.value!, defaultCollapseState.value)
    }
    defaultCollapseState.value = !defaultCollapseState.value
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

  onMounted(() => {
    elFormRef.value && elFormRef.value?.resetFields()
    elFormRef.value && elFormRef.value?.clearValidate()
  })
</script>

<style lang="less" scoped>
  @import 'element-plus/theme-chalk/display.css';
  .grid-collapse-box {
    position: relative;
    height: auto;
    overflow: hidden;
    .col-opacity-1 {
      opacity: 1;
    }
    .slot-el-row {
      width: 100%;
      align-items: end;
      .el-col {
        margin-bottom: 12px;
        & > :deep(.el-form-item) {
          margin-bottom: 0;
        }
      }
    }

    .expand-or-collapse {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: auto;
      color: var(--el-color-primary, #409eff);
      cursor: pointer;
      .button-col {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .left {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          overflow: hidden;
        }
        .right {
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-left: 12px;
          .text {
            padding: 0 5px 0 10px;
            user-select: none;
          }
        }
      }
    }
  }
</style>
