    <template class="paddingContainer">
      <v-form @submit.prevent="validateBeforeSubmit">
        <v-container fluid class="paddingContainer">
          <v-layout row wrap class="marTop-22">
            <v-flex xs6 class="pr-2">
              <!-- title contract -->
              <v-text-field
              placeholder="Nhập tiêu đề hợp đồng"
              :error-messages="errors.has('title_contract') ? errors.collect('title_contract') : []"
              v-validate="'required'"
              :data-vv-as="$t('label.title_contract')"
              ref="firstInput"
              :tabindex="1"
              :label="$t('label.title_contract')"
              class="input-required"
              name="title_contract"
             autofocus="autofocus"
              v-model="contract.title"> </v-text-field>
              <!-- type contract -->
            </v-flex>
            <v-flex xs6 class="pr-2">
             <v-autocomplete
             v-model="contract.employee_id"
             :items="listtingEmployee"
             v-if="Array.isArray(listtingEmployee)"
             @keyup="sreachEmployee"
             @click:clear="clearContract"
             @blur="closeBlur()"
             :error-messages="errors.has('user_id') ? errors.collect('user_id') : []"
             v-validate="'required'"
             :item-text="twoparams"
             clearable
             item-value="id"
             placeholder="Chọn tên nhân viên"
             :label="$t('label.user_id')"
             class="input-required"
             :data-vv-as="$t('label.user_id')"
             name="user_id"
             :loading="isLoadingEmployee"
             :tabindex="2"
            >
              <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color: blue">
                  Không có tên nhân viên trong hệ thống
                </v-list-tile-title>
              </v-list-tile>
            </template>
              <template slot="item" slot-scope="{ item }" >
                  {{ item.name }} - {{ item.phone }}
              </template>
            </v-autocomplete>
         </v-flex>
       </v-layout>
       <v-layout row wrap class="marTop-22">
        <v-flex xs6>
         <v-select
         v-validate="'required'"
         :error-messages="errors.has('status') ? errors.collect('status') : []"
         :data-vv-as="$t('label.status')"
         name="status"
         :label="$t('label.status')"
         v-model="contract.status"
         :items="status"
         item-value="id"
         item-text="name"
         :tabindex="3"
        >
       </v-select>
     </v-flex>
     <v-flex xs6>
      <v-select
      v-validate="'required'"
      :error-messages="errors.has('type') ? errors.collect('type') : []"
      :data-vv-as="$t('label.type')"
      name="type"
      :label="$t('label.type')"
      v-model="contract.type"
      :items="types"
      item-value="id"
      item-text="name"
      :tabindex="4"
      > </v-select>
      <!-- status contract-->
    </v-flex>
  </v-layout>

  <v-layout row wrap class="marTop-22">
    <v-flex xs6>
      <!-- date_sign -->
      <v-menu
      ref="sign"
      :close-on-content-click="false"
      v-model="sign"
      :nudge-right="40"
      :return-value.sync="contract.date_sign"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
      >
      <v-text-field
      slot="activator"
      v-model="contract.date_sign"
      label="Ngày ký"
      :tabindex="5"
      readonly
      ></v-text-field>
      <v-date-picker v-model="contract.date_sign" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="sign = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.sign.save(contract.date_sign)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </v-flex>

  <v-flex xs6>
   <!--date_expiration-->
        <v-menu
      ref="expiration"
      :close-on-content-click="false"
      v-model="expiration"
      :nudge-right="40"
      :return-value.sync="contract.date_expiration"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
      >
      <v-text-field
      slot="activator"
      v-model="contract.date_expiration"
      label="Ngày hết hạn"
      :tabindex="6"
      readonly
      ></v-text-field>
      <v-date-picker v-model="contract.date_expiration" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="expiration = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.expiration.save(contract.date_expiration)">OK</v-btn>
      </v-date-picker>
    </v-menu>
</v-flex>
</v-layout>

<v-layout row wrap class="marTop-22 marButton-22">
  <v-flex xs6>
    <!-- date_effective -->
      <v-menu
      ref="effective"
      :close-on-content-click="false"
      v-model="effective"
      :nudge-right="40"
      :return-value.sync="contract.date_effective"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
      >
      <v-text-field
      slot="activator"
      v-model="contract.date_effective"
      :tabindex="7"
      label="Ngày  hiệu lực"
      readonly
      ></v-text-field>
      <v-date-picker v-model="contract.date_effective" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="effective = false">Cancel</v-btn>
        <v-btn flat color="primary" @click="$refs.effective.save(contract.date_effective)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </v-flex>
  <v-flex xs6>
   <v-text-field
   v-validate="'url:require_protocol'"
  :error-messages="errors.has('link_contract') ? errors.collect('link_contract') : []"
   placeholder="Nhập link hợp đồng"
   :data-vv-as="$t('label.link_contract')"
   :tabindex="8"
   :label="$t('label.link_contract')"
   name="link_contract"
   v-model="contract.link"> </v-text-field>
 </v-flex>
</v-layout>
<v-flex xs12 text-xs-center class="marTop-22">
  <v-btn
  :loading="isFetchingApi"
  :disabled="isFetchingApi"
  :tabindex="9"
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
<div :tabindex="10"  @focus="backTabIndex"></div>
</v-flex>
</v-container>
</v-form>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default{
  name: 'ContractForm',
  computed: {
    ...mapGetters(['isFetchingApi']),
    ...mapGetters('Employee', ['employeeAll']),
    ...mapActions('Contracts', ['getContract']),
    ...mapGetters('Contracts', ['contractDetail']),
    isCreate () {
      return this.type === 'create'
    }
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataContract: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      menu: null,
      sign: null,
      expiration: null,
      effective: null,
      isLoadingEmployee: false,
      dateSign: false,
      dateEffective: false,
      listtingEmployee: [],
      dateExpiration: false,
      contract: {
        code: '',
        title: '',
        type: 0,
        status: 0,
        date_sign: '',
        date_effective: '',
        date_expiration: '',
        employee_id: '',
        link: ''
      },
      types: [
        { 'id': 0, 'name': 'Học việc' },
        { 'id': 1, 'name': 'Cộng tác viên' },
        { 'id': 2, 'name': 'Thử việc' },
        { 'id': 3, 'name': 'Có thời hạn' },
        { 'id': 4, 'name': 'Không thời hạn' },
        { 'id': 5, 'name': 'Khác' }
      ],
      status: [
        { 'id': 0, 'name': 'Tiêu chuẩn' },
        { 'id': 1, 'name': 'Chấm dứt' },
        { 'id': 2, 'name': 'Gia hạn' }
      ]
    }
  },
  watch: {
    dataContract (value) {
      this.setInitData()
      // mặc định lấy 10 bản ghi
      console.log('data value ', value)
      if (value.id) {
        // this.getEmployees({ params: { q: value.employee_name, limit: 10 } })
        this.listtingEmployee.push(value.employee.data)
      }
    },
    dateSign (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    dateEffective (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    dateExpiration (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }

  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Employee', ['getEmployees', 'setEmployee', 'getEmployeesForm']),
    clearContract () {
      // this.getEmployees({ params: { limit: 10 } })
      this.getEmployeesForm({
        params: { limit: 10 },
        cb: (params) => {
          this.listtingEmployee = params
        }
      })
    },

    closeBlur () {
      if (this.contract.id && this.contract.employee_id !== this.contract.employee.data.id) {
        console.log('co thay doi')
      } else if (this.contract.employee && this.contract.id) {
        console.log('set data employees')
        // this.setEmployee({
        //   employees: [this.contract.employee.data]
        // })
        this.listtingEmployee.push(this.contract.employee.data)
        //  console.log("data employee 1:",this.contract.employee.data);
        // console.log("data employee :",  this.employeeAll);
      }
    },
    // Passes 2 parameters to item text selectbox
    twoparams (item) {
      return item.name + ' - ' + item.phone
    },
    // screach employee
    sreachEmployee (value) {
      this.getEmployeesForm({
        params: { q: value.target.value, limit: 10 },
        cb: (params) => {
          this.listtingEmployee = params
        }

      })
      this.isLoadingEmployee = true
      setTimeout(() => {
        this.isLoadingEmployee = false
      }, 1000)
    },
    // autofocus firsrtInput
    backTabIndex () {
      this.$refs.firstInput.focus()
    },
    // save date
    save (date) {
      this.$refs.dateSign.save(date)
      this.$refs.dateEffective.save(date)
      this.$refs.dateExpiration.save(date)
    },
    // thời gian đăng kí , có hiệu lực hợp đồng
    dateConstract () {
      let today = moment().format('YYYY-MM-DD')
      this.contract.date_sign = today
      this.contract.date_effective = today
      this.contract.date_expiration = today
    },
    // thời gian kết thúc hợp đồng
    dateExpirationConstract () {
      let today = new Date()
      let dd = today.getDate()
      let mm = today.getMonth() + 3
      let yyyy = today.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd
      this.contract.date_expiration = today
    },
    setInitData () {
      let dataContract = { ...this.dataContract }
      this.contract = { ...this.contract, ...dataContract }
      if (this.$route.params.id) {
        this.listtingEmployee.push(this.contract.employee.data)
      }
    },
    // validator form
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          console.log('data validateBeforeSubmit :', result)
          this.$emit('submit', this.contract)
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    }
  },
  mounted () {
    if (!this.listtingEmployee.length && !this.$route.params.id) {
      this.getEmployeesForm({
        params: { limit: 10 },
        cb: (params) => {
          this.listtingEmployee = params
        }
      })
    }
  },
  created () {
    this.dateExpirationConstract()
    this.dateConstract()
    !!this.dataContract && this.setInitData()
  }
}
</script>
<style scoped>
  .marTop-22{
   margin-top: -22px !important;
 }
 .marButton-22{
  margin-bottom: 22px !important;
}
.paddingContainer{
  padding: 0px 24px 24px 24px !important
}
</style>
