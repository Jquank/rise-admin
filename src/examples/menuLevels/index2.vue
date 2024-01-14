<template>
  <div>
    <h1>{{ arr[2] }}</h1>
    <div style="padding-left: 20px">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter()
  let arr: string[]
  try {
    arr = router.currentRoute.value.matched
      .filter((v) => v.path.includes('/menu1'))
      .map((v) => v.meta.title)
  } catch (error) {
    console.error(error)
  }
</script>
