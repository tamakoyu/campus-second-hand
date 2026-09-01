<template>
  <div class="ai-chat">
    <div class="ai-chat__head">
      <div class="ai-chat__head-left">
        <AiBadge size="sm" />
        <span class="ai-chat__head-title">AI 智能问答</span>
      </div>
      <button v-if="messages.length" type="button" class="ai-chat__clear" @click="emit('clear')">清空</button>
    </div>

    <div ref="listRef" class="ai-chat__list" aria-live="polite">
      <div v-for="(msg, i) in messages" :key="i" class="ai-chat__row" :class="'ai-chat__row--' + msg.role">
        <div class="ai-chat__bubble">
          <span v-if="msg.role === 'assistant' && isTyping(i)" class="ai-chat__typing-dots">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </span>
          <template v-else>{{ displayText(msg, i) }}</template>
        </div>
        <div v-if="msg.role === 'assistant' && (msg.fallback || msg.suggestManual)" class="ai-chat__actions">
          <el-button size="small" @click="transfer">
            <el-icon class="ai-chat__actions-icon"><ChatDotRound /></el-icon>转人工私信
          </el-button>
        </div>
      </div>
      <div v-if="loading" class="ai-chat__row ai-chat__row--assistant">
        <div class="ai-chat__bubble ai-chat__typing-dots">
          <span class="dot" /><span class="dot" /><span class="dot" />
        </div>
      </div>
    </div>

    <div v-if="quickQuestions && quickQuestions.length" class="ai-chat__quick">
      <button v-for="q in quickQuestions" :key="q" type="button" class="ai-chat__quick-btn" @click="send(q)">
        {{ q }}
      </button>
    </div>

    <div class="ai-chat__input">
      <el-input
        v-model="draft"
        type="textarea"
        :rows="1"
        autosize
        maxlength="500"
        placeholder="问问 AI 关于这个商品…（Enter 发送，Shift+Enter 换行）"
        @keydown.enter.exact.prevent="send(draft)"
      />
      <el-button type="primary" :disabled="!draft.trim() || loading" @click="send(draft)">发送</el-button>
    </div>
    <p class="ai-chat__disclaimer">内容由 AI 生成，仅供参考，请与卖家核实</p>
  </div>
</template>

<script setup>
/**
 * AI 问答聊天容器：消息列表 + 输入区 + 快捷问题 + 打字机动画 + 转人工（规范 §9、清单）
 * 非流式：回答一次性返回，打字动画由本组件逐字模拟（联调约定 §5）。
 * props: messages([{role, content, fallback?, suggestManual?}]) / loading / quickQuestions(string[])
 * event: send(text) / transferHuman({question}) / clear
 */
import { ref, reactive, watch, nextTick, onBeforeUnmount } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import AiBadge from '@/components/business/AiBadge/index.vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  quickQuestions: { type: Array, default: () => [] }
})
const emit = defineEmits(['send', 'transferHuman', 'clear'])

const draft = ref('')
const listRef = ref(null)
// 打字机：记录每条 assistant 消息已显示的字数（index -> 已渲染文本）
const typed = reactive({})
let timer = null

watch(
  () => props.messages,
  (msgs) => {
    if (!msgs.length) {
      Object.keys(typed).forEach((k) => delete typed[k])
      return
    }
    const lastIdx = msgs.length - 1
    const last = msgs[lastIdx]
    // 仅当最后一条是 assistant 且尚未打完时才启动打字机
    if (last && last.role === 'assistant' && (typed[lastIdx] || '').length < last.content.length) {
      clearTimeout(timer)
      typed[lastIdx] = typed[lastIdx] || ''
      let i = typed[lastIdx].length
      const step = () => {
        i = Math.min(i + 2, last.content.length)
        typed[lastIdx] = last.content.slice(0, i)
        scrollToBottom()
        if (i < last.content.length) timer = setTimeout(step, 24)
      }
      timer = setTimeout(step, 80)
    }
    scrollToBottom()
  },
  { deep: true }
)

watch(() => props.loading, (l) => { if (l) scrollToBottom() })

onBeforeUnmount(() => clearTimeout(timer))

function displayText(msg, i) {
  if (msg.role === 'assistant' && typed[i] !== undefined) return typed[i]
  return msg.content
}

function isTyping(i) {
  const m = props.messages[i]
  return !!m && m.role === 'assistant' && typed[i] !== undefined && typed[i].length < m.content.length
}

function scrollToBottom() {
  nextTick(() => {
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
  })
}

function send(text) {
  const t = String(text || '').trim()
  if (!t || props.loading) return
  emit('send', t)
  draft.value = ''
}

function transfer() {
  const lastUser = [...props.messages].reverse().find((m) => m.role === 'user')
  emit('transferHuman', { question: lastUser ? lastUser.content : '' })
}
</script>

<style scoped lang="scss">
.ai-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 360px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-divider);
  }

  &__head-left {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__head-title {
    font-size: var(--fs-body);
    font-weight: var(--fw-medium);
  }

  &__clear {
    font-size: var(--fs-aux);
    color: var(--color-text-3);
    transition: color var(--duration-fast) var(--ease-standard);

    &:hover {
      color: var(--color-text-1);
    }
  }

  &__list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--space-4);
    background: var(--color-bg-page);
  }

  &__row {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--space-3);

    &--user {
      align-items: flex-end;

      .ai-chat__bubble {
        background: var(--color-primary);
        color: var(--color-text-inverse);
        border-bottom-right-radius: var(--radius-sm);
      }
    }

    &--assistant {
      align-items: flex-start;

      .ai-chat__bubble {
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border);
        border-bottom-left-radius: var(--radius-sm);
      }
    }
  }

  &__bubble {
    max-width: 84%;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-lg);
    font-size: var(--fs-body);
    line-height: var(--lh-body);
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__actions {
    margin-top: var(--space-2);
  }

  &__actions-icon {
    margin-right: 2px;
    vertical-align: -2px;
  }

  &__typing-dots {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 18px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: var(--radius-full);
      background: var(--color-text-3);
      animation: ai-chat-dot 1.2s infinite ease-in-out;

      &:nth-child(2) { animation-delay: 0.15s; }
      &:nth-child(3) { animation-delay: 0.3s; }
    }
  }

  &__quick {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border-top: 1px solid var(--color-divider);
  }

  &__quick-btn {
    padding: var(--space-1) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    font-size: var(--fs-aux);
    color: var(--color-text-2);
    background: var(--color-bg-surface);
    transition: all var(--duration-fast) var(--ease-standard);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  &__input {
    display: flex;
    align-items: flex-end;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border-top: 1px solid var(--color-divider);
    background: var(--color-bg-surface);

    :deep(.el-textarea__inner) {
      border-radius: var(--radius-md);
      box-shadow: 0 0 0 1px var(--color-border) inset;
      padding: 9px var(--space-3);

      &:focus {
        box-shadow: 0 0 0 1px var(--color-primary) inset, var(--focus-ring);
      }
    }
  }

  &__disclaimer {
    padding: 0 var(--space-4) var(--space-3);
    font-size: var(--fs-caption);
    color: var(--color-text-3);
  }
}

@keyframes ai-chat-dot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-3px); opacity: 1; }
}
</style>
