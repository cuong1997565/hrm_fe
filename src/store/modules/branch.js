import {
  SET_INITIAL_STATE,
  SET_BRANCHS,
  SET_BRANCH
} from '../mutation-types'
import { getField, updateField } from 'vuex-map-fields'
const initState = () => {
  return {
    branchs: [],
    branch: {},
    params: {
      q: '',
      cityId: '',
      districtId: '',
      sort: 'type:-1,status:-1,id:-1'
    }
  }
}

const state = {
  branchs: initState().branchs,
  branch: initState().branch,
  params: initState().params
}
const actions = {
  setBranch ({ commit }, payload) {
    let { branchs } = payload
    commit(SET_BRANCHS, branchs)
  },
  getBranchs ({ commit, dispatch }, payload) {
    let { cb, params } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `branches`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_BRANCHS, response.data)
          cb(response.data)
        }
      },
      { root: true }
    )
  },
  getBranch ({ commit, dispatch }, payload) {
    let { branchId, params } = payload
    dispatch(
      'fetchApi',
      {
        url: `branches/${branchId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_BRANCH, response.data)
          console.log('data get branch ', response.data)
        }
      },
      { root: true }
    )
  },
  getBranchForUser ({ commit, dispatch }, payload) {
    dispatch(
      'fetchApi',
      {
        url: `branches`,
        method: 'GET',
        success: (response) => {
          commit(SET_BRANCHS, response.data)
        }
      },
      { root: true }
    )
  },
  createBranch ({ commit, dispatch }, payload) {
    let { error, branch, cb, params } = payload
    dispatch('fetchApi', {
      url: 'branches',
      method: 'POST',
      data: branch,
      params: params,
      success: cb,
      error: error
    }, { root: true })
  },
  updateBranch ({ commit, dispatch }, payload) {
    let { error, id, branch, cb, params } = payload || {}
    dispatch('fetchApi', {
      url: `branches/${id}`,
      method: 'PUT',
      data: branch,
      params: params,
      success: cb,
      error: error
    }, { root: true })
  },
  updateTypeBranch ({ commit, dispatch }, payload) {
    let { id, branch, cb, params } = payload || {}
    dispatch('fetchApi', {
      url: `/branches/change-branch-main/${id}`,
      method: 'PUT',
      data: branch,
      params: params,
      success: cb
    }, { root: true })
  },
  updateStatusBranch ({ commit, dispatch }, payload) {
    let { id, cb } = payload
    dispatch('fetchApi', {
      url: `branches/change-status/${id}`,
      method: 'PUT',
      success: cb
    }, { root: true })
  },
  deleteBranch ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `branches/${id}`,
      method: 'DELETE',
      success: cb,
      error: error
    }, { root: true })
  },
  clearFilter ({ commit }) {
    commit('resetFilter')
  },
  clearFilterCity ({ commit }) {
    commit('clearDistrictByCity')
  }
}
const mutations = {
  [SET_BRANCHS]: (state, branchs) => {
    state.branchs = branchs
  },
  [SET_BRANCH]: (state, branch) => {
    state.branch = branch
  },
  [SET_INITIAL_STATE]: (state) => {
    state.branchs = initState().branchs
    state.branch = initState().branch
    state.params = initState().params
  },
  updateField,
  resetFilter (state) {
    state.params.q = ''
    state.params.cityId = ''
    state.params.districtId = ''
  },
  clearDistrictByCity (state) {
    state.params.districtId = ''
  }

}

const getters = {
  branchAll: (state) => state.branchs,
  branchDetail: (state) => state.branch,
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
