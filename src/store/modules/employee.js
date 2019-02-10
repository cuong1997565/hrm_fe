import {
  SET_EMPLOYEE,
  SET_EMPLOYEES,
  SET_INITIAL_STATE
} from '../mutation-types'
import { getField, updateField } from 'vuex-map-fields'
const initState = () => {
  return {
    employees: [],
    employee: {},
    params: {
      q: '',
      status: '',
      branchId: '',
      departmentId: '',
      positionId: '',
      contractType: '',
      dateOfFirstContract: '',
      dateExpiration: '',
      dateOfBirth: '',
      monthOfBirth: '',
      include: 'roles,departments,contracts',
      sort: 'status:-1,id:-1'
    }
  }
}

/**
 * state
 */
const state = {
  employees: initState().employees,
  employee: initState().employee,
  params: initState().params
}

/**
 * actions
 */
const actions = {
  setEmployee ({ commit }, payload) {
    let { employees } = payload
    commit(SET_EMPLOYEES, employees)
  },
  getEmployees ({ commit, dispatch }, payload) {
    let { cb, params } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `employees`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_EMPLOYEES, response.data)
          cb(response.data)
        }
      },
      { root: true }
    )
  },
  getEmployeesForm ({ dispatch }, payload) {
    let { cb, params } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `employees`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          // commit(SET_EMPLOYEES, response.data)
          cb(response.data)
        }
      },
      { root: true }
    )
  },
  uploadItem ({ commit, dispatch }, payload) {
    let { cb, data } = payload
    dispatch('fetchApi', {
      url: 'employees/upload',
      method: 'POST',
      data: data,
      success: cb
    }, { root: true })
  },
  getEmployee ({ commit, dispatch }, payload) {
    let { employeeId, params, cb } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `employees/${employeeId}`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_EMPLOYEE, response.data)
          cb && cb(response.data)
        }
      },
      { root: true }
    )
  },
  fetchEmployee ({ commit, dispatch }, payload) {
    let { params, error } = payload || {}
    dispatch(
      'fetchApi',
      {
        url: `employees`,
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_EMPLOYEE, response.data)
        },
        error: error
      },
      { root: true }
    )
  },
  createEmployee ({ commit, dispatch }, payload) {
    let { employee, cb, params, error } = payload
    dispatch('fetchApi', {
      url: 'employees',
      method: 'POST',
      data: employee,
      params: params,
      success: cb,
      error: error
    }, { root: true })
  },
  updateStatusEmployee ({ commit, dispatch }, payload) {
    let { id, employee, cb } = payload
    dispatch('fetchApi', {
      url: `employees/change-status/${id}`,
      method: 'PUT',
      data: employee,
      success: cb
    }, { root: true })
  },
  updateEmployee ({ commit, dispatch }, payload) {
    let { error, id, employee, cb, params } = payload
    dispatch('fetchApi', {
      url: `employees/${id}`,
      method: 'PUT',
      data: employee,
      params: params,
      success: cb,
      error: error
    }, { root: true })
  },
  deleteEmployee ({ commit, dispatch }, payload) {
    let { id, cb, error } = payload || {}
    dispatch('fetchApi', {
      url: `employees/${id}`,
      method: 'DELETE',
      success: (response) => {
        commit(SET_EMPLOYEES, response.data)
        cb && cb(response.data)
      },
      error: error
    }, { root: true })
  },
  clearFilter ({ commit }) {
    commit('resetFilter')
  },
  clearFilterBranch ({ commit }) {
    commit('clearBranch')
  },
  clearFilterDateBirth ({ commit }) {
    commit('clearDateBirth')
  },
  clearFilterDateFirstContract ({ commit }) {
    commit('clearDateFirstContract')
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_EMPLOYEES]: (state, employees) => {
    state.employees = employees
  },
  [SET_EMPLOYEE]: (state, employee) => {
    state.employee = employee
  },
  [SET_INITIAL_STATE]: (state) => {
    state.employees = initState().employees
    state.employee = initState().employee
    state.params = initState().params
  },
  updateField,
  // clear toàn bộ tính năng lọc
  resetFilter (state) {
    state.params.q = ''
    state.params.status = ''
    state.params.departmentId = ''
    state.params.branchId = ''
    state.params.positionId = ''
    state.params.dateOfBirth = ''
    state.params.monthOfBirth = ''
    state.params.contractType = ''
    state.params.dateOfFirstContract = ''
    state.params.dateExpiration = ''
  },
  // clear khi clear branch thì department cũng clear luôn
  clearBranch (state) {
    state.params.departmentId = ''
  },
  clearDateBirth (state) {
    state.params.dateOfBirth = ''
  },
  clearDateFirstContract (state) {
    state.params.dateOfFirstContract = ''
  }

}

/**
 * getters
 */
const getters = {
  employeeDetail: (state) => state.employee,
  employeeAll: (state) => state.employees,
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
