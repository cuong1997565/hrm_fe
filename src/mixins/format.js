import { set } from 'lodash'
export default {
  methods: {
    formatPrice (obj, path, value) {
      set(obj, path, String(value).replace(/\D/g, ''))
      return obj
    }
  }
}
