<template>
  <div class="base-image">
    <el-image
      class="base-image__inner"
      :src="src || undefined"
      :alt="alt"
      :lazy="lazy"
      :preview-src-list="preview ? [src] : undefined"
      :initial-index="0"
      :hide-on-click-modal="true"
      fit="cover"
    >
      <template #placeholder>
        <div class="base-image__placeholder" />
      </template>
      <template #error>
        <div class="base-image__error">
          <img v-if="fallback" :src="fallback" :alt="alt" class="base-image__fallback" />
          <template v-else>
            <svg viewBox="0 0 48 48" width="28" height="28" fill="none" aria-hidden="true">
              <rect x="6" y="10" width="36" height="28" rx="4" stroke="#C4C4C4" stroke-width="2" />
              <path d="M10 32l9-9 7 7 6-6 6 6" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="18" cy="18" r="2.5" fill="#C4C4C4" />
            </svg>
            <span class="base-image__error-text">图片加载失败</span>
          </template>
        </div>
      </template>
    </el-image>
  </div>
</template>

<script setup>
/**
 * 商品图片：懒加载 + 占位 shimmer + 失败兜底 + 点击预览（规范 §8.1、清单）
 * props: src / alt / lazy / preview / fallback
 */
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  lazy: { type: Boolean, default: true },
  preview: { type: Boolean, default: false },
  fallback: { type: String, default: '' }
})
</script>

<style scoped lang="scss">
.base-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg-subtle);

  &__inner {
    width: 100%;
    height: 100%;
    display: block;
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #fafafa 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: base-image-shimmer 1.4s ease infinite;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    width: 100%;
    height: 100%;
    background: var(--color-bg-subtle);
  }

  &__error-text {
    font-size: var(--fs-caption);
    color: var(--color-text-3);
  }

  &__fallback {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@keyframes base-image-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
</style>
