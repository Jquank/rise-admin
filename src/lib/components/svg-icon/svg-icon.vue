<template>
  <svg class="svg-icon icon" aria-hidden="true" :style="styleContent">
    <use :xlink:href="'#icon-' + props.icon" :fill="props.color"></use>
  </svg>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  const props = defineProps({
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    size: {
      type: Number
    }
  })

  const styleContent = computed(() => {
    return {
      width: !props.size ? undefined : props.size + 'px',
      height: !props.size ? undefined : props.size + 'px'
    }
  })
</script>
