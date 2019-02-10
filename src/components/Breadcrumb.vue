<template>
  <v-breadcrumbs divider="/">
    <v-breadcrumbs-item
      v-for="(item, index) in breadcrumb"
      :key="index"
      :to="item.path ? item.path : '/'"
      :disabled="index === (breadcrumb.length - 1)"
      active-class=""
    >
      <span class="white--text" :class="index === (breadcrumb.length - 1) ? 'item-disabled' : ''">{{ item.name }}</span>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Breadcrumb',
  computed: {
    ...mapGetters(['breadcrumb'])
  }
}
</script>

<style lang="css" scoped>
.item-disabled {
  opacity: 0.7
}
</style>
