<template>
    <v-layout ref="laylout" row fill-height>
      <v-flex xs12>
        <listting />
      </v-flex>
    </v-layout>
</template>

<script>
import Listting from './Listting'
import { mapActions } from 'vuex'
export default{
  name: 'Role',
  components: {
    Listting
  },
  methods: {
    ...mapActions(['setMiniDrawer'])
  },
  created () {
    this.setMiniDrawer(false)
  }
}
</script>
