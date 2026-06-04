import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHotspotStore = defineStore('hotspot', () => {
  // ======== 热点选中 ========
  const selectedIds = ref<Set<number>>(new Set())

  function isSelected(hotspotId: number) {
    return selectedIds.value.has(hotspotId)
  }

  function toggleSelect(hotspotId: number) {
    const s = new Set(selectedIds.value)
    if (s.has(hotspotId)) {
      s.delete(hotspotId)
    } else {
      s.add(hotspotId)
    }
    selectedIds.value = s
  }

  function selectAll(ids: number[]) {
    const s = new Set(selectedIds.value)
    ids.forEach((id) => s.add(id))
    selectedIds.value = s
  }

  function deselectAll(ids: number[]) {
    const s = new Set(selectedIds.value)
    ids.forEach((id) => s.delete(id))
    selectedIds.value = s
  }

  /** 添加一个勾选 */
  function addSelection(id: number) {
    const s = new Set(selectedIds.value)
    s.add(id)
    selectedIds.value = s
  }

  /** 移除一个勾选 */
  function removeSelection(id: number) {
    const s = new Set(selectedIds.value)
    s.delete(id)
    selectedIds.value = s
  }

  function clearSelection() {
    selectedIds.value = new Set()
  }

  const selectedCount = computed(() => selectedIds.value.size)
  const selectedIdList = computed(() => [...selectedIds.value])

  return {
    selectedIds,
    isSelected,
    toggleSelect,
    selectAll,
    deselectAll,
    addSelection,
    removeSelection,
    clearSelection,
    selectedCount,
    selectedIdList
  }
})
