import { useCommonStore } from '@/store/common'
export const permission = {
  mounted(el: HTMLElement, binding: { arg?: string }) {
    const commonStore = useCommonStore()
    const btnAuth = commonStore.userInfo.btnAuth || []
    const arg = (binding.arg || '').toUpperCase()
    const parentNode = el.parentNode
    if (parentNode && arg && !btnAuth.includes(arg)) {
      parentNode.removeChild(el)
    }
  }
}
