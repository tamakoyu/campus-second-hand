<template>
  <div class="page-container page-main">
    <section class="hero">
      <span class="hero__badge">AI</span>
      <h1 class="hero__title">AI 智能校园二手交易平台</h1>
      <p class="hero__desc">AI 估价 · AI 发布助手 · AI 智能问答 · 信用担保交易</p>
    </section>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">猜你喜欢</h2>
        <router-link to="/products" class="section-more">更多</router-link>
      </div>
      <el-empty description="AI 推荐位 · 步骤 7 接入 /api/ai/recommend" />
    </section>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">最新商品</h2>
        <router-link to="/products" class="section-more">更多</router-link>
      </div>
      <el-empty description="商品列表 · 步骤 4 开发（GoodsCard 网格）" />
    </section>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">热门商品</h2>
      </div>
      <el-empty description="热门商品 · 步骤 4 开发" />
    </section>
  </div>
</template>

<script setup>
// 首页（负责人：范胜洲）——步骤 4 开发，当前为步骤 2 工程占位
</script>

<style scoped lang="scss">
.hero {
  padding: var(--space-16) 0 var(--space-12);
  text-align: center;

  &__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 32px;
    padding: 0 var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--color-ai);
    color: var(--color-text-inverse);
    font-size: var(--fs-body);
    font-weight: var(--fw-bold);
    letter-spacing: 0.08em;
  }

  &__title {
    margin-top: var(--space-4);
    font-size: var(--fs-display);
    line-height: var(--lh-display);
    font-weight: var(--fw-semibold);
    letter-spacing: 0.02em;
  }

  &__desc {
    margin-top: var(--space-2);
    font-size: var(--fs-body-lg);
    color: var(--color-text-2);
  }
}
</style>
