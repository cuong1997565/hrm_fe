<template>
  <v-layout ref="laylout" row>
    <v-flex xs12 class="border-e0-left white">
      <employee-form ref="nextStep" @submit="submitForm" />
    </v-flex>
  </v-layout>
</template>
<script>
import employeeForm from './Form'
import { mapActions } from 'vuex'
export default{
  name: 'CreateEmployee',
  components: {
    employeeForm
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Employee', ['createEmployee', 'clearFilter']),
    submitForm (formData) {
      this.clearFilter()
      if (formData.contracts.length && !formData.contracts[0].title) {
        formData.contracts = []
      }
      this.createEmployee({
        employee: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.addEmployee')
          })
          this.$router.push({
            name: 'employee',
            query: {
              reload: null
            }
          })
        },
        error: (error) => {
          // nếu có lỗi email, phone ở step 1 thì quay trở về step 1
          if (error.data.data.errors.email || error.data.data.errors.phone) {
            this.$refs.nextStep.stepError()
          }
        }
      })
    }
  },
  created () {
    this.setMiniDrawer(false)
  }
}
</script>
