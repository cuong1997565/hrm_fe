export default[
  {
    path: 'position',
    name: 'position',
    meta: {
      title: {
        i18n: 'title.position.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/position/Index')
  }
]
