import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    canAccess (name) {
      if (this.permissions['admin.super-admin'] || this.permissions[name]) {
        return true
      }
      return false
    }
  }
}
