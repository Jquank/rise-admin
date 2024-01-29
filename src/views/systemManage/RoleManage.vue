<template>
  <div class="role-manage">
    <el-table border :data="tableData" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="role" label="角色名称" align="center" />
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

    <el-dialog
      v-model="dialogVisible"
      title="角色编辑"
      width="50%"
      :append-to-body="true"
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
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { deleteNodeFromTreeList, getCheckedKeysByProp } from '@/utils/common'
  import { ElMessage, type ElTree, type CheckboxValueType } from 'element-plus'
  import { cloneDeep } from 'lodash-es'
  import { roleApi, RoleType } from '@/api/index'

  const router = useRouter()
  const loading = ref(true)
  const tableData = ref<RoleType.Res_getRole[]>([])
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
  let currentRole: RoleType.Res_getRole = {}

  let d = cloneDeep(
    router.options.routes.filter((v) => v.name === 'layout')[0].children || []
  )
  deleteNodeFromTreeList(d, false, 'meta.show')
  const routerOptionsClone = d

  const getRoleList = async () => {
    try {
      const { data } = await roleApi.getRole()
      tableData.value = data
    } finally {
      loading.value = false
    }
  }
  getRoleList()

  const editRole = async (row: RoleType.Res_getRole) => {
    currentRole = row
    const { data } = await roleApi.getRoleAuthById(row.role)
    // 默认选中按钮
    checkedBtns.value = data.btn
    if (data.btn.length === btnTypes.length) {
      checkAll.value = true
      isIndeterminate.value = false
    }
    // 默认选中菜单
    defaultCheckedKeys.value = getCheckedKeysByProp(
      routerOptionsClone,
      'name',
      (item) =>
        (!item.children || !item.children.length) && !data.menu.length
          ? true
          : data.menu.includes(item.name)
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
    const { code, message } = await roleApi.putRoleAuthById(currentRole.role, {
      menu: keys,
      btn: checkedBtns.value
    })
    if (code === 0) {
      ElMessage.success(message)
      dialogVisible.value = false
    }
  }
</script>
