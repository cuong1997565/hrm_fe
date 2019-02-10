<template>
  <v-layout ref="laylout" row fill-height>
    <v-flex xs4>
      <listting />
    </v-flex>
    <v-flex xs8 class="border-e0-left">
      <v-toolbar dense color="white" flat>
        <v-toolbar-title>{{ $t('title.role.detail') }}: {{roleDetail.name}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn v-if="canAccess('role.update')" icon @click="$router.push({name: 'role-edit', params: {id: $route.params.id}})">
          <v-icon>edit</v-icon>
        </v-btn>

        <v-btn v-if="canAccess('role.delete')" icon @click="removeConfirm()">
          <v-icon>delete</v-icon>
        </v-btn>

        <v-btn icon @click="$router.push({name: 'role'})">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
          <p>Tên: {{ roleDetail.name }}</p>
          <p>Slug: {{ roleDetail.slug }}</p>
          <p>Mô tả: {{ roleDetail.description }}</p>
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                placeholder="Tìm kiếm..."
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="roleDetail.pers"
              :pagination.sync="pagination"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <td>{{props.item.group}}</td>
                <td>{{props.item.name}}</td>
                <td>{{props.item.slug}}</td>
              </template>
            </v-data-table>
          </v-card>
      </v-container>
    </v-flex>
    <dialog-confirm v-model="dialogDelete" @input="remove" />
  </v-layout>
</template>

<script>
import Listting from './Listting'
import DialogConfirm from '@/components/DialogConfirm'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'RoleDetail',
  components: {
    Listting,
    DialogConfirm
  },
  data () {
    return {
      search: '',
      dataViewHeight: 0,
      headers: [
        { text: 'Nhóm quyền', value: 'group' },
        { text: 'Tên', value: 'name' },
        { text: 'slug', value: 'slug' }
      ],
      pagination: {
        sortBy: 'name'
      },
      dialogDelete: false
    }
  },
  computed: {
    ...mapGetters('Role', ['roleDetail'])
  },
  methods: {
    ...mapActions(['setMiniDrawer']),
    ...mapActions('Role', ['getRole', 'deleteRole']),
    ...mapActions('Dataview', ['removeDataviewEntry']),
    removeConfirm () {
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteRole({
          id: this.$route.params.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'role',
              data: this.roleDetail,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.success'),
              color: 'success'
            })
            this.dialogDelete = false
            this.$router.push({ name: 'role' })
          },
          error: (error) => {
            if (error.status === 404) {
              this.$store.dispatch('showNotify', {
                text: this.$t('alert.not-found'),
                color: 'warning'
              })
            }
          }
        })
      }
    }
  },
  created () {
    this.setMiniDrawer(true)
    if (!this.roleDetail.id) {
      this.getRole({
        roleId: this.$route.params.id,
        params: { include: 'pers' },
        error: (error) => {
          if (error.status === 404) {
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.not-found'),
              color: 'warning'
            })
            this.$router.push({ name: 'role' })
          }
        }
      })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
  }
}
</script>
