import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import NotFound from '../views/404'
import Login from '../views/Login'
import Register from '../views/Register'
import Admin from '../views/Admin'
import Me from '../views/Me'
import Message from '../views/Message'
import Study from '../views/Study'
import Article from '../views/Article'
import AddArticle from '../components/AddArticle'
import HandleArticle from '../components/HandleArticle'
import AddStudy from '../components/AddStudy'
import HandleStudy from '../components/HandleStudy'
import HandleMessage from '../components/HandleMessage'
import AdminHome from '../components/AdminHome'
import Info from '../components/Info'
import AddNotice from '../components/AddNotice'
import AddLinks from '../components/AddLinks'
import AddAutograph from '../components/AddAutograph'
import HandleAutograph from '../components/HandleAutograph'
import HandleNotice from '../components/HandleNotice'
import HandleLinks from '../components/HandleLinks'


Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Index
  },
  {
    path: '*',
    name: '404',
    component: NotFound
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path:'/admin',
    name:'admin',
    component:Admin,
    children:[
      {
        path:'/admin',
        name:'首页',
        component:AdminHome
      },
      {
        path:'/ad-article/add',
        name:'新增文章',
        component:AddArticle
      },
      {
        path:'/ad-article/handle',
        name:'文章管理',
        component:HandleArticle
      },
      {
        path:'/ad-study/add',
        name:'学习添加',
        component:AddStudy
      },
      {
        path:'/ad-study/handle',
        name:'学习管理',
        component:HandleStudy
      },
      {
        path:'/ad-message/handle',
        name:'留言管理',
        component:HandleMessage
      },
      {
        path:'/notice/add',
        name:'添加公告',
        component:AddNotice
      },
      {
        path:'/links/add',
        name:'添加链接',
        component:AddLinks
      },
      {
        path:'/autograph/add',
        name:'添加签名',
        component:AddAutograph
      },
      {
        path:'/notice/handle',
        name:'公告管理',
        component:HandleNotice
      },
      {
        path:'/links/handle',
        name:'链接管理',
        component:HandleLinks
      },
      {
        path:'/autograph/handle',
        name:'签名管理',
        component:HandleAutograph
      },
      {
        path:'/info',
        name:'个人信息',
        component:Info
      }
    ]
  },
  {
    path:'/study',
    name:'study',
    component:Study
  },
  {
    path:'/message',
    name:'message',
    component:Message
  },
  {
    path:'/me',
    name:'me',
    component:Me
  },
  {
    path:'/article/:id',
    name:'article',
    component:Article
  }
]

//解决element-ui点击路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode:'history',//锚点地位时url不会改变，刷新时页面不会空白
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false
  if (to.path != '/admin') {
      next()
  } else {
      isLogin ? next() : next('/login')
  }
})

export default router
 