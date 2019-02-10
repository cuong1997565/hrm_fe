export default[
  {
    path: 'contract',
    name: 'contract',
    meta: {
      title: {
        i18n: 'title.contract.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/contracts/Index')
  },
  {
    path: 'contract/detail/:id',
    name: 'contract-detail',
    meta: {
      title: {
        i18n: 'title.contract.detail'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/contract',
          meta: {
            title: {
              i18n: 'title.contract.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/contracts/Detail')
  },
  {
    path: 'contract/create',
    name: 'contract-create',
    meta: {
      title: {
        i18n: 'title.contract.create'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/contract',
          meta: {
            title: {
              i18n: 'title.contract.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/contracts/Create')
  },
  {
    path: 'contract/:id/edit',
    name: 'contract-edit',
    meta: {
      title: {
        i18n: 'title.contract.edit'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/contract',
          meta: {
            title: {
              i18n: 'title.contract.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/contracts/Edit')
  }
]
