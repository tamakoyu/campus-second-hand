<template>
  <div class="nf-page">
    <p class="nf-page__code">404</p>
    <h1 class="nf-page__title">页面不存在</h1>
    <p class="nf-page__desc">你访问的页面走丢了，去看看别的闲置好物吧</p>
    <router-link to="/" class="nf-page__btn">返回首页</router-link>
  </div>
</template>

<script setup>
// 404（公共页面）
</script>

<style scoped lang="scss">
.nf-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 var(--space-6);
  text-align: center;
  background: var(--color-bg-page);

  &__code {
    font-family: var(--font-family-number);
    font-size: 96px;
    line-height: 1;
    font-weight: var(--fw-bold);
    color: var(--color-text-1);
    letter-spacing: 0.04em;
  }

  &__title {
    margin-top: var(--space-4);
    font-size: var(--fs-title-lg);
    font-weight: var(--fw-semibold);
  }

  &__desc {
    margin-top: var(--space-2);
    font-size: var(--fs-body);
    color: var(--color-text-2);
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 var(--space-8);
    margin-top: var(--space-8);
    background: var(--color-primary);
    color: var(--color-text-inverse);
    font-size: var(--fs-body);
    font-weight: var(--fw-medium);
    border-radius: var(--radius-md);
    transition: background var(--duration-fast) var(--ease-standard);

    &:hover {
      background: var(--color-primary-hover);
    }
  }
}
</style>
