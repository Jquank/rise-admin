<template>
  <div class="edit-page">
    <!-- 顶部工具栏 -->
    <div class="edit-toolbar">
      <el-button @click="handleBack" :icon="ArrowLeft"> 返回生成 </el-button>
      <span class="edit-title" v-if="currentDraft">
        {{ currentDraft.title }}
      </span>
      <div class="toolbar-actions">
        <el-button
          @click="handleSave"
          type="primary"
          size="default"
          :loading="saving">
          保存草稿
        </el-button>
        <el-button @click="handleCopy" type="success" size="default">
          <el-icon><CopyDocument /></el-icon>
          一键复制全文
        </el-button>
      </div>
    </div>

    <div class="edit-body">
      <!-- 编辑器 -->
      <div class="editor-section">
        <div class="editor-header">
          <el-input
            v-model="editTitle"
            placeholder="输入标题"
            size="large"
            class="title-input" />
        </div>
        <EditorTinymce v-model="editContent" class="tinymce-container" />
      </div>

      <!-- 右侧草稿列表 -->
      <div class="drafts-panel">
        <h4>我的草稿</h4>
        <div class="draft-list">
          <div
            v-for="draft in draftStore.drafts"
            :key="draft.id"
            class="draft-item"
            :class="{ active: currentDraft?.id === draft.id }"
            @click="loadDraft(draft.id)">
            <div class="draft-item-title">{{ draft.title || '无标题' }}</div>
            <div class="draft-item-meta">
              <span>{{ draft.targetFormat }}</span>
              <span>{{ formatDate(draft.updatedAt) }}</span>
            </div>
            <el-button
              class="draft-delete"
              size="small"
              text
              type="danger"
              @click.stop="handleDeleteDraft(draft.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-empty
            v-if="draftStore.drafts.length === 0"
            description="暂无草稿"
            :image-size="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { ArrowLeft, CopyDocument, Delete } from '@element-plus/icons-vue'
  import { useDraftStore, type Draft } from '@/store/draft'
  import EditorTinymce from '@/components/EditorTinymce.vue'

  const router = useRouter()
  const route = useRoute()
  const draftStore = useDraftStore()

  const currentDraft = ref<Draft | null>(null)
  const editTitle = ref('')
  const editContent = ref('')
  const saving = ref(false)
  const hasUnsaved = ref(false)

  // 加载草稿
  function loadDraft(draftId: string) {
    const draft = draftStore.getById(draftId)
    if (!draft) {
      ElMessage.error('草稿不存在')
      router.replace({ name: 'hotspot' })
      return
    }
    currentDraft.value = draft
    editTitle.value = draft.title
    // 兼容旧草稿：如果有 [配图] 占位符，替换为提示文字（图片数据在生成时已注入）
    editContent.value = draft.content.replace(
      /\[配图[：:]?\s*.*?\s*\]/g,
      '<p style="color:#999;font-style:italic">🖼️ （图片占位 — 请重新生成获取配图）</p>'
    )
    hasUnsaved.value = false
  }

  // 保存草稿
  async function handleSave() {
    if (!currentDraft.value) return
    saving.value = true
    // 模拟片刻，实际是 localStorage 同步操作
    await new Promise((r) => setTimeout(r, 200))
    draftStore.update(currentDraft.value.id, {
      title: editTitle.value,
      content: editContent.value
    })
    currentDraft.value = draftStore.getById(currentDraft.value.id)!
    hasUnsaved.value = false
    saving.value = false
    ElMessage.success('草稿已保存')
  }

  // 一键复制（HTML富文本 + base64图片）
  async function handleCopy() {
    if (!editContent.value.trim()) {
      ElMessage.warning('内容为空，无法复制')
      return
    }

    const loadingMsg = ElMessage({
      message: '正在处理图片...',
      type: 'info',
      duration: 0
    })

    try {
      // 解析 HTML，找到所有图片
      const parser = new DOMParser()
      const doc = parser.parseFromString(editContent.value, 'text/html')
      const imgs = doc.querySelectorAll('img')

      // 将本地图片和代理图片转为 base64
      const promises = Array.from(imgs).map(async (img) => {
        const src = img.getAttribute('src')
        if (!src) return

        // 只处理本地图片和代理图片
        if (src.startsWith('/uploads/')) {
          try {
            const response = await fetch(src)
            if (!response.ok) return
            const blob = await response.blob()
            const reader = new FileReader()
            const base64 = await new Promise<string>((resolve) => {
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
            img.setAttribute('src', base64)
          } catch {
            // 图片不可用，设置提示
            img.alt = '[图片加载失败]'
          }
        }
      })

      await Promise.all(promises)

      // 复制 HTML 富文本到剪贴板
      const html = doc.body.innerHTML
      const blob = new Blob([html], { type: 'text/html' })
      const plainText = doc.body.textContent?.trim() || ''

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([plainText], { type: 'text/plain' })
        })
      ])

      loadingMsg.close()
      ElMessage.success('已复制到剪贴板（含图片），可前往今日头条粘贴发布')
    } catch {
      loadingMsg.close()
      // fallback: 纯文本
      try {
        const plainText = editContent.value
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/\[配图[：:]?\s*.*?\s*\]/g, '[图片]')
          .trim()
        await navigator.clipboard.writeText(plainText)
        ElMessage.warning('图片转换失败，已复制纯文本（可手动上传配图）')
      } catch {
        ElMessage.error('复制失败，请重试')
      }
    }
  }

  // 删除草稿
  async function handleDeleteDraft(draftId: string) {
    try {
      await ElMessageBox.confirm('确定删除该草稿？', '确认', {
        type: 'warning'
      })
    } catch {
      return
    }
    draftStore.remove(draftId)
    if (currentDraft.value?.id === draftId) {
      const next = draftStore.drafts[0]
      if (next) {
        loadDraft(next.id)
      } else {
        router.replace({ name: 'hotspot' })
      }
    }
    ElMessage.success('草稿已删除')
  }

  function handleBack() {
    if (hasUnsaved.value) {
      ElMessage.warning('有未保存的修改')
    }
    router.push({ name: 'hotspot-content' })
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 监听内容变化
  watch([editTitle, editContent], () => {
    hasUnsaved.value = true
  })

  // 离开前确认
  onBeforeRouteLeave((_to, _from, next) => {
    if (hasUnsaved.value) {
      ElMessageBox.confirm('有未保存的修改，确定离开？', '提示', {
        confirmButtonText: '离开',
        cancelButtonText: '留下',
        type: 'warning'
      })
        .then(() => next())
        .catch(() => next(false))
    } else {
      next()
    }
  })

  onMounted(() => {
    const draftId = route.params.draftId as string
    if (draftId) {
      loadDraft(draftId)
    }
    // 无 draftId 时停留在本页，用户可以看到右侧草稿列表
  })
</script>

<style lang="less" scoped>
  .edit-page {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .edit-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    flex-shrink: 0;
    .edit-title {
      flex: 1;
      font-size: 15px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .toolbar-actions {
      display: flex;
      gap: 8px;
    }
  }
  .edit-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  .editor-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .editor-header {
      padding: 12px 16px;
      .title-input {
        font-size: 18px;
        :deep(.el-input__wrapper) {
          box-shadow: none;
          padding: 0;
        }
        :deep(input) {
          font-weight: 600;
        }
      }
    }
    .tinymce-container {
      flex: 1;
      overflow: hidden;
    }
  }
  .drafts-panel {
    width: 240px;
    border-left: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    h4 {
      padding: 16px;
      margin: 0;
      font-size: 14px;
      border-bottom: 1px solid var(--el-border-color-light);
    }
    .draft-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    .draft-item {
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      margin-bottom: 4px;
      transition: background 0.15s;
      &:hover {
        background: var(--el-fill-color-light);
      }
      &.active {
        background: var(--el-color-primary-light-9);
        border: 1px solid var(--el-color-primary-light-5);
      }
      .draft-item-title {
        font-size: 13px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 24px;
      }
      .draft-item-meta {
        font-size: 11px;
        color: var(--el-text-color-secondary);
        margin-top: 4px;
        display: flex;
        gap: 8px;
      }
      .draft-delete {
        position: absolute;
        top: 6px;
        right: 4px;
        opacity: 0;
        transition: opacity 0.15s;
      }
      &:hover .draft-delete {
        opacity: 1;
      }
    }
  }
</style>
