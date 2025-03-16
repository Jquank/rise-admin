<template>
  <div>
    <el-alert title="阿里图标库" type="info" :closable="false">
      <a
        target="_blank"
        href="https://www.iconfont.cn/manage/index?spm=a313x.home_index.i3.22.49493a81f23yON&manage_type=myprojects&projectId=4380660"
        >link</a
      >
    </el-alert>
    <div class="ex-icons">
      <div v-for="item in data" :key="item">
        <el-tooltip :content="getContent(item)" placement="top">
          <el-card>
            <div style="text-align: center">
              <SvgIcon :icon="item" :size="28"></SvgIcon>
            </div>
          </el-card>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import $http from '@/utils/http'
  import iconfontURL from '/src/assets/icons/iconfont.js?url'

  const data = ref<string[]>([])
  const getContent = (str: string) => {
    return `<SvgIcon :icon="${str}"></SvgIcon>`
  }
  const urls = [
    iconfontURL,
    'https://at.alicdn.com/t/c/font_4380660_b9lbte90tyr.js'
  ]
  const request = async (urls: string[]) => {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      try {
        let res = await $http.get(url, {
          baseURL: '',
          withCredentials: false,
          headers: {
            Authorization: null
          }
        })
        if (res && typeof res === 'string') {
          // eval(res)
          let regexp = /id="icon-(.*?)"/g
          // res.replace(regexp, (_, g1) => {
          //   data.value.push(g1)
          // })
          // const matches = res.matchAll(regexp)
          // data.value = [...matches]
          let match: RegExpExecArray | null
          while ((match = regexp.exec(res)) !== null) {
            data.value.push(match[1])
          }
          return
        }
      } catch (error) {
        /* empty */
      }
    }
  }
  request(urls)
</script>

<style lang="less" scoped>
  .ex-icons {
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
  }
</style>
