<template>
  <div class="page-container page-main">
    <div class="ph">
      <h1 class="ph__title">私信</h1>
      <p class="ph__desc">站内私信（转人工入口，携带 productId + question）由徐家凯开发</p>
      <p class="ph__owner">负责人：徐家凯 · 当前为步骤 2 工程占位</p>
    </div>
  </div>
</template>

<script setup>
// 占位页
</script>

<style scoped lang="scss">
.ph {
  padding: var(--space-16) 0;
  text-align: center;

  &__title {
    font-size: var(--fs-title-lg);
    line-height: var(--lh-title-lg);
    font-weight: var(--fw-semibold);
  }

  &__desc {
    margin-top: var(--space-3);
    font-size: var(--fs-body);
    color: var(--color-text-2);
  }

  &__owner {
    margin-top: var(--space-6);
    font-size: var(--fs-caption);
    color: var(--color-text-3);
  }
}
</style>
