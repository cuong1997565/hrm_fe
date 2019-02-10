<template>
  <v-layout column>
    <v-flex xs12 id="scroll-view" class="scroll-y white" :style="{height: viewHeight - 28 + 'px'}">
      <slot :items="items"></slot>
      <v-flex xs12 v-if="!!this.items.pagination && items.pagination.count == 0" class="px-3" style="text-align:center; color: blue;  height: 22px;">
        Không có kết quả nào được tìm thấy
      </v-flex>
    </v-flex>
    <v-flex xs12 v-if="isFetchingApi">
    <v-progress-linear
      style="margin: 2px 0px 1px 0px"
      height="3"
      color="primary"
      :indeterminate="isFetchingApi"
    ></v-progress-linear>
    </v-flex>
    <v-flex v-else xs12 style="height: 6px" class="white">
      &nbsp;
    </v-flex>
    <v-flex xs12 v-if="!!this.items.pagination && this.items.pagination.total" class="px-3 white" style="text-align: right; height: 22px;">
      {{this.items.data.length}} / {{this.items.pagination.total}}
    </v-flex>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'DataView',
  props: {
    viewHeight: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    scroll: {
      type: Object,
      default: () => {
        return {
          distance: 200
        }
      }
    },
    apiUrl: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters(['isFetchingApi']),
    items () {
      return this.$store.getters['Dataview/dataViews'](this.name)
    }
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Dataview', ['setDataview', 'initDataview', 'reloadDataview']),
    fetchSuccess (response) {
      this.setDataview({ name: this.name, data: [...this.items.data || [], ...response.data] })
      if (!!response.meta && !!response.meta.pagination) {
        this.setDataview({ name: this.name, pagination: response.meta.pagination })
      }
    },
    fetchData () {
      this.fetchApi({
        url: this.apiUrl,
        methods: 'GET',
        params: { ...this.params, page: this.items && this.items.pagination ? this.items.pagination.current_page : null },
        success: this.fetchSuccess
      })
    },
    onScroll (e) {
      /**
       * check scroll down & scroll distance bottom <= distance
       * @author KingDarkness <nguyentranhoan13@gmail.com>
       */
      if (this.items.lastScrollPos < e.target.scrollTop && (e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight)) < this.scroll.distance) {
        if (this.items.pagination.total_pages && !this.isFetchingApi && this.items.pagination.current_page + 1 <= this.items.pagination.total_pages) {
          let pagination = { ...this.items.pagination }
          ++pagination.current_page
          this.setDataview({ name: this.name, pagination: pagination })
          this.fetchData()
        }
      }
      this.setDataview({ name: this.name, lastScrollPos: e.target.scrollTop })
    },
    resetDataView () {
      this.reloadDataview({ name: this.name })
      this.fetchData()
    }
  },
  mounted () {
    if (!(this.items && this.items.data && this.items.data.length)) {
      this.fetchData()
    }
    this.$nextTick(() => {
      this.$el.querySelector('#scroll-view').addEventListener('scroll', this.onScroll)
      if (!this.items.lastScrollPos) {
        this.setDataview({ name: this.name, lastScrollPos: 0 })
      } else {
        this.$el.querySelector('#scroll-view').scrollTop = this.items.lastScrollPos
      }
    })
  },
  created () {
    this.initDataview({ name: this.name })
    this.$on('reload', () => {
      this.resetDataView()
    })
  },
  destroyed () {
    this.$el.querySelector('#scroll-view').removeEventListener('scroll', this.onScroll)
  }
}
</script>
