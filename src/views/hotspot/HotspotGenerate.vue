<template>
  <div class="generate-wrapper">
    <!-- 左栏：配置 -->
    <div class="left-panel">
      <div class="panel-header">
        <h3>内容生成配置</h3>
        <el-button text size="small" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回浏览
        </el-button>
      </div>

      <!-- 已选热点 -->
      <div
        v-if="store.selectedCount > 0"
        class="selected-section"
        v-loading="loadingTitles">
        <strong>已选 {{ store.selectedCount }} 条热点：</strong>
        <div class="hotspot-tags">
          <el-tag
            v-for="h in selectedHotspotTitles"
            :key="h.id"
            size="small"
            type="info">
            {{ h.title }}
          </el-tag>
        </div>
        <span
          v-if="selectedHotspotTitles.length < store.selectedCount"
          class="tag-hint">
          部分标题未加载，可能日期不同
        </span>
      </div>

      <div v-else class="no-selection-hint">
        <el-alert
          title="尚未选择热点"
          type="warning"
          :closable="false"
          show-icon>
          请先前往
          <el-link type="primary" @click="goBack">热点浏览</el-link>
          页面选择热点
        </el-alert>
      </div>

      <!-- 配置表单 -->
      <el-form
        :model="config"
        label-width="80px"
        size="default"
        class="config-form">
        <el-form-item label="目标格式">
          <el-radio-group v-model="config.targetFormat">
            <el-radio value="微头条">微头条</el-radio>
            <el-radio value="文章">文章</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="文风">
          <el-radio-group v-model="config.style">
            <el-radio value="正式">正式</el-radio>
            <el-radio value="活泼">活泼</el-radio>
            <el-radio value="犀利">犀利</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="字数范围">
          <el-slider
            class="mb-18"
            v-model="wordRange"
            range
            :min="30"
            :max="1200"
            :step="10"
            :marks="{ 50: '50', 300: '300', 500: '500', 800: '800' }" />
          <span class="form-hint ml-0"
            >{{ wordRange[0] }} - {{ wordRange[1] }} 字</span
          >
        </el-form-item>

        <el-form-item label="配图">
          <el-select v-model="config.maxImages" style="width: 100px">
            <el-option :value="0" label="0 张" />
            <el-option :value="1" label="1 张" />
            <el-option :value="2" label="2 张" />
            <el-option :value="3" label="3 张" />
          </el-select>
          <span class="form-hint">AI 自动生成新闻配图</span>
        </el-form-item>

        <!-- 生图模型选择（仅当配图数量 > 0 时显示） -->
        <el-form-item v-if="config.maxImages > 0" label="生图模型">
          <el-select v-model="config.imageModel" style="width: 240px">
            <el-option
              v-for="m in imageModels"
              :key="m.name"
              :value="m.name"
              :label="`${m.displayName} (¥${((m.price || 0) / 100).toFixed(
                2
              )}/张)`" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 价格预估 -->
      <div class="cost-preview" v-if="store.selectedCount > 0">
        <span>预估费用：</span>
        <strong>¥{{ estimatedCost.toFixed(2) }}</strong>
        <span class="cost-detail">
          （成文 ¥0.05 + 生图 {{ config.maxImages }}×¥{{
            (imageModelPrice / 100).toFixed(2)
          }}）
        </span>
      </div>

      <!-- 生成按钮 -->
      <el-button
        type="primary"
        size="large"
        :loading="generating"
        :disabled="store.selectedCount === 0"
        @click="handleGenerate"
        class="generate-btn">
        <el-icon><MagicStick /></el-icon>
        {{
          generating
            ? 'AI正在生成中...'
            : store.selectedCount
              ? `开始生成（${store.selectedCount}条）`
              : '请先选择热点'
        }}
      </el-button>
    </div>

    <!-- 右栏：结果 -->
    <div class="right-panel">
      <div v-if="result" class="result-area">
        <div class="result-header">
          <h3>生成结果</h3>
          <div class="result-actions">
            <el-button
              @click="handleRegenerate"
              :loading="generating"
              size="small">
              <el-icon><Refresh /></el-icon>
              重新生成
            </el-button>
            <el-button @click="handleEdit" type="primary" size="small">
              <el-icon><Edit /></el-icon>
              去编辑发布
            </el-button>
          </div>
        </div>
        <div
          class="result-content"
          v-html="formatContent(result.content)"></div>
      </div>

      <!-- 生成中 -->
      <div v-else-if="generating" class="generating-state">
        <el-icon class="is-loading" :size="48"><MagicStick /></el-icon>
        <p>AI 正在创作中，请稍候...</p>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-empty
          description="配置参数后点击「开始生成」即可创作内容"
          :image-size="120" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { MagicStick, Refresh, Edit, ArrowLeft } from '@element-plus/icons-vue'
  import { hotspotApi, aiImageApi } from '@/_api/index'
  import type { Res_AiImageModel } from '@/_api/modules/aiImage'
  import { useHotspotStore } from '@/store/hotspot'
  import { useDraftStore } from '@/store/draft'

  const store = useHotspotStore()
  const router = useRouter()
  const route = useRoute()

  const imageModels = ref<Res_AiImageModel[]>([])

  const config = reactive({
    targetFormat: '微头条',
    style: '正式',
    maxImages: 1,
    imageModel: ''
  })
  const wordRange = ref([50, 300])
  const generating = ref(false)
  const loadingTitles = ref(false)
  const result = ref<{
    content: string
    hotspots: any[]
    generatedImages: string[]
    config: any
  } | null>(null)
  const selectedHotspotTitles = ref<
    { id: number; title: string; localImageUrl?: string | null }[]
  >([])

  const imageModelPrice = computed(() => {
    const found = imageModels.value.find((m) => m.name === config.imageModel)
    return found?.price ?? 2
  })
  const estimatedCost = computed(() =>
    store.selectedCount > 0
      ? (5 + config.maxImages * imageModelPrice.value) / 100
      : 0
  )

  onMounted(async () => {
    // 加载生图模型列表
    try {
      const { data } = await aiImageApi.getModels()
      imageModels.value = (data || []).filter((m) => m.isActive)
      // 默认选择第一个可用模型
      if (imageModels.value.length && !config.imageModel) {
        config.imageModel = imageModels.value[0].name
      }
    } catch (e) {
      console.error('加载生图模型失败', e)
    }
    // 从 URL query 恢复选中的热点 ID（支持刷新后恢复）
    const idsFromQuery = route.query.ids as string | undefined
    if (idsFromQuery) {
      const ids = idsFromQuery.split(',').map(Number).filter(Boolean)
      if (ids.length) store.selectAll(ids)
    }

    if (store.selectedCount === 0) return

    loadingTitles.value = true
    try {
      const today = new Date().toISOString().slice(0, 10)
      const { data } = await hotspotApi.getByDate(today)
      if (data) {
        const selected = data.filter((h: any) =>
          store.selectedIdList.includes(h.id)
        )
        selectedHotspotTitles.value = selected.map((h: any) => ({
          id: h.id,
          title: h.title,
          localImageUrl: h.localImageUrl
        }))
      }
    } catch (e) {
      console.error('加载选中热点标题失败', e)
    } finally {
      loadingTitles.value = false
    }
  })

  function goBack() {
    router.push({ name: 'hotspot-content' })
  }

  async function handleGenerate() {
    if (store.selectedCount === 0) {
      ElMessage.warning('请先在热点浏览页选择热点')
      return
    }
    generating.value = true
    result.value = null
    try {
      const { data } = await hotspotApi.generate({
        hotspotIds: store.selectedIdList,
        targetFormat: config.targetFormat,
        style: config.style,
        minWords: wordRange.value[0],
        maxWords: wordRange.value[1],
        maxImages: config.maxImages,
        imageModel: config.imageModel || undefined
      })
      result.value = data
      ElMessage.success('生成成功')
    } catch (e: any) {
      console.error(e)
      ElMessage.error(e?.message || e?.data?.message || '生成失败，请重试')
    } finally {
      generating.value = false
    }
  }

  async function handleRegenerate() {
    result.value = null
    await handleGenerate()
  }

  async function handleEdit() {
    if (!result.value) return
    const draftStore = useDraftStore()
    const htmlContent = formatContentForDraft(result.value.content)
    const draft = draftStore.save({
      title: `${config.targetFormat} - ${new Date().toLocaleDateString()}`,
      content: htmlContent,
      targetFormat: config.targetFormat,
      hotspotIds: store.selectedIdList
    })
    store.clearSelection()
    router.push({ name: 'hotspot-edit', params: { draftId: draft.id } })
  }

  function formatContent(text: string) {
    const images = result.value?.generatedImages || []
    let imgIndex = 0
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\[配图[：:]?\s*(.*?)\s*\]/g, () =>
        images[imgIndex]
          ? `<figure class="article-figure"><img src="${
              images[imgIndex++]
            }" alt="配图" loading="lazy" style="max-width:100%;border-radius:6px" /><figcaption style="text-align:center;color:#999;font-size:12px">▲ AI 生成配图</figcaption></figure>`
          : '<span class="image-placeholder">🖼️ 此处插入配图</span>'
      )
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
  }

  function formatContentForDraft(text: string): string {
    const images = result.value?.generatedImages || []
    let imgIndex = 0
    let html = text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')

    html = html.replace(/\[配图[：:]?\s*(.*?)\s*\]/g, () => {
      if (imgIndex >= images.length) {
        return '<p style="color:#999;font-style:italic">🖼️ 此处插入配图</p>'
      }
      const src = images[imgIndex++]
      return `<p><img src="${src}" alt="AI配图" style="max-width:100%;border-radius:6px" /></p>`
    })
    return html
  }
</script>

<style lang="less" scoped>
  .generate-wrapper {
    display: flex;
    height: 100%;
    gap: 16px;
    padding: 16px;
  }

  // ======== 左栏 ========
  .left-panel {
    width: 480px;
    min-width: 360px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    padding: 16px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 16px;
      margin: 0;
    }
  }

  .selected-section {
    background: var(--el-fill-color-light);
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 13px;
    strong {
      display: block;
      margin-bottom: 6px;
      color: var(--el-text-color-primary);
    }
    .hotspot-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .tag-hint {
      font-size: 11px;
      color: var(--el-text-color-secondary);
      margin-top: 4px;
      display: block;
    }
  }

  .no-selection-hint {
    margin: 4px 0;
  }

  .config-form {
    flex-shrink: 0;
  }

  .form-hint {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-left: 8px;
  }

  .cost-preview {
    text-align: center;
    font-size: 13px;
    padding: 8px;
    background: var(--el-color-warning-light-9);
    border-radius: 6px;
    color: var(--el-text-color-regular);
    .cost-detail {
      font-size: 11px;
      color: var(--el-text-color-secondary);
      display: block;
      margin-top: 2px;
    }
  }

  .generate-btn {
    width: 100%;
  }

  // ======== 右栏 ========
  .right-panel {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    padding: 20px;
  }

  .result-area {
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--el-border-color-light);
      h3 {
        font-size: 16px;
        margin: 0;
      }
      .result-actions {
        display: flex;
        gap: 8px;
      }
    }
    .result-content {
      line-height: 1.8;
      font-size: 15px;
      color: var(--el-text-color-primary);
      :deep(.image-placeholder) {
        display: inline-block;
        background: var(--el-color-info-light-8);
        border: 1px dashed var(--el-color-info-light-3);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
      :deep(.article-figure) {
        margin: 12px 0;
        text-align: center;
        img {
          max-width: 100%;
          border-radius: 6px;
        }
        figcaption {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-top: 4px;
        }
      }
    }
  }

  .generating-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    color: var(--el-text-color-secondary);
    p {
      font-size: 15px;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
