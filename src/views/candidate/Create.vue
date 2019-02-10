<template>
  <v-layout ref="laylout" row fill-height>
      <v-flex xs12 class="border-e0-left white">
        <v-toolbar dense color="white" flat>
          <v-spacer></v-spacer>
         <v-btn icon @click="$router.push({name: 'candidate'})">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
            <candidate-form @submit="submitForm" />
      </v-container>
      </v-flex>
  </v-layout>
</template>
<script>
import CandidateForm from './Form'
import { mapActions } from 'vuex'
export default{
  name: 'CreateCandidate',
  components: {
    CandidateForm
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Candidate', ['createCandidate']),
    submitForm (formData) {
      console.log(formData)
      this.createCandidate({
        candidate: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: 'Thành công'
          })
          this.$router.push({
            name: 'candidate',
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
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
  }
}
</script>
<style scoped>
.padding15{
  padding: 0px 15px 15px 15px;
}
</style>
