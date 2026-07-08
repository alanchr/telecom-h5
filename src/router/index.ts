import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/app'

/**
 * 路由配置
 * 四个页面：登录、授权、套餐、结果
 * 路由守卫确保流程前置条件
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/pages/Auth.vue'),
    meta: { title: '身份授权' }
  },
  {
    path: '/plan',
    name: 'Plan',
    component: () => import('@/pages/Plan.vue'),
    meta: { title: '套餐选择' }
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/pages/Result.vue'),
    meta: { title: '办理结果' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局前置守卫
 * 确保用户按照流程顺序访问页面
 */
router.beforeEach((to, _from) => {
  const store = useAppStore()

  // 未登录时只能访问登录页
  if (!store.isLoggedIn && to.name !== 'Login') {
    return { name: 'Login' }
  }

  // 已登录但未授权，只能访问授权页或登录页
  if (store.isLoggedIn && !store.isAuthorized && to.name !== 'Auth' && to.name !== 'Login') {
    return { name: 'Auth' }
  }

  // 已授权但手机号未验证，只能访问授权页
  if (store.isAuthorized && !store.isPhoneVerified && to.name !== 'Auth' && to.name !== 'Login') {
    return { name: 'Auth' }
  }

  // 手机号已验证但未选套餐，只能访问套餐页或授权页
  if (store.isPhoneVerified && !store.selectedPlan && to.name !== 'Plan' && to.name !== 'Auth' && to.name !== 'Login') {
    return { name: 'Plan' }
  }

  // 已选套餐但未获取测评结果，只能访问结果页
  if (store.selectedPlan && !store.creditResult && to.name !== 'Result' && to.name !== 'Plan' && to.name !== 'Auth' && to.name !== 'Login') {
    return { name: 'Result' }
  }

  // 已登录用户访问登录页时，重定向到当前流程位置
  if (store.isLoggedIn && to.name === 'Login') {
    if (!store.isAuthorized) return { name: 'Auth' }
    if (!store.isPhoneVerified) return { name: 'Auth' }
    if (!store.selectedPlan) return { name: 'Plan' }
    if (!store.creditResult) return { name: 'Result' }
    return { name: 'Result' }
  }

  return true
})

export default router
