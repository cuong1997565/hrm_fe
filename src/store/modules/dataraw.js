import {
  SET_CITIES,
  SET_DISTRICTS,
  SET_INITIAL_STATE
} from '../mutation-types'

const initState = () => {
  return {
    cities: [],
    districts: []
  }
}

/**
 * state
 */
const state = {
  cities: initState().cities,
  districts: initState().districts
}

/**
 * actions
 */
const actions = {
  getCities ({ commit, dispatch }, params) {
    dispatch(
      'fetchApi',
      {
        url: 'cities',
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_CITIES, response.data)
        }
      },
      { root: true }
    )
  },
  getDistricts ({ commit, dispatch }, params) {
    dispatch(
      'fetchApi',
      {
        url: 'districts',
        method: 'GET',
        params: params || {},
        success: (response) => {
          commit(SET_DISTRICTS, response.data)
        }
      },
      { root: true }
    )
  }
}

/**
 * mutations
 */
const mutations = {
  [SET_CITIES]: (state, cities) => {
    state.cities = cities
  },
  [SET_DISTRICTS]: (state, districts) => {
    state.districts = districts
  },
  [SET_INITIAL_STATE]: (state) => {
    state.cities = initState().cities
    state.districts = initState().districts
  }
}

/**
 * getters
 */
const getters = {
  cities: (state) => state.cities,
  districts: (state) => state.districts
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
