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
        <plan-form @submit="submitForm"/>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import planForm from './Form'
import { mapActions } from 'vuex'

export default {
  name: 'CreatePlan',
  components: {
    planForm
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Plan', ['createPlan']),
    submitForm (formData) {
      console.log('formData', formData)
      this.createPlan({
        plan: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.plan.success_create')
          })
          this.$router.push({
            name: 'plans',
            query: {
              reload: null
            }
          })
        }
      })
    }
  },
  mounted () {
    this.setMiniDrawer(false)
    this.dataViewHeight = this.$refs.laylout.clientHeight - 50
  }

}
</script>
