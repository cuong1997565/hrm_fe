import {
  NOTIFY_INSTANCE,
  NOTIFY_TIME,
  NOTIFY_TEXT,
  NOTIFY_COLOR,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    snackbar: false,
    snackbarTimeout: 6000,
    snackbarText: '',
    snackbarColor: ''
  }
}

/**
 * state
 */
const state = {
  snackbar: initState().snackbar,
  snackbarTimeout: initState().snackbarTimeout,
  snackbarText: initState().snackbarText,
  snackbarColor: initState().snackbarColor
}

/**
 * actions
 */
const actions = {
  showNotify ({ commit }, payload = {}) {
    let { timeout, text, color } = payload
    timeout && commit(NOTIFY_TIME, timeout)
    text && commit(NOTIFY_TEXT, text)
    color && commit(NOTIFY_COLOR, color)
    commit(NOTIFY_INSTANCE, true)
  },
  setNotifyInstance ({ commit }, payload) {
    commit(NOTIFY_INSTANCE, payload)
  }
}

/**
 * mutations
 */
const mutations = {
  [NOTIFY_INSTANCE]: (state, instance) => {
    state.snackbar = instance
  },
  [NOTIFY_TIME]: (state, timeout) => {
    state.snackbarTimeout = timeout
  },
  [NOTIFY_TEXT]: (state, text) => {
    state.snackbarText = text
  },
  [NOTIFY_COLOR]: (state, color) => {
    state.snackbarColor = color
  },
  [SET_INITIAL_STATE]: (state) => {
    state.snackbar = initState().snackbar
    state.snackbarTimeout = initState().snackbarTimeout
    state.snackbarText = initState().snackbarText
    state.snackbarColor = initState().snackbarColor
  }
}

/**
 * getters
 */
const getters = {
  snackbar: (state) => state.snackbar,
  snackbarTimeout: (state) => state.snackbarTimeout,
  snackbarText: (state) => state.snackbarText,
  snackbarColor: (state) => state.snackbarColor
}

export default {
  state,
  actions,
  mutations,
  getters
}
