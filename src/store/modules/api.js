import axios from '@/plugins/axios.js'
import router from '@/router'
import {
  FETCHING_RESOURCES,
  FETCHING_RESOURCES_DONE,
  FETCHING_RESOURCES_FAIL,
  SET_INITIAL_STATE
} from '../mutation-types'
import { forIn } from 'lodash'

const initState = () => {
  return {
    fetchApi: false,
    apiErrors: null
  }
}

/**
 * state
 */
const state = {
  fetchApi: initState().fetchApi,
  apiErrors: initState().apiErrors
}

/**
 * actions
 */
const actions = {
  async fetchApi ({ dispatch }, payload = {}) {
    let { async } = payload
    async = async !== undefined ? async : true
    if (async) {
      dispatch('fetchApiAsync', payload)
    } else {
      dispatch('fetchApiSynchronous', payload)
    }
  },

  async fetchApiAsync ({ commit, dispatch, state }, payload = {}) {
    let { success, error, showWarnings } = payload
    showWarnings = showWarnings === undefined ? true : showWarnings

    try {
      commit(FETCHING_RESOURCES, true)
      let response = await axios.request(payload)
      commit(FETCHING_RESOURCES_DONE)
      success && await success(response.data)
    } catch (e) {
      let err = null
      if (e.response) {
        if (showWarnings) {
          switch (e.response.status) {
            case 422:
              let msg = []
              forIn(e.response.data.data.errors, (err, idx) => {
                if (typeof err === 'string') {
                  msg.push('&bullet; ' + err)
                } else {
                  msg.push('&bullet; ' + err[0])
                }
              })
              dispatch('showNotify', { text: msg.join('<br />'), color: 'warning' })
              break
            case 403:
              dispatch('showNotify', { text: 'Bạn không có quyền thực hiện tác vụ này', color: 'warning' })
              router.push({ name: 'forbidden' })
              break
            case 401:
              dispatch('showNotify', { text: 'Phiên đăng nhập hết hạn vui lòng đăng nhập', color: 'warning' })
              dispatch('clearLogged')
              router.push({ name: 'login' })
              break
            case 500:
              dispatch('showNotify', { text: 'Máy chủ sảy ra sự cố vui lòng thử lại sau', color: 'error' })
              router.push({ name: 'opps' })
              break
          }
        }
        err = e.response
      } else if (e.request) {
        err = e.request
      } else {
        err = e.message
      }
      commit(FETCHING_RESOURCES_FAIL, err)
      error && error(err)
    } finally {
      commit(FETCHING_RESOURCES, false)
    }
  },

  fetchApiSynchronous ({ commit, dispatch, state }, payload = {}) {
    let { success, error, showWarnings } = payload
    showWarnings = showWarnings === undefined ? true : showWarnings
    commit(FETCHING_RESOURCES, true)
    axios.request(payload).then(response => {
      commit(FETCHING_RESOURCES, false)
      commit(FETCHING_RESOURCES_DONE)
      success && success(response.data)
    })
      .catch(e => {
        commit(FETCHING_RESOURCES, false)
        let err = null
        if (e.response) {
          if (showWarnings) {
            switch (e.response.status) {
              case 422:
                let msg = []
                forIn(e.response.data.data.errors, (err, idx) => {
                  if (typeof err === 'string') {
                    msg.push('&bullet; ' + err)
                  } else {
                    msg.push('&bullet; ' + err[0])
                  }
                })
                dispatch('showNotify', { text: msg.join('<br />'), color: 'warning' })
                break
              case 403:
                dispatch('showNotify', { text: 'Bạn không có quyền thực hiện tác vụ này', color: 'warning' })
                router.push({ name: 'forbidden' })
                break
              case 401:
                dispatch('showNotify', { text: 'Phiên đăng nhập hết hạn vui lòng đăng nhập', color: 'warning' })
                dispatch('clearLogged')
                router.push({ name: 'login' })
                break
              case 500:
                dispatch('showNotify', { text: 'Máy chủ sảy ra sự cố vui lòng thử lại sau', color: 'error' })
                router.push({ name: 'opps' })
                break
            }
          }
          err = e.response
        } else if (e.request) {
          err = e.request
        } else {
          err = e.message
        }
        commit(FETCHING_RESOURCES_FAIL, err)
        error && error(err)
      })
  }
}

/**
 * mutations
 */
const mutations = {
  [FETCHING_RESOURCES_FAIL]: (state, err) => {
    state.apiErrors = err.response
  },
  [FETCHING_RESOURCES_DONE]: (state) => {
    state.apiErrors = null
  },
  [FETCHING_RESOURCES]: (state, isFechApi) => {
    state.fetchApi = isFechApi
  },
  [SET_INITIAL_STATE]: (state) => {
    state.fetchApi = initState().fetchApi
    state.apiErrors = initState().apiErrors
  }
}

/**
 * getters
 */
const getters = {
  allApiErrors: (state) => state.apiErrors,
  isFetchingApi: (state) => state.fetchApi
}

export default {
  state,
  actions,
  mutations,
  getters
}
