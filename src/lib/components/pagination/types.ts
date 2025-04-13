export interface PageParams {
  [key: string]: number
}

export type SearchMethod = (arg?: PageParams) => Promise<number | never | void>
