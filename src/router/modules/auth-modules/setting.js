export default[
  {
    path: 'setting',
    name: 'setting',
    meta: {
      title: {
        i18n: 'title.setting.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/setting/Index')
  }
]
