import Vue from 'vue'
import Router from 'vue-router'
import ls from 'local-storage'
import i18n from '@/i18n'
// modules
import * as modules from './modules'
console.log(modules)
Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) {
      return { selector: to.hash }
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    ...Object.values(modules),
    {
      path: '/*',
      meta: {
        title: '404-Trang không tồn tại'
      },
      name: 'notfound',
      component: () => import('@/views/errors/404')
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = itemTitle(to.meta)
  let auth = ls('auth') || {}
  if (to.matched.some(record => record.meta.require_auth) && !auth.access_token) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else if (to.matched.some(record => record.meta.guest && (record.name === 'login' || record.name === 'register')) && auth.access_token) {
    next({
      name: 'home'
    })
  } else {
    next()
  }
})

function itemTitle (item) {
  if (typeof item.title === 'object') {
    return i18n.tc(item.title.i18n)
  } else {
    return item.title
  }
}

export default router
