import {
  SET_USER,
  SET_USERS,
  SET_INITIAL_STATE
} from '../mutation-types'
import { getField, updateField } from 'vuex-map-fields'
const initState = () => {
  return {
    users: {},
    user: {},
    params: {
      q: '',
      status: '',
      include: 'roles'
    }
  }
}

/**
 * state
 */
const state = {
  users: initState().users,
  user: initState().user,
  params: initState().params
}

/**
 * actions
 */
const actions = {
  setUser ({ commit }, payload) {
    let { users } = payload
    commit(SET_USERS, users)
  },
  getUsers ({ commit, dispatch }, payload) {
    let { params } = payload
    dispatch(
      'fetchApi',
      {
        url: `users`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_USERS, response.data)
        }
      },
      { root: true }
    )
  },
  getUser ({ commit, dispatch }, payload) {
    let { userId, params } = payload
    dispatch(
      'fetchApi',
      {
        url: `users/${userId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_USER, response.data)
        }
      },
      { root: true }
    )
  },
  fetchUser ({ commit, dispatch }, payload) {
    let { params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `users`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_USER, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  createUser ({ commit, dispatch }, payload) {
    let { user, cb, params } = payload
    dispatch('fetchApi', {
      url: 'users',
      method: 'POST',
      data: user,
      params: params,
      success: cb
    }, { root: true })
  },
  updateStatusUser ({ commit, dispatch }, payload) {
    let { id, user, cb } = payload
    dispatch('fetchApi', {
      url: `users/change-status/${id}`,
      method: 'PUT',
      data: user,
      success: cb
    }, { root: true })
  },
  updateUser ({ commit, dispatch }, payload) {
    let { id, user, cb, params } = payload || {}
    dispatch('fetchApi', {
      url: `users/${id}`,
      method: 'PUT',
      data: user,
      params: params,
      success: response => {
        cb && cb(response.data)
      }
    }, { root: true })
  },
  deleteUser ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `users/${id}`,
      method: 'DELETE',
      success: cb,
      error: error
    }, { root: true })
  },
  clearFilter ({ commit }) {
    commit('resetFilter')
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_USERS]: (state, users) => {
    state.users = users
  },
  [SET_USER]: (state, user) => {
    state.user = user
  },
  [SET_INITIAL_STATE]: (state) => {
    state.users = initState().users
    state.user = initState().user
    state.params = initState().params
  },
  updateField,
  resetFilter (state) {
    state.params.q = ''
    state.params.status = ''
  }
}

/**
 * getters
 */
const getters = {
  userDetail: (state) => state.user,
  userAll: (state) => state.users,
  filterParams: (state) => state.params,
  getField
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
