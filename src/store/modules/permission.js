import {
  SET_PERMISSION,
  SET_ALL_PERMISSION,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    permissions: {},
    allPermission: {}
  }
}

/**
 * state
 */
const state = {
  permissions: initState().permissions,
  allPermission: initState().allallPermission
}

/**
 * actions
 */
const actions = {
  setPermissons ({ commit }, payload) {
    let { permissions } = payload || {}
    if (permissions) {
      commit(SET_PERMISSION, permissions)
    }
  },
  getAllPermission ({ commit, dispatch }, payload) {
    let { params } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `permissions`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_ALL_PERMISSION, response.data)
        }
      }
    )
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_PERMISSION]: (state, permissions) => {
    state.permissions = permissions
  },
  [SET_ALL_PERMISSION]: (state, permissions) => {
    state.allPermission = permissions
  },
  [SET_INITIAL_STATE]: (state) => {
    state.permissions = initState().permissions
    state.allPermission = initState().allallPermission
  }
}

/**
 * getters
 */
const getters = {
  // permission of current loged user
  permissions: (state) => state.permissions,
  // permission of system
  allPermission: (state) => state.allPermission
}

export default {
  state,
  actions,
  mutations,
  getters
}
