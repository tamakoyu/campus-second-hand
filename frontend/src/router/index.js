// 路由表：全部懒加载（《前端目录结构说明》§3）
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import { setupGuards } from './guards'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: () => import('@/views/Home/index.vue'), meta: { title: '首页' } },
      { path: 'products', name: 'goods-list', component: () => import('@/views/GoodsList/index.vue'), meta: { title: '商品列表' } },
      { path: 'product/:id', name: 'goods-detail', component: () => import('@/views/GoodsDetail/index.vue'), meta: { title: '商品详情' } },
      { path: 'center', name: 'profile', component: () => import('@/views/Profile/index.vue'), meta: { title: '个人中心', requiresAuth: true } },
      { path: 'publish', name: 'publish', component: () => import('@/views/Publish/index.vue'), meta: { title: '发布商品', requiresAuth: true } },
      { path: 'message', name: 'message', component: () => import('@/views/Message/index.vue'), meta: { title: '私信', requiresAuth: true } },
      { path: 'components', name: 'component-demo', component: () => import('@/views/ComponentDemo/index.vue'), meta: { title: '组件示例' } }
    ]
  },
  {
    path: '/login',
    component: BlankLayout,
    children: [{ path: '', name: 'login', component: () => import('@/views/Login/index.vue'), meta: { title: '登录' } }]
  },
  {
    path: '/register',
    component: BlankLayout,
    children: [{ path: '', name: 'register', component: () => import('@/views/Register/index.vue'), meta: { title: '注册' } }]
  },
  {
    path: '/admin',
    // 管理后台暂用空布局，徐家凯开发时可按需替换为后台专用布局
    component: BlankLayout,
    children: [{ path: '', name: 'admin', component: () => import('@/views/Admin/index.vue'), meta: { title: '管理后台', requiresAuth: true, requiresAdmin: true } }]
  },
  {
    path: '/404',
    component: BlankLayout,
    children: [{ path: '', name: 'not-found', component: () => import('@/views/NotFound/index.vue'), meta: { title: '页面不存在' } }]
  },
  { path: '/:pathMatch(.*)*', redirect: '/404' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

setupGuards(router)

export default router
