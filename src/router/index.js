import { createRouter, createWebHistory } from 'vue-router'
import SplashScreen from '../components/SplashScreen.vue'
import TestComponent from '../components/TestComponent.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: SplashScreen
  },
  {
    path: '/test',
    name: 'test',
    component: TestComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router