export default[
  {
    path: 'employee',
    name: 'employee',
    meta: {
      title: {
        i18n: 'title.employee.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/employee/Index')
  },
  {
    path: 'employee/create',
    name: 'employee-create',
    meta: {
      title: {
        i18n: 'title.employee.create'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/employee',
          meta: {
            title: {
              i18n: 'title.employee.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/employee/Create')
  },
  {
    path: 'employee/:id',
    name: 'employee-detail',
    meta: {
      title: {
        i18n: 'title.employee.detail'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/employee',
          meta: {
            title: {
              i18n: 'title.employee.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/employee/Detail')
  },
  {
    path: 'employee/:id/edit',
    name: 'employee-edit',
    meta: {
      title: {
        i18n: 'title.employee.edit'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/employee',
          meta: {
            title: {
              i18n: 'title.employee.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/employee/Edit')
  }
]
