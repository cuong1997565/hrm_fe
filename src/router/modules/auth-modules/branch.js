export default[
  {
    path: '/branch',
    name: 'branch',
    meta: {
      title: {
        i18n: 'title.branch.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/branch/Index')
  },
  {
    path: 'branch/create',
    name: 'branch-create',
    meta: {
      title: {
        i18n: 'title.branch.create'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/branch',
          meta: {
            title: {
              i18n: 'title.branch.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/branch/Create')
  },
  {
    path: 'branch/:id',
    name: 'branch-detail',
    meta: {
      title: {
        i18n: 'title.branch.detail'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/branch',
          meta: {
            title: {
              i18n: 'title.branch.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/branch/Detail')
  },
  {
    path: 'branch/:id/edit',
    name: 'branch-edit',
    meta: {
      title: {
        i18n: 'title.branch.edit'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/branch',
          meta: {
            title: {
              i18n: 'title.branch.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/branch/Edit')
  }
]
