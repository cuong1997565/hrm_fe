<template >
    <v-layout ref="laylout" row fill-height>
      <v-flex xs4>
      <listting></listting>
    </v-flex>
    <v-flex xs8 class="border-e0-left">
    <v-toolbar dense color="white" flat>
        <v-toolbar-title>{{ $t('title.department.detail') }}: {{departmentDetail.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
         <v-menu :nudge-width="100" offset-y>
          <v-btn icon slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="item in 10"
              :key="item"
            >
              <v-list-tile-title v-text="item"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn v-if="canAccess('department.update')" icon @click="$router.push({name: 'department-edit', params: {id: $route.params.id}})">
                <v-icon>edit</v-icon>
        </v-btn>
        <v-btn v-if="canAccess('department.delete')" icon @click="removeConfirm()">
                <v-icon>delete</v-icon>
        </v-btn>
        <v-btn icon  @click="$router.push({name: 'department'})">
               <v-icon>close</v-icon>
        </v-btn>
    </v-toolbar>
     <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
            <p>name: {{departmentDetail.name}} </p>
            <div>
                <span style="margin-right: 10px;">status</span>
                <v-icon v-if="departmentDetail.status" color="green lighten-1">check</v-icon>
                <v-icon v-else color="grey lighten-1">lock</v-icon>
            </div>
            <p>branch name : {{departmentDetail.branch ? departmentDetail.branch.data.name : ''}} </p>
            <p>description : {{departmentDetail.branch ? departmentDetail.branch.data.description : ''}} </p>
            <p>phone :{{departmentDetail.branch ? departmentDetail.branch.data.phone : ''}}</p>
            <p>address : {{departmentDetail.branch ? departmentDetail.branch.data.address : ''}} </p>
            <p>website: {{departmentDetail.branch ? departmentDetail.branch.data.website : ''}}</p>
            <p>email: {{departmentDetail.branch ? departmentDetail.branch.data.email : ''}} </p>
            <p>facebook: {{departmentDetail.branch ? departmentDetail.branch.data.facebook : ''}}</p>
        </v-container>
    </v-flex>
     <dialog-confirm v-model="dialogDelete" @input="remove" />

    </v-layout>
</template>
<script>
import listting from './Listting'
import DialogConfirm from '@/components/DialogConfirm'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'PositionDetail',
  components: {
    listting,
    DialogConfirm
  },
  data () {
    return {
      dataViewHeight: 0,
      dialogDelete: false
    }
  },
  computed: {
    ...mapGetters('Department', ['departmentDetail'])
  },
  methods: {
    ...mapActions(['setMiniDrawer']),
    ...mapActions('Department', ['getDepartment', 'deleteDepartment']),
    ...mapActions('Dataview', ['removeDataviewEntry']),
    removeConfirm () {
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteDepartment({
          id: this.$route.params.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'department',
              data: this.departmentDetail,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.success'),
              color: 'success'
            })
            this.dialogDelete = false
            this.$router.push({ name: 'department' })
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
    console.log('id :' + this.departmentDetail.id)
    // if (!this.departmentDetail.id) {
    this.getDepartment({ departmentId: this.$route.params.id, params: { include: 'branch' } })
    // }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
    console.log(this.dataViewHeight)
  }
}
</script>
