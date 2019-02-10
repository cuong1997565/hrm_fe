<template>
  <v-layout ref="laylout" column fill-height>
    <div ref="header">
      <!-- this.getBranchs({ q: item.branch_name }) -->
      <v-toolbar height="50px" color="white" flat>
        <v-layout row wrap>
          <v-flex xs1 :class="isMini && 'max-width-col-2'">
            <v-tooltip bottom>
              <v-btn slot="activator" v-if="canAccess('employee.create')" class="mr-3 mt-3" icon color="primary" @click="$router.push({name: 'employee-create'})">
                <v-icon>add</v-icon>
              </v-btn>
              <span>Thêm mới</span>
            </v-tooltip>
          </v-flex>
          <!-- v-model="params.q" -->
          <v-flex xs7 class="mt-1" :class="isMini && 'full-flex-basic full-width-col-10'">
            <v-text-field
            hide-details
            single-line
            placeholder="Nhập tên, sđt, email ..."
            v-model="filterQ"
            @keyup="changeSearch"
            clearable
            @click:clear="clearSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs3 class='mt-1' :class="isMini && 'd-none'">
            <!-- filter by status -->
            <v-select
            class='ml-2'
            @change="filter"
            placeholder="Trạng thái"
            item-text="status_txt"
            item-value="status"
            :items="statusEmployee"
            v-model="filterByStatus"
            menu-props="auto"
            hide-details
            single-line
            clearable
            ></v-select>
          </v-flex>
          <!--  -->
          <v-menu
          :class="isMini && 'd-none'"
          :close-on-content-click="false"
          :nudge-width="400"
          absolute
          v-model="filterMore"
          right
          >
          <v-btn slot="activator" icon color="primary" class="mt-3 ml-4">
            <v-icon>list</v-icon>
          </v-btn>
          <v-card>
            <v-list class="pa-0">
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="text-xs-center text-bold ml-4">Lọc nhiều hơn</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon @click="filterMore = false">
                    <v-icon color="primary">close</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-flex xs12>
              <!-- birth_day -->
              <v-menu
              ref="dateOfBirth"
              :close-on-content-click="false"
              v-model="dateOfBirth"
              :nudge-right="40"
              lazy transition="scale-transition"
              offset-y
              full-width
              min-width="290px">
              <v-text-field
              style="margin-top: 0px;"
              class="pl-2 pr-2"
              placeholder="Ngày, tháng, năm sinh"
              slot="activator"
              v-model="filterByDateOfBirth"
              clearable
              @click:clear="clearDateBirth"
              readonly > </v-text-field>
              <v-date-picker
              ref="picker"
              v-model="filterByDateOfBirth"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="save"> </v-date-picker> </v-menu>
              <!-- tháng sinh -->
              <v-select
              class='pl-2 pr-2'
              style="margin-top: -4px;"
              @change="filter"
              placeholder="Tháng sinh"
              item-text="name"
              item-value="value"
              v-if="Array.isArray(monthBirths)"
              :items="monthBirths"
              v-model="filterByMonthBirth"
              menu-props="auto"
              hide-details
              single-line
              clearable
              ></v-select>
              <!-- type contract -->
              <v-autocomplete
              class='ml-2 mr-2 mt-3'
              @change="filter"
              placeholder="Loại hợp đồng"
              item-text="type_txt"
              item-value="type"
              v-if="Array.isArray(contractDetail)"
              :items="contractDetail"
              @keyup="sreachContract"
              v-model="filterByTypeContract"
              menu-props="auto"
              hide-details
              single-line
              clearable
              >
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-title style="color:blue">
                    Không tìm thấy loại hợp đồng
                  </v-list-tile-title>
                </v-list-tile>
              </template>
            </v-autocomplete>
            <!-- date First contract -->
            <v-menu
            ref="dateFirst"
            :close-on-content-click="false"
            v-model="dateFirst"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
            >
            <v-text-field
            style="margin-top: 17px;"
            slot="activator"
            v-model="filterByDateFirstContract"
            clearable
            persistent-hint
            class='ml-2 mr-2'
            placeholder="Ngày vào công ty"
            @click:clear="clearDateFirstContract"
            ></v-text-field>
            <v-date-picker @change="filter" v-model="filterByDateFirstContract"
            no-title @input="dateFirst = false"></v-date-picker>
          </v-menu>
<!-- dateExpiration
          <template>
            <v-menu
            ref="dateExpiration"
            :close-on-content-click="false"
            v-model="dateExpiration"
            :nudge-right="40"
            lazy transition="scale-transition"
            offset-y
            full-width
            min-width="290px">
            <v-text-field
            style="margin-top: -5px;"
            class='ml-2 mr-2'
            placeholder="Ngày kết thúc hợp đồng"
            slot="activator"
            v-model="filterByDateExpirationContract"
            clearable
            readonly> </v-text-field>
            <v-date-picker
            v-model="filterByDateExpirationContract"
            no-title @input="dateExpiration = false"
            ></v-date-picker> </v-menu>
          </template> -->
        </v-flex>
      </v-card>
    </v-menu>
  </v-layout>
</v-toolbar>
<!-- filter by department -->
<!-- v-if="isDepartment" -->
<v-toolbar height="50px" color="white" flat :class="isMini && 'd-none'">
  <v-layout row wrap v-if="!isMini">
    <v-flex xs4 class="pt-0" :class="isMini && 'd-none'">
      <v-autocomplete
      class='ml-2'
      @change="changeBranch"
      placeholder="Chọn chi nhánh"
      :items="branchAll"
      v-if="Array.isArray(branchAll)"
      @keyup="sreachBranch"
      :loading="isLoadingBranch"
      item-text="name"
      item-value="id"
      v-model="filterByBranch"
      hide-details
      single-line
      clearable
      @click:clear="clearBranch">
      <template slot="no-data">
        <v-list-tile>
          <v-list-tile-title style="color:blue">
            Không tìm thấy chi nhánh
          </v-list-tile-title>
        </v-list-tile>
      </template>
    </v-autocomplete>
  </v-flex>
  <v-flex xs4 :class="isMini && 'd-none'">
    <v-autocomplete
    :disabled = "!filterByBranch"
    class='ml-2'
    @change="ChangeDepartment"
    v-if="Array.isArray(departmentByBranch)"
    placeholder="Chọn phòng ban"
    :items="departmentByBranch"
    item-text="name"
    item-value="id"
    v-model="filterByDepartment"
    hide-details
    single-line
    clearable
    @click:clear="clearDepartment"
    >
    <template slot="no-data" style="color:blue">
      <v-list-tile>
        <v-list-tile-title>
          Không tìm thấy phòng ban
        </v-list-tile-title>
      </v-list-tile>
      </template
      >
    </v-autocomplete>
  </v-flex>
  <v-flex xs3 :class="isMini && 'd-none'">
    <v-autocomplete
    class='ml-2'
    @change="filter"
    placeholder="Chọn chức danh"
    v-if="Array.isArray(positionAll)"
    :items="positionAll"
    :loading="isLoadingPosition"
    @keyup="sreachPosition"
    item-text="name"
    item-value="id"
    v-model="filterByPosition"
    hide-details
    single-line
    clearable
    @click:clear="filter"
    >
    <template slot="no-data">
      <v-list-tile>
        <v-list-tile-title style="color:blue">
          Không tìm thấy chức danh
        </v-list-tile-title>
      </v-list-tile>
      </template
      >
    </v-autocomplete>
  </v-flex>
  <v-flex xs1>
    <v-tooltip bottom>
      <v-btn class="mt-3 ml-4" slot="activator" icon color="primary" @click="resetForm()">
        <v-icon>close</v-icon>
      </v-btn>
      <span>Reset bộ lọc</span>
    </v-tooltip>
  </v-flex>
</v-layout>
</v-toolbar>
<v-toolbar height="45px" color="white" flat v-if="!isMini">
  <v-layout>
    <v-flex style="flex-basis:55px;" sm1 class="text-bold">
      #
    </v-flex>
    <v-flex sm1 class="text-bold">
      Hình ảnh
    </v-flex>
    <v-flex sm4 class="text-bold">
      Thông tin nhân viên
    </v-flex>
    <v-flex sm2 class="text-bold">
      Chi nhánh
    </v-flex>
    <v-flex sm2 class="text-bold">
      Phòng ban
    </v-flex>
    <v-flex sm2 class="text-bold">
      Chức danh
    </v-flex>
    <v-flex style="flex-basis:100px;" sm2 class="text-bold mr-3">
      Hành động
    </v-flex>
  </v-layout>
</v-toolbar>
</div>
<v-flex xs12 class="border-e0-top">
  <data-view
  :name="dataViewName"
  api-url="employees"
  v-if="dataViewHeight"
  :viewHeight="dataViewHeight"
  :params="filterParams"
  :ref="dataViewName"
  >
  <template slot-scope="{items}">
    <v-list three-line>
      <template  v-for="(item, index) in items.data">
        <v-list-tile
        :key="'item' + item.id"
        avatar
        @click="employeeDetail(item)"
        :inactive="item.id === $route.params.id"
        :class="item.id === $route.params.id && 'grey lighten-2'"
        >
        <v-layout class="pa-2">
          <v-flex style="flex-basis:55px;" sm1 :class="isMini && 'd-none'">
            {{index + 1}}
          </v-flex>
          <v-flex xs1>
            <v-flex :class="isMini && 'd-none'">
              <img width="80%" height='60px' :src="item.avatar_path" alt="">
            </v-flex>
            <v-flex style="margin-top:-10px !important;">
              <!-- <b>GT: </b> -->
            </v-flex>
          </v-flex>
          <!-- imfomation -->
          <v-flex sm4 :class="isMini && 'full-flex-basic full-max-width'">
            {{ item.name}} -
            <small>
            <!--                 <span v-if="item.gender_txt==='Nam'" style="color: blue;">{{ item.gender_txt }}</span>
              <span v-if="item.gender_txt==='Nữ'" style="color: #AA00FF;">{{ item.gender_txt }}</span> -->
              <span style="color: green;">{{ item.gender_txt }}</span>
            </small>
            <!--               <v-tooltip bottom v-if="item.gender_txt==='Nam'">
                <v-icon slot="activator" color="blue">fa fa-mars</v-icon>
                <span>Nam</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.gender_txt==='Nữ'">
                <v-icon slot="activator" color="pink">fa fa-venus</v-icon>
                <span>Nữ</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.gender_txt==='Khác'">
                <v-icon slot="activator" color="green">fa fa-venus-mars</v-icon>
                <span>Giới tính khác</span>
              </v-tooltip> -->
              <v-list-tile-sub-title  class="text--primary copytext" v-if="item.email" :class="isMini && 'd-none'">
                <v-icon size="16px">email</v-icon>
                <span @click.stop="clickToCopy" class="click-copy">{{ item.email }}</span>
              </v-list-tile-sub-title>
              <v-list-tile-sub-title class="text--primary copytext" v-if="item.phone" :class="isMini && 'd-none'">
                <v-flex :id="'phone'+index"><v-icon size="16px">phone</v-icon>
                  <span @click.stop="clickToCopy" class="click-copy">{{ item.phone }}</span>
                </v-flex>
              </v-list-tile-sub-title>
            </v-flex>
            <!-- end infomation -->
            <v-flex sm2>
              <v-flex v-if="item.departments" :class="isMini && 'd-none'">
                <v-flex :key="index" v-for="(branch, index) in item.departments.data" class='pr-2'>
                  {{ branch.branch_name }}
                </v-flex>
              </v-flex>
            </v-flex>
            <v-flex sm2 :class="isMini && 'd-none'" >
              <v-flex v-if="item.departments">
                <v-flex class="pr-2" :key="index" v-for="(department, index) in item.departments.data">
                  {{ department.name }}
                </v-flex>
              </v-flex>
            </v-flex>
            <v-flex sm2 :class="isMini && 'd-none'" >
              <v-flex v-if="item.departments">
                <v-flex :key="index" v-for="(department, index) in item.departments.data">
                  {{ department.position_name }}
                </v-flex>
              </v-flex>
            </v-flex>
            <v-flex style="flex-basis:100px;" sm2 :class="isMini && 'd-none'">
             <v-tooltip bottom sm6>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('employee.update')" icon @click.stop="editEmployee(item.id, item)">
                <v-icon class='theme--light teal--text'>edit</v-icon>
              </v-btn>
              <span>Sửa</span>
            </v-tooltip>
            <v-tooltip bottom sm6>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('employee.delete')" icon @click.stop="removeConfirm(item)">
                <v-icon class="theme--light pink--text">delete</v-icon>
              </v-btn>
              <span>Xóa</span>
            </v-tooltip>
            <v-layout row xs12>
              <v-flex xs6>
                <v-tooltip bottom>
                  <v-switch
                  @click.native.stop
                  @change="changeStatus(item.id)"
                  name="status"
                  slot="activator"
                  v-model="item.status"
                  ></v-switch>
                  <span v-if="item.status">Kích hoạt</span>
                  <span v-else>Không kích hoạt</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs6 style="margin-left: -15px;">
                <v-tooltip bottom v-if="!item.has_account">
                  <v-btn slot="activator" icon  @click.stop="addAccount(item)" style="margin-top: 0px;">
                    <v-icon color="orange" size="15px">fa-user-plus</v-icon>
                  </v-btn>
                  <span> Tạo tài khoản </span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-divider
      :key="'div' + item.id"
      v-if="index + 1 < items.data.length"
      ></v-divider>
    </template>
  </v-list>
</template>
</data-view>
</v-flex>
<dialog-confirm v-model="dialogDelete" @input="remove" />
<!-- dialog create and edit -->
<v-dialog v-model="dialogAccount" max-width="700px">
  <v-form @submit.prevent="submitFormAccount">
    <v-card class="pa-0">
      <v-card-title class="pa-0 pt-3">
        <span class="headline" width="100%"  style="margin:0 auto">Tạo tài khoản: {{ valAccount.email }}  </span>
      </v-card-title>
      <!-- form edit -->
      <v-card-text id="formSub" class="pt-0">
        <v-container grid-list-md class="white scroll-y">
          <!-- password -->
          <v-text-field
          placeholder="Nhập mật khẩu"
          :error-messages="errors.has('password') ? errors.collect('password') : []" v-validate="'required|min:6'"
          :data-vv-as="$t('label.password')"
          :autofocus="true"
          tabindex="1"
          ref="password"
          name="password"
          :label="$t('label.password')"
          class="input-required"
          type="password"
          v-model="accountUser.password"> </v-text-field>
          <!-- password confirm -->
          <v-text-field
          tabindex="2"
          placeholder="Nhập lại mật khẩu"
          :error-messages="errors.has('password_confirmation') ? errors.collect('password_confirmation') : []"
          v-validate="'required|confirmed:'+accountUser.password"
          :data-vv-as="$t('label.password_confirmation')"
          name="password_confirmation"
          :label="$t('label.password_confirmation')"
          class="input-required"
          type="password"
          v-model="accountUser.password_confirmation"> </v-text-field>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn tabindex="4" color="error" flat @click.native="closeAccount">Hủy bỏ</v-btn>
        <v-btn tabindex="3" class="green--text" flat type="submit">Thêm mới</v-btn>
        <div :tabindex="4"  @focus="backTabIndex"></div>
      </v-card-actions>
    </v-card>
  </v-form>
</v-dialog>
</v-layout>
</template>
<script>
import DialogConfirm from '@/components/DialogConfirm'
import { debounce } from 'lodash'
import DataView from '@/components/DataView/DataView'
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
export default{
  name: 'employeeListting',
  props: {
    isMini: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DataView,
    DialogConfirm
  },
  data: () => ({
    copyToText: true,
    // lọc nhiều hơn
    filterMore: false,
    isLoadingBranch: false,
    isLoadingContract: false,
    isLoadingPosition: false,
    // filter by date
    dialog: false,
    dialogAccount: false,
    valAccount: {
      email: null
    },
    accountUser: {
      password: null,
      password_confirmation: null
    },
    date: null,
    monthBirths: [
      { name: 'Tháng một', value: 1 },
      { name: 'Tháng hai', value: 2 },
      { name: 'Tháng ba', value: 3 },
      { name: 'Tháng bốn', value: 4 },
      { name: 'Tháng năm', value: 5 },
      { name: 'Tháng sáu', value: 6 },
      { name: 'Tháng bảy', value: 7 },
      { name: 'Tháng tám', value: 8 },
      { name: 'Tháng chín', value: 9 },
      { name: 'Tháng mười', value: 10 },
      { name: 'Tháng mười một', value: 11 },
      { name: 'Tháng mưới hai', value: 12 }
    ],
    dateOfBirth: false,
    // end filter by date
    branches: [],
    contracts: [],
    dateContract: '',
    positions: [],
    dialogDelete: false,
    dateFirst: false,
    dateExpiration: false,
    dataViewHeight: 0,
    dataViewName: 'employee',
    departments: [],
    idEmployee: null,
    dataEmployee: {},
    employee: {
      status: true
    },
    statusEmployee: [
      { status_txt: 'Kích hoạt', status: 1 },
      { status_txt: 'Không kích hoạt', status: 0 }
    ]
  }),
  computed: {
    ...mapGetters('Department', ['departmentByBranch']),
    ...mapGetters('Branch', ['branchAll']),
    ...mapGetters('Employee', ['filterParams']),
    ...mapGetters('Contracts', ['contractDetail']),
    ...mapGetters('Position', ['positionAll']),
    ...mapGetters(['isFetchingApi']),
    ...mapFields(`Employee`, {
      filterQ: 'params.q',
      filterByStatus: 'params.status',
      filterByBranch: 'params.branchId',
      filterByDepartment: 'params.departmentId',
      filterByPosition: 'params.positionId',
      filterByDateOfBirth: 'params.dateOfBirth',
      filterByMonthBirth: 'params.monthOfBirth',
      filterByTypeContract: 'params.contractType',
      filterByDateFirstContract: 'params.dateOfFirstContract',
      filterByDateExpirationContract: 'params.dateExpiration'
    })
  },
  watch: {
    // auto focue when create accoute
    dialogAccount (val) {
      if (!val) return
      requestAnimationFrame(() => {
        this.$refs.password.focus()
      })
    },
    dateOfBirth (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    // filterByDateFirstContract (val) {
    //   this.dateFirst = this.formatDate(this.date)
    // },
    filterByDateExpirationContract (val) {
      this.dateExpiration = this.formatDate(this.date)
    },
    filterParams (val) {
      this.filterParams = val
    }
  },
  methods: {
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry', 'setDataview']),
    ...mapActions('Employee', ['getEmployee', 'deleteEmployee', 'updateStatusEmployee', 'clearFilter', 'clearFilterBranch', 'clearFilterDateBirth', 'clearFilterDateFirstContract']),
    ...mapActions(['showNotify']),
    ...mapActions('Department', ['getDepartmentForEmployee']),
    ...mapActions('Branch', ['getBranchs']),
    ...mapActions('Contracts', ['fetchContract']),
    ...mapActions('Position', ['fetchPosition']),
    ...mapActions('User', ['createUser']),
    ...mapActions(['fetchApi']),
    addAccount (valueAccount) {
      this.$validator.reset()
      this.accountUser.password = ''
      this.accountUser.password_confirmation = ''
      this.valAccount = valueAccount
      this.dialogAccount = true
      this.passWordDialog = true
    },
    // địng dạng hiển thị cho các trường date
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`
    },
    backTabIndex () {
      this.$refs.firstInput.focus()
    },
    closeAccount () {
      this.dialogAccount = false
    },
    submitFormAccount () {
      this.accountUser.name = this.valAccount.name
      this.accountUser.email = this.valAccount.email
      this.accountUser.phone = this.valAccount.phone
      console.log('this.accountUser', this.accountUser)
      this.$validator.validateAll().then(result => {
        if (result) {
          this.createUser({
            user: this.accountUser,
            cb: (response) => {
              let object = Object.assign({}, this.valAccount)
              console.log('this.accountUser', this.valAccount)
              object.has_account = true
              this.updateDataviewEntry({
                name: 'employee',
                data: object,
                key: 'id'
              })
              this.showNotify({
                color: 'success',
                text: this.$t('alert.accountSuccess')
              })
              this.setDataview({
                name: 'user',
                data: [],
                uniqueKey: 'id'
              })
              this.dialogAccount = false
            }
          })
        }
      })
    },
    employeeDetail (employee) {
      this.clearFilter()
      this.filter()
      this.getEmployee({ employeeId: employee.id, params: { include: 'roles,departments,contracts' } })
      // this.clearFilter()
      this.$router.push({ name: 'employee-detail', params: { id: employee.id } })
    },
    save (date) {
      this.$refs.dateOfBirth.save(date)
      this.filter()
    },
    clearSearch () {
      this.changeSearch()
      this.filter()
    },
    clearDepartment () {
      this.changeSearch()
    },
    clearBranch () {
      this.getBranchs({ params: { limit: 10 } })
      this.clearFilterBranch()
      this.changeSearch()
    },
    clearDateBirth () {
      this.clearFilterDateBirth()
      this.changeSearch()
    },
    clearDateFirstContract () {
      this.clearFilterDateFirstContract()
      this.changeSearch()
    },
    resetForm () {
      this.clearFilter()
      this.filter()
    },
    changeSearch: debounce(function () {
      this.filter()
    }, 200),
    sreachBranch: debounce(function (value) {
      this.isLoadingBranch = true
      this.getBranchs({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingBranch = false
      }, 500)
    }, 500),
    sreachContract: debounce(function (value) {
      this.isLoadingContract = true
      this.fetchContract({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingContract = false
      }, 500)
    }, 500),
    sreachPosition: debounce(function (value) {
      this.isLoadingPosition = true
      this.fetchPosition({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingPosition = false
      }, 200)
    }, 500),
    // lọc phòng ban theo chi nhánh
    changeBranch: debounce(function (value) {
      if (value) {
        this.getDepartmentForEmployee({
          branchId: value,
          params: { include: 'departments' },
          cb: () => {
            this.departments = this.departmentByBranch
          }
        })
      }
      this.filter()
    }, 500),
    ChangeDepartment: debounce(function () {
      this.placeholderPosition = 'Chọn chức vụ'
      this.filter()
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    },
    changeStatus (idEmployee) {
      this.updateStatusEmployee({
        id: idEmployee,
        employee: this.employee,
        cb: (response) => {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.statusSuccess'),
            color: 'success'
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
    },
    openDialog () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    },
    editEmployee (employeeId, item) {
      this.getEmployee({ employeeId: employeeId, params: { include: 'roles,departments.branch,contracts' } })
      this.$router.push({ name: 'employee-edit', params: { id: employeeId } })
    },
    // xóa employee
    removeConfirm (item) {
      // this.idEmployee = id
      this.dataEmployee = item
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteEmployee({
          id: this.dataEmployee.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'employee',
              data: this.dataEmployee,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.deleteEmployeeSuccess'),
              color: 'success'
            })
            this.dialogDelete = false
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
  mounted () {
    // if (!this.branchAll.length) {
    this.getBranchs({ params: { limit: 10 } })
    // }
    // if (!this.contractDetail.length) {
    this.fetchContract({ params: { limit: 10 } })
    // }
    // if (!this.positionAll.length) {
    this.fetchPosition({ params: { limit: 10 } })
    // }
    if (this.$route.params.id) {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 55
    } else {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 147
    }
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
<style scoped>
.v-toolbar__content{
  height: 80px !important;
}
.v-menu__content
{
  top: 100px !important;
}
/*tooltip*/
</style>
<style>
.copytext{
  overflow: unset;
}
</style>
