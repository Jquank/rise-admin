/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from '../http'
import { ResponseType, AxiosRequestConfig } from '../responseType'

// ========== 类型 ==========
export type Res_Wallet = {
  id: number
  userId: number
  balance: number
  totalRecharged: number
  totalConsumed: number
}

export type Res_Transaction = {
  id: number
  userId: number
  type: 'RECHARGE' | 'CONSUME' | 'REFUND'
  amount: number
  balanceBefore: number
  balanceAfter: number
  relatedType: string | null
  relatedId: number | null
  description: string | null
  createdAt: string
  user: { id: number; username: string; name: string | null }
}

export interface Body_Recharge {
  targetUserId: number
  amountInFen: number
  description?: string
}

class Wallet {
  getMyWallet(
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_Wallet>> {
    return $http.get('/api/wallet', config)
  }

  recharge(
    data: Body_Recharge,
    config: AxiosRequestConfig = {}
  ): Promise<ResponseType<Res_Wallet>> {
    return $http.post('/api/wallet/recharge', data, config)
  }

  getTransactions(params?: {
    page?: number
    pageSize?: number
    userId?: number
    type?: string
  }): Promise<
    ResponseType<{
      records: Res_Transaction[]
      total: number
      page: number
      pageSize: number
    }>
  > {
    return $http.get('/api/wallet/transactions', { params })
  }
}

export const walletApi = new Wallet()
