import {
  SET_BREADCRUMB,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    breadcrumb: false
  }
}
/**
 * state
 */
const state = {
  breadcrumb: initState().breadcrumb
}

/**
 * actions
 */
const actions = {
  setBreadcrumb ({ commit }, payload) {
    commit(SET_BREADCRUMB, payload)
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_BREADCRUMB]: (state, breadcrumb) => {
    state.breadcrumb = breadcrumb
  },
  [SET_INITIAL_STATE]: (state) => {
    state.breadcrumb = initState().breadcrumb
  }
}

/**
 * getters
 */
const getters = {
  breadcrumb: (state) => state.breadcrumb
}

export default {
  state,
  actions,
  mutations,
  getters
}
