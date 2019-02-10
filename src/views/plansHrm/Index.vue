<template>
  <v-layout ref="laylout" row fill-height>
    <v-flex xs12>
      <listting></listting>
    </v-flex>
  </v-layout>
</template>
<script>
import listting from './Listting'
import { mapActions } from 'vuex'

export default {
  name: 'Plan',
  components: {
    listting
  },
  methods: {
    ...mapActions(['setMiniDrawer'])
  },
  created () {
    this.setMiniDrawer(false)
  }

}
</script>
