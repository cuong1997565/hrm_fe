
import {
  SET_PLAN_DETAIL,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    planDetail: {}
  }
}

/**
 * state
 */
const state = {
  planDetail: initState().planDetail
}

/**
 * actions
 */
const actions = {
  setPlanDetail ({ commit }, payload) {
    let { planDetail } = payload || {}
    commit(SET_PLAN_DETAIL, planDetail)
  },
  fetchPlanDetail ({ commit, dispatch }, payload) {
    let { params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `plan_details`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_PLAN_DETAIL, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  getPlanDetail ({ commit, dispatch }, payload) {
    let { planDetailId, params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `plan_details/${planDetailId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_PLAN_DETAIL, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  createPlanDetail ({ commit, dispatch }, payload) {
    let { planDetail, cb } = payload || {}
    dispatch('fetchApi', {
      url: 'plan_details',
      method: 'POST',
      data: planDetail,
      success: cb
    }, { root: true })
  },
  updatePlanDetail ({ commit, dispatch }, payload) {
    let { id, planDetail, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `plan_details/${id}`,
      method: 'PUT',
      data: planDetail,
      success: cb,
      error: error
    }, { root: true })
  },
  deletePlanDetail ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `plan_details/${id}`,
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
  [SET_PLAN_DETAIL]: (state, planDetail) => {
    state.planDetail = planDetail
  },
  [SET_INITIAL_STATE]: (state) => {
    state.planDetail = initState().planDetail
  }
  // [SET_INITIAL_STATE]: (state) => {
  //   state.role = initState().role
  // }
}

/**
 * getters
 */
const getters = {
  planDetail: (state) => state.planDetail,
  planAll: (state) => state.planDetail
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
