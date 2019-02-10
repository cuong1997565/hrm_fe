<template>
  <v-layout  ref="laylout" row fill-height>
      <v-flex xs12 class="border-e0-left white">
        <v-toolbar dense color="white" flat>
          <v-spacer></v-spacer>
         <v-btn icon @click="$router.push({name: 'contract'})">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
            <contract-form @submit="submitForm" />
      </v-container>
      </v-flex>
  </v-layout>
</template>
<script type="text/javascript">
import ContractForm from './Form'
import { mapActions } from 'vuex'
export default{
  name: 'CreateContract',
  components: {
    ContractForm
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Contracts', ['createContract', 'clearFilter']),
    ...mapActions('Employee', ['getEmployees']),

    submitForm (formData) {
      this.createContract({
        contract: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.add-contract')
          })
          this.clearFilter()
          this.$router.push({
            name: 'contract',
            query: {
              reload: true
            }
          })
        }
      })
      // this.getEmployees({ params: { limit: 10 } })
    }
  },
  watch: {
    contractDetail (value) {
      if (value.id) {
        this.getEmployees({ params: { q: value.employee_name, limit: 10 } })
      }
    }
  },

  created () {
    this.setMiniDrawer(false)
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
  }
}
</script>
