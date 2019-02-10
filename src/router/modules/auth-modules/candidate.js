export default[
  {
    path: 'candidate',
    name: 'candidate',
    meta: {
      title: {
        i18n: 'title.candidate.index'
      },
      require_auth: true,
      breadcrumb: []
    },
    component: () => import('@/views/candidate/Index')
  },
  {
    path: 'candidate/create',
    name: 'candidate-create',
    meta: {
      title: {
        i18n: 'title.candidate.create'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/candidate',
          meta: {
            title: {
              i18n: 'title.candidate.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/candidate/Create')
  },
  {
    path: 'candidate/:id',
    name: 'candidate-detail',
    meta: {
      title: {
        i18n: 'title.candidate.detail'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/candidate',
          meta: {
            title: {
              i18n: 'title.candidate.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/candidate/Detail')
  },
  {
    path: 'candidate/:id/edit',
    name: 'candidate-edit',
    meta: {
      title: {
        i18n: 'title.candidate.edit'
      },
      require_auth: true,
      breadcrumb: [
        {
          path: '/candidate',
          meta: {
            title: {
              i18n: 'title.candidate.index'
            }
          }
        }
      ]
    },
    component: () => import('@/views/candidate/Edit')
  }
]
