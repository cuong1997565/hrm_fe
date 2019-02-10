<template>
  <layout-error />
</template>
<script>
import { forEach } from 'lodash'
import LayoutError from '@/components/LayoutError'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    LayoutError
  },
  computed: {
    ...mapGetters(['isLogged'])
  },
  methods: {
    ...mapActions(['setBreadcrumb', 'checkLogged', 'getProfile', 'resetState']),
    itemTitle (item) {
      if (typeof item.title === 'object') {
        return this.$t(item.title.i18n)
      } else {
        return item.title
      }
    }
  },
  created () {
    this.checkLogged()
    if (this.isLogged) {
      this.getProfile({ params: { include: 'roles' } })
    }
  },
  watch: {
    '$route' (to, from) {
      let breadcrumb = [
        {
          path: '/',
          name: this.itemTitle({
            title: {
              i18n: 'title.home'
            }
          })
        }
      ]
      if (to.meta && to.meta.breadcrumb) {
        to.meta.breadcrumb.forEach((item, index) => {
          let path = item.path
          if (to.params) {
            forEach(to.params, (value, key) => {
              path = path.replace(new RegExp(`:${key}`, 'gi'), value)
            })
          }
          item.name !== 'home' && breadcrumb.push({ path: path, name: this.itemTitle(item.meta) })
        })
      }
      to.name !== 'home' && breadcrumb.push({ path: to.path, name: this.itemTitle(to.meta) })
      this.setBreadcrumb(breadcrumb)
    }
  }
}
</script>
<style>
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f4f6f9;
  color: #67757c;
  font-family: Roboto, Arial, sans-serif;
}
.app-main{
  width: 100%;
  height: 100%;
}
</style>
