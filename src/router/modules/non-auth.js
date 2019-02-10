export default {
  path: '/guest',
  component: () => import('@/App'),
  children: [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: {
          i18n: 'title.login'
        },
        guest: true
      },
      component: () => import('@/views/account/Index')
    }
  ]
}
