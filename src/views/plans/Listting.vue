<template>
  <v-layout ref="laylout" column fill-height>
    <div ref="header">
      <v-toolbar height="45px" class="pt-2" color="white" flat>
        <v-layout row wrap>
          <v-flex xs1 :class="isMini && 'full-flex-basic max-width-col-2'">
            <v-tooltip bottom>
              <v-btn slot="activator" v-if="canAccess('plan.create')" class="mt-3" icon color="primary"
                     @click="$router.push({name: 'plan-create'})">
                <v-icon>add</v-icon>
              </v-btn>
              <span>Thêm mới</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs4 class="mt-1" :class="isMini && 'full-flex-basic full-width-col-10'">
            <v-text-field
              hide-details
              single-line
              @change="filter"
              v-model="filterQ"
              @keyup="changeSearch"
              clearable
              @click:clear="clearSearch"
              placeholder="Nhập tên..."
            ></v-text-field>
          </v-flex>

          <v-flex xs4 class="pl-2 mt-1" :class="isMini && 'd-none'">
            <v-tooltip bottom>
              <v-text-field
                clearable
                slot="activator"
                hide-details
                v-model="filterDate"
                single-line
                placeholder="Tìm kiếm theo thời gian"
                @click:clear="clearDate"
                @click="openDialog"
              ></v-text-field>
              <v-dialog style="margin-left:10px" v-model="dialog" max-width="900px" max-height="1200px">
                <v-card>
                  <v-daterange id='dateRange'
                               :options="dateRangeOptions"
                               :labels="dateRangeOptionsLabel"
                               :first-day-of-week="1"
                               next-icon="arrow_forward"
                               prev-icon="arrow_back"
                               @input="onDateRangeChange"></v-daterange>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat
                           @click.native="submitDate"
                           color="success darken-1"
                    >
                      <span>Đồng ý</span>
                    </v-btn>
                    <v-btn color="error darken-1" flat @click.native="close" class="ml-2">Hủy bỏ</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <span>Lọc theo thời gian</span></v-tooltip>
          </v-flex>

          <v-flex xs2 class="pl-2 mt-1" :class="isMini && 'd-none'">
            <v-autocomplete
              :items="status"
              item-value="id"
              @change="filter"
              v-model="filterStatus"
              placeholder="Trạng thái"
              item-text="name"
              clearable>
            </v-autocomplete>
          </v-flex>
          <v-flex xs1 :class="isMini && 'd-none'">
            <v-tooltip bottom>
              <v-btn class="mt-3 ml-4" slot="activator" icon color="primary" @click="resetForm()">
                <v-icon>close</v-icon>
              </v-btn>
              <span>Reset bộ lọc</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-toolbar>
      <v-toolbar style="margin-top: -5px;" color="white" height="50px" flat :class="isMini && 'd-none'">
        <v-layout row wrap v-if="!isMini">
          <v-flex xs4 class="pt-0" :class="isMini && 'd-none'">
            <v-tooltip bottom>
              <v-autocomplete
                :loading="isLoadingBranchListting"
                slot="activator"
                class='ml-2'
                @change="changeBranch"
                placeholder="Chọn chi nhánh"
                :items="branchAll"
                item-text="name"
                item-value="id"
                @keyup="searchBranch"
                v-model="filterBranchId"
                hide-details
                single-line
                clearable
                @click:clear="clearBranch"
              >
                <template slot="no-data">
                  <v-list-tile>
                    <v-list-tile-title style="color:blue">
                      Không tìm thấy chức danh
                    </v-list-tile-title>
                  </v-list-tile>
                </template>
              </v-autocomplete>
              <span>Lọc theo chi nhánh</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs4 :class="isMini && 'd-none'">
            <v-tooltip bottom>
              <v-select
                slot="activator"
                :disabled="!filterBranchId"
                class='ml-2'
                @change="changeDepartment"
                placeholder="Chọn phòng ban"
                :items="getDepartmentByBranch(filterBranchId)"
                item-text="name"
                item-value="id"
                v-model="filterDepartmentId"
                hide-details
                single-line
                clearable
                @click:clear="clearDepartment"
              >
                <template slot="no-data">
                  <v-list-tile>
                    <v-list-tile-title style="color:blue">
                      Không tìm thấy phòng ban
                    </v-list-tile-title>
                  </v-list-tile>
                </template>
              </v-select>
              <span>Lọc theo phòng ban</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs4 :class="isMini && 'd-none'">
            <v-tooltip bottom>
              <v-autocomplete
                :loading="isLoadingPositonListting"
                slot="activator"
                class='ml-2'
                @change="filter"
                placeholder="Chọn chức danh"
                :items="positionAll"
                item-text="name"
                item-value="id"
                @keyup="searchPosition"
                v-model="filterPositionId"
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
                </template>
              </v-autocomplete>
              <span>Lọc theo chức danh</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-toolbar>
      <v-toolbar height="45px" color="white" flat v-if="!isMini">
        <v-layout>
          <v-flex sm1 style="flex-basis: 55px" class="text-bold">
            #
          </v-flex>
          <v-flex sm4 class="text-bold">
            Tên kế hoạch
          </v-flex>
          <v-flex sm2 class="text-bold">
            Thời gian bắt đầu
          </v-flex>
          <v-flex sm2 class="text-bold">
            Thời gian kết thúc
          </v-flex>
          <v-flex sm2 class="text-bold">
            Trạng thái
          </v-flex>
          <v-flex sm1 style="flex-basis: 100px" class="text-bold mr-3">
            Hành động
          </v-flex>
        </v-layout>
      </v-toolbar>
    </div>

    <v-flex xs12 class="border-e0-top">
      <data-view
        :name="dataViewName"
        api-url="plans"
        v-if="dataViewHeight"
        :viewHeight="dataViewHeight"
        :params="filterParams"
        :ref="dataViewName">
        <template slot-scope="{items}">
          <v-list three-line>
            <template v-for="(item, index) in items.data">
              <v-list-tile
                :key="'item' + item.id"
                avatar
                @click="planDetail(item)"
                :inactive="item.id === $route.params.id"
                :class="item.id === $route.params.id && 'grey lighten-2'"
              >
                <v-layout class="pa-2">
                  <v-flex class="" style="flex-basis: 55px" sm1 :class="isMini && 'd-none'">
                    {{ index + 1 }}
                  </v-flex>
                  <v-flex sm4 :class="isMini && 'full-flex-basic full-max-width'">
                    {{ item.title }}
                  </v-flex>
                  <v-flex sm2 class="pl-3" :class="isMini && 'd-none'">
                    {{ item.date_start }}
                  </v-flex>
                  <v-flex sm2 class="pl-3" :class="isMini && 'd-none'">
                    {{ item.date_end }}
                  </v-flex>
                  <v-flex sm2 class="pl-3" :class="isMini && 'd-none'">
                    {{ item.status_txt }}
                  </v-flex>
                  <v-flex xs1 style="flex-basis: 100px" class="pl-2" :class="isMini && 'd-none'">
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-tooltip bottom>
                          <v-btn slot="activator" class="ma-0" v-if="canAccess('plan.update')" icon
                                 @click.stop="editPlan(item.id)">
                            <v-icon class='theme--light teal--text'>edit</v-icon>
                          </v-btn>
                          <span>Sửa</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-btn slot="activator" class="ma-0" v-if="item.status == 0" icon
                                 @click.stop="sendRequest(item.id)">
                            <v-icon size="19px" class="theme--light blue--text">fas fa-share-square</v-icon>
                          </v-btn>
                          <span>Gửi yêu cầu phê duyệt</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs6>
                        <v-tooltip bottom>
                          <v-btn slot="activator" class="ma-0" v-if="canAccess('plan.delete')" icon
                                 @click.stop="removeConfirm(item)">
                            <v-icon class="theme--light pink--text">delete</v-icon>
                          </v-btn>
                          <span>Xóa</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-btn slot="activator" class="ma-0" v-if="canAccess('plan.delete')" icon
                                 @click.stop="createCandidate(item)">
                            <v-icon color="orange" size="15px">fa-user-plus</v-icon>
                          </v-btn>
                          <span>Thêm ứng viên</span>
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
    <!-- dialog details -->
    <v-dialog v-model="dialogSendRequest" max-width="600px">
      <v-form @submit.prevent="submitSendRequest" class="pa-0">
        <v-card class="pa-0">
          <v-card-title class="pt-3">
            <span class="headline" width="100%" style="margin:0 auto">Gửi yêu cầu phê duyệt</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-3">
            <v-container grid-list-md style="padding-bottom: 0px" class="white scroll-y">
              <v-layout row wrap style="margin-top:-15px">
                <v-flex xs12>
                  <v-combobox
                    v-model="employees.emails"
                    :loading="isLoadingEmployee"
                    v-validate="'required'"
                    :error-messages="errors.has('employees.emails') ? errors.collect('employees.emails') : []"
                    name="employees.emails"
                    :data-vv-as="$t('label.name_approver')"
                    v-if="Array.isArray(employeeAll)"
                    :items="employeeAll"
                    @keyup="searchEmployee"
                    label="Chọn người phê duyệt"
                    multiple
                    @input="checkInput"
                    item-value="email"
                    item-text="email"
                    chips
                    @click:clear="clearEmployee()"
                    clearable
                  >
                    <template
                      slot="selection"
                      slot-scope="data"
                    >
                      <v-chip
                        :selected="data.selected"
                        close
                        class="chip--select-multi"
                        @input="removeEmployee(data.item)"
                      >
                        <v-list-tile-title v-html="data.item.email"></v-list-tile-title>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tabindex="5" color="error" flat @click.native="closeDialogSendRequest()">Hủy bỏ</v-btn>
            <v-btn tabindex="6" class="green--text text-uppercase" flat type="submit"><span>Gửi yêu cầu</span></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <dialog-confirm v-model="dialogDelete" @input="remove"/>
    <v-dialog v-model="dialogCreateCandidate" max-width="800px">
      <form-candidate
        @closeDialogCandidate="closeDialogCandidate($event)"
        :planId="idPlan"
        :positionsCandidate="positions"
      />
    </v-dialog>

  </v-layout>
  <!-- end detail setting -->
</template>
<script type="text/javascript">
import { format, subMonths } from 'date-fns'
import DialogConfirm from '@/components/DialogConfirm'
import DataView from '@/components/DataView/DataView'
import FormCandidate from './FormCandidate'
import { mapFields } from 'vuex-map-fields'
import { map, filter, debounce } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css'
export default {
  name: 'PlanListting',
  components: {
    DialogConfirm,
    DataView,
    FormCandidate
  },
  props: {
    isMini: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'index'
    },
    closeDialog: {
      type: Boolean,
      default: false
    }
    // planId: {
    //   type: Number
    // },
    // positionsCandidate: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data: () => ({
    dialogDetail: false,
    valuePlan: null,
    dataViewHeight: 0,
    dataViewName: 'plan',
    dialogDelete: false,
    dialogCreateCandidate: false,
    dialogSendRequest: false,
    isLoadingBranchListting: false,
    isLoadingPositonListting: false,
    isLoadingEmployee: false,
    idPlan: null,
    idSendRequest: null,
    positions: [],
    employees: {
      emails: []
    },
    params: {
      q: '',
      branchId: '',
      departmentId: '',
      positionId: '',
      status: '',
      date: '',
      dateStart: '',
      dateEnd: '',
      include: 'details.department.branch'
    },
    // filter theo status
    status: [
      { 'id': 0, 'name': 'Mới' },
      { 'id': 1, 'name': 'Chờ duyệt' },
      { 'id': 2, 'name': 'Đã duyệt' },
      { 'id': 3, 'name': 'Không duyệt' },
      { 'id': 4, 'name': 'Hoàn thành' },
      { 'id': 5, 'name': 'Hủy' }
    ],
    // filter theo date
    dialog: false,
    date: null,
    range: [],
    departments: [],
    dateRangeOptions: {
      maxDate: format('2030-12-30', 'YYYY-MM-DD'),
      startDate: format(new Date(), 'YYYY-MM-DD'),
      endDate: format(new Date(), 'YYYY-MM-DD'),
      format: 'DD/MM/YYYY',
      presets: [
        {
          label: 'Hôm nay',
          range: [
            format(new Date(), 'YYYY-MM-DD'),
            format(new Date(), 'YYYY-MM-DD')
          ]
        },
        {
          label: '2 tháng sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -2), 'YYYY-MM-DD')
          ]
        },
        {
          label: '6 tháng sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -6), 'YYYY-MM-DD')
          ]
        },
        {
          label: '1 năm sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -12), 'YYYY-MM-DD')
          ]
        },
        {
          label: '2 năm sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -24), 'YYYY-MM-DD')
          ]
        },
        {
          label: '3 năm sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -36), 'YYYY-MM-DD')
          ]
        }
      ]
    },
    dateRangeOptionsLabel: {
      start: 'Ngày bắt đầu',
      end: 'Ngày kết thúc',
      preset: 'Thời gian'
    }
    // end filter theo date
  }),
  computed: {
    // ...mapGetters('Plan', ['planDetail']),
    ...mapGetters('Branch', ['branchAll']),
    ...mapGetters('Position', ['positionAll']),
    ...mapGetters('Department', ['departmentByBranch']),
    ...mapGetters('Plan', ['filterParams']),
    ...mapGetters('Employee', ['employeeAll']),
    ...mapFields('Plan', {
      filterQ: 'params.q',
      filterBranchId: 'params.branchId',
      filterDepartmentId: 'params.departmentId',
      filterPositionId: 'params.positionId',
      filterStatus: 'params.status',
      filterDate: 'params.date',
      filterDateStart: 'params.dateStart',
      filterDateEnd: 'params.dateEnd'
    }),
    isIndex () {
      return this.type === 'index'
    }
  },
  // created () {
  //   this.fetchPlan()
  // },
  methods: {
    ...mapActions(['setMiniDrawer']),
    ...mapActions(['fetchApi']),
    ...mapActions('Plan', ['fetchPlan', 'deletePlan', 'getPlan', 'changeStatusPlan', 'clearFilter', 'clearFilterBranch', 'clearFilterDate', 'clearFilterPosition']),
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry']),
    ...mapActions('Department', ['getDepartmentForEmployee']),
    ...mapActions('Position', ['fetchPosition']),
    ...mapActions('Branch', ['getBranchs']),
    ...mapActions('Employee', ['getEmployees']),
    getDepartmentByBranch (branchId) {
      let array = []
      if (this.departments.length) {
        array = filter(this.departments, function (object) {
          return parseInt(object.branch_id) === parseInt(branchId)
        })
      }
      return array
    },
    planDetail (plan) {
      if (!this.$route.params.id) {
        this.clearFilter()
        this.filter()
      }
      this.getPlan({ planId: plan.id, params: { include: 'details.department.branch,candidates.employees' } })
      this.$router.push({ name: 'plan-detail', params: { id: plan.id } })
    },
    // filter name
    clearSearch () {
      if (this.$route.params.id) {
        this.clearFilter()
      }
      this.changeSearch()
      this.filter()
    },
    changeSearch: debounce(function () {
      this.filter()
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    },
    // end filter name
    // filter date
    submitDate () {
      if (this.range[0] === undefined || this.range[1] === undefined) {
        this.filterParams.dateStart = this.dateRangeOptions.startDate
        this.filterParams.dateEnd = this.dateRangeOptions.endDate
      } else {
        this.filterParams.dateStart = this.range[0]
        this.filterParams.dateEnd = this.range[1]
      }
      this.filterParams.date = 'Từ ngày ' + this.filterParams.dateStart
      this.filterParams.date += ' đến ngày ' + this.filterParams.dateEnd
      this.dialog = false
      this.changeSearch()
    },
    openDialog () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    },
    clearDate () {
      this.clearFilterDate()
      this.changeSearch()
    },
    onDateRangeChange (range) {
      this.range = range
      this.dateRangeOptions.presets[1].range[0] = format(range[0], 'YYYY-MM-DD')
      this.dateRangeOptions.presets[1].range[1] = format(subMonths(range[0], -2), 'YYYY-MM-DD')
      this.dateRangeOptions.presets[2].range[0] = format(range[0], 'YYYY-MM-DD')
      this.dateRangeOptions.presets[2].range[1] = format(subMonths(range[0], -6), 'YYYY-MM-DD')
      this.dateRangeOptions.presets[3].range[0] = format(range[0], 'YYYY-MM-DD')
      this.dateRangeOptions.presets[3].range[1] = format(subMonths(range[0], -12), 'YYYY-MM-DD')
    },
    // end filter date
    // xóa plan
    removeConfirm (item) {
      this.idPlan = item.id
      this.valuePlan = item
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deletePlan({
          id: this.idPlan,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'plan',
              data: this.valuePlan,
              key: 'id'
            })
            this.$refs[this.dataViewName].$emit('reload')
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.plan.success_delete'),
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
    },
    editPlan (planId) {
      this.getPlan({ planId: planId, params: { include: 'details.department.branch' } })
      this.$router.push({ name: 'plan-edit', params: { id: planId } })
    },
    // filter
    resetForm () {
      this.clearFilter()
      this.changeSearch()
    },
    searchBranch: debounce(function (value) {
      this.isLoadingBranchListting = true
      this.getBranchs({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingBranchListting = false
      }, 500)
    }, 500),
    searchPosition: debounce(function (value) {
      this.isLoadingPositonListting = true
      this.fetchPosition({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingPositonListting = false
      }, 500)
    }, 500),
    resetBranch () {
      this.getBranchs({ params: { limit: 10 } })
    },
    changeBranch: debounce(function (value) {
      this.filter()
    }, 500),
    clearBranch () {
      this.clearFilterBranch()
      this.changeSearch()
    },
    changeDepartment: debounce(function () {
      this.filter()
    }, 500),
    clearDepartment () {
      this.changeSearch()
    },
    sendRequest (id) {
      this.$validator.reset()
      this.dialogSendRequest = true
      this.idSendRequest = id
    },
    closeDialogSendRequest () {
      this.dialogSendRequest = false
    },
    searchEmployee: debounce(function (value) {
      this.isLoadingEmployee = true
      this.getEmployees({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingEmployee = false
      }, 500)
    }, 500),
    removeEmployee (item) {
      const index = this.employees.emails.indexOf(item)
      if (index >= 0) this.employees.emails.splice(index, 1)
    },
    submitSendRequest () {
      // console.log(this.$validator.errors)
      this.$validator.validateAll().then(result => {
        if (result) {
          let data = { ...this.employees }
          if (data.emails.length) {
            data.emails = map(data.emails, 'email')
          }
          this.changeStatusPlan({
            id: this.idSendRequest,
            mail: data,
            cb: (response) => {
              this.getPlan({
                planId: this.idSendRequest,
                params: { include: 'details.department.branch,candidates.employees' },
                cb: (response) => {
                  this.updateDataviewEntry({
                    name: 'plan',
                    data: response.data,
                    key: 'id'
                  })
                }
              })
              this.$store.dispatch('showNotify', {
                text: this.$t('alert.plan.success_change_status'),
                color: 'success'
              })
              this.dialogSendRequest = false
            }
          })
        }
      })
    },
    clearEmployee () {
      this.getEmployees({ params: { limit: 10 } })
    },
    // create candidate
    createCandidate (item) {
      this.dialogCreateCandidate = true
      this.idPlan = item.id
      console.log('data item :', item)
      this.positions = map(item.details.data, function (item) {
        return {
          id: item.position_id,
          name: item.position_txt
        }
      })
    },
    closeDialogCandidate (val) {
      this.dialogCreateCandidate = val
    },
    checkInput (val) {
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          if (typeof val[i] !== 'object') {
            console.log('xoas')
            val.splice(i, 1)
          }
        }
      }
    }
  },
  mounted () {
    // filter
    if (!this.branchAll.length) {
      this.getBranchs({ params: { limit: 10 } })
    }
    if (!this.positionAll.length) {
      this.fetchPosition({ params: { limit: 10 } })
    }
    if (!this.employeeAll.length) {
      this.getEmployees({ params: { limit: 10 } })
    }
    this.fetchApi({
      url: 'departments',
      method: 'GET',
      params: {
        limit: -1
      },
      success: (response) => {
        this.departments = response.data
      }
    })
    // tinh view height --
    if (this.$route.params.id) {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 55
    } else {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 154
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
  .scroll-y {
    max-height: 200px;
    overflow-y: scroll;
  }
  .v-input.v-text-field {
    margin-top: 0px;
  }
  .v-list--three-line {
    height: 108px !important;
  }
  .v-list__tile {
    height: 108px !important;
  }
</style>
