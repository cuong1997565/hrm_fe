import {
  SET_CONTRACTS,
  SET_INITIAL_STATE
} from '../mutation-types'
import { getField, updateField } from 'vuex-map-fields'
const initState = () => {
  return {
    contract: [],
    params: {
      q: '',
      sort: 'id:-1',
      employeeId: '',
      type: '',
      status: '',
      dateSign: '',
      dateExpiration: ''
    }

  }
}

/**
 * state
 */
const state = {
  contract: initState().contract,
  params: initState().params
}

/**
 * actions
 */
const actions = {
  setContract ({ commit }, payload) {
    let { contract } = payload || {}
    commit(SET_CONTRACTS, contract)
  },
  clearFilter ({ commit }) {
    commit('resetFilter')
  },
  fetchContract ({ commit, dispatch }, payload) {
    let { params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `contracts`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_CONTRACTS, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  getContract ({ commit, dispatch }, payload) {
    let { contractId, params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `contracts/${contractId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_CONTRACTS, response.data)
          console.log('data :', response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  createContract ({ commit, dispatch }, payload) {
    let { contract, cb } = payload || {}
    dispatch('fetchApi', {
      url: 'contracts',
      method: 'POST',
      data: contract,
      success: cb
    }, { root: true })
  },
  updateContract ({ commit, dispatch }, payload) {
    let { id, contract, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `contracts/${id}`,
      method: 'PUT',
      data: contract,
      success: cb,
      error: error
    }, { root: true })
  },
  updateStatusContract ({ commit, dispatch }, payload) {
    let { id } = payload
    dispatch('fetchApi', {
      url: `contracts/change-status/${id}`,
      method: 'PUT'
    }, { root: true })
  },
  deleteContract ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    console.log('id contracts :', id)
    dispatch('fetchApi', {
      url: `contracts/${id}`,
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
  [SET_CONTRACTS]: (state, contract) => {
    state.contract = contract
    console.log('SET Contract')
  },
  [SET_INITIAL_STATE]: (state) => {
    state.contract = initState().contract
    state.params = initState().params
    state.date = initState().date
  },
  // resetFilter (state) {
  //   state.params.q = ''
  //   state.params.employeeId = ''
  //   state.params.type = ''
  //   state.params.status = ''
  //   state.params.dateSign = ''
  //   state.params.dateExpiration = ''
  // },
  updateField
}

const getters = {
  contractDetail: (state) => state.contract,
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
