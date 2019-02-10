<template>
  <v-form  @submit.prevent="validateBeforeSubmit">
     <v-container fluid>
        <v-layout row wrap>
         <v-flex xs12>
            <v-text-field
              :error-messages="errors.has('name') ? errors.collect('name') : []"
              v-validate="'required|min:3'"
              :data-vv-as="$t('label.name')"
              name="name"
              :label="$t('label.name') + '*'"
              v-model="department.name">
            </v-text-field>
          </v-flex>

            <v-flex xs12>
               <v-select v-validate="'required'"
              :error-messages="errors.has('status') ? errors.collect('status') : []"
               :data-vv-as="$t('label.status')" name="status" :label="$t('label.status')"
                v-model="department.status" :items="items" item-value="id" item-text="name">
              </v-select>
          </v-flex>
          <v-flex xs12>
            <v-select v-validate="'required'"
                :error-messages="errors.has('branch_id') ? errors.collect('branch_id') : []"
                :data-vv-as="$t('label.branch_id')"
                name="branch_id"
                v-model="department.branch_id"
                 :label="$t('label.branch_id')"
                 :items="branchAll"
                 v-if="Array.isArray(branchAll)"
                 item-value="id"
                 item-text="name"
                 placeholder="Xin vui lòng nhập vào chi nhánh "
                 >
          </v-select>
          </v-flex>
         <v-flex xs12 text-xs-center>
          <v-btn
            :loading="isFetchingApi"
            :disabled="isFetchingApi"
            color="primary"
            type="submit"
          >
            <template v-if="isCreate">
              <v-icon left>add</v-icon> {{$t('control.create')}}
            </template>
            <template v-else>
              <v-icon left>save</v-icon> {{$t('control.save')}}
            </template>
         </v-btn>
         </v-flex>

        </v-layout>
     </v-container>
  </v-form>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default{
  name: 'DepartmentForm',
  computed: {
    ...mapGetters(['isFetchingApi']),
    ...mapGetters('Branch', ['branchAll']),
    isCreate () {
      return this.type === 'create'
    }
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataDepartment: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      menu: false,
      department: {
        name: '',
        status: '',
        branch_id: '',
        branch: {
          data: {
            id: ''
          }
        }
      },

      items: [
        {
          'id': '',
          'name': '-- Su lua chon ---'
        },
        {
          'id': 1,
          'name': 'Hiển thị'
        },
        {
          'id': 0,
          'name': 'Không hiển thị'
        }
      ]

    }
  },

  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Branch', ['getBranch']),
    setInitData () {
      let dataDepartment = { ...this.dataDepartment }
      this.department = { ...this.department, ...dataDepartment }
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$emit('submit', this.department)
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    }
  },

  created () {
    this.getBranch()
    !!this.dataDepartment && this.setInitData()
  }
}
</script>
