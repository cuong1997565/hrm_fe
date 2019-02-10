<template>
  <v-layout ref="laylout" row fill-height>
    <v-flex xs4>
      <listting />
    </v-flex>
    <v-flex xs8 class="border-e0-left">
      <v-toolbar dense color="white" flat>
        <v-toolbar-title>{{ $t('title.role.edit') }}: {{roleDetail.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$router.push({name: 'role-detail', params: {id: $route.params.id}})">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
        <role-form v-if="roleDetail.id" @submit="submitForm" type="edit" :dataRole="roleDetail" />
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import RoleForm from './Form'
import Listting from './Listting'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'CreateRole',
  components: {
    RoleForm,
    Listting
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  computed: {
    ...mapGetters('Role', ['roleDetail'])
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Role', ['updateRole', 'getRole', 'setRole']),
    ...mapActions('Dataview', ['updateDataviewEntry']),
    submitForm (formData) {
      this.updateRole({
        id: this.$route.params.id,
        role: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: 'Thành công'
          })

          this.setRole({ role: response.data })

          this.updateDataviewEntry({
            name: 'role',
            data: response.data,
            key: 'id'
          })

          this.$router.push({
            name: 'role-detail',
            params: { id: this.$route.params.id }
          })
        }
      })
    }
  },
  created () {
    this.setMiniDrawer(true)
    if (!this.roleDetail.id) {
      this.getRole({ roleId: this.$route.params.id })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
  }
}
</script>
