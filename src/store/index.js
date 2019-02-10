import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
// modules
import * as modules from './modules'
import { forEach } from 'lodash'
import { SET_INITIAL_STATE } from './mutation-types'
console.log(modules)
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  // strict: debug,
  state: {

  },
  mutations: {

  },
  actions: {
    resetState ({ commit }, payload) {
      forEach(modules, (module, name) => {
        if (module.mutations[SET_INITIAL_STATE]) {
          if (module.namespaced) {
            commit(name + '/' + SET_INITIAL_STATE)
          } else {
            commit(SET_INITIAL_STATE)
          }
        }
      })
    }
  },
  modules: {
    ...modules
  },
  plugins: debug ? [createLogger()] : []
})
