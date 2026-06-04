<template>
  <div class="hotspot-browse">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <el-date-picker
        v-model="currentDate"
        type="date"
        placeholder="选择日期"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        @change="loadHotspots" />
      <span class="date-hint" v-if="hotspots.length">
        共 {{ hotspots.length }} 条热点，已选
        <strong>{{ store.selectedCount }}</strong> 条
      </span>
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
          <span class="tab-label">
            {{ cat.name }}
            <span class="tab-count">{{ categoryCounts[cat.id] || 0 }}</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 空状态 -->
    <el-empty
      v-if="!loading && currentHotspots.length === 0"
      description="今日热点正在赶来..." />

    <!-- 热点列表 -->
    <div v-else class="hotspot-list">
      <div
        v-for="item in currentHotspots"
        :key="item.id"
        class="hotspot-card"
        :class="{ selected: store.isSelected(item.id) }"
        @click="store.toggleSelect(item.id)">
        <el-checkbox
          :model-value="store.isSelected(item.id)"
          @click.stop
          @change="store.toggleSelect(item.id)" />
        <div class="card-body">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-meta">
            <span
              v-if="item.region"
              class="region-tag"
              :class="
                item.region === '国外' ? 'region-foreign' : 'region-domestic'
              "
              >{{ item.region }}</span
            >
            <span v-if="item.source" class="source">{{ item.source }}</span>
            <span class="heat">🔥 {{ item.heatIndex }}</span>
          </div>
          <div class="card-summary" v-if="item.summary">{{ item.summary }}</div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar" v-if="hotspots.length">
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
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
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
    categoryId: number
    category: { id: number; name: string }
    publishDate: string
    createdAt: string
  }

  const store = useHotspotStore()
  const router = useRouter()

  const categories = ref<Category[]>([])
  const hotspots = ref<Hotspot[]>([])
  const currentDate = ref(new Date().toISOString().slice(0, 10))
  const activeCategory = ref('')
  const loading = ref(false)

  const categoryCounts = computed(() => {
    const map: Record<number, number> = {}
    hotspots.value.forEach((h) => {
      map[h.categoryId] = (map[h.categoryId] || 0) + 1
    })
    return map
  })

  const currentHotspots = computed(() => {
    if (!activeCategory.value) return []
    return hotspots.value.filter(
      (h) => String(h.categoryId) === activeCategory.value
    )
  })

  function onTabChange(val: string | number) {
    activeCategory.value = String(val)
  }

  async function loadCategories() {
    try {
      const { data } = await hotspotApi.getCategories()
      categories.value = data || []
      if (categories.value.length && !activeCategory.value) {
        activeCategory.value = String(categories.value[0]?.id || '')
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

  function handleGenerate() {
    if (store.selectedCount === 0) return
    if (!router.hasRoute('hotspot-generate')) {
      ElMessage.error('页面加载中，请稍后再试')
      return
    }
    router.push({ name: 'hotspot-generate' })
  }

  function disabledDate(date: Date) {
    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 3600 * 1000)
    return date < new Date(threeDaysAgo.toDateString()) || date > now
  }

  onMounted(async () => {
    await loadCategories()
    await loadHotspots()
  })
</script>

<style lang="less" scoped>
  .hotspot-browse {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 16px 0;
  }
  .top-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
    .date-hint {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
  .tab-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    .tab-count {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      margin-left: 2px;
    }
  }
  :deep(.el-tabs__header) {
    margin-bottom: 12px;
  }
  .hotspot-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 80px;
  }
  .hotspot-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--el-bg-color);
    &:hover {
      border-color: var(--el-color-primary-light-5);
      background: var(--el-color-primary-light-9);
    }
    &.selected {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
    .card-body {
      flex: 1;
      min-width: 0;
      .card-title {
        font-size: 15px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .card-meta {
        margin-top: 4px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .region-tag {
        display: inline-block;
        padding: 0 6px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: 500;
        line-height: 18px;
      }
      .region-foreign {
        background: #e6f4ff;
        color: #1677ff;
      }
      .region-domestic {
        background: #fff7e6;
        color: #d48806;
      }
      .card-summary {
        margin-top: 6px;
        font-size: 13px;
        color: var(--el-text-color-regular);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: var(--layout-aside-width, 0);
    right: 0;
    padding: 12px 16px;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color);
    display: flex;
    justify-content: center;
    z-index: 10;
  }
</style>
