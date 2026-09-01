<template>
  <div v-show="visible" class="ai-panel">
    <div class="ai-panel__bar" />
    <div v-if="summaryText || closable" class="ai-panel__head">
      <AiBadge size="sm" />
      <p v-if="summaryText" class="ai-panel__summary">{{ summaryText }}</p>
      <button v-if="closable" type="button" class="ai-panel__close" aria-label="关闭" @click="emit('close')">
        <el-icon><Close /></el-icon>
      </button>
    </div>
    <div class="ai-panel__body"><slot /></div>
    <div v-if="$slots.footer" class="ai-panel__foot"><slot name="footer" /></div>
    <p class="ai-panel__disclaimer">内容由 AI 生成，仅供参考，请与卖家核实</p>
  </div>
</template>

<script setup>
/**
 * AI 面板外壳：顶部 2px 黑条 + 商品上下文摘要 + 内容插槽 + 免责声明（规范 §9）
 * props: visible / goodsSummary(String|{title,price,conditionName}) / closable（右上角关闭按钮）
 * event: close；slot: default / footer
 */
import { computed } from 'vue'
import { Close } from '@element-plus/icons-vue'
import AiBadge from '@/components/business/AiBadge/index.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  goodsSummary: { type: [String, Object], default: '' },
  closable: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const summaryText = computed(() => {
  const s = props.goodsSummary
  if (!s) return ''
  if (typeof s === 'string') return s
  const parts = [s.title]
  if (s.price != null) parts.push('¥' + (Number(s.price) / 100).toLocaleString('zh-CN'))
  if (s.conditionName) parts.push(s.conditionName)
  return parts.filter(Boolean).join(' · ')
})
</script>

<style scoped lang="scss">
.ai-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-ai);

  &__bar {
    height: 2px;
    background: var(--color-ai);
  }

  &__head {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--color-ai-soft);
    border-bottom: 1px solid var(--color-divider);
  }

  &__summary {
    flex: 1;
    min-width: 0;
    font-size: var(--fs-aux);
    line-height: var(--lh-aux);
    color: var(--color-text-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border-radius: var(--radius-sm);
    color: var(--color-text-3);
    transition: color var(--duration-fast) var(--ease-standard),
      background var(--duration-fast) var(--ease-standard);

    &:hover {
      color: var(--color-primary);
      background: var(--color-bg-subtle);
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  &__foot {
    padding: var(--space-3) var(--space-4);
    border-top: 1px solid var(--color-divider);
  }

  &__disclaimer {
    padding: var(--space-2) var(--space-4) var(--space-3);
    font-size: var(--fs-caption);
    line-height: var(--lh-caption);
    color: var(--color-text-3);
  }
}
</style>
