import {
  SET_DATA_VIEW,
  UPDATE_DATA_VIEW_ENTRY,
  REMOVE_DATA_VIEW_ENTRY,
  SET_INITIAL_STATE
} from '../mutation-types'
import { get, set, findIndex, unset, uniqBy } from 'lodash'

const DEFAULT_PAGINATION = { current_page: null, total_pages: null, total: null, count: null, per_page: null }
const DEFAULT_MODULE_DATA = {
  data: [],
  pagination: { ...DEFAULT_PAGINATION },
  lastScrollPos: 0
}

const initState = () => {
  return {
    dataViews: {
      user: { ...DEFAULT_MODULE_DATA },
      employee: { ...DEFAULT_MODULE_DATA },
      city: { ...DEFAULT_MODULE_DATA },
      position: { ...DEFAULT_MODULE_DATA },
      department: { ...DEFAULT_MODULE_DATA },
      setting: { ...DEFAULT_MODULE_DATA },
      plan: { ...DEFAULT_MODULE_DATA },
      branch: { ...DEFAULT_MODULE_DATA },
      candidate: { ...DEFAULT_MODULE_DATA },
      contract: { ...DEFAULT_MODULE_DATA }
      // planDetail: { ...DEFAULT_MODULE_DATA }
    }
  }
}

/**
 * state
 */
const state = {
  dataViews: initState().dataViews
}

/**
 * actions
 */
const actions = {
  setDataview ({ commit }, payload) {
    commit(SET_DATA_VIEW, payload)
  },
  initDataview ({ dispatch, state }, payload) {
    payload.name && !state.dataViews[payload.name] && dispatch('setDataview', { name: payload.name, data: [], pagination: { ...DEFAULT_PAGINATION }, lastScrollPos: 0 })
  },
  reloadDataview ({ dispatch }, payload) {
    payload.name && dispatch('setDataview', { name: payload.name, data: [], pagination: { ...DEFAULT_PAGINATION }, lastScrollPos: 0 })
  },
  updateDataviewEntry ({ commit }, payload) {
    commit(UPDATE_DATA_VIEW_ENTRY, payload)
  },
  removeDataviewEntry ({ commit }, payload) {
    commit(REMOVE_DATA_VIEW_ENTRY, payload)
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_DATA_VIEW]: (state, payload) => {
    let { name, data, pagination, lastScrollPos, uniqueKey } = payload
    uniqueKey = uniqueKey || 'id'
    data && set(state.dataViews, `${name}.data`, uniqBy(data, uniqueKey))
    pagination && set(state.dataViews, `${name}.pagination`, pagination)
    Number.isInteger(lastScrollPos) && set(state.dataViews, `${name}.lastScrollPos`, lastScrollPos)
  },
  [UPDATE_DATA_VIEW_ENTRY]: (state, payload) => {
    let { name, data, key } = payload
    let index = findIndex(get(state.dataViews, `${name}.data`), { [key]: data[key] })
    index !== -1 && !!data && set(state.dataViews, `${name}.data[${index}]`, data)
    state.dataViews[name]['data'] = Object.values(Object.assign({}, state.dataViews[name]['data']))
  },
  [REMOVE_DATA_VIEW_ENTRY]: (state, payload) => {
    let { name, data, key } = payload
    let index = findIndex(get(state.dataViews, `${name}.data`), { [key]: data[key] })
    index !== -1 && !!data && unset(state.dataViews, `${name}.data[${index}]`)
    state.dataViews[name]['data'] = Object.values(Object.assign({}, state.dataViews[name]['data']))
  },
  [SET_INITIAL_STATE]: (state) => {
    state.dataViews = initState().dataViews
  }
}

/**
 * getters
 */
const getters = {
  dataViews: state => name => get(state.dataViews, name, { data: [], pagination: { ...DEFAULT_PAGINATION }, lastScrollPos: 0 })
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
