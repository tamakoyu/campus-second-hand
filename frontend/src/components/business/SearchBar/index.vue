<template>
  <div class="search-bar">
    <el-input
      v-model="kw"
      class="search-bar__input"
      :class="{ 'search-bar__input--round': round }"
      :placeholder="placeholder"
      clearable
      @keyup.enter="doSearch"
      @clear="doSearch"
    >
      <template #prefix><el-icon><Search /></el-icon></template>
    </el-input>

    <el-select v-if="categories && categories.length" v-model="cat" class="search-bar__select" placeholder="全部分类" clearable>
      <el-option v-for="c in categories" :key="c.value" :label="c.label" :value="c.value" />
    </el-select>

    <el-select v-if="sortOptions && sortOptions.length" v-model="srt" class="search-bar__select" placeholder="排序">
      <el-option v-for="s in sortOptions" :key="s.value" :label="s.label" :value="s.value" />
    </el-select>

    <el-button type="primary" class="search-bar__btn" :loading="loading" @click="doSearch">搜索</el-button>
  </div>
</template>

<script setup>
/**
 * 通用搜索栏：关键词 + 分类 + 排序；支持 v-model 双向绑定与路由参数同步（清单）
 * props: modelValue / categories / sortOptions / category / sort / round / placeholder / loading
 * event: search({keyword, category, sort})、update:modelValue / update:category / update:sort
 */
import { computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  categories: { type: Array, default: () => [] },
  sortOptions: { type: Array, default: () => [] },
  category: { type: String, default: '' },
  sort: { type: String, default: '' },
  round: { type: Boolean, default: true },
  placeholder: { type: String, default: '搜索想要的闲置好物' },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'update:category', 'update:sort', 'search'])

const kw = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const cat = computed({
  get: () => props.category,
  set: (v) => emit('update:category', v)
})
const srt = computed({
  get: () => props.sort,
  set: (v) => emit('update:sort', v)
})

function doSearch() {
  emit('search', { keyword: kw.value.trim(), category: cat.value, sort: srt.value })
}
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;

  &__input {
    flex: 1;
    min-width: 0;

    &--round :deep(.el-input__wrapper) {
      border-radius: var(--radius-full);
    }

    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--color-border) inset;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--color-primary) inset, var(--focus-ring);
      }
    }
  }

  &__select {
    width: 132px;
    flex-shrink: 0;
  }

  &__btn {
    flex-shrink: 0;
  }
}
</style>
