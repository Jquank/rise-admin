<template>
  <div>
    <Editor
      api-key="zw08p5owxw4pzuxjkiexwsyzryclbc6uyfxih22ta138egu3"
      :init="init"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
  import Editor from '@tinymce/tinymce-vue'
  const langsMap = {
    zh: 'zh_CN',
    en: 'en'
  }
  const language = (localStorage.getItem('locale') ||
    'zh') as keyof typeof langsMap
  const init = {
    selector: '#mytextarea',
    plugins: 'lists link image table code help wordcount',
    toolbar:
      'undo redo restoredraft | cut copy paste pastetext | \
      forecolor backcolor bold italic underline strikethrough link anchor | \
      alignleft aligncenter alignright alignjustify outdent indent | \
      styleselect formatselect fontselect fontsizeselect | bullist numlist | \
      blockquote subscript superscript removeformat | \
      table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | \
      bdmap indent2em lineheight formatpainter axupimgs',
    language: langsMap[language] || langsMap.zh
  }
</script>

<style lang="less">
  .tox-editor-container {
    .tox-promotion,
    .tox-statusbar__branding {
      display: none;
    }
  }
</style>
