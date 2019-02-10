import ls from 'local-storage'
import {
  SET_LOGGED,
  SET_PROFILE,
  SET_INITIAL_STATE
} from '../mutation-types'
import { forEach } from 'lodash'

const initState = () => {
  return {
    logged: false,
    profile: {}
  }
}

/**
 * state
 */
const state = {
  logged: initState().logged,
  profile: initState().profile
}

/**
 * actions
 */
const actions = {
  checkLogged ({ commit }, payload) {
    let auth = ls('auth') || {}
    commit(SET_LOGGED, !!auth.access_token)
  },
  setLogged ({ commit }, payload) {
    payload = payload || {}
    ls('auth', payload)
    commit(SET_LOGGED, !!payload.token)
  },
  clearLogged ({ commit, dispatch }, payload) {
    ls.remove('auth')
    commit(SET_LOGGED, false)
    dispatch('resetState', { root: true })
  },
  getProfile ({ commit, dispatch }, payload) {
    let { params } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: 'profile',
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_PROFILE, response.data)
          if (response.data.setting) {
            dispatch('Setting/setSetting', { settings: response.data.setting.data })
          }
          if (response.data.roles) {
            let permissions = {}
            forEach(response.data.roles.data, (role) => {
              permissions = { ...permissions, ...role.permissions }
            })
            dispatch('setPermissons', { permissions })
          }
        }
      },
      { root: true }
    )
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_LOGGED]: (state, logged) => {
    state.logged = logged
  },
  [SET_PROFILE]: (state, profile) => {
    state.profile = profile
  },
  [SET_INITIAL_STATE]: (state) => {
    state.logged = initState().logged
    state.profile = initState().profile
  }
}

/**
 * getters
 */
const getters = {
  isLogged: (state) => state.logged,
  userProfile: (state) => state.profile
}

export default {
  state,
  actions,
  mutations,
  getters
}
