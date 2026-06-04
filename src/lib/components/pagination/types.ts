/** 分页查询参数（页码、每页条数等） */
export interface PageParams {
  [key: string]: number
}

/**
 * 分页查询方法签名
 * 需返回 `Promise<number>` 表示总记录数，用于更新分页器的 total
 * RTable 内置 RPagination，设置 `usePagination` + `searchMethod` 即可自动分页
 */
export type SearchMethod = (arg?: PageParams) => Promise<number | never | void>

