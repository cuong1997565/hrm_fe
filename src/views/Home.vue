<template>
    <v-layout ref="laylout" row fill-height>
      <v-flex xs4>
        home
      </v-flex>
      <router-link :to="{name: 'opps'}" >opps</router-link>
    </v-layout>
</template>

<script>
import DataView from '@/components/DataView/DataView.vue'
export default{
  components: {
    DataView
  },
  data: () => ({
    dataViewHeight: 0
  }),
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
