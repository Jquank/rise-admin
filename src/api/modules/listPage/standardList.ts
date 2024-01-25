import $http from '@/utils/http'
export const getStandardList = (params?: Record<string, any>) => {
  return $http.get('/api/standardList/list', params)
}
