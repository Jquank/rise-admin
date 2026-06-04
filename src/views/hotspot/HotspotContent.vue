<template>
  <div class="hotspot-content">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <el-date-picker
        v-model="currentDate"
        type="date"
        placeholder="选择日期"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        @change="loadHotspots" />
      <el-button type="primary" @click="handleRefreshAll" :loading="refreshing">
        <SvgIcon icon="shuaxin" />
        刷新全部
      </el-button>
      <span class="hint">全部分类 ¥0.40，单分类刷新 ¥0.10</span>
      <el-button @click="handleOpenDrafts">
        <SvgIcon icon="edit" />
        草稿箱
      </el-button>
    </div>

    <!-- 分类Tab -->
    <el-tabs
      v-model="activeCategory"
      @tab-change="onTabChange"
      v-loading="loading">
      <el-tab-pane
        v-for="cat in categories"
        :key="cat.id"
        :name="String(cat.id)">
        <template #label>
          <span class="tab-label-wrap">
            {{ cat.name }}（{{ getCategoryCount(cat.id) }}）
            <SvgIcon
              class="tab-refresh-icon"
              :class="{ spinning: refreshingCat === cat.id }"
              icon="shuaxin"
              @click.stop="handleRefreshCategory(cat.id, cat.name)" />
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 空状态 -->
    <el-empty
      v-if="!loading && currentHotspots.length === 0"
      description="该分类暂无热点，请先点击刷新" />

    <!-- 热点表格 -->
    <div v-else class="table-wrapper">
      <el-table
        :data="currentHotspots"
        stripe
        height="calc(100vh - 310px)"
        @selection-change="onSelectionChange"
        ref="tableRef">
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="title"
          label="标题"
          min-width="200"
          show-overflow-tooltip />
        <el-table-column prop="source" label="来源" width="80" />
        <el-table-column prop="region" label="地域" width="80" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.region === '国外' ? 'warning' : ''"
              size="small"
              effect="plain">
              {{ row.region || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="heatIndex"
          label="热度"
          width="80"
          align="center"
          sortable>
          <template #default="{ row }">🔥 {{ row.heatIndex }}</template>
        </el-table-column>
        <el-table-column
          prop="summary"
          label="摘要"
          min-width="300"
          show-overflow-tooltip />
      </el-table>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar" v-if="hotspots.length">
      <span class="selected-info">
        已选 <strong>{{ store.selectedCount }}</strong> 条热点
      </span>
      <el-button
        type="primary"
        size="large"
        :disabled="store.selectedCount === 0"
        @click="handleGenerate">
        生成内容（已选 {{ store.selectedCount }} 条）
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { ElMessage, ElTable } from 'element-plus'
  import { hotspotApi } from '@/_api/index'
  import { useHotspotStore } from '@/store/hotspot'
  import { useRouter } from 'vue-router'

  interface Category {
    id: number
    name: string
    sortOrder: number
  }

  interface Hotspot {
    id: number
    title: string
    summary: string | null
    source: string | null
    region: string | null
    heatIndex: number
    localImageUrl: string | null
    publishDate: string
    createdAt: string
    categoryId: number
    category: { id: number; name: string }
  }

  const store = useHotspotStore()
  const router = useRouter()

  const categories = ref<Category[]>([])
  const hotspots = ref<Hotspot[]>([])
  const currentDate = ref(new Date().toISOString().slice(0, 10))
  const activeCategory = ref('')
  const loading = ref(false)
  const refreshing = ref(false)
  const refreshingCat = ref(0)
  const tableRef = ref<InstanceType<typeof ElTable>>()

  const currentHotspots = computed(() => {
    if (!activeCategory.value) return []
    return hotspots.value.filter(
      (h) => String(h.categoryId) === activeCategory.value
    )
  })

  function onTabChange(val: string | number) {
    activeCategory.value = String(val)
  }

  /** 勾选同步 → store */
  function onSelectionChange(rows: Hotspot[]) {
    // 当前分类已勾选的 ID
    const pickingIds = new Set(rows.map((r) => r.id))
    // 分离出"新增"和"移除"
    const currentCatIds = new Set(currentHotspots.value.map((h) => h.id))
    // 当前分类中：之前在 store 但不在 rows → deselectAll
    const toRemove: number[] = []
    currentCatIds.forEach((id) => {
      if (!pickingIds.has(id) && store.isSelected(id)) {
        toRemove.push(id)
      }
    })
    if (toRemove.length) store.deselectAll(toRemove)
    // rows 中新增的
    rows.forEach((r) => {
      if (!store.isSelected(r.id)) store.addSelection(r.id)
    })
  }

  /** 恢复勾选状态：切换分类后同步 store → table */
  function syncTableSelection() {
    if (!tableRef.value) return
    const selectedIds = new Set(store.selectedIdList)
    const rows = currentHotspots.value.filter((h) => selectedIds.has(h.id))
    tableRef.value.clearSelection()
    rows.forEach((row) => tableRef.value!.toggleRowSelection(row, true))
  }

  watch(activeCategory, () => {
    setTimeout(syncTableSelection, 0)
  })
  watch(
    () => hotspots.value,
    () => {
      setTimeout(syncTableSelection, 0)
    }
  )

  function getCategoryCount(catId: number) {
    return hotspots.value.filter((h) => h.categoryId === catId).length
  }

  function disabledDate(date: Date) {
    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 3600 * 1000)
    return date < new Date(threeDaysAgo.toDateString()) || date > now
  }

  async function loadCategories() {
    try {
      const { data } = await hotspotApi.getCategories()
      categories.value = data || []
      if (categories.value.length && !activeCategory.value) {
        activeCategory.value = String(categories.value[0].id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function loadHotspots() {
    loading.value = true
    try {
      const { data } = await hotspotApi.getByDate(currentDate.value)
      hotspots.value = data || []
    } catch (e) {
      console.error(e)
      ElMessage.error('加载热点失败')
    } finally {
      loading.value = false
    }
  }

  async function handleRefreshAll() {
    refreshing.value = true
    try {
      ElMessage.info('正在通过AI聚合今日热点，请稍候...')
      const { data } = await hotspotApi.refreshAi(currentDate.value)
      ElMessage.success(`刷新成功！共入库 ${data.count} 条热点，消耗 ¥0.40`)
      await loadHotspots()
    } catch (e) {
      const err = e as { message?: string; data?: { message?: string } }
      ElMessage.error(
        err?.message || err?.data?.message || 'AI聚合失败，请重试'
      )
    } finally {
      refreshing.value = false
    }
  }

  async function handleRefreshCategory(catId: number, catName: string) {
    refreshingCat.value = catId
    try {
      ElMessage.info(`正在刷新「${catName}」分类...`)
      await hotspotApi.refreshCategoryAi(currentDate.value, catId)
      ElMessage.success(`「${catName}」刷新完成！消耗 ¥0.10`)
      await loadHotspots()
    } catch (e) {
      const err = e as { message?: string; data?: { message?: string } }
      ElMessage.error(err?.message || err?.data?.message || '刷新失败')
    } finally {
      refreshingCat.value = 0
    }
  }

  function handleGenerate() {
    if (store.selectedCount === 0) return
    const ids = store.selectedIdList.join(',')
    router.push({ name: 'hotspot-generate', query: { ids } })
  }

  function handleOpenDrafts() {
    router.push({ name: 'hotspot-edit' })
  }

  onMounted(async () => {
    await Promise.all([loadCategories(), loadHotspots()])
  })
</script>

<style lang="less" scoped>
  .hotspot-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 16px 0;
  }
  .top-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    .hint {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }
  .tab-label-wrap {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    .tab-refresh-icon {
      cursor: pointer;
      font-size: 14px;
      color: var(--el-color-primary);
      &:hover {
        color: var(--el-color-primary-light-3);
      }
    }
    .spinning {
      animation: rotate 1s linear infinite;
      color: var(--el-text-color-placeholder);
    }
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .table-wrapper {
    flex: 1;
    overflow: hidden;
    :deep(.el-table) {
      font-size: 13px;
    }
  }
  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-top: 1px solid var(--el-border-color-lighter);
    .selected-info {
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
  }
</style>
