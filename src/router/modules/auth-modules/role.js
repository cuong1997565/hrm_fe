export default[
  {
    path: 'role',
    name: 'role',
    meta: {
      title: {
        i18n: 'title.role.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/role/Index')
  },
  {
    path: 'role/create',
    name: 'role-create',
    meta: {
      title: {
        i18n: 'title.role.create'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/role',
          meta: {
            title: {
              i18n: 'title.role.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/role/Create')
  },
  {
    path: 'role/:id',
    name: 'role-detail',
    meta: {
      title: {
        i18n: 'title.role.detail'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/role',
          meta: {
            title: {
              i18n: 'title.role.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/role/Detail')
  },
  {
    path: 'role/:id/edit',
    name: 'role-edit',
    meta: {
      title: {
        i18n: 'title.role.edit'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/role',
          meta: {
            title: {
              i18n: 'title.role.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/role/Edit')
  }
]
