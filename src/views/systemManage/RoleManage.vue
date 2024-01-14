<template>
  <div class="role-manage">
    <el-table border :data="tableData" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="roleName" label="角色名称" align="center" />
      <el-table-column prop="startTime" label="创建时间" align="center" />
      <el-table-column prop="notes" label="描述"></el-table-column>
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
  import { getRolesList, getMenuByRole } from '@/api/user'
  import { deleteNodeFromTreeList, getCheckedKeysByProp } from '@/utils/common'
  import type { ElTree } from 'element-plus'
  import { cloneDeep } from 'lodash-es'

  const router = useRouter()
  const loading = ref(true)
  const tableData = ref([])
  const dialogVisible = ref(false)
  const treeKey = ref(new Date() + '')
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const defaultCheckedKeys = ref<string[]>([])
  const treeProps = {
    label: (data: Record<string, { title: string }>) => data.meta?.title,
    children: 'children',
    disabled: 'disabled'
  }
  let currentRole = ''

  let d = cloneDeep(
    router.options.routes.filter((v) => v.name === 'layout')[0].children || []
  )
  deleteNodeFromTreeList(d, false, 'meta.show')
  const routerOptionsClone = d

  getRolesList()
    .then((res) => {
      loading.value = false
      tableData.value = res.data
    })
    .catch(() => {
      loading.value = false
    })

  const editRole = async (item: { role: string }) => {
    currentRole = item.role
    const auth = await getMenuByRole([item.role])
    // !auth.length ? true : auth.includes(item.name)模拟代码，真实为：auth.includes(item.name)
    defaultCheckedKeys.value = getCheckedKeysByProp(
      routerOptionsClone,
      'name',
      (item) =>
        (!item.children || !item.children.length) &&
        (!auth.length ? true : auth.includes(item.name))
    )
    dialogVisible.value = true
    treeKey.value = new Date() + ''
  }
  const confirm = () => {
    let keys = treeRef.value!.getCheckedKeys(true)
    localStorage.setItem(`menuAuth-${currentRole}`, JSON.stringify(keys))
    dialogVisible.value = false
  }
</script>
