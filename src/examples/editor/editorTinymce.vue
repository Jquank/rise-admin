<template>
  <Editor v-model="content" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import Editor from '@/components/EditorTinymce.vue'
  const content = ref('')
</script>
