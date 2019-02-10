<template>
 <v-layout ref="laylout" row fill-height>
    <v-flex fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
     <branch-form ref="nextStep" @submit="submitForm" />
   </v-flex>
 </v-layout>
</template>
<script>
import BranchForm from './Form'
import { mapActions } from 'vuex'
export default{
  name: 'CreateForm',
  components: {
    BranchForm
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Branch', ['createBranch', 'clearFilter']),
    submitForm (formData) {
      this.clearFilter()
      this.createBranch({
        branch: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.createBranchSuccess')
          })
          this.$router.push({
            name: 'branch',
            query: {
              reload: true
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
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 8
  }
}
</script>
