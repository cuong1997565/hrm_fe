<template>
  <v-layout ref="laylout" row fill-height>
      <v-flex  xs12 class="border-e0-left white">
      <v-toolbar dense color="white" flat>
          <v-spacer></v-spacer>
         <v-btn icon @click="$router.push({name: 'candidate'})">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
          <candidate-form v-if="candidateDetail.id" @submit="submitForm" type="edit" :dataCandidate="candidateDetail" />
      </v-container>
      </v-flex>
  </v-layout>
</template>
<script>
import CandidateForm from './Form'
import listting from './Listting'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'EditCandidate',
  components: {
    listting,
    CandidateForm
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  computed: {
    ...mapGetters('Candidate', ['candidateDetail'])
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Candidate', ['updateCandidate', 'getCandidate', 'setCandidate']),
    ...mapActions('Dataview', ['updateDataviewEntry']),
    submitForm (formData) {
      this.updateCandidate({
        id: this.$route.params.id,
        candidate: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: 'Thành công'
          })
          this.setCandidate({ candidate: response.data })
          this.updateDataviewEntry({
            name: 'candidate',
            data: response.data,
            key: 'id'
          })
          this.$router.push({
            name: 'candidate'
          })
        }
      })
    }
  },
  created () {
    this.setMiniDrawer(true)
    if (!this.candidateDetail.id) {
      this.getCandidate({ candidateId: this.$route.params.id })
      console.log('data getCandidate ', this.$route.params.id)
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
  }
}
</script>
