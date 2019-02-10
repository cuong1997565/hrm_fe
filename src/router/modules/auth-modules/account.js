export default[
  {
    path: 'account/change-password',
    name: 'account-change-password',
    meta: {
      title: {
        i18n: 'title.account.change-password'
      },
      require_auth: true
      // breadcrumb: [
      //   {
      //     path: '/account',
      //     meta: {
      //       title: {
      //         i18n: 'title.account.change-password'
      //       }
      //     }
      //   }
      // ]
    },
    component: () => import('@/views/account/ChangePassword')
  },
  {
    path: 'account/change-information',
    name: 'account-change-information',
    meta: {
      title: {
        i18n: 'title.account.change-information'
      },
      require_auth: true
      // breadcrumb: [
      //   {
      //     path: '/account',
      //     meta: {
      //       title: {
      //         i18n: 'title.account.change-information'
      //       }
      //     }
      //   }
      // ]
    },
    component: () => import('@/views/account/ChangeInformation')
  }
]
