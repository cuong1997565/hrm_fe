<template>
  <v-layout ref="laylout" row fill-height>
    <v-flex fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
      <branch-form ref="nextStep" v-if="branchDetail.id" @submit="submitForm" type="edit" :dataBranch="branchDetail" />
    </v-flex>
  </v-layout>
</template>
<script>
import BranchForm from './Form'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'EditBranch',
  components: {
    BranchForm
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  computed: {
    ...mapGetters('Branch', ['branchDetail'])
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Branch', ['updateBranch', 'getBranch', 'setBranch', 'clearFilter']),
    ...mapActions('Dataview', ['updateDataviewEntry']),
    submitForm (formData) {
      this.clearFilter()
      this.updateBranch({
        id: this.$route.params.id,
        branch: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.updateBranchSuccess')
          })
          this.setBranch({ branch: response.data })
          this.updateDataviewEntry({
            name: 'branch',
            data: response.data,
            key: 'id'
          })
          this.$router.push({
            name: 'branch-hrm',
            query: { reload: true }
          })
        },
        error: (error) => {
          //     // nếu có lỗi email, phone ở step 1 thì quay trở về step 1
          if (error.data.data.errors.email || error.data.data.errors.phone) {
            this.$refs.nextStep.stepError()
          }
        }
      })
    }
  },
  created () {
    this.getBranch({ branchId: this.$route.params.id })
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 8
  }
}
</script>
