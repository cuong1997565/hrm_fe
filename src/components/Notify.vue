<template>
  <v-snackbar
    v-model="model"
    :right="true"
    :timeout="snackbarTimeout"
    :top="true"
    :multi-line="true"
    :color="snackbarColor"
  >
    <div v-html="snackbarText"></div>
    <v-btn
      flat
      @click="setNotifyInstance(false)"
    >
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default{
  name: 'GostoreNotify',
  computed: {
    ...mapGetters([
      'snackbar',
      'snackbarTimeout',
      'snackbarText',
      'snackbarColor'
    ]),
    model: {
      get () {
        return this.snackbar
      },
      set (value) {
        this.setNotifyInstance(value)
      }
    }
  },
  methods: {
    ...mapActions(['setNotifyInstance'])
  }
}
</script>
