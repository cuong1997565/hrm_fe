import {
  SET_DRAWER,
  SET_MINI_DRAWER,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    drawer: true,
    miniDrawer: false
  }
}
/**
 * state
 */
const state = {
  drawer: initState().drawer,
  miniDrawer: initState().miniDrawer
}

/**
 * actions
 */
const actions = {
  setDrawer ({ commit }, payload) {
    commit(SET_DRAWER, !!payload)
  },
  setMiniDrawer ({ commit }, payload) {
    commit(SET_MINI_DRAWER, !!payload)
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_DRAWER]: (state, drawer) => {
    state.drawer = drawer
  },
  [SET_MINI_DRAWER]: (state, miniDrawer) => {
    state.miniDrawer = miniDrawer
  },
  [SET_INITIAL_STATE]: (state) => {
    state.drawer = initState().drawer
    state.miniDrawer = initState().miniDrawer
  }
}

/**
 * getters
 */
const getters = {
  drawerModel: (state) => state.drawer,
  miniDrawer: (state) => state.miniDrawer
}

export default {
  state,
  actions,
  mutations,
  getters
}
