<template>
  <div style="background: var(--main-bg-color); padding: 18px">
    <el-alert type="info" :closable="false"
      >{{ `<FileDownload url="//at.alicdn.com/t/c/font_4380660_r3zwauwij5l.js">
        下载</FileDownload
      >` }}
      <div>浏览器可识别文件转为blob下载，其它文件直接用a标签下载</div>
    </el-alert>
    <div class="mt-20">
      <FileDownload :url="xlsURL">
        <el-button>下载excel</el-button>
      </FileDownload>
      <FileDownload :url="pdfURL" style="margin-left: 30px">
        <el-button>下载pdf</el-button>
      </FileDownload>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FileDownload from '@/components/download/FileDownload.vue'
  import xlsURL from '/src/examples/download/111.xls?url'
  import pdfURL from '/src/examples/download/111.pdf?url'
</script>

<style lang="less" scoped></style>
