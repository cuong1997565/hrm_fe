import {
  SET_DEPARTMENT,
  SET_INITIAL_STATE
} from '../mutation-types'
import { getField, updateField } from 'vuex-map-fields'
const initState = () => {
  return {
    department: [],
    params: {
      q: '',
      branch_id: ''
    }
  }
}

/**
 * state
 */
const state = {
  department: initState().department,
  params: initState().params
}

/**
 * actions
 */

const actions = {
  setDepartment ({ commit }, payload) {
    let { department } = payload || {}
    commit(SET_DEPARTMENT, department)
  },
  clearFilter ({ commit }) {
    commit('resetFilter')
  },
  getDepartment ({ commit, dispatch }, payload) {
    let { departmentId, params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `departments/${departmentId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_DEPARTMENT, response.data)
          console.log('data get department :', response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  fetchDepartment ({ commit, dispatch }, payload) {
    let { params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `departments?sort=status:-1,id:-1`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_DEPARTMENT, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  getDepartmentForEmployee ({ commit, dispatch }, payload) {
    let { branchId, cb } = payload
    dispatch(
      'fetchApi',
      {
        url: `departments/branches/${branchId}`,
        method: 'GET',
        success: (response) => {
          commit(SET_DEPARTMENT, response.data)
          cb && cb()
        }
      },
      { root: true }
    )
  },

  createDepartment ({ commit, dispatch }, payload) {
    let { department, cb, params } = payload
    dispatch('fetchApi', {
      url: 'departments',
      method: 'POST',
      data: department,
      params: params,
      success: cb
    }, { root: true })
  },
  updateDepartment ({ commit, dispatch }, payload) {
    let { id, department, cb, params } = payload
    dispatch('fetchApi', {
      url: `departments/${id}`,
      method: 'PUT',
      data: department,
      params: params,
      success: cb
    }, { root: true })
  },
  updateStatusDepartment ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload
    dispatch('fetchApi', {
      url: `departments/change-status/${id}`,
      method: 'PUT',
      success: cb,
      error: error
    }, { root: true })
  },
  deleteDepartment ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `departments/${id}`,
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
  [SET_DEPARTMENT]: (state, department) => {
    state.department = department
  },
  [SET_INITIAL_STATE]: (state) => {
    state.department = initState().department
    state.params = initState().params
  },
  updateField,
  resetFilter (state) {
    state.params.q = ''
    state.params.branch_id = ''
  }
}

/**
 * getters
 */

const getters = {
  departmentByBranch: (state) => state.department,
  departmentDetail: (state) => state.department,
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
