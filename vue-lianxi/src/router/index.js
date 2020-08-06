import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
// 引入布局组件
import Layout from '../views/Layout/index.vue';
const routes = [
  // 主页
  {
    path: '/',
    redirect: "register",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  // 登录
  {
    path: '/register',
    name: 'register',
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import('../views/register/register.vue')
  },
  // 控制台
  {
    path: '/console',
    name: 'console',
    redirect: "index",
    meta: {
      name: "控制台"
  },
    component: Layout,
    children: [
      {
        path: '/index',
        name: 'index',
        meta: {
          name: "首页"
        },
        component: () => import('../views/Console/console.vue')
      },
    ]
  },
  // 信息管理
  {
    path: '/info',
    name: 'Info',
    meta: {
      name: "信息管理"
    },
    component: Layout,
    children: [
      {
        path: '/infoList',
        name: 'infoList',
        meta: {
          name: "信息列表"
        },
        component: () => import("../views/Info/InfoList.vue")
      },

        {
          path: '/infoCategory',
          name: 'infoCategory',
          meta: {
            name: "信息分类"
          },
        component:() => import("../views/Info/InfoCategory.vue") 
      },
    ]
  },
  //用户管理
  {
    path: '/user',
    name: 'user',
    meta: {
      name: "用户管理"
    },
    component: Layout,
    children: [
      {
        path: '/userList',
        name: 'userList',
        meta: {
          name: "用户列表"
        },
        component: () => import("../views/User/UserList.vue")
      },
    ]
  },
  
]

const router = new VueRouter({
  routes
})
export default router
