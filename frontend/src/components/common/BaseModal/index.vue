<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="emit('cancel')"
  >
    <div class="base-modal__body"><slot /></div>
    <template #footer>
      <div class="base-modal__footer">
        <!-- 按钮顺序 [取消] [确定]（规范 §8.4） -->
        <el-button @click="visible = false">取消</el-button>
        <el-button
          :type="danger ? 'danger' : 'primary'"
          :loading="confirmLoading"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 弹窗统一封装（el-dialog 二次封装，规范 §8.4：仅危险/不可逆操作使用，按钮 [取消] [确定]）
 * v-model 控制显隐；props: title / width / confirmText / danger / confirmLoading；event: confirm / cancel
 */
const props = defineProps({
  title: { type: String, default: '确认操作' },
  width: { type: String, default: '480px' },
  confirmText: { type: String, default: '确定' },
  danger: { type: Boolean, default: false },
  confirmLoading: { type: Boolean, default: false }
})
const emit = defineEmits(['confirm', 'cancel'])
const visible = defineModel({ type: Boolean, default: false })
</script>

<style scoped lang="scss">
.base-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
</style>
