export default[
  {
    path: 'setting-hrm',
    name: 'setting-hrm',
    meta: {
      title: {
        i18n: 'title.setting.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/settingHrm/Index')
  }
]
