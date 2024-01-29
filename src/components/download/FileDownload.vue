<template>
  <div style="display: inline-block" @click="download">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import $http from '@/utils/http'
  const props = defineProps({
    url: {
      type: String,
      required: true
    }
  })
  const toHttpBlob = (url: string, type = 'blob') => {
    return $http
      .get(url, {
        baseURL: '',
        withCredentials: false,
        headers: {
          Authorization: null
        },
        responseType: type
      })
      .then((res) => {
        return res
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const download = async () => {
    const reg = /\.(js|json|txt|jpg|png|svg|gif|bmp|mp3|mp4)/
    let url = ''
    if (reg.test(props.url)) {
      const res = await toHttpBlob(props.url)
      url = window.URL.createObjectURL(res)
    }
    const aTag = document.createElement('a')
    aTag.href = url || props.url
    aTag.download = ''
    aTag.click()
    window.URL.revokeObjectURL(url)
  }
</script>
