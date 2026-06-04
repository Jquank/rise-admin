<template>
  <div class="user-manage">
    <RForm
      @search="handleSearch"
      isResponseGrid
      showLastCol
      :config="searchFormConfig"
      v-model="searchModel">
      <template #right-buttons>
        <el-button type="primary" @click="openCreateDialog">
          <SvgIcon icon="add" /> 新增用户
        </el-button>
      </template>
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
        <template #column-roles="{ row }">
          <el-tag
            v-for="r in row.roles"
            :key="r.id"
            size="small"
            class="role-tag">
            {{ r.name }}
          </el-tag>
          <span v-if="!row.roles?.length" class="text-placeholder">无角色</span>
        </template>
        <template #column-isActive="{ row }">
          <el-switch
            :model-value="row.isActive"
            @change="(val: boolean) => handleToggleActive(row, val)"
            size="small" />
        </template>
        <template #column-actions="{ row }">
          <el-button
            type="primary"
            link
            size="small"
            @click="openEditDialog(row)">
            编辑
          </el-button>
          <el-button
            type="warning"
            link
            size="small"
            @click="handleResetPassword(row)">
            重置密码
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button
            type="success"
            link
            size="small"
            @click="openRechargeDialog(row)">
            充值
          </el-button>
        </template>
      </r-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingUser ? '编辑用户' : '新增用户'"
      width="520px"
      destroy-on-close
      @closed="dialogClosed">
      <RForm
        ref="formRef"
        v-model="formModel"
        :config="formConfig"
        :show-action-btn="false"
        label-width="80px" />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            v-if="editingUser"
            type="danger"
            plain
            @click="handleResetFromDialog">
            重置密码
          </el-button>
          <div class="footer-right">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="handleSubmit"
              :loading="submitting">
              确定
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 充值弹窗 -->
    <el-dialog
      v-model="rechargeVisible"
      title="充值"
      width="420px"
      destroy-on-close
      @closed="rechargeModel.amountInFen = ''">
      <el-form label-width="80px">
        <el-form-item label="用户">
          {{ rechargeModel.username }}
        </el-form-item>
        <el-form-item label="金额（元）" required>
          <el-input-number
            v-model="rechargeModel.amount"
            :min="0.01"
            :step="10"
            :precision="2"
            placeholder="输入充值金额"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="rechargeModel.description" placeholder="选填" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rechargeVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRecharge" :loading="recharging">
          确认充值
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { userApi, roleApi, walletApi } from '@/_api'
  import type {
    Res_UserManage,
    Body_AdminCreateUser,
    Body_AdminUpdateUser
  } from '@/_api/modules/user'
  import { RForm, RTable } from '@/lib/index'
  import type { FormConfigItemType } from '@/lib/components/form'

  // ========== 搜索 ==========
  const searchModel = reactive({ keyword: '' })
  const searchFormConfig: FormConfigItemType[] = [
    {
      prop: 'keyword',
      label: '关键词',
      type: 'input',
      compConfig: { placeholder: '用户名 / 姓名' }
    }
  ]

  // ========== 表格 ==========
  const tableData = ref<Res_UserManage[]>([])
  const loading = ref(false)
  const tableRef = ref()

  const tableColumns = [
    { prop: 'username', label: '用户名', minWidth: 120 },
    { prop: 'name', label: '姓名', minWidth: 120 },
    { prop: 'roles', label: '角色', minWidth: 160 },
    { prop: 'isActive', label: '启用', width: 70 },
    { prop: 'createdAt', label: '创建时间', width: 200 },
    { prop: 'lastLoginAt', label: '最后登录', width: 160 },
    { prop: 'actions', label: '操作', width: 230 }
  ]

  const listSearch = (page: { current: number; pageSize: number }) => {
    loading.value = true
    const params = {
      page: page.current,
      pageSize: page.pageSize,
      keyword: searchModel.keyword || undefined
    }
    return userApi
      .getPaginatedUsers(params)
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

  // ========== 启用/禁用 ==========
  async function handleToggleActive(row: Res_UserManage, val: boolean) {
    try {
      await userApi.updateUser(row.id, { isActive: val })
      row.isActive = val
      ElMessage.success(val ? '已启用' : '已禁用')
    } catch {
      ElMessage.error('操作失败')
    }
  }

  // ========== 弹窗表单 ==========
  const dialogVisible = ref(false)
  const editingUser = ref<Res_UserManage | null>(null)
  const submitting = ref(false)
  const formRef = ref()

  const formModel = reactive<
    Body_AdminCreateUser & Body_AdminUpdateUser & { id?: number }
  >({
    username: '',
    password: '',
    name: '',
    roleIds: []
  })

  // 角色选项
  const roleOptions = ref<{ label: string; value: number }[]>([])
  async function loadRoleOptions() {
    try {
      const { data } = (await roleApi.getRole({ name: '', desc: '' })) as any
      roleOptions.value = (data || []).map((r: any) => ({
        label: r.name,
        value: r.id
      }))
    } catch {
      /* ignore */
    }
  }

  const formConfig = computed<FormConfigItemType[]>(() => [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      colNumber: 1,
      compConfig: {
        placeholder: '登录账号',
        disabled: !!editingUser.value
      }
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'input',
      colNumber: 1,
      compConfig: { placeholder: '显示名称' }
    },
    ...(editingUser.value
      ? [
          {
            prop: 'password',
            label: '密码',
            type: 'input',
            colNumber: 1,
            compConfig: {
              type: 'password',
              placeholder: '输入新密码（留空不修改）',
              autocomplete: 'new-password'
            }
          } as FormConfigItemType
        ]
      : [
          {
            prop: 'password',
            label: '密码',
            type: 'input',
            colNumber: 1,
            compConfig: {
              type: 'password',
              placeholder: '留空则随机生成 12 位复杂密码',
              autocomplete: 'new-password'
            }
          } as FormConfigItemType
        ]),
    {
      prop: 'roleIds',
      label: '角色',
      type: 'select',
      colNumber: 1,
      compConfig: {
        multiple: true,
        customOptions: roleOptions.value,
        placeholder: '选择角色'
      }
    }
  ])

  function openCreateDialog() {
    editingUser.value = null
    formModel.username = ''
    formModel.password = ''
    formModel.name = ''
    formModel.roleIds = []
    dialogVisible.value = true
    loadRoleOptions()
    // 确保 RForm 重新渲染后清掉缓存值
    nextTick(() => {
      formRef.value?.formRef?.resetFields?.()
    })
  }

  function openEditDialog(row: Res_UserManage) {
    editingUser.value = row
    formModel.username = row.username
    formModel.password = ''
    formModel.name = row.name || ''
    formModel.roleIds = row.roles.map((r) => r.id)
    dialogVisible.value = true
    loadRoleOptions()
    nextTick(() => {
      formRef.value?.formRef?.clearValidate?.()
    })
  }

  function dialogClosed() {
    editingUser.value = null
    // 清空表单避免下次打开闪烁旧数据
    formModel.username = ''
    formModel.password = ''
    formModel.name = ''
    formModel.roleIds = []
  }

  /** 编辑弹窗内直接重置密码 */
  async function handleResetFromDialog() {
    if (!editingUser.value) return
    try {
      await ElMessageBox.confirm(
        `确定要重置用户「${editingUser.value.username}」的密码吗？`,
        '重置密码',
        { type: 'warning' }
      )
      const { data } = await userApi.resetPassword(editingUser.value.id)
      formModel.password = data.newPassword
      ElMessage.success(`新密码已填入：${data.newPassword}`)
    } catch {
      /* 取消 */
    }
  }

  async function handleSubmit() {
    if (!formModel.username) {
      ElMessage.warning('请输入用户名')
      return
    }
    submitting.value = true
    let created = false
    try {
      if (editingUser.value) {
        await userApi.updateUser(editingUser.value.id, {
          name: formModel.name,
          roleIds: formModel.roleIds,
          ...(formModel.password ? { password: formModel.password } : {})
        })
        ElMessage.success('保存成功')
        created = true
      } else {
        const res = await userApi.createUser({
          username: formModel.username,
          password: formModel.password || undefined,
          name: formModel.name || undefined,
          roleIds: formModel.roleIds?.length ? formModel.roleIds : undefined
        })
        const inner = res.data
        if (inner.initialPassword) {
          ElMessage.success({
            message: `创建成功！初始密码：${inner.initialPassword}（请截图保存）`,
            duration: 10000
          })
        } else {
          ElMessage.success('创建成功')
        }
        created = true
      }
      dialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(
        err?.response?.data?.message || err?.message || '操作失败'
      )
    } finally {
      submitting.value = false
    }
    // 延迟刷新避免弹窗关闭动画干扰
    if (created) {
      listSearch({ current: 1, pageSize: 20 })
    }
  }

  // ========== 重置密码 ==========
  async function handleResetPassword(row: Res_UserManage) {
    try {
      await ElMessageBox.confirm(
        `确定要重置用户「${row.username}」的密码吗？`,
        '重置密码',
        { type: 'warning' }
      )
      const { data } = await userApi.resetPassword(row.id)
      ElMessage.success({
        message: `密码已重置，新密码：${data.newPassword}（请截图保存）`,
        duration: 10000
      })
    } catch {
      /* 取消 */
    }
  }

  // ========== 充值 ==========
  const rechargeVisible = ref(false)
  const recharging = ref(false)
  const rechargeModel = reactive({
    userId: 0,
    username: '',
    amount: null as number | null,
    description: ''
  })

  function openRechargeDialog(row: Res_UserManage) {
    rechargeModel.userId = row.id
    rechargeModel.username = row.username
    rechargeModel.amount = null
    rechargeModel.description = ''
    rechargeVisible.value = true
  }

  async function handleRecharge() {
    if (!rechargeModel.amount || rechargeModel.amount <= 0) {
      ElMessage.warning('请输入充值金额')
      return
    }
    recharging.value = true
    try {
      const amountInFen = Math.round(rechargeModel.amount * 100)
      await walletApi.recharge({
        targetUserId: rechargeModel.userId,
        amountInFen,
        description: rechargeModel.description || undefined
      })
      ElMessage.success(
        `已为用户「${rechargeModel.username}」充值 ¥${rechargeModel.amount}`
      )
      rechargeVisible.value = false
    } catch (err: any) {
      ElMessage.error(
        err?.response?.data?.message || err?.message || '充值失败'
      )
    } finally {
      recharging.value = false
    }
  }

  // ========== 删除 ==========
  async function handleDelete(row: Res_UserManage) {
    try {
      await ElMessageBox.confirm(
        `确定要删除用户「${row.username}」吗？此操作不可恢复！`,
        '确认删除',
        { type: 'warning', confirmButtonClass: 'el-button--danger' }
      )
      await userApi.deleteUser(row.id)
      ElMessage.success('已删除')
      listSearch({ current: 1, pageSize: 20 })
    } catch {
      /* 取消 */
    }
  }
</script>

<style lang="less" scoped>
  .user-manage {
    height: 100%;
    display: flex;
    flex-direction: column;
    .table-wrap {
      flex: 1;
      min-height: 0;
    }
    .role-tag {
      margin-right: 4px;
    }
    .text-placeholder {
      color: var(--el-text-color-placeholder);
      font-size: 12px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .footer-right {
      display: flex;
      gap: 8px;
    }
  }
</style>
