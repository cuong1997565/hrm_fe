<template>
  <v-layout ref="laylout" row fill-height>
    <v-flex xs12 class="border-e0-left white" style="padding-top: 0px;">
      <v-toolbar dense color="white" flat>
        <v-spacer></v-spacer>
        <v-btn icon @click="$router.push({name: 'plans'})">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="white scroll-y border-e0-top" style="padding-top: 0px;"
                   :style="{height: dataViewHeight + 'px'}">
        <plan-form v-if="planDetail.id" @submit="submitForm" type="edit" :dataPlan="planDetail"/>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import planForm from './Form'
import Listting from './Listting'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'EditPlan',
  components: {
    planForm,
    Listting
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  computed: {
    ...mapGetters('Plan', ['planDetail'])

  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Plan', ['updatePlan', 'getPlan', 'setPlan']),
    ...mapActions('Dataview', ['updateDataviewEntry']),
    submitForm (formData) {
      // if (formData.details.data) {
      //   formData.details = formData.details.data
      // }
      console.log('data submit', formData)
    }
  },
  created () {
  },
  mounted () {
    this.setMiniDrawer(false)
    this.dataViewHeight = this.$refs.laylout.clientHeight - 50
    if (!this.planDetail.id) {
      this.getPlan({ planId: this.$route.params.id, params: { include: 'details.department.branch' } })
    }
  }
}
</script>
