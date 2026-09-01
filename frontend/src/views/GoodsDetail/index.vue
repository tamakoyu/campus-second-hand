<template>
  <div class="page-container page-main">
    <div class="detail-head">
      <h1 class="detail-head__title">商品详情</h1>
      <p class="detail-head__desc">商品信息 · 卖家信息 · AI 智能问答 · 相关推荐（步骤 6 开发）</p>
    </div>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">商品信息</h2>
      </div>
      <el-empty description="步骤 6 开发（GET /api/products/:id，views +1）" />
    </section>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">AI 智能问答</h2>
      </div>
      <el-empty description="AiChat / AiPanel · 步骤 6 开发（POST /api/ai/chat，需登录）" />
    </section>
  </div>
</template>

<script setup>
// 商品详情 + AI 问答（负责人：范胜洲）——步骤 6 开发，当前为步骤 2 工程占位
</script>

<style scoped lang="scss">
.detail-head {
  padding: var(--space-12) 0 var(--space-8);

  &__title {
    font-size: var(--fs-title-lg);
    line-height: var(--lh-title-lg);
    font-weight: var(--fw-semibold);
  }

  &__desc {
    margin-top: var(--space-2);
    font-size: var(--fs-body);
    color: var(--color-text-2);
  }
}
</style>
