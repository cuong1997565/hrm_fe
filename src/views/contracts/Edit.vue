<template>
  <v-layout ref="laylout" row fill-height>
      <v-flex  xs12 class="border-e0-left white">
      <v-toolbar dense color="white" flat>
          <v-spacer></v-spacer>
         <v-btn icon @click="ListtingContract">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
          <ContractForm v-if="contractDetail.id" @submit="submitForm" type="edit" :dataContract="contractDetail"/>
      </v-container>
      </v-flex>
  </v-layout>
</template>
<script type="text/javascript">
import ContractForm from './Form'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'EditContract',
  components: {
    ContractForm
  },

  data () {
    return {
      dataViewHeight: 0
    }
  },
  computed: {
    ...mapGetters('Contracts', ['contractDetail'])
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Contracts', ['updateContract', 'getContract', 'setContract']),
    ...mapActions('Dataview', ['updateDataviewEntry']),
    ...mapActions('Employee', ['getEmployees', 'getEmployeesForm']),
    ListtingContract () {
      // this.getEmployees({ params: { limit: 10 } })
      this.$router.push({ name: 'contract' })
    },
    submitForm (formData) {
      this.updateContract({
        id: this.$route.params.id,
        contract: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.edit-contract')
          })
          this.updateDataviewEntry({
            name: 'contract',
            data: response.data,
            key: 'id'
          })
          // this.getEmployees({ params: { limit: 10 } })
          // this.clearFilter()
          this.$router.push({
            name: 'contract',
            query: {
              reload: true
            }
          })
        }
      })
      console.log('form data :', formData)
    }
  },

  // watch: {
  //   contractDetail (value) {
  //     if (value.id) {
  //       // this.getEmployees({ params: { q: value.employee_name, limit: 10 } })
  //         this.getEmployeesForm({
  //           params: { q: value.employee_name },
  //           cb: (params) => {
  //             // this.listtingEmployee = params
  //             console.log("data form employee edit", params)
  //           }
  //         })
  //     }
  //   }
  // },
  created () {
    this.setMiniDrawer(false)
    if (!this.contractDetail.id) {
      this.getContract({ params: { include: 'employee' }, contractId: this.$route.params.id })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
  }
}
</script>
