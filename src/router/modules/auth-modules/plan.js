export default[
  {
    path: 'plans',
    name: 'plans',
    meta: {
      title: {
        i18n: 'title.plan.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/plans/Index')
  },
  {
    path: 'plans/create',
    name: 'plan-create',
    meta: {
      title: {
        i18n: 'title.plan.create'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/plan',
          meta: {
            title: {
              i18n: 'title.plan.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/plans/Create')
  },
  {
    path: 'plan/:id',
    name: 'plan-detail',
    meta: {
      title: {
        i18n: 'title.plan.detail'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/plan',
          meta: {
            title: {
              i18n: 'title.plan.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/plans/Detail')
  },
  {
    path: 'plans/:id/edit',
    name: 'plan-edit',
    meta: {
      title: {
        i18n: 'title.plan.edit'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/plan',
          meta: {
            title: {
              i18n: 'title.plan.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/plans/Edit')
  }
]
