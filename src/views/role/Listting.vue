<template>
    <v-layout ref="laylout" column fill-height>
      <v-toolbar dense color="white" flat>
        <v-btn v-if="canAccess('role.create')" class="mr-3" icon color="primary" @click="$router.push({name: 'role-create'})">
          <v-icon>add</v-icon>
        </v-btn>
        <v-text-field
          hide-details
          single-line
        ></v-text-field>
        <!-- <v-menu :nudge-width="100" offset-y>
          <v-toolbar-title slot="activator">
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </v-toolbar-title>

          <v-list>
            <v-list-tile
              v-for="role in 10"
              :key="'title'+role"
              @click=""
            >
              <v-list-tile-title v-text="role"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu> -->
      </v-toolbar>

      <v-flex xs12 class="border-e0-top">
        <data-view
          :name="dataViewName"
          api-url="roles"
          v-if="dataViewHeight"
          :viewHeight="dataViewHeight"
          :params="params"
          :ref="dataViewName"
        >
          <template slot-scope="{items}">
            <v-list three-line>
              <template v-for="(role, index) in items.data">
                <v-list-tile
                  :key="'role' + role.id"
                  avatar
                  ripple
                  @click="roleDetail(role)"
                  :inactive="role.id === $route.params.id"
                  :class="role.id === $route.params.id && 'grey lighten-2'"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ role.name }}</v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary">{{ role.description }}</v-list-tile-sub-title>
                  </v-list-tile-content>

                </v-list-tile>
                <v-divider
                  :key="'div' + index + role.id"
                  v-if="index + 1 < items.data.length"
                ></v-divider>
              </template>
            </v-list>
          </template>
        </data-view>
      </v-flex>
    </v-layout>
</template>

<script>
import DataView from '@/components/DataView/DataView'
import { mapActions } from 'vuex'
export default{
  name: 'RoleListting',
  components: {
    DataView
  },
  data: () => ({
    dataViewHeight: 0,
    dataViewName: 'role',
    params: {
      include: 'pers',
      q: ''
    }
  }),
  methods: {
    ...mapActions('Role', ['setRole']),
    roleDetail (role) {
      this.setRole({ role })
      this.$router.push({ name: 'role-detail', params: { id: role.id } })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 49
    let query = { ...this.$route.query }
    if (query.hasOwnProperty('reload')) {
      this.$nextTick(() => {
        this.$refs[this.dataViewName].$emit('reload')
      })
      delete query.reload
      this.$router.replace({
        query: query
      })
    }
  }
}
</script>
