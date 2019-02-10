<template>
    <v-layout ref="laylout" row fill-height>
     <v-flex xs12>
         <listting></listting>
      </v-flex>
    </v-layout>
</template>
<script>
import listting from './Listting'
export default{
  name: 'Contracts',
  components: {
    listting
  }
}
</script>
