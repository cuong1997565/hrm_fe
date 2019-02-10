export default[
  {
    path: 'user',
    name: 'user',
    meta: {
      title: {
        i18n: 'title.user.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/user/Index')
  }
]
