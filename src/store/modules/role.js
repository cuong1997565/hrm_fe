import {
  SET_ROLE,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    role: {}
  }
}

/**
 * state
 */
const state = {
  role: initState().role
}

/**
 * actions
 */
const actions = {
  setRole ({ commit }, payload) {
    let { role } = payload || {}
    commit(SET_ROLE, role)
  },
  getRole ({ commit, dispatch }, payload) {
    let { roleId, params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `roles/${roleId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_ROLE, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  createRole ({ commit, dispatch }, payload) {
    let { role, cb } = payload || {}
    dispatch('fetchApi', {
      url: 'roles',
      method: 'POST',
      data: role,
      success: cb
    }, { root: true })
  },
  updateRole ({ commit, dispatch }, payload) {
    let { id, role, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `roles/${id}`,
      method: 'PUT',
      data: role,
      success: cb,
      error: error
    }, { root: true })
  },
  deleteRole ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `roles/${id}`,
      method: 'DELETE',
      success: cb,
      error: error
    }, { root: true })
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_ROLE]: (state, role) => {
    state.role = role
  },
  [SET_INITIAL_STATE]: (state) => {
    state.role = initState().role
  }
}

/**
 * getters
 */
const getters = {
  roleDetail: (state) => state.role
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
