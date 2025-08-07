import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {requiresGuest: true}
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: {requiresAuth: true}
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router
