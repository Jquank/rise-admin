<template>
  <div class="hotspot-admin">
    <div class="toolbar">
      <el-date-picker
        v-model="currentDate"
        type="date"
        placeholder="选择日期"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        @change="loadHotspots" />
      <el-button type="primary" @click="handleRefreshAll" :loading="refreshing">
        <el-icon><Refresh /></el-icon>
        刷新全部
      </el-button>
      <span class="hint">（全部分类 ¥0.50，单分类刷新 ¥0.20）</span>
    </div>

    <el-tabs
      v-model="activeCategory"
      @tab-change="onTabChange"
      v-loading="loading">
      <el-tab-pane
        v-for="cat in categories"
        :key="cat.id"
        :label="`${cat.name}（${getCategoryCount(cat.id)}）`"
        :name="String(cat.id)">
        <template #label>
          <span class="tab-label-wrap">
            {{ cat.name }}（{{ getCategoryCount(cat.id) }}）
            <el-icon
              class="tab-refresh-icon"
              :class="{ spinning: refreshingCat === cat.id }"
              @click.stop="handleRefreshCategory(cat.id, cat.name)">
              <Refresh />
            </el-icon>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-empty
      v-if="!loading && currentHotspots.length === 0"
      description="该分类暂无热点，请先点击刷新" />

    <r-table
      v-else
      :columns="tableColumns"
      :data="currentHotspots"
      :use-pagination="false"
      height-fill-up
      stripe
      size="small" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Refresh } from '@element-plus/icons-vue'
  import { hotspotApi } from '@/_api/index'
  import { RTable } from '@/lib/index'

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

  const tableColumns = [
    {
      prop: 'title',
      label: '标题',
      minWidth: '200',
      'show-overflow-tooltip': true
    },
    { prop: 'source', label: '来源', width: '80' },
    { prop: 'region', label: '地域', width: '60', align: 'center' },
    {
      prop: 'heatIndex',
      label: '热度',
      width: '70',
      align: 'center',
      sortable: 'custom'
    },
    {
      prop: 'summary',
      label: '摘要',
      minWidth: '300',
      'show-overflow-tooltip': true
    },
  ]

  const categories = ref<Category[]>([])
  const hotspots = ref<Hotspot[]>([])
  const currentDate = ref(new Date().toISOString().slice(0, 10))
  const activeCategory = ref('')
  const loading = ref(false)
  const refreshing = ref(false)
  const refreshingCat = ref(0) // 正在刷新的分类id

  /** 日期限制：只能选最近3天 */
  function disabledDate(date: Date) {
    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 3600 * 1000)
    return date < new Date(threeDaysAgo.toDateString()) || date > now
  }

  const currentHotspots = computed(() => {
    if (!activeCategory.value) return []
    return hotspots.value.filter(
      (h) => String(h.categoryId) === activeCategory.value
    )
  })

  const onTabChange = (name: string | number) => {
    activeCategory.value = String(name)
  }

  function getCategoryCount(catId: number) {
    return hotspots.value.filter((h) => h.categoryId === catId).length
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
      const date = currentDate.value
      ElMessage.info('正在通过AI聚合今日热点，请稍候...')
      const { data } = await hotspotApi.refreshAi(date)
      ElMessage.success(`刷新成功！共入库 ${data.count} 条热点，消耗 ¥0.50`)
      await loadHotspots()
    } catch (e: any) {
      console.error(e)
      ElMessage.error(e?.message || e?.data?.message || 'AI聚合失败，请重试')
    } finally {
      refreshing.value = false
    }
  }

  /** 单个分类刷新 */
  async function handleRefreshCategory(catId: number, catName: string) {
    refreshingCat.value = catId
    try {
      ElMessage.info(`正在刷新「${catName}」分类...`)
      const { data } = await hotspotApi.refreshCategoryAi(currentDate.value, catId)
      ElMessage.success(`「${catName}」刷新完成！消耗 ¥0.20`)
      await loadHotspots()
    } catch (e: any) {
      ElMessage.error(e?.message || e?.data?.message || '刷新失败')
    } finally {
      refreshingCat.value = 0
    }
  }

  /** 每日6:30自动刷新 */
  let autoRefreshTimer: ReturnType<typeof setInterval> | null = null
  function scheduleAutoRefresh() {
    const now = new Date()
    const target = new Date(now)
    target.setHours(6, 30, 0, 0)
    if (now > target) target.setDate(target.getDate() + 1)
    const delay = target.getTime() - now.getTime()
    autoRefreshTimer = setTimeout(() => {
      currentDate.value = new Date().toISOString().slice(0, 10)
      handleRefreshAll()
      scheduleAutoRefresh()
    }, delay)
  }

  onMounted(async () => {
    await loadCategories()
    await loadHotspots()
    scheduleAutoRefresh()
  })
</script>

<style lang="less" scoped>
  .hotspot-admin {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 16px 0;
    .toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
      flex-shrink: 0;
      .hint {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
    :deep(.el-tabs) {
      flex-shrink: 0;
    }
    :deep(.el-tabs__header) {
      margin-bottom: 8px;
    }
    :deep(.r-table-box) {
      flex: 1;
      height: 0;
    }
    .tab-label-wrap {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      .tab-refresh-icon {
        font-size: 14px;
        color: var(--el-color-primary);
        cursor: pointer;
        opacity: 0.6;
        &:hover {
          opacity: 1;
        }
        &.spinning {
          animation: spin 1s linear infinite;
        }
      }
    }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
