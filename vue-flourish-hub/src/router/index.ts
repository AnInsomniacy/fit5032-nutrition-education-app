import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'

const routes = [
  {path: '/login', component: LoginPage},
  {path: '/', redirect: '/login'}
]

export default createRouter({
  history: createWebHistory(),
  routes
})
