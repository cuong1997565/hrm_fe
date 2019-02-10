export default[
  {
    path: '/branch',
    name: 'branch-hrm',
    meta: {
      title: {
        i18n: 'title.branch.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/branchHrm/Index')
  },
  {
    path: '/branch-hrm/create',
    name: 'branch-create-hrm',
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
    component: () => import('@/views/branchHrm/Create')
  },
  {
    path: 'branch-hrm/:id',
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
    component: () => import('@/views/branchHrm/Detail')
  },
  {
    path: 'branch-hrm/:id/edit',
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
    component: () => import('@/views/branchHrm/Edit')
  }
]
