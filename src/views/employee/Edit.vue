<template>
  <v-layout ref="laylout" fill-height>
    <v-flex class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
      <employee-form ref="nextStep" v-if="employeeDetail.id" @submit="submitForm" type="edit" :dataEmployee="employeeDetail" />
    </v-flex>
  </v-layout>
</template>
<script>
import employeeForm from './Form'
import Listting from './Listting'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'EditEmployee',
  components: {
    employeeForm,
    Listting
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  computed: {
    ...mapGetters('Employee', ['employeeDetail'])
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Employee', ['updateEmployee', 'getEmployee', 'setEmployee', 'clearFilter']),
    ...mapActions('Dataview', ['updateDataviewEntry']),
    submitForm (formData) {
      this.clearFilter()
      if (formData.departments.data) {
        formData.departments = formData.departments.data
      }
      // console.log("form", formData)
      // return false
      this.updateEmployee({
        id: this.$route.params.id,
        employee: formData,
        params: {
          include: 'roles,departments'
        },
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.updateEmployee')
          })
          this.setEmployee({ employee: response.data })
          this.updateDataviewEntry({
            name: 'employee',
            data: response.data,
            key: 'id'
          })
          this.$router.push({ name: 'employee', params: { id: this.$route.params.id } })
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
    if (!this.employeeDetail.id) {
      this.getEmployee({ employeeId: this.$route.params.id, params: { include: 'roles,departments.branch,contracts' } })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 5
  }
}
</script>
