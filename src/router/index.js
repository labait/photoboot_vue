import { createRouter, createWebHistory } from 'vue-router'
import SplashScreen from '../components/SplashScreen.vue'
import TestComponent from '../components/TestComponent.vue'
import List from '../components/List.vue'
import Cam from '../components/Cam.vue'
import Detail from '../components/Detail.vue'

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
    path: '/cam',
    name: 'cam',
    component: Cam
  },
  {
    path: '/list',
    name: 'list',
    component: List,
  },
  {
    path: '/detail/:docId',
    name: 'detail',
    component: Detail,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router