<template >
    <v-layout ref="laylout" row fill-height>
    <v-flex xs12 class="border-e0-left white">
    <v-toolbar dense color="white" flat>
          <v-toolbar-title>{{ $t('title.department.edit') }}: {{departmentDetail.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="$router.push({name: 'department-detail', params: {id: $route.params.id}})">
          <v-icon>close</v-icon>
        </v-btn>
    </v-toolbar>
     <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
        <DepartmentForm v-if="departmentDetail.id" @submit="submitForm" type="edit" :dataDepartment="departmentDetail"></DepartmentForm>
      </v-container>
    </v-flex>
    </v-layout>
</template>
<script>
import DepartmentForm from './Form'
import listting from './Listting'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'DepartmentDetail',
  components: {
    listting,
    DepartmentForm
  },
  data () {
    return {
      dataViewHeight: 0
    }
  },
  computed: {
    ...mapGetters('Department', ['departmentDetail'])
  },
  methods: {
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Department', ['updateDepartment', 'getDepartment', 'setDepartment']),
    ...mapActions('Dataview', ['updateDataviewEntry']),
    submitForm (formData) {
      this.updateDepartment({
        id: this.$route.params.id,
        department: formData,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: 'Thành công'
          })
          this.setDepartment({ department: response.data })
          this.updateDataviewEntry({
            name: 'department',
            data: response.data,
            key: 'id'
          })
          this.$router.push({
            name: 'department-detail',
            params: { id: this.$route.params.id }
          })
        }
      })
    }
  },
  created () {
    this.setMiniDrawer(true)
    if (!this.departmentDetail.id) {
      this.getDepartment({ departmentId: this.$route.params.id, params: { include: 'branch' } })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 48
  }
}
</script>
