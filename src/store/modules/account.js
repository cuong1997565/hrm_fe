/**
 * state
 */
const state = {
}

/**
 * actions
 */
const actions = {
  changeInformation ({ commit, dispatch }, payload) {
    let { data, cb } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: 'profile',
        method: 'PUT',
        data: data,
        success: cb
      },
      { root: true }
    )
  },
  changePassword ({ commit, dispatch }, payload) {
    let { data, cb } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: 'profile/change-password',
        method: 'PUT',
        data: data,
        success: cb
      },
      { root: true }
    )
  },
  loginFacebook ({ commit, dispatch }, payload) {
    let { params, cb } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: 'login/facebook',
        method: 'GET',
        params: params,
        success: cb
      },
      { root: true }
    )
  }
}

/**
 * mutations
 */
const mutations = {
}

/**
 * getters
 */
const getters = {
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
