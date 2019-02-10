<template>
  <v-layout ref="laylout" row fill-height>
   <v-flex xs4>
    <listting :is-mini="true" />
  </v-flex>
  <v-flex xs8 class="border-e0-left">
   <v-toolbar dense color="white" flat>
    <v-toolbar-title class="text-uppercase">{{employeeDetail.name}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip bottom>
      <v-btn slot='activator' v-if="canAccess('employee.update')" icon>
        <v-icon class="theme--light teal--text">edit</v-icon>
      </v-btn>
      <span>Sửa</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn slot="activator" v-if="canAccess('employee.delete')" icon @click="removeConfirmEmployee">
        <v-icon class='theme--light pink--text'>delete</v-icon>
      </v-btn>
      <span>Xóa</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click="$router.push({name: 'employee-hrm', query: { reload: true }} )">
        <v-icon>close</v-icon>
      </v-btn>
      <span>Đóng</span>
    </v-tooltip>
  </v-toolbar>
  <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
    <v-layout row>
      <v-flex xs4 v-if="employeeDetail.avatar_path">
        <img width="100%" style="max-height: 250px;" :src="employeeDetail.avatar_path" alt="">
      </v-flex>
      <v-flex xs8 style="padding-left:10px;">
        <v-layout>
          <v-flex xs4>
           <b>Mã nhân viên</b>
         </v-flex>
         <v-flex xs8 class="copytext">
           <span @click.stop="clickToCopy" class="click-copy"><span class="text-uppercase">{{ employeeDetail.code }}</span></span>
         </v-flex>
       </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
          <b>Tên nhân viên</b>
        </v-flex>
        <v-flex xs8>
         <span class="text-capitalize">{{ employeeDetail.name }}</span>
       </v-flex> </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
         <b>Email</b>
       </v-flex>
       <v-flex xs8 class="copytext">
         <span @click.stop="clickToCopy" class="click-copy text-capitalize">{{ employeeDetail.email }}</span>
       </v-flex> </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
         <b>Trình độ chuyên môn</b>
       </v-flex>
       <v-flex xs8>
         {{ employeeDetail.qualification }}
       </v-flex> </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
         <b>Địa chỉ</b>
       </v-flex>
       <v-flex xs8>
         {{ employeeDetail.address }}
       </v-flex> </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
         <b>Số điện thoại</b>
       </v-flex>
       <v-flex xs8 class="copytext">
         <span @click.stop="clickToCopy" class="click-copy text-capitalize">{{ employeeDetail.phone }}</span>
       </v-flex> </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
          <b>Giới tính</b>
        </v-flex>
        <v-flex xs8>
         {{ employeeDetail.gender_txt }}
       </v-flex> </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
          <b>Ngày sinh</b>
        </v-flex>
        <v-flex xs8>
         {{ employeeDetail.date_of_birth_format }}
       </v-flex> </v-layout>
       <v-layout class="mt-2">
        <v-flex xs4>
          <b>Trạng thái</b>
        </v-flex>
        <v-flex xs8>
         {{ employeeDetail.status_txt }}
       </v-flex>
     </v-layout>
   </v-flex>
 </v-layout>
 <v-flex class="mt-4" xs12 v-if="employeeDetail.departments">
  <h3>Vị trí , chức danh của nhân viên</h3>
  <v-data-table
  :headers = "headersPosition"
  :items = "employeeDetail.departments.data"
  hide-actions
  class="elevation-1 mt-2"
  >
  <template slot="items" slot-scope="props">
    <td> {{ props.item.branch_name }} </td>
    <td> {{ props.item.name }} </td>
    <td> {{ props.item.position_name }} </td>
  </template>
</v-data-table>
</v-flex>
<v-flex class="mt-4" xs12 v-if="employeeDetail.contracts">
  <h3>Hợp đồng
    <v-tooltip bottom>
      <v-btn slot="activator" v-if="canAccess('employee.create')"
      class="mr-5" icon color="primary"
      @click="addContract"
      >
      <v-icon>add</v-icon
        > </v-btn>
        <span>Thêm hợp đồng</span>
      </v-tooltip>
    </h3>
    <v-data-table
    v-if = "employeeDetail.contracts"
    id="tableContract"
    :headers="headersContract"
    :items="employeeDetail.contracts.data"
    hide-actions
    class="elevation-1 mt-2"
    >
    <template slot="items" slot-scope="props">
      <td colspan="2"> {{props.item.title}}  </td>
      <td> {{props.item.type_txt}}<br><b>Trạng thái : </b>{{ props.item.status_txt }} </td>
      <td colspan="3">
        <b>Ngày kí:</b> {{ props.item.date_sign_format }}<br>
        <b>Hiệu lực</b> {{ props.item.date_effective_format }}<br>
        <b>Kết thúc:</b> {{ props.item.date_expiration_format }}<br>
      </td>
      <td colspan="2" style="padding:2px;">
        <v-tooltip bottom class="ml-3">
          <v-btn style="margin:0px;" slot='activator' v-if="canAccess('employee.update')" @click="editContract(props.item, props.item.id )" icon>
            <v-icon size="19px" class='theme--light teal--text'>edit</v-icon>
          </v-btn>
          <span>Sửa</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn style="margin: 0px;" slot="activator" v-if="canAccess('employee.delete')" @click="removeConfirmContract(props.item.id)" icon >
            <v-icon size="19px" class="theme--light pink--text">delete</v-icon>
          </v-btn>
          <span>Xóa</span>
        </v-tooltip>
      </td>
    </template>
  </v-data-table>
</v-flex>
</v-container>
<v-dialog v-model="dialogEditContract" max-width="800px">
  <v-form  class="pa-0" @submit.prevent="submitForm" >
    <v-card class="pa-0">
      <v-card-title class="pt-3">
        <span class="headline" width="100%" style="margin:0 auto">{{ formTitle }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <!-- form edit -->
      <v-card-text id="formSub" class="pt-0">
        <v-container grid-list-md class="white scroll-y">
          <v-layout row wrap>
            <v-flex xs6 class="pr-2">
             <!-- title contract -->
             <v-text-field
             tabindex="1"
             ref="firstInput"
             v-validate="'required'"
             class="input-required"
             placeholder="Nhập tiêu đề hợp đồng"
             :error-messages="errors.has('title') ? errors.collect('title') : []"
             :data-vv-as="$t('label.title')"
             name="title"
             :label="$t('label.title')"
             v-model="contracts.title"> </v-text-field>
             <!-- type contract -->
             <v-select
             tabindex="3"
             v-validate="'required'"
             :error-messages="errors.has('type') ? errors.collect('type') : []"
             :data-vv-as="$t('label.type')"
             name="type"
             :label="$t('label.type')"
             v-model="contracts.type"
             :items="typeContract"
             item-value="value"
             item-text="name"> </v-select>
             <!-- link contract -->
             <!-- link contract -->
             <v-text-field
             placeholder="Nhập link hợp đồng"
             v-validate="'url:require_protocol'"
             :error-messages="errors.has('link_contract') ? errors.collect('link_contract') : []"
             :data-vv-as="$t('label.link_contract')"
             :tabindex="5"
             :label="'Link hợp đồng'"
             name="link_contract"
             v-model="contracts.link"> </v-text-field>
             <!-- status contract-->
             <v-select
             tabindex="7"
             v-validate="'required'"
             :error-messages="errors.has('status') ? errors.collect('status') : []"
             :data-vv-as="$t('label.status')"
             name="status"
             :label="$t('label.status')"
             v-model="contracts.status"
             :items="statusContract"
             item-value="value"
             item-text="name"> </v-select>
           </v-flex>
           <v-flex xs6 class="pl-2">
            <!-- date_sign -->
            <v-menu
            ref="sign"
            :close-on-content-click="false"
            v-model="sign"
            :nudge-right="40"
            :return-value.sync="contracts.date_sign"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            >
            <v-text-field
            slot="activator"
            v-model="contracts.date_sign"
            label="Ngày ký"
            :tabindex="5"
            readonly
            ></v-text-field>
            <v-date-picker v-model="contracts.date_sign" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="sign = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.sign.save(contracts.date_sign)">OK</v-btn>
            </v-date-picker>
          </v-menu>

          <!--date_expiration-->
          <v-menu
          ref="expiration"
          :close-on-content-click="false"
          v-model="expiration"
          :nudge-right="40"
          :return-value.sync="contracts.date_expiration"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
          >
          <v-text-field
          slot="activator"
          v-model="contracts.date_expiration"
          label="Ngày hết hạn"
          :tabindex="6"
          readonly
          ></v-text-field>
          <v-date-picker v-model="contracts.date_expiration" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="expiration = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.expiration.save(contracts.date_expiration)">OK</v-btn>
          </v-date-picker>
        </v-menu>

        <!-- date_effective -->
        <v-menu
        ref="effective"
        :close-on-content-click="false"
        v-model="effective"
        :nudge-right="40"
        :return-value.sync="contracts.date_effective"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
        >
        <v-text-field
        slot="activator"
        v-model="contracts.date_effective"
        :tabindex="7"
        label="Ngày  hiệu lực"
        readonly
        ></v-text-field>
        <v-date-picker v-model="contracts.date_effective" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="effective = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.effective.save(contracts.date_effective)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</v-container>
</v-card-text>
<v-divider></v-divider>
<v-card-actions>
  <v-spacer></v-spacer>
  <v-btn tabindex="9" color="error" flat>Hủy bỏ</v-btn>
  <v-btn tabindex="8" class="green--text text-uppercase" flat type="submit"><span v-if="editedIndex!==-1">Lưu lại</span><span v-else>Thêm mới</span></v-btn>
  <div :tabindex="8" ></div>
</v-card-actions>
</v-card>
</v-form>
</v-dialog>
</v-flex>
<dialog-confirm v-model="dialogDeleteEmployee" @input="removeEmployee" />
<dialog-confirm v-model="dialogDeleteContract" @input="removeContract" />
</v-layout>
</template>
<script>
import Listting from './Listting'
import { mapActions, mapGetters } from 'vuex'
import DialogConfirm from '@/components/DialogConfirm'
export default{
  name: 'employeeDetail',
  components: {
    Listting,
    DialogConfirm
  },
  computed: {
    // title of form Contract modal
    formTitle () {
      return this.editedIndex === -1 ? 'Thêm hợp đồng' : 'Sửa hợp đồng'
    },
    ...mapGetters('Employee', ['employeeDetail'])
  },
  data () {
    return {
      dataViewHeight: 0,
      // dialog contract
      dialogEditContract: false,
      editedIndex: -1,
      sign: null,
      expiration: null,
      effective: null,
      dialogDeleteContract: false,
      dialogDeleteEmployee: false,
      // tiêu đề của bảng chi nhánh phòng ban , chức vụ
      headersPosition: [
        { text: 'Chi nhánh', value: 'branch', sortable: false },
        { text: 'Phòng ban', value: 'department', sortable: false },
        { text: 'Chức vụ', value: 'position', sortable: false }
      ],
      // tiêu đề của bảng hợp đồng
      headersContract: [
        { text: 'Tên hợp đồng', value: 'title', sortable: false },
        { text: '', sortable: false },
        { text: 'Loai hợp đồng', value: 'type', sortable: false },
        { text: 'Thời gian', value: 'date_sign', sortable: false },
        { text: '', sortable: false },
        { text: '', sortable: false },
        { text: 'Hành động', value: 'action', sortable: false }
      ],
      // các loại hợp đồng
      typeContract: [
        { name: 'Học việc', value: 0 },
        { name: 'Cộng tác viên', value: 1 },
        { name: 'Thử việc', value: 2 },
        { name: 'Có thời hạn', value: 3 },
        { name: 'Không thời hạn', value: 4 },
        { name: 'Khác', value: 5 }
      ],
      // các trạng thái của hợp đồng
      statusContract: [
        { name: 'Tiêu chuẩn', value: 0 },
        { name: 'Chấm dứt', value: 1 },
        { name: 'Gia hạn', value: 2 }
      ],
      // data constracts
      contracts:
      {
        id: '',
        employee_id: '',
        status: 0,
        type: 0,
        date_sign: null,
        date_effective: null,
        date_expiration: null
      }
    }
  },
  watch: {

  },
  methods: {
    ...mapActions('Employee', ['getEmployee', 'deleteEmployee']),
    ...mapActions('Contracts', ['createContract', 'updateContract', 'deleteContract']),
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry']),
    ...mapActions(['showNotify']),
    addContract () {
      this.$validator.reset()
      this.editedIndex = -1
      this.contracts = Object.assign({}, this.defaultContract)
      this.contracts.employee_id = this.employeeDetail.id
      this.dialogEditContract = true
    },
    // edit contract
    editContract (item, id) {
      this.$validator.reset()
      this.idContract = id
      this.editedIndex = 1
      this.contracts = Object.assign({}, item)
      this.dialogEditContract = true
    },
    // them hoac sua contract employee
    addAndEditContract () {
      if (this.editedIndex === -1) {
        this.createContract({
          contract: this.contracts,
          cb: (response) => {
            setTimeout(() => {
              this.contracts = Object.assign({}, this.defaultContract)
              this.editedIndex = -1
            }, 300)
            this.showNotify({
              color: 'success',
              text: this.$t('alert.addContract')
            })
            this.getEmployee({
              employeeId: this.$route.params.id,
              params: { include: 'roles,departments,contracts' },
              cb: (response) => {
                this.updateDataviewEntry({
                  name: 'employee',
                  data: response,
                  key: 'id'
                })
              }
            })
            this.dialogEditContract = false
          }
        })
      } else {
        this.updateContract({
          id: this.idContract,
          contract: this.contracts,
          cb: (response) => {
            this.showNotify({
              color: 'success',
              text: this.$t('alert.updateContract')
            })
            setTimeout(() => {
              this.contracts = Object.assign({}, this.defaultContract)
              this.editedIndex = -1
            }, 300)
            this.getEmployee({
              employeeId: this.$route.params.id,
              params: { include: 'roles,departments,contracts' },
              cb: (response) => {
                this.updateDataviewEntry({
                  name: 'employee',
                  data: response,
                  key: 'id'
                })
              }
            })
            this.dialogEditContract = false
          }
        })
      }
    },
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.addAndEditContract()
        }
      })
    },
    // xóa contract
    removeConfirmContract (idContract) {
      this.contracts.id = idContract
      this.dialogDeleteContract = true
    },
    removeContract (confirm) {
      if (confirm) {
        this.deleteContract({
          id: this.contracts.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'contract',
              data: this.contracts,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.deleteContract'),
              color: 'success'
            })
            this.dialogDeleteContract = false
            this.getEmployee({
              employeeId: this.$route.params.id,
              params: { include: 'roles,departments,contracts' },
              cb: (response) => {
                this.updateDataviewEntry({
                  name: 'employee',
                  data: response,
                  key: 'id'
                })
              }
            })
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
    },
    removeConfirmEmployee () {
      this.dialogDeleteEmployee = true
    },
    removeEmployee (confirm) {
      if (confirm) {
        this.deleteEmployee({
          id: this.$route.params.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'employee',
              data: this.employeeDetail,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.deleteEmployeeSuccess'),
              color: 'success'
            })
            this.dialogDeleteEmployee = false
            this.$router.push({ name: 'employee' })
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
    if (!this.employeeDetail.id) {
      this.getEmployee({ employeeId: this.$route.params.id, params: { include: 'roles,departments,contracts' } })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 50
  }

}
</script>
<style scoped>
  #tableContract td{
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
