<template>
  <div class="auth-page">
    <div class="auth-card">
      <span class="auth-card__badge">AI</span>
      <h1 class="auth-card__title">注册</h1>
      <p class="auth-card__note">注册页由徐家凯开发（步骤 1 分工），当前为工程占位页</p>
      <router-link to="/" class="auth-card__btn">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
// 登录页（负责人：徐家凯）——当前为步骤 2 工程占位
</script>

<style scoped lang="scss">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 var(--space-6);
  background: var(--color-bg-page);
}

.auth-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  padding: var(--space-12) var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-surface);
  text-align: center;

  &__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 28px;
    padding: 0 var(--space-2);
    border-radius: var(--radius-sm);
    background: var(--color-ai);
    color: var(--color-text-inverse);
    font-size: var(--fs-caption);
    font-weight: var(--fw-bold);
    letter-spacing: 0.08em;
  }

  &__title {
    margin-top: var(--space-4);
    font-size: var(--fs-title);
    line-height: var(--lh-title);
    font-weight: var(--fw-semibold);
  }

  &__note {
    margin-top: var(--space-2);
    font-size: var(--fs-body);
    line-height: var(--lh-body);
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
