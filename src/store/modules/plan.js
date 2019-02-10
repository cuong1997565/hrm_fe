import {
  SET_PLAN,
  SET_INITIAL_STATE
} from '../mutation-types'
import { getField, updateField } from 'vuex-map-fields'
const initState = () => {
  return {
    plan: {},
    params: {
      q: '',
      branchId: '',
      departmentId: '',
      positionId: '',
      status: '',
      date: '',
      dateStart: '',
      dateEnd: '',
      include: 'details.department.branch,candidates',
      sort: 'status:1,id:-1'
    }
  }
}

/**
 * state
 */
const state = {
  plan: initState().plan,
  params: initState().params
}

/**
 * actions
 */
const actions = {
  setPlan ({ commit }, payload) {
    let { plan } = payload || {}
    commit(SET_PLAN, plan)
  },
  fetchPlan ({ commit, dispatch }, payload) {
    let { params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `plans`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_PLAN, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  getPlan ({ commit, dispatch }, payload) {
    let { planId, params, error, cb } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `plans/${planId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_PLAN, response.data)
          cb(response)
        },
        error: error
      },
      { root: true }
    )
  },
  createPlan ({ commit, dispatch }, payload) {
    let { plan, cb } = payload || {}
    dispatch('fetchApi', {
      url: 'plans',
      method: 'POST',
      data: plan,
      success: cb
    }, { root: true })
  },
  updatePlan ({ commit, dispatch }, payload) {
    let { id, plan, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `plans/${id}`,
      method: 'PUT',
      data: plan,
      success: cb,
      error: error
    }, { root: true })
  },
  deletePlan ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `plans/${id}`,
      method: 'DELETE',
      success: cb,
      error: error
    }, { root: true })
  },
  changeStatusPlan ({ commit, dispatch }, payload) {
    let { id, mail, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `plans/change-status-wait/${id}`,
      method: 'PUT',
      data: mail,
      success: cb,
      error: error
    }, { root: true })
  },

  clearFilter ({ commit }) {
    commit('resetFilter')
  },
  clearFilterBranch ({ commit }) {
    commit('clearBranch')
  },
  clearFilterDate ({ commit }) {
    commit('clearDate')
  },
  clearFilterPosition ({ commit }) {
    commit('clearPosition')
  }

}

/**
 * mutations
 */
const mutations = {
  [SET_PLAN]: (state, plan) => {
    state.plan = plan
  },
  [SET_INITIAL_STATE]: (state) => {
    state.params = initState().params
  },
  updateField,
  // clear toàn bộ tính năng lọc
  resetFilter (state) {
    state.params.q = ''
    state.params.branchId = ''
    state.params.departmentId = ''
    state.params.positionId = ''
    state.params.status = ''
    state.params.date = ''
    state.params.dateStart = ''
    state.params.dateEnd = ''
  },
  clearBranch (state) {
    state.params.departmentId = ''
  },
  clearDate (state) {
    state.params.dateEnd = ''
    state.params.dateStart = ''
  }

  // fiterStatus (state, value) {
  //   state.params.status = value
  // },
  // filterStatus (state, value) {
  //   state.params.status = value
  // }
}

/**
 * getters
 */
const getters = {
  planDetail: (state) => state.plan,
  planAll: (state) => state.plan,
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
