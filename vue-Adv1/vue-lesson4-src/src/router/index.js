import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

// createWebHistory(process.env.BASE_URL),
console.log(process.isServer);

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
