<template>
  <div>
  <!-- <v-app> -->
    <!-- <v-content> -->
    <router-view />
    <!-- </v-content> -->
    <notify />
  <!-- </v-app> -->
  </div>
</template>

<script>
import Notify from './Notify'
export default {
  components: {
    Notify
  }
}
</script>
