import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login1'
import Home from './components/Home'
import Welcome from './components/Welcome'
import Consumer from './components/common/Consumer'
import RandomExam from './components/common/RandomExam'
import Question from './components/common/Question'
import RecommendExam from './components/common/RecommendExam'
import Record from './components/common/Record'
import Rank from './components/common/Rank'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/consumers', component: Consumer },
        { path: '/question', component: Question },
        { path: '/random', component: RandomExam },
        { path: '/recommend', component: RecommendExam },
        { path: '/record', component: Record },
        { path: '/rank', component: Rank }
      ]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
