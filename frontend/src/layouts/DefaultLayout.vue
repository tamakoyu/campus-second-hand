<template>
  <div class="layout">
    <!-- 顶部导航：品牌 + 导航 + 搜索 + 用户信息（《前端目录结构说明》步骤 2） -->
    <header class="layout-header">
      <div class="page-container layout-header__inner">
        <router-link to="/" class="brand" aria-label="返回首页">
          <span class="brand__badge">AI</span>
          <span class="brand__name">校园二手</span>
        </router-link>

        <nav class="nav" aria-label="主导航">
          <router-link to="/" class="nav__item" :class="{ 'is-active': $route.name === 'home' }">首页</router-link>
          <router-link to="/products" class="nav__item" :class="{ 'is-active': ['goods-list', 'goods-detail'].includes($route.name) }">逛一逛</router-link>
        </nav>

        <div class="search">
          <el-input
            v-model="keyword"
            class="search__input"
            placeholder="搜索想要的闲置好物"
            clearable
            @keyup.enter="onSearch"
            @clear="onSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="user">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown trigger="click" @command="onCommand">
              <button class="user__trigger" type="button">
                <span class="user__avatar">{{ avatarText }}</span>
                <span class="user__name">{{ userStore.displayName }}</span>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="center">个人中心</el-dropdown-item>
                  <el-dropdown-item command="publish">
                    <el-icon class="dropdown-icon"><Plus /></el-icon>发布闲置
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-ghost">登录</router-link>
            <router-link to="/register" class="btn-primary">注册</router-link>
          </template>
        </div>
      </div>
    </header>

    <main class="page-main">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="layout-footer">
      <div class="page-container layout-footer__inner">
        <p class="layout-footer__title">AI 智能校园二手交易平台</p>
        <p class="layout-footer__meta">学号实名 · 信用担保 · AI 赋能 · 绿色减碳</p>
        <p class="layout-footer__copy">让闲置流转更简单</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const keyword = ref('')

const avatarText = computed(() => (userStore.displayName || '同').slice(0, 1))

// 搜索：跳转列表页并携带关键词（URL 参数同步，规范 §8.5）
function onSearch() {
  const kw = keyword.value.trim()
  router.push({ path: '/products', query: kw ? { keyword: kw } : {} })
}

function onCommand(command) {
  if (command === 'center') {
    router.push('/center')
  } else if (command === 'publish') {
    router.push('/publish')
  } else if (command === 'logout') {
    userStore.logout().then(() => {
      ElMessage({ message: '已退出登录', type: 'success' })
      router.push('/')
    })
  }
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--layout-header-height);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-divider);

  &__inner {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    height: 100%;
  }
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;

  &__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 24px;
    border-radius: var(--radius-sm);
    background: var(--color-ai);
    color: var(--color-text-inverse);
    font-size: var(--fs-caption);
    font-weight: var(--fw-bold);
    letter-spacing: 0.02em;
  }

  &__name {
    font-size: var(--fs-title-sm);
    font-weight: var(--fw-semibold);
    letter-spacing: 0.04em;
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;

  &__item {
    position: relative;
    padding: var(--space-2) var(--space-3);
    font-size: var(--fs-body);
    font-weight: var(--fw-medium);
    color: var(--color-text-2);
    border-radius: var(--radius-md);
    transition: color var(--duration-fast) var(--ease-standard);

    &:hover {
      color: var(--color-primary);
    }

    &.is-active {
      color: var(--color-primary);

      &::after {
        content: '';
        position: absolute;
        left: var(--space-3);
        right: var(--space-3);
        bottom: 0;
        height: 2px;
        background: var(--color-primary);
        border-radius: var(--radius-full);
      }
    }
  }
}

.search {
  flex: 1;
  max-width: 420px;
  margin-left: auto;

  &__input {
    :deep(.el-input__wrapper) {
      border-radius: var(--radius-full);
      box-shadow: 0 0 0 1px var(--color-border) inset;
      background: var(--color-bg-subtle);
      padding: 0 var(--space-4);

      &.is-focus {
        box-shadow: 0 0 0 1px var(--color-primary) inset, var(--focus-ring);
      }
    }
  }
}

.user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;

  &__trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    transition: background var(--duration-fast) var(--ease-standard);

    &:hover {
      background: var(--color-bg-subtle);
    }
  }

  &__avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    color: var(--color-text-inverse);
    font-size: var(--fs-aux);
    font-weight: var(--fw-medium);
  }

  &__name {
    max-width: 96px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--fs-body);
    font-weight: var(--fw-medium);
  }
}

.btn-ghost,
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 var(--space-4);
  font-size: var(--fs-body);
  font-weight: var(--fw-medium);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-standard);
}

.btn-ghost {
  color: var(--color-text-2);

  &:hover {
    color: var(--color-primary);
    background: var(--color-bg-subtle);
  }
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);

  &:hover {
    background: var(--color-primary-hover);
  }
}

.dropdown-icon {
  margin-right: var(--space-1);
  vertical-align: -2px;
}

.layout-footer {
  margin-top: var(--space-12);
  background: var(--color-bg-subtle);
  border-top: 1px solid var(--color-divider);

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    min-height: var(--layout-footer-height);
    text-align: center;
  }

  &__title {
    font-size: var(--fs-body);
    font-weight: var(--fw-medium);
    color: var(--color-text-1);
  }

  &__meta {
    font-size: var(--fs-caption);
    color: var(--color-text-3);
  }

  &__copy {
    font-size: var(--fs-caption);
    color: var(--color-text-3);
  }
}
</style>
