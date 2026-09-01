<template>
  <div class="page-container page-main">
    <div class="list-head">
      <h1 class="list-head__title">商品列表</h1>
      <p class="list-head__desc">关键词检索 · 分类筛选 · 价格区间 · 成色 · 排序（步骤 5 开发）</p>
    </div>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">筛选与排序</h2>
      </div>
      <el-empty description="SearchBar + 筛选栏 · 步骤 5 开发（URL 参数同步 ?keyword=&category=&sort=&page=）" />
    </section>

    <section class="page-section">
      <div class="page-section__header">
        <h2 class="section-title">商品网格</h2>
      </div>
      <el-empty description="GoodsCard 网格 + BasePagination · 步骤 5 开发（GET /api/products）" />
    </section>
  </div>
</template>

<script setup>
// 商品列表 / 检索（负责人：范胜洲）——步骤 5 开发，当前为步骤 2 工程占位
</script>

<style scoped lang="scss">
.list-head {
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
