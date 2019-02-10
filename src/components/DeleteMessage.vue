<template>
  <v-dialog v-model="model" max-width="500px">
    <v-card>
      <v-card-title>
        <span>Bạn có chắc muốn xóa {{deleteTitle}} <span class="green--text">{{ deleteName }}</span> không ?</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-actions>
        <v-flex text-xs-right>
          <v-btn flat @click.stop="model=false">Không</v-btn>
          <v-btn flat color="error" @click="deleteRow">Xóa</v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'DeleteMessage',
  computed: {
    ...mapGetters([
      'deleteShow',
      'deleteTitle',
      'deleteName',
      'deleteCallback'
    ]),
    model: {
      get () {
        return this.deleteShow
      },
      set (value) {
        this.setDeleteMessage(value)
      }
    }
  },
  methods: {
    ...mapActions(['setDeleteMessage']),
    deleteRow () {
      return this.deleteCallback()
    }
  }
}
</script>

<style lang="css" scoped>
</style>
