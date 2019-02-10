import * as modules from './auth-modules/'
import { flatten } from 'lodash'
console.log(modules)
export default {
  path: '/',
  redirect: '/home',
  component: () => import('@/Auth'),
  name: 'layoutAuth',
  meta: {
    title: {
      i18n: 'title.home'
    },
    require_auth: true,
    breadcrumb: [
    ]
  },
  children: [
    {
      path: 'home',
      name: 'home',
      meta: {
        title: {
          i18n: 'title.home'
        },
        require_auth: true,
        breadcrumb: [
        ]
      },
      component: () => import('@/views/Home')
    },
    ...flatten(Object.values(modules))
  ]
}
