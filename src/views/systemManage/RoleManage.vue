<template>
  <div class="role-manage">
    <el-button type="primary" @click="addDialogVisible = true" class="mb-20"
      >新增角色</el-button
    >
    <el-table border :data="tableData" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="desc" label="描述"></el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editRole(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="角色编辑"
      width="50%"
      :append-to-body="true"
    >
      <el-button class="ml-24 mb-20" type="primary" @click="assignUser"
        >账户分配</el-button
      >
      <h4 class="pl-24 pb-10">按钮权限</h4>
      <div class="pl-24">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <el-checkbox-group v-model="checkedBtns" @change="checkedBtnsChange">
          <el-checkbox
            v-for="item in btnTypes"
            :key="item.key"
            :label="item.value"
            >{{ item.key }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <h4 class="pl-24 pb-10 pt-10">菜单权限</h4>
      <el-tree
        :key="treeKey"
        ref="treeRef"
        :props="treeProps"
        :data="routerOptionsClone"
        node-key="name"
        :default-checked-keys="defaultCheckedKeys"
        show-checkbox
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 新增弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增角色"
      width="50%"
      :append-to-body="true"
    >
      <el-form
        ref="addRoleFormRef"
        :model="addRoleFormModel"
        :rules="addRoleFormRules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="addRoleFormModel.name"
            maxlength="20"
            placeholder="角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="addRoleFormModel.desc"
            maxlength="200"
            placeholder="角色描述"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCancel(addRoleFormRef)">取消</el-button>
        <el-button type="primary" @click="addConfirm(addRoleFormRef)">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 用户选择弹窗 -->
    <el-dialog
      v-model="toUserDialogVisible"
      title="选择用户"
      width="50%"
      :append-to-body="true"
    >
      <el-tree
        ref="userTreeRef"
        :props="assignProps"
        :data="userTree"
        node-key="id"
        :default-checked-keys="userDefaultCheckedKeys"
        show-checkbox
        default-expand-all
      />
      <template #footer>
        <el-button @click="toUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assignUserConfirm"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { deleteNodeFromTreeList, getCheckedKeysByProp } from '@/utils/common'
  import { ElMessage, type ElTree, type CheckboxValueType } from 'element-plus'
  import { cloneDeep } from 'lodash-es'
  import { roleApi, type RoleType, userApi, type UserType } from '@/_api/index'
  import type { FormInstance, FormRules } from 'element-plus'

  // #region 获取菜单树
  const router = useRouter()
  let d = cloneDeep(
    router.options.routes.filter((v) => v.name === 'layout')[0].children || []
  )
  deleteNodeFromTreeList(d, false, 'meta.show')
  const routerOptionsClone = d
  // #endregion

  // #region 查询角色列表
  const loading = ref(true)
  const tableData = ref<RoleType.Res_getRole[]>([])
  const getRoleList = async () => {
    try {
      const { data } = await roleApi.getRole()
      tableData.value = data
    } finally {
      loading.value = false
    }
  }
  getRoleList()
  // #endregion

  // #region 新增角色
  const addDialogVisible = ref(false)
  const addRoleFormRef = ref<FormInstance>()
  const addRoleFormModel = reactive({
    name: '',
    desc: ''
  })
  const addRoleFormRules = reactive<FormRules<typeof addRoleFormModel>>({
    name: {
      required: true,
      message: '请填写角色名称',
      trigger: 'blur'
    },
    desc: {
      required: true,
      message: '请填写角色描述',
      trigger: 'blur'
    }
  })
  const addCancel = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    addDialogVisible.value = false
  }
  const addConfirm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate()
    const { code } = await roleApi.postRole(addRoleFormModel)
    if (code === 0) {
      ElMessage.success('新增成功')
      getRoleList()
    }
    addDialogVisible.value = false
  }
  // #endregion

  // #region 编辑角色
  const dialogVisible = ref(false)
  const treeKey = ref(new Date() + '')
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const defaultCheckedKeys = ref<string[]>([])
  const treeProps = {
    label: (data: Record<string, { title: string }>) => data.meta?.title,
    children: 'children',
    disabled: 'disabled'
  }
  const btnTypes = [
    { value: 'ADD', key: '新增' },
    { value: 'UPDATE', key: '修改' },
    { value: 'DELETE', key: '删除' },
    { value: 'VIEW', key: '查看' },
    { value: 'DOWNLOAD', key: '下载' },
    { value: 'IMPORT', key: '导入' },
    { value: 'EXPORT', key: '导出' }
  ]
  const checkedBtns = ref<string[]>([])
  const checkAll = ref(false)
  const isIndeterminate = ref(true)
  let currentRole: RoleType.Res_getRoleById
  const editRole = async (row: RoleType.Res_getRole) => {
    currentRole = row
    const { data } = await roleApi.getRoleById(row.id)
    // 默认选中按钮
    checkedBtns.value = data.btnAuth
    if (data.btnAuth.length === btnTypes.length) {
      checkAll.value = true
      isIndeterminate.value = false
    }
    if (data.btnAuth.length === 0) {
      isIndeterminate.value = false
    }
    // 默认选中菜单（满足条件的叶子节点的name）
    defaultCheckedKeys.value = getCheckedKeysByProp(
      routerOptionsClone,
      'name',
      (item) =>
        (!item.children || !item.children.length) &&
        data.menuAuth.includes(item.name)
    )
    dialogVisible.value = true
    treeKey.value = new Date() + ''
  }
  const handleCheckAllChange = (val: CheckboxValueType) => {
    checkedBtns.value = val ? btnTypes.map((item) => item.value) : []
    isIndeterminate.value = false
  }
  const checkedBtnsChange = (value: CheckboxValueType[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === btnTypes.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < btnTypes.length
  }
  const confirm = async () => {
    let keys = treeRef.value!.getCheckedKeys(true) as string[]
    const { code, message } = await roleApi.putRoleByIdAuth(currentRole.id, {
      menuAuth: keys,
      btnAuth: checkedBtns.value
    })
    if (code === 0) {
      ElMessage.success(message)
      dialogVisible.value = false
    }
  }
  // #endregion

  // #region 用户分配弹窗逻辑
  const userTreeRef = ref()
  const toUserDialogVisible = ref(false)
  const assignProps = {
    label: 'name',
    children: 'children',
    disabled: 'disabled'
  }
  const userDefaultCheckedKeys = ref<number[]>([])
  const userTree = ref<UserType.Res_getUserDepartmentTree[]>([])
  // 点击分配用户
  const assignUser = async () => {
    toUserDialogVisible.value = true
    const { data: d } = await roleApi.getRoleByIdUsers(currentRole.id)
    userDefaultCheckedKeys.value = d.map(
      (item: UserType.Res_getUser) => item.id
    )
    const { data } = await userApi.getUserDepartmentTree()
    userTree.value = data
  }
  // 点击确认
  const assignUserConfirm = async () => {
    let keys = userTreeRef.value!.getCheckedKeys(true) as number[]
    const { code } = await roleApi.postRoleByIdBindUser(currentRole.id, keys)
    if (code === 0) {
      ElMessage.success('用户绑定成功')
      toUserDialogVisible.value = false
    }
  }
  // #endregion
</script>
