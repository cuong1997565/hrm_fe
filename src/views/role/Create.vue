<template>
    <v-layout ref="laylout" row>
      <v-flex xs12 pa-5 class="white">
        <role-form @submit="submitForm" />
      </v-flex>
    </v-layout>
</template>

<script>
import RoleForm from './Form'
import { mapActions } from 'vuex'
export default{
  name: 'CreateRole',
  components: {
    RoleForm
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Role', ['createRole']),
    submitForm (formData) {
      this.createRole({
        role: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: 'Thành công'
          })

          this.$router.push({
            name: 'role',
            query: {
              reload: null
            }
          })
        }
      })
    }
  },
  created () {
    this.setMiniDrawer(false)
  }
}
</script>
