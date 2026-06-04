import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DRAFT_KEY = 'hotspot-drafts'

export interface Draft {
  id: string
  title: string
  content: string
  targetFormat: string
  hotspotIds: number[]
  createdAt: string
  updatedAt: string
}

export const useDraftStore = defineStore('draft', () => {
  const drafts = ref<Draft[]>(JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'))

  function _persist() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts.value))
  }

  function save(draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>): Draft {
    const now = new Date().toISOString()
    const newDraft: Draft = {
      id: Date.now().toString(36),
      ...draft,
      createdAt: now,
      updatedAt: now,
    }
    drafts.value.unshift(newDraft)
    _persist()
    return newDraft
  }

  function update(id: string, patch: Partial<Pick<Draft, 'title' | 'content'>>) {
    const idx = drafts.value.findIndex((d) => d.id === id)
    if (idx === -1) return
    drafts.value[idx] = {
      ...drafts.value[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    _persist()
  }

  function remove(id: string) {
    drafts.value = drafts.value.filter((d) => d.id !== id)
    _persist()
  }

  function getById(id: string) {
    return drafts.value.find((d) => d.id === id)
  }

  const sortedDrafts = computed(() =>
    [...drafts.value].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  )

  return { drafts: sortedDrafts, save, update, remove, getById }
})
