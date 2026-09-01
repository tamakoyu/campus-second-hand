<template>
  <div class="page-header">
    <nav v-if="breadcrumb && breadcrumb.length" class="page-header__crumb" aria-label="面包屑">
      <template v-for="(item, i) in breadcrumb" :key="i">
        <router-link v-if="item.path" :to="item.path" class="page-header__crumb-link">{{ item.label }}</router-link>
        <span v-else class="page-header__crumb-current">{{ item.label }}</span>
        <span v-if="i < breadcrumb.length - 1" class="page-header__crumb-sep">/</span>
      </template>
    </nav>

    <div class="page-header__main">
      <div class="page-header__text">
        <h1 class="page-header__title">{{ title }}</h1>
        <p v-if="description" class="page-header__desc">{{ description }}</p>
      </div>
      <div class="page-header__extra"><slot name="extra" /></div>
    </div>
  </div>
</template>

<script setup>
/**
 * 页面标题区：面包屑 + 标题 + 说明 + 右侧操作（清单）
 * props: title / description / breadcrumb([{label, path?}])；slot: extra
 */
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  breadcrumb: { type: Array, default: () => [] }
})
</script>

<style scoped lang="scss">
.page-header {
  padding: var(--space-10) 0 var(--space-6);

  &__crumb {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    margin-bottom: var(--space-3);
    font-size: var(--fs-aux);
    color: var(--color-text-3);
  }

  &__crumb-link {
    transition: color var(--duration-fast) var(--ease-standard);

    &:hover {
      color: var(--color-primary);
    }
  }

  &__crumb-current {
    color: var(--color-text-2);
  }

  &__crumb-sep {
    color: var(--color-border);
  }

  &__main {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  &__title {
    font-size: var(--fs-title-lg);
    line-height: var(--lh-title-lg);
    font-weight: var(--fw-semibold);
  }

  &__desc {
    margin-top: var(--space-2);
    font-size: var(--fs-body);
    line-height: var(--lh-body);
    color: var(--color-text-2);
  }
}
</style>
