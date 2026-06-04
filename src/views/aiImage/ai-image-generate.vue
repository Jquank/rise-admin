<template>
  <div class="ai-image-page">
    <div class="box">
      <div class="left">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>🎨 AI 生图</span>
              <div class="header-btns">
                <span v-if="priceYuan > 0" class="cost-estimate">
                  ¥{{ estimatedCost(formData.n) }}
                  <span
                    v-if="balance !== null"
                    :class="
                      balance < +estimatedCost(formData.n)
                        ? 'balance-low'
                        : 'balance-ok'
                    ">
                    / 余额 ¥{{ balance.toFixed(2) }}
                  </span>
                </span>
                <el-button size="small" @click="saveAsTemplate"
                  >存为模板</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="handleGenerate"
                  :loading="generating"
                  >开始生成</el-button
                >
              </div>
            </div>
          </template>

          <RForm
            ref="formRef"
            v-model="formData"
            :config="formConfig"
            :show-action-btn="false"
            label-width="100px" />

          <!-- 参考图片上传（仅 GPT-Image-2 模型支持） -->
          <div v-if="supports.refImages" class="ref-images-section">
            <div class="section-label">📷 参考图片（图片编辑）</div>
            <el-upload
              v-model:file-list="refImageList"
              list-type="picture-card"
              :limit="4"
              :http-request="handleUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemoveRef"
              accept=".png,.jpg,.jpeg,.webp,.gif">
              <SvgIcon icon="add" />
            </el-upload>
            <div class="upload-tip">
              支持 PNG/JPG/WEBP/GIF，每张不超过 10MB，最多 4 张
            </div>
          </div>
        </el-card>
      </div>

      <div class="right">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>🖼️ 生成历史 <span class="retention-hint">（图片保留3天，请尽快下载）</span></span>
              <div class="header-btns">
                <el-button
                  size="small"
                  type="danger"
                  plain
                  @click="handleDeleteAll"
                  >删除全部</el-button
                >
                <el-button
                  size="small"
                  @click="loadRecords"
                  :loading="loadingRecords"
                  >刷新</el-button
                >
              </div>
            </div>
          </template>

          <div
            v-if="records.length === 0 && !loadingRecords"
            class="empty-hint">
            <el-empty description="暂无生成记录，快去左侧生成一张吧！" />
          </div>

          <div v-else class="image-grid">
            <div v-for="record in records" :key="record.id" class="image-card">
              <el-image
                :src="record.imageUrl"
                fit="cover"
                class="grid-image"
                lazy
                :preview-src-list="allPreviewUrls"
                :initial-index="records.indexOf(record)"
                preview-teleported />
              <div class="image-info">
                <span class="info-model">{{ record.model.displayName }}</span>
                <span class="info-size">{{ record.size }}</span>
                <span class="info-time">{{
                  formatTime(record.createdAt)
                }}</span>
              </div>
              <div class="image-actions">
                <el-button
                  class="action-btn"
                  size="small"
                  circle
                  @click.stop="handleDownload(record)">
                  <SvgIcon icon="bottom" />
                </el-button>
                <el-button
                  class="action-btn"
                  type="danger"
                  size="small"
                  circle
                  @click.stop="handleDeleteRecord(record)">
                  <SvgIcon icon="delete" />
                </el-button>
              </div>
            </div>
          </div>

          <div v-if="recordTotal > pageSize" class="pagination-wrap">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="recordTotal"
              layout="prev, pager, next"
              @current-change="loadRecords" />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 提示词弹窗 -->
    <el-dialog
      v-model="promptDialogVisible"
      :title="editingPrompt ? '编辑创意模板' : '新增创意模板'"
      width="600px"
      destroy-on-close>
      <RForm
        ref="promptFormRef"
        v-model="promptForm"
        :config="promptFormConfig"
        :show-action-btn="false"
        label-width="100px" />
      <template #footer>
        <el-button @click="promptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePrompt">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, toRef, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { UploadProps, UploadUserFile } from 'element-plus'
  import { aiImageApi, walletApi } from '@/_api'
  import type {
    Res_AiImageModel,
    Res_AiImagePrompt,
    Res_AiImageRecord,
    Body_CreatePrompt,
    Body_GenerateImage
  } from '@/_api/modules/aiImage'
  import dayjs from 'dayjs'
  import { RForm, type FormConfigItemType } from '@/lib/components/form'
  import { useAiApiParams } from './hooks/useAiApiParams'
  import { useFormConfig } from './hooks/useFormConfig'

  const models = ref<Res_AiImageModel[]>([])
  const prompts = ref<Res_AiImagePrompt[]>([])
  const records = ref<Res_AiImageRecord[]>([])
  const recordTotal = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(12)
  const generating = ref(false)
  const loadingRecords = ref(false)
  const formRef = ref()
  const promptFormRef = ref()

  const formData = reactive({
    modelId: null as number | null,
    promptId: undefined as number | undefined,
    prompt: '',
    size: '1024x1024',
    imageSizeVal: '1K',
    customSize: '',
    n: 1,
    watermark: false
  })

  // ===== 模型参数 =====
  const aiParams = useAiApiParams(models, toRef(formData, 'modelId'))
  const { supports, priceYuan, modelLabel, sizeOptions, estimatedCost } =
    aiParams

  // ===== 表单配置 =====
  const { formConfig } = useFormConfig({
    models,
    prompts,
    supports,
    modelLabel,
    sizeOptions,
    onModelChange,
    onPromptChange
  })

  // ===== 计费信息 =====
  const balance = ref<number | null>(null)

  async function fetchBalance() {
    try {
      const { data } = await walletApi.getMyWallet()
      balance.value = data.balance / 100
    } catch {
      /* */
    }
  }

  // ===== 参考图片 =====
  const refImageList = ref<UploadUserFile[]>([])

  /** 自定义上传处理 */
  const handleUpload: UploadProps['httpRequest'] = async (options) => {
    try {
      const res = await aiImageApi.uploadImage(options.file as File)
      const url = res.data.url
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileUid = (options.file as any).uid as string
      const idx = refImageList.value.findIndex((f) => f.uid === fileUid)
      if (idx !== -1) {
        refImageList.value[idx].url = url
      }
      ElMessage.success('参考图上传成功')
    } catch {
      ElMessage.error('参考图上传失败')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileUid = (options.file as any).uid as string
      const idx = refImageList.value.findIndex((f) => f.uid === fileUid)
      if (idx !== -1) refImageList.value.splice(idx, 1)
    }
  }

  /** 预览 */
  const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    const url = uploadFile.url
    if (url) window.open(url, '_blank')
  }

  /** 移除参考图 */
  const handleRemoveRef: UploadProps['onRemove'] = () => {
    // handleGenerate 中从 refImageList 实时读取
  }

  // 全部图片预览列表
  const allPreviewUrls = computed(() => records.value.map((r) => r.imageUrl))

  // ===== 提示词弹窗 =====
  const promptDialogVisible = ref(false)
  const editingPrompt = ref<Res_AiImagePrompt | null>(null)
  const promptForm = reactive<Body_CreatePrompt>({ name: '', content: '' })

  const promptFormConfig: FormConfigItemType[] = [
    {
      prop: 'name',
      label: '模板名称',
      type: 'input',
      required: true,
      colNumber: 1,
      compConfig: { placeholder: '给提示词起个名字' }
    },
    {
      prop: 'content',
      label: '提示词内容',
      type: 'input',
      required: true,
      colNumber: 1,
      compConfig: { type: 'textarea', rows: 8, placeholder: '输入画面描述...' }
    }
  ]

  function saveAsTemplate() {
    const selectedPrompt = formData.promptId
      ? prompts.value.find((p) => p.id === formData.promptId)
      : null
    openPromptDialog(
      undefined,
      formData.prompt || undefined,
      selectedPrompt?.name
    )
  }

  function openPromptDialog(
    prompt?: Res_AiImagePrompt,
    prefillContent?: string,
    prefillName?: string
  ) {
    editingPrompt.value = prompt || null
    if (prompt) {
      promptForm.name = prompt.name
      promptForm.content = prompt.content
    } else {
      promptForm.name = prefillName || ''
      promptForm.content = prefillContent || formData.prompt || ''
    }
    promptDialogVisible.value = true
  }

  async function handleSavePrompt() {
    if (!promptForm.name || !promptForm.content) {
      ElMessage.warning('请填写必填项')
      return
    }
    try {
      const payload: Body_CreatePrompt = {
        ...promptForm,
        size: formData.size,
        modelId: formData.modelId ?? undefined
      }
      if (editingPrompt.value) {
        await aiImageApi.updatePrompt(editingPrompt.value.id, payload)
        ElMessage.success('提示词已更新')
      } else {
        await aiImageApi.createPrompt(payload)
        ElMessage.success('提示词已创建')
      }
      promptDialogVisible.value = false
      await loadPrompts()
    } catch {
      ElMessage.error('保存失败')
    }
  }

  // ===== 生成 =====
  async function handleGenerate() {
    if (!formData.modelId) {
      ElMessage.warning('请选择模型')
      return
    }
    if (!formData.prompt) {
      ElMessage.warning('请输入创意')
      return
    }
    generating.value = true
    try {
      const refUrls = refImageList.value.filter((f) => f.url).map((f) => f.url!)
      const payload: Body_GenerateImage = {
        modelId: formData.modelId!,
        prompt: formData.prompt,
        size: formData.customSize || formData.size,
        n: formData.n,
        watermark: formData.watermark,
        images: refUrls.length > 0 ? refUrls : undefined,
        imageSize: formData.imageSizeVal
      }
      if (formData.promptId) payload.promptId = formData.promptId
      const res = await aiImageApi.generate(payload)
      const count = res.data.length
      const cost = estimatedCost(count)
      ElMessage.success(`成功生成 ${count} 张图片，消耗 ¥${cost}`)
      await loadRecords()
      fetchBalance()
    } catch (err) {
      ElMessage.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || '生成失败'
      )
    } finally {
      generating.value = false
    }
  }

  // ===== 记录 =====
  async function loadRecords() {
    loadingRecords.value = true
    try {
      const res = await aiImageApi.getRecords({
        page: currentPage.value,
        pageSize: pageSize.value
      })
      records.value = res.data.records
      recordTotal.value = res.data.total
    } catch {
      ElMessage.error('加载记录失败')
    } finally {
      loadingRecords.value = false
    }
  }

  async function handleDeleteRecord(record: Res_AiImageRecord) {
    try {
      await ElMessageBox.confirm('确定删除这张图片吗？', '确认删除', {
        type: 'warning'
      })
      await aiImageApi.deleteRecord(record.id)
      ElMessage.success('已删除')
      if (records.value.length === 1 && currentPage.value > 1)
        currentPage.value--
      await loadRecords()
    } catch {
      /* 取消 */
    }
  }

  async function handleDeleteAll() {
    try {
      await ElMessageBox.confirm(
        '确定要删除全部生成记录吗？此操作不可恢复！',
        '确认全部删除',
        { type: 'warning', confirmButtonClass: 'el-button--danger' }
      )
      const res = await aiImageApi.deleteAllRecords()
      ElMessage.success(`已删除 ${res.data.deleted} 条记录`)
      currentPage.value = 1
      await loadRecords()
    } catch {
      /* 取消 */
    }
  }

  function handleDownload(record: Res_AiImageRecord) {
    const a = document.createElement('a')
    a.href = record.imageUrl
    a.download = `ai-img-${dayjs(record.createdAt).format(
      'YYYYMMDD-HHmmss'
    )}.png`
    a.click()
  }

  // ===== 联动 =====
  function onModelChange() {
    formData.promptId = undefined
    formData.customSize = ''
    refImageList.value = []
    // Nano Banana 切换到 auto；Nano Banana 2 默认 1K
    if (supports.value.nanoSize) {
      formData.size = 'auto'
      formData.imageSizeVal = '1K'
    } else if (aiParams.currentModel.value?.defaultSize) {
      formData.size = aiParams.currentModel.value.defaultSize
    }
    // GRSAI 只支持单张
    if (!supports.value.multipleCount) {
      formData.n = 1
    }
  }

  function onPromptChange() {
    const prompt = prompts.value.find((p) => p.id === formData.promptId)
    if (prompt) {
      formData.prompt = prompt.content
      if (prompt.size) formData.size = prompt.size
      if (prompt.modelId) formData.modelId = prompt.modelId
    }
  }

  function formatTime(dateStr: string) {
    return dayjs(dateStr).format('MM-DD HH:mm')
  }

  // ===== 初始化 =====
  async function loadModels() {
    try {
      const res = await aiImageApi.getModels()
      models.value = res.data
    } catch {
      ElMessage.error('加载模型失败')
    }
  }
  async function loadPrompts() {
    try {
      const res = await aiImageApi.getPrompts()
      prompts.value = res.data
    } catch {
      ElMessage.error('加载提示词失败')
    }
  }

  onMounted(async () => {
    await Promise.all([
      loadModels(),
      loadPrompts(),
      loadRecords(),
      fetchBalance()
    ])
    if (!formData.modelId && models.value.length > 0) {
      formData.modelId = models.value[0].id
      if (models.value[0].defaultSize)
        formData.size = models.value[0].defaultSize
    }
  })
</script>

<style lang="less" scoped>
  .ai-image-page {
    height: 100%;
  }
  .header-btns {
    display: flex;
    gap: 8px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  .retention-hint {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    white-space: nowrap;
  }
  .cost-estimate {
    font-size: 13px;
    color: var(--el-color-warning);
    font-weight: 600;
    .balance-low {
      color: var(--el-color-danger);
    }
    .balance-ok {
      color: var(--el-text-color-secondary);
      font-weight: 400;
    }
  }
  .ref-images-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-light);
    .section-label {
      font-size: 14px;
      color: var(--el-text-color-regular);
      margin-bottom: 8px;
      font-weight: 500;
    }
    .upload-tip {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 4px;
    }
  }
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
  .image-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid var(--el-border-color-light);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      .image-actions {
        opacity: 1;
      }
    }
    .grid-image {
      width: 100%;
      aspect-ratio: 16/9;
      display: block;
    }
    .image-info {
      padding: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      span {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        background: var(--el-fill-color-light);
        padding: 1px 6px;
        border-radius: 4px;
      }
      .info-model {
        font-weight: 500;
        color: var(--el-color-primary);
      }
    }
    .image-actions {
      position: absolute;
      top: 6px;
      right: 6px;
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s;
      .action-btn {
        width: 24px;
        height: 24px;
      }
    }
  }
  .empty-hint {
    padding: 40px 0;
  }
  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
  .box {
    display: flex;
    gap: 20px;
    height: 100%;
    .left {
      flex: 3;
      min-width: 0;
      :deep(.el-card) {
        max-height: 100%;
      }
    }
    .right {
      flex: 4;
      min-width: 0;
      :deep(.el-card) {
        height: 100%;
      }
    }
  }
</style>
