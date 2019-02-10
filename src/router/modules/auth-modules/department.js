export default[
  {
    path: 'department',
    name: 'department',
    meta: {
      title: {
        i18n: 'title.department.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/department/Index')
  },
  {
    path: 'department/create',
    name: 'department-create',
    meta: {
      title: {
        i18n: 'title.department.create'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/department',
          meta: {
            title: {
              i18n: 'title.department.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/department/Create')
  },
  {
    path: 'department/:id',
    name: 'department-detail',
    meta: {
      title: {
        i18n: 'title.department.detail'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/department',
          meta: {
            title: {
              i18n: 'title.department.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/department/Detail')
  },
  {
    path: 'department/:id/edit',
    name: 'department-edit',
    meta: {
      title: {
        i18n: 'title.department.edit'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/department',
          meta: {
            title: {
              i18n: 'title.department.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/department/Edit')
  }
]
