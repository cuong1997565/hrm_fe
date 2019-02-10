export default[
  {
    path: 'plans',
    name: 'plans-hrm',
    meta: {
      title: {
        i18n: 'title.plan.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/plansHrm/Index')
  },
  {
    path: 'plans/create',
    name: 'plan-hrm-create',
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
    component: () => import('@/views/plansHrm/Create')
  },
  {
    path: 'plan/:id',
    name: 'plan-hrm-detail',
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
    component: () => import('@/views/plansHrm/Detail')
  },
  {
    path: 'plans/:id/edit',
    name: 'plan-hrm-edit',
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
    component: () => import('@/views/plansHrm/Edit')
  }
]
