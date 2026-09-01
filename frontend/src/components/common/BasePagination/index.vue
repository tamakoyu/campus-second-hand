<template>
  <div class="base-pagination">
    <el-pagination
      background
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      :pager-count="pagerCount"
      layout="total, prev, pager, next"
      @current-change="onChange"
    />
  </div>
</template>

<script setup>
/**
 * 统一分页（封装 el-pagination，规范 §8.5：默认每页 12 条、页码 >7 折叠、显示总数）
 * props: total / page / pageSize / pagerCount；event: change(page, pageSize)
 */
const props = defineProps({
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 12 },
  pagerCount: { type: Number, default: 7 }
})
const emit = defineEmits(['change'])

function onChange(p) {
  if (p !== undefined && p !== null) emit('change', p, props.pageSize)
}
</script>

<style scoped lang="scss">
.base-pagination {
  display: flex;
  justify-content: center;
  padding: var(--space-8) 0;

  // 黑色激活页码 + 中性 hover（对齐设计 token）
  :deep(.el-pagination.is-background .el-pager li) {
    border-radius: var(--radius-sm);
    background: var(--color-bg-surface);

    &.is-active {
      background: var(--color-primary);
      color: var(--color-text-inverse);
    }

    &:hover:not(.is-active) {
      color: var(--color-primary);
    }
  }

  :deep(.el-pagination__total) {
    color: var(--color-text-2);
    font-size: var(--fs-aux);
  }
}
</style>
