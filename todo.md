# TODO

## 组件库改进

### RForm select/radio 映射简化 ✅ 已完成
- **已做**：升级 element-plus 到 2.14+，`select` 直接映射 `ElSelect`（原生支持 `:options` prop），删除 `r-select-native.vue`。`radio` 改为 `ElRadioGroup` inline 包装（`defineComponent` + `h()`），删除 `r-radio.vue`。RForm 模板新增 `:options="options[index]"` 传递以兼容 ElSelect。
- **剩余**：`selectObject`（r-select.vue）仍在，可考虑后续把对象绑定逻辑上提到 RForm 层面后一并移除。
