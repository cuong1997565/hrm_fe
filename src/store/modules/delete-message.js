import {
  SET_DELETE_SHOW,
  SET_DELETE_TITLE,
  SET_DELETE_NAME,
  SET_DELETE_CALLBACK,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    deleteShow: false,
    deleteTitle: '',
    deleteName: '',
    deleteCallback: () => {}
  }
}

/**
 * state
 */
const state = {
  deleteShow: initState().deleteShow,
  deleteTitle: initState().deleteTitle,
  deleteName: initState().deleteName,
  deleteCallback: initState().deleteCallback
}

/**
 * actions
 */
const actions = {
  showDeleteMessage ({ commit }, payload = {}) {
    let { title, name, cb } = payload
    title && commit(SET_DELETE_TITLE, title)
    name && commit(SET_DELETE_NAME, name)
    commit(SET_DELETE_SHOW, true)
    cb && commit(SET_DELETE_CALLBACK, cb)
  },
  setDeleteMessage ({ commit }, payload) {
    commit(SET_DELETE_SHOW, payload)
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_DELETE_SHOW]: (state, data) => {
    state.deleteShow = data
  },
  [SET_DELETE_TITLE]: (state, title) => {
    state.deleteTitle = title
  },
  [SET_DELETE_NAME]: (state, name) => {
    state.deleteName = name
  },
  [SET_DELETE_CALLBACK]: (state, cb) => {
    state.deleteCallback = cb
  },
  [SET_INITIAL_STATE]: (state) => {
    state.deleteShow = initState().deleteShow
    state.deleteTitle = initState().deleteTitle
    state.deleteName = initState().deleteName
    state.deleteCallback = initState().deleteCallback
  }
}

/**
 * getters
 */
const getters = {
  deleteShow: (state) => state.deleteShow,
  deleteTitle: (state) => state.deleteTitle,
  deleteName: (state) => state.deleteName,
  deleteCallback: (state) => state.deleteCallback
}

export default {
  state,
  actions,
  mutations,
  getters
}
