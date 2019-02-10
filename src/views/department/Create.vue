<template>
    <v-layout row >
        <v-flex xs12 pa-5 class="white">
                  <DepartmentForm @submit="submitForm"></DepartmentForm>
        </v-flex>
    </v-layout>
</template>
<script>
import DepartmentForm from './Form'
import { mapActions } from 'vuex'
export default{
  name: 'CreatePosition',
  components: {
    DepartmentForm
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Department', ['createDepartment']),
    submitForm (formData) {
      this.createDepartment({
        department: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: 'Thành công'
          })

          this.$router.push({
            name: 'department',
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
<style>

</style>
