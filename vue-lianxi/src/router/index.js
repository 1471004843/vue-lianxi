import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/register/register.vue'
import Console from '../views/Layout/index.vue'
import ConsoleIndex from '../views/Console/console.vue'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect:"register"
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/console',
    name: 'console',
    component: Console,
    children:[
      {
        path: '/console',
        name: 'console',
        component: ConsoleIndex
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})
export default router
