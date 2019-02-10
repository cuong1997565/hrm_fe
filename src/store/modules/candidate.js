import {
  SET_CANDIDATE
} from '../mutation-types'
const initState = () => {
  return {
    candidate: {}
  }
}

/**
 * state
 */

const state = {
  candidate: initState().candidate
}

/**
 * actions
 */

const actions = {
  setCandidate ({ commit }, payload) {
    let { candidate } = payload || {}
    commit(SET_CANDIDATE, candidate)
  },
  fetchCandidate ({ commit, dispatch }, payload) {
    let { params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `candidates`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_CANDIDATE, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  getCandidate ({ commit, dispatch }, payload) {
    let { candidateId, params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `candidates/${candidateId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_CANDIDATE, response.data)
          console.log('data SET_CANDIDATE', response)
        },
        error: error
      },
      { root: true }
    )
  },
  createCandidate ({ commit, dispatch }, payload) {
    let { candidate, cb, params } = payload
    dispatch('fetchApi', {
      url: 'candidates',
      method: 'POST',
      data: candidate,
      params: params,
      success: cb
    }, { root: true })
  },
  updateCandidate ({ commit, dispatch }, payload) {
    let { id, candidate, cb, params } = payload
    dispatch('fetchApi', {
      url: `candidates/${id}`,
      method: 'PUT',
      data: candidate,
      params: params,
      success: cb
    }, { root: true })
  },
  deleteCandidate ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `candidates/${id}`,
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
  [SET_CANDIDATE]: (state, candidate) => {
    state.candidate = candidate
  }
}

/**
 * getters
 */
const getters = {
  candidateDetail: (state) => state.candidate,
  candidateAll: (state) => state.candidate
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
