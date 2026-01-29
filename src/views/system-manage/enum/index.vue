<template>
  <div class="enum-manage">
    <RForm
      @search="handleSearch"
      isResponseGrid
      showLastCol
      buttonInRow
      defaultCollapse
      :config="formConfig"
      v-model="searchModel">
      <template #left-buttons>
        <el-button type="primary" @click="createEnum">新增枚举</el-button>
      </template>
    </RForm>
    <div class="enum-content">
      <div class="left"></div>
      <div class="right">
        <RTable :columns="enumColumns" :data="enumData" border> </RTable>
      </div>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      v-if="addDialogVisible"
      title="新增枚举"
      width="500px"
      :append-to-body="true">
      <RForm
        ref="addEnumRef"
        :config="addformConfig"
        v-model="addModel"
        :colNumber="1"></RForm>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { RForm, RTable } from '@/lib/index'
  import { enumApi, EnumType } from '@/_api/index'
  import { ElMessage } from 'element-plus'

  const searchModel = reactive({
    name: ''
  })
  const formConfig = [
    {
      prop: 'name',
      label: '名称',
      type: 'input'
    }
  ]
  const handleSearch = () => {}
  const enumColumns = []
  const enumData = ref([])
  const createEnum = () => {
    addDialogVisible.value = true
  }

  // #region 新增枚举
  const addDialogVisible = ref(false)
  const addEnumRef = ref(null)
  const addModel = reactive<EnumType.Body_postEnum>({
    type: '',
    code: '',
    name: '',
    desc: ''
  })
  const addformConfig = [
    {
      prop: 'type',
      label: '类型',
      required: true,
      type: 'select',
      compConfig: {
        customRequest: enumApi.getEnumType
      }
    },
    {
      prop: 'name',
      label: '名称',
      required: true,
      type: 'input'
    },
    {
      prop: 'code',
      label: '内部名称',
      required: true,
      type: 'input'
    },
    {
      prop: 'desc',
      label: '描述',
      type: 'input',
      compConfig: {
        type: 'textarea'
      }
    }
  ]
  const addConfirm = async () => {
    await addEnumRef.value.formRef.validate()
    const { code } = await enumApi.postEnum(addModel)
    if (code === 0) {
      ElMessage.success('创建成功')
      addDialogVisible.value = false
      addEnumRef.value.formRef.resetFields()
    }
  }
  // #endregion 新增枚举-end
</script>

<style lang="less" scoped>
  .enum-manage {
    height: 100%;
    background-color: var(--main-bg-color);
    display: flex;
    flex-direction: column;
    .enum-content {
      flex: 1;
      display: flex;
      .left {
        width: 200px;
        height: 100%;
      }
      .right {
        flex: 1;
        height: 100%;
      }
    }
  }
</style>
