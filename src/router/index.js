import { createRouter, createWebHistory } from 'vue-router'
import SplashScreen from '../components/SplashScreen.vue'
import TestComponent from '../components/TestComponent.vue'
import List from '../components/List.vue'


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
  },
  {
    path: '/list',
    name: 'list',
    component: List,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router