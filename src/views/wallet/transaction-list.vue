<template>
  <div class="transaction-page">
    <RForm
      @search="handleSearch"
      isResponseGrid
      showLastCol
      :config="searchFormConfig"
      v-model="searchModel">
    </RForm>
    <div class="table-wrap">
      <r-table
        ref="tableRef"
        height="100%"
        :columns="tableColumns"
        :data="tableData"
        :searchMethod="listSearch"
        :loading="loading"
        show-overflow-tooltip
        border>
        <template #column-user="{ row }">
          {{ row.user?.name || row.user?.username }}
        </template>
        <template #column-type="{ row }">
          <el-tag :type="tagType(row.type)" size="small">
            {{ typeLabel(row.type) }}
          </el-tag>
        </template>
        <template #column-amount="{ row }">
          <span
            :class="
              row.type === 'RECHARGE' ? 'amount-positive' : 'amount-negative'
            ">
            {{ formatAmount(row) }}
          </span>
        </template>
        <template #column-balanceChange="{ row }">
          <span class="text-secondary">
            {{ (row.balanceBefore / 100).toFixed(2) }}
            →
            {{ (row.balanceAfter / 100).toFixed(2) }}
          </span>
        </template>
      </r-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { walletApi } from '@/_api'
  import type { Res_Transaction } from '@/_api/modules/wallet'
  import { RForm, RTable } from '@/lib/index'
  import type { FormConfigItemType } from '@/lib/components/form'

  const searchModel = reactive({ keyword: '' })
  const searchFormConfig: FormConfigItemType[] = [
    {
      prop: 'keyword',
      label: '关键词',
      type: 'input',
      compConfig: { placeholder: '用户名' }
    }
  ]

  const tableData = ref<Res_Transaction[]>([])
  const loading = ref(false)
  const tableRef = ref()

  const tableColumns = [
    { prop: 'user', label: '用户', minWidth: 100 },
    { prop: 'type', label: '类型', width: 80 },
    { prop: 'amount', label: '金额', width: 100 },
    { prop: 'balanceChange', label: '余额变化', width: 160 },
    { prop: 'description', label: '备注', minWidth: 140 },
    { prop: 'createdAt', label: '时间', width: 160 }
  ]

  function tagType(type: string) {
    const map: Record<string, string> = {
      RECHARGE: 'success',
      CONSUME: 'warning',
      REFUND: 'info'
    }
    return map[type] || ''
  }

  function typeLabel(type: string) {
    const map: Record<string, string> = {
      RECHARGE: '充值',
      CONSUME: '消费',
      REFUND: '退款'
    }
    return map[type] || type
  }

  function formatAmount(row: Res_Transaction) {
    const yuan = (Math.abs(row.amount) / 100).toFixed(2)
    const sign = row.type === 'RECHARGE' ? '+' : '-'
    const prefix = row.type === 'REFUND' ? '+' : sign
    return `${prefix}¥${yuan}`
  }

  const listSearch = (page: { current: number; pageSize: number }) => {
    loading.value = true
    const params = {
      page: page.current,
      pageSize: page.pageSize
    }
    return walletApi
      .getTransactions(params)
      .then((res) => {
        loading.value = false
        tableData.value = res.data.records
        return res.data.total
      })
      .catch(() => {
        loading.value = false
      })
  }

  function handleSearch() {
    listSearch({ current: 1, pageSize: 20 })
  }
</script>

<style lang="less" scoped>
  .transaction-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    .table-wrap {
      flex: 1;
      min-height: 0;
    }
    .amount-positive {
      color: var(--el-color-success);
      font-weight: 500;
    }
    .amount-negative {
      color: var(--el-color-danger);
      font-weight: 500;
    }
    .text-secondary {
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
  }
</style>
