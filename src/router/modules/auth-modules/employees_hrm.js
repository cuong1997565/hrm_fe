export default[
  {
    path: 'employees',
    name: 'employee-hrm',
    meta: {
      title: {
        i18n: 'title.employee.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/employeeHrm/Index')
  },
  {
    path: 'employee-hrm/create',
    name: 'employee-create-hrm',
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
    component: () => import('@/views/employeeHrm/Create')
  },
  {
    path: 'employee-hrm/:id',
    name: 'employee-hrm-detail',
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
    component: () => import('@/views/employeeHrm/Detail')
  },
  {
    path: 'employee-hrm/:id/edit',
    name: 'employee-hrm-edit',
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
    component: () => import('@/views/employeeHrm/Edit')
  }
]
