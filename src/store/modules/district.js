// import {
//   SET_DISTRICTS,
//   SET_INITIAL_STATE
// } from '../mutation-types'

// const initState = () => {
//   return {
//     district: {}
//   }
// }

// const state = {
//   district: initState().district
// }

// const actions = {
//   setDistrict ({ commit }, payload) {
//     let { district } = payload
//     commit(SET_DISTRICTS, district)
//   },
//   getDistrict ({ commit, dispatch }, payload) {
//     dispatch(
//       'fetchApi',
//       {
//         url: `districts`,
//         method: 'GET',
//         success: (response) => {
//           commit(SET_DISTRICTS, response.data)
//         }
//       },
//       { root: true }
//       )
//   }
// }

// const mutations = {
//   [SET_DISTRICTS]: (state, district) => {
//     state.district = district
//   },
//   [SET_INITIAL_STATE]: (state) => {
//     state.district = initState().district
//   }
// }

// const getters = {
//   districtAll: (state) => state.district
// }
// export default {
//   namespaced: true,
//   state,
//   actions,
//   mutations,
//   getters
// }
