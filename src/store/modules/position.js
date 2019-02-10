import {
  SET_POSITION,
  SET_INITIAL_STATE
} from '../mutation-types'
import { getField, updateField } from 'vuex-map-fields'

const initState = () => {
  return {
    position: [],
    params: {
      q: ''
    }

  }
}

/**
 * state
 */
const state = {
  position: initState().position,
  params: initState().params

}

/**
 * actions
 */
const actions = {
  setPosition ({ commit }, payload) {
    let { position } = payload || {}
    commit(SET_POSITION, position)
  },
  fetchPosition ({ commit, dispatch }, payload) {
    let { params, cb } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `positions`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_POSITION, response.data)
          cb(response.data)
          console.log("data response :", response.data);
        }
      },
      { root: true }
    )
  },
  getPosition ({ commit, dispatch }, payload) {
    let { positionId, params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `positions/${positionId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_POSITION, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  createPosition ({ commit, dispatch }, payload) {
    let { position, cb } = payload || {}
    dispatch('fetchApi', {
      url: 'positions',
      method: 'POST',
      data: position,
      success: cb
    }, { root: true })
  },
  updatePosition ({ commit, dispatch }, payload) {
    let { id, position, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `positions/${id}`,
      method: 'PUT',
      data: position,
      success: cb,
      error: error
    }, { root: true })
  },
  updateStatusPosition ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload
    dispatch('fetchApi', {
      url: `positions/change-status/${id}`,
      method: 'PUT',
      success: cb,
      error: error
    }, { root: true })
  },
  deletePosition ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `positions/${id}`,
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
  [SET_POSITION]: (state, position) => {
    state.position = position
  },
  [SET_INITIAL_STATE]: (state) => {
    state.department = initState().department
    state.position = initState().position
    state.params = initState().params
  },
  resetFilter (state) {
    state.params.q = ''
  },
  updateField
}

/**
 * getters
 */
const getters = {
  positionDetail: (state) => state.position,
  positionAll: (state) => state.position,
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
