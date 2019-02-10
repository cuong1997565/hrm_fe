<template>
  <v-layout ref="laylout" row fill-height>
   <v-flex xs4>
    <listting :is-mini="true" />
  </v-flex>
 </v-layout>
</template>

<script>
import Listting from './Listting'
export default{
  name: 'Candidate',
  components: {
    Listting
  }
}
</script>
