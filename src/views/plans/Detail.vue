<template>
  <v-layout ref="laylout" row fill-height>
    <v-flex xs4>
      <listting type="detail" :is-mini="true"></listting>
    </v-flex>
    <v-flex xs8 class="border-e0-left">
      <v-toolbar dense color="white" flat>
        <v-toolbar-title>{{planDetail.title}}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn v-if="canAccess('plan.update')" icon
               @click="$router.push({name: 'plan-edit', params: {id: $route.params.id}})">
          <v-icon class="theme--light teal--text">edit</v-icon>
        </v-btn>
        <v-btn v-if="canAccess('plan.delete')" icon @click="removeConfirm()">
          <v-icon class="theme--light pink--text">delete</v-icon>
        </v-btn>
        <v-btn icon @click="$router.push({name: 'plans'})">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid id="" class="white scroll-y border-e0-top" style="font-size:16px"
                   :style="{height: dataViewHeight + 'px'}">
        <v-layout>

          <v-flex xs2 style="font-weight: 500">
            <p>Tên kế hoạch</p>
            <p>Ngày bắt đầu</p>
            <p>Ngày kết thúc</p>
            <p>Trạng thái</p>
            <p>Nội dung</p>
          </v-flex>
          <v-flex xs9>
            <p>{{ planDetail.title }}</p>
            <p>{{ planDetail.date_start }}</p>
            <p>{{ planDetail.date_end }}</p>
            <p>{{ planDetail.status_txt }}</p>
            <p><span v-html="planDetail.content"></span></p>
          </v-flex>
        </v-layout>
        <h3>Chi tiết kế hoạch
          <v-tooltip bottom>
            <v-btn slot="activator" v-if="canAccess('plan.create')"
                   class="mr-5" icon color="primary"
                   @click="addPlanDetail">
              <v-icon>add
              </v-icon
              >
            </v-btn>
            <span>Thêm hợp đồng</span>
          </v-tooltip>
        </h3>
        <v-layout class="mt-3">
          <v-flex xs12 v-if="planDetail.details">
            <v-data-table
              :headers="headersPlanDetail"
              :items="planDetail.details.data"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td v-if="props.item.department">{{ props.item.department.data.branch_name }}</td>
                <td>{{ props.item.department_txt }}</td>
                <td>{{ props.item.position_txt }}</td>
                <td class="text-center">{{ props.item.quantity }}</td>
                <td colspan="2" style="width:100px">
                  <v-tooltip bottom>
                    <v-btn style="margin-right: -20px;margin-left: -10px" slot='activator'
                           v-if="canAccess('plan.update')" icon
                           @click="editDetail(props.item,props.item.id)">
                      <v-icon size="19px" class='theme--light teal--text'>edit</v-icon>
                    </v-btn>
                    <span>Sửa</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <v-btn style="margin-right: -20px" slot="activator" v-if="canAccess('plan.delete')" icon
                           @click="removeConfirmDetail(props.item.id)">
                      <v-icon size="19px" class="theme--light pink--text">delete</v-icon>
                    </v-btn>
                    <span>Xóa</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn style="margin-right: -20px;" slot="activator" icon @click.stop="addCandidate(props.item)">
                      <v-icon color="orange" size="15px">fa-user-plus</v-icon>
                    </v-btn>
                    <span> Tạo hồ sơ ứng viên </span>
                  </v-tooltip>
                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
        <h3 class="mt-4">Hồ sơ ứng viên
          <v-tooltip bottom>
            <v-btn slot="activator" v-if="canAccess('plan.create')"
                   class="mr-5" icon color="primary"
                   @click="addCandidate()">
              <v-icon>add
              </v-icon
              >
            </v-btn>
            <span>Thêm hồ sơ ứng viên</span>
          </v-tooltip>
        </h3>
        <v-layout class="mt-3">
          <v-flex xs12 v-if="planDetail.candidates">
            <v-data-table
              :headers="headersCandidate"
              :items="planDetail.candidates.data"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.phone }}</td>
                <td>{{ props.item.position_txt }}</td>
                <td>{{ props.item.time_interview_format }}</td>
                <td colspan="2" style="padding:2px;">
                  <v-tooltip bottom class="ml-3">
                    <v-btn style="margin:0px;" slot='activator' v-if="canAccess('plan.update')" icon
                           @click="editCadidate(props.item,props.item.id)">
                      <v-icon size="19px" class='theme--light teal--text'>edit</v-icon>
                    </v-btn>
                    <span>Sửa</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn style="margin: 0px;" slot="activator" v-if="canAccess('plan.delete')" icon
                           @click="removeConfirmCandidate(props.item.id)">
                      <v-icon size="19px" class="theme--light pink--text">delete</v-icon>
                    </v-btn>
                    <span>Xóa</span>
                  </v-tooltip>

                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <!-- dialog details -->
    <v-dialog v-model="dialogEditDetail" max-width="800px">
      <v-form @submit.prevent="submitForm('detail')" data-vv-scope="detail" class="pa-0">
        <v-card class="pa-0">
          <v-card-title class="pt-3">
            <span class="headline" width="100%" style="margin:0 auto">{{ formTitle('detail') }} vị trí tuyển dụng</span>
          </v-card-title>
          <v-divider></v-divider>
          <!-- form edit -->
          <v-card-text id="formSub" class="pt-0">
            <v-container grid-list-md style="padding-bottom: 0px" class="white">
              <v-layout row wrap>

                <v-flex xs6>
                  <p class="lb">Chi nhánh</p>
                  <v-tooltip bottom>
                    <v-autocomplete
                      tabindex="1"
                      ref="firstInputDetail"
                      :loading="isLoadingBranch"
                      v-validate="'required'"
                      slot="activator"
                      v-model="details.branch_id"
                      :items="branchAll"
                      @keyup="searchBranch"
                      item-text="name"
                      item-value="id"
                      :error-messages="errors.has('detail.branch') ? errors.first('detail.branch') : []"
                      :data-vv-as="$t('label.name_branch')"
                      name="branch"
                      data-vv-scope="detail"
                      placeholder="Chi nhánh"
                      single-line
                    >
                      <template slot="no-data">
                        <v-list-tile>
                          <v-list-tile-title style="color:blue">
                            Không tìm thấy chi nhánh
                          </v-list-tile-title>
                        </v-list-tile>
                      </template>
                    </v-autocomplete>
                    <span>Chọn chi nhánh</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs6>
                  <p class="lb">Phòng ban</p>
                  <v-select
                    tabindex="2"
                    slot="activator"
                    v-validate="'required'"
                    :disabled="!details.branch_id"
                    v-model="details.department_id"
                    :items="getDepartmentByBranch(details.branch_id)"
                    label="Phòng ban"
                    :error-messages="errors.has('detail.department_id') ? errors.first('detail.department_id') : []"
                    :data-vv-as="$t('label.name_department')"
                    name="department_id"
                    item-text="name"
                    item-value="id"
                    data-vv-scope="detail"
                    placeholder="Phòng ban"
                    single-line
                  >
                    <template slot="no-data">
                      <v-list-tile>
                        <v-list-tile-title style="color:blue">
                          Không tìm thấy phòng ban
                        </v-list-tile-title>
                      </v-list-tile>
                    </template>
                  </v-select>
                </v-flex>

                <v-flex xs6>
                  <p class="lb" style="margin-top: 0px !important">Chức danh</p>
                  <v-tooltip bottom>
                    <v-autocomplete
                      tabindex="3"
                      :loading="isLoadingPositon"
                      v-validate="'required'"
                      slot="activator"
                      v-model="details.position_id"
                      label="Chức danh"
                      :items="positionAll"
                      @keyup="searchPosition"
                      item-text="name"
                      item-value="id"
                      :error-messages="errors.has('detail.position') ? errors.first('detail.position') : []"
                      :data-vv-as="$t('label.name_position')"
                      name="position"
                      data-vv-scope="detail"
                      placeholder="Chức danh"
                      single-line
                    >
                      <template slot="no-data">
                        <v-list-tile>
                          <v-list-tile-title style="color:blue">
                            Không tìm thấy chức danh
                          </v-list-tile-title>
                        </v-list-tile>
                      </template>
                    </v-autocomplete>
                    <span>Chọn chức danh</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs2>
                  <p class="lb" style="margin-top: 0px !important">Số lượng</p>
                  <v-text-field
                    class="pt-0"
                    tabindex="4"
                    style="margin-top:12px"
                    :error-messages="errors.has('detail.quantity') ? errors.first('detail.quantity') : []"
                    v-validate="'required|numeric|min_value:1'"
                    :data-vv-as="$t('label.quantity')"
                    name="quantity"
                    v-model="details.quantity"
                    type="number"
                    data-vv-scope="detail"
                    placeholder="Số lượng">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <!-- end form edit -->
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tabindex="5" color="error" flat @click.native="closeDialog('Detail')">Hủy bỏ</v-btn>
            <v-btn tabindex="6" class="green--text text-uppercase" flat type="submit"><span v-if="isEditDetail!==0">Lưu lại</span><span
              v-else>Thêm mới</span></v-btn>
            <div :tabindex="7" @focus="backTabIndex('detail')"></div>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- dialog canidate -->
    <v-dialog v-model="dialogCandidate" max-width="800px">
      <v-form @submit.prevent="submitFormCandidate('candidate')" class="pa-0" data-vv-scope="candidate">
        <v-card class="pa-0">
          <v-card-title class="pt-3">
            <span class="headline" width="100%" style="margin:0 auto">{{ formTitle('a') }} hồ sơ ứng viên</span>
          </v-card-title>
          <v-divider></v-divider>
          <!-- form edit -->
          <v-card-text class="pt-0">
            <v-container fluid grid-list-md style="padding-top: 0px !important;padding-bottom: 0px !important;"
                         class="white scroll-y border-e0-top">

              <v-layout row wrap>
                <v-flex xs6>
                  <v-text-field
                    ref="firstInputCandidate"
                    tabindex="1"
                    :error-messages="errors.has('candidate.name') ? errors.first('candidate.name') : []"
                    v-validate="'required|min:3'"
                    :data-vv-as="$t('label.name')"
                    name="name"
                    placeholder="Họ tên"
                    :label="$t('label.name')"
                    class="input-required"
                    autofocus="autofocus"
                    data-vv-scope="candidate"
                    v-model="candidate.name">
                  </v-text-field>

                  <v-text-field
                    tabindex="3"
                    :error-messages="errors.has('candidate.phone') ? errors.first('candidate.phone') : []"
                    v-validate="'numeric|min:10|max:12'"
                    :data-vv-as="$t('label.phone')"
                    name="phone"
                    data-vv-scope="candidate"
                    placeholder="Số điện thoại"
                    :label="$t('label.phone')"
                    v-model="candidate.phone">
                  </v-text-field>

                </v-flex>

                <v-flex xs6>
                  <v-text-field
                    tabindex="2"
                    :error-messages="errors.has('candidate.email') ? errors.first('candidate.email') : []"
                    v-validate="'required|min:3'"
                    :data-vv-as="$t('label.email')"
                    placeholder="example@gmail.com"
                    name="email"
                    :label="$t('label.email')"
                    class="input-required"
                    data-vv-scope="candidate"
                    v-model="candidate.email">
                  </v-text-field>

                  <v-text-field
                    tabindex="4"
                    :error-messages="errors.has('candidate.source') ? errors.first('candidate.source') : []"
                    v-validate="'url:require_protocol'"
                    :data-vv-as="$t('label.source')"
                    data-vv-scope="candidate"
                    name="source"
                    placeholder="Chọn source"
                    :label="$t('label.source')"
                    v-model="candidate.source">
                  </v-text-field>

                </v-flex>
              </v-layout>

              <v-layout row wrap style="margin-top:-15px">
                <v-flex xs6>
                  <p class="lb">Chức danh</p>
                  <v-tooltip bottom>
                    <v-autocomplete
                      tabindex="5"
                      slot="activator"
                      label="Chức danh"
                      :loading="isLoadingPositon"
                      v-validate="'required'"
                      data-vv-scope="candidate"
                      @keyup="searchPosition"
                      v-model="candidate.position_id"
                      :items="positions"
                      item-text="name"
                      class="input-required"
                      :disabled="isPosition"
                      item-value="id"
                      :data-vv-as="$t('label.name_position')"
                      :error-messages="errors.has('candidate.position') ? errors.first('candidate.position') : []"
                      :name="'candidate.position'"
                      placeholder="Chức danh"
                      single-line>
                      <template slot="no-data">
                        <v-list-tile>
                          <v-list-tile-title style="color:blue">
                            Không tìm thấy chức danh
                          </v-list-tile-title>
                        </v-list-tile>
                      </template>
                    </v-autocomplete>
                    <span>Chọn chức danh</span>
                  </v-tooltip>
                  <v-datetime-picker
                    label="Thời gian phỏng vấn"
                    placeholder="Chọn thời gian phỏng vấn"
                    v-model="candidate.time_interview">
                  </v-datetime-picker>
                </v-flex>

                <v-flex xs6>
                  <v-select
                    tabindex="6"
                    :items="status"
                    v-model="candidate.status"
                    data-vv-scope="candidate"
                    item-text="name"
                    item-value="id"
                    name="status"
                    :label="$t('label.status')"
                  ></v-select>

                  <v-menu
                    ref="dateApply"
                    :close-on-content-click="false"
                    v-model="dateApply"
                    :nudge-right="40"
                    :return-value.sync="candidate.date_apply"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      tabindex="8"
                      v-model="candidate.date_apply"
                      label="Chọn ngày nộp đơn"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="candidate.date_apply" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="dateApply = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.dateApply.save(candidate.date_apply)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>

              </v-layout>
              <v-layout row wrap style="margin-top:-15px">
                <v-flex xs12>
                    <v-combobox
                      name="interview_by"
                      v-model="candidate.interview_by"
                      v-if="Array.isArray(employeeAll)"
                      :items="employeeAll"
                      @keyup="searchEmployee"
                      label="Người phỏng vấn"
                      multiple
                      item-value="id"
                      item-text="name"
                      chips
                      @input="checkInput"
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
                          @input="removeInterview(data.item)"
                        >
                          <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                        </v-chip>
                      </template>

                    </v-combobox>
                  </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <!-- end form edit -->
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tabindex="10" color="error" flat @click.native="closeDialog('Candidate')">Hủy bỏ</v-btn>
            <v-btn tabindex="11" class="green--text text-uppercase" flat type="submit"><span v-if="isEditCandidate!==0">Lưu lại</span><span
              v-else>Thêm mới</span></v-btn>
            <div :tabindex="12" @focus="backTabIndex('candidate')"></div>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <dialog-confirm v-model="dialogDelete" @input="remove"/>
    <dialog-confirm v-model="dialogDeleteDetail" @input="removeDetail"/>
    <dialog-confirm v-model="dialogDeleteCandidate" @input="removeCandidate"/>
  </v-layout>
</template>
<script>
import listting from './Listting'
import DialogConfirm from '@/components/DialogConfirm'
import { mapActions, mapGetters } from 'vuex'
import { map, filter, debounce } from 'lodash'
export default {
  name: 'PlanDetail',
  components: {
    listting,
    DialogConfirm
  },
  data () {
    return {
      details: {
        id: '',
        plan_id: '',
        branch_id: '',
        department_id: '',
        position_id: '',
        quantity: ''
      },
      candidate: {
        name: '',
        email: '',
        phone: '',
        source: '',
        date_apply: '',
        time_interview: '',
        plan_id: '',
        position_id: '',
        status: 0,
        interview_by: []
      },
      interviews: [],
      departments: [],
      positions: [],
      employees: [],
      dataViewHeight: 0,
      dateApply: false,
      // dialog
      dialogDelete: false,
      dialogEditDetail: false,
      dialogCandidate: false,
      dialogDeleteDetail: false,
      dialogDeleteCandidate: false,
      // loading
      isLoadingBranch: false,
      isLoadingEmployee: false,
      isLoadingPositon: false,
      isPosition: false,
      dataViewName: 'plan',
      isEditDetail: 0,
      isEditCandidate: 0,
      defaultValues: {},
      headersPlanDetail: [
        {
          text: 'Chi nhánh',
          align: 'left',
          sortable: false
        },
        { text: 'Phòng ban', value: 'department_txt', sortable: false },
        { text: 'Chức danh', value: 'position_txt', sortable: false },
        { text: 'Số lượng', value: 'quantity', sortable: false },
        { text: 'Hành động', sortable: false }
      ],
      headersCandidate: [
        {
          text: 'Họ tên',
          align: 'left',
          sortable: false
        },
        { text: 'Số điện thoại', value: 'department_txt', sortable: false },
        { text: 'Chức danh ứng tuyển', value: 'position_txt', sortable: false },
        { text: 'Thời gian phỏng vấn', value: 'quantity', sortable: false },
        { text: 'Hành động', sortable: false }
      ],
      data: [],
      status: [
        { 'id': 0, 'name': 'Mới' },
        { 'id': 1, 'name': 'Chờ kết quả' },
        { 'id': 2, 'name': 'Trượt' },
        { 'id': 3, 'name': 'Đỗ' },
        { 'id': 4, 'name': 'Danh sách đen' }
      ]
    }
  },
  computed: {
    ...mapGetters('Plan', ['planDetail']),
    ...mapGetters('Branch', ['branchAll']),
    ...mapGetters('Position', ['positionAll']),
    ...mapGetters('Employee', ['employeeAll'])
  },
  watch: {
    dialogEditDetail (val) {
      if (!val) return
      requestAnimationFrame(() => {
        this.$refs.firstInputDetail.focus()
      })
    },
    dialogCandidate (val) {
      this.positions = map(this.planDetail.details.data, function (item) {
        return {
          id: item.position_id,
          name: item.position_txt
        }
      })
      if (!val) return
      requestAnimationFrame(() => {
        this.$refs.firstInputCandidate.focus()
      })
    }
  },
  methods: {
    ...mapActions(['setMiniDrawer']),
    ...mapActions(['showNotify']),
    ...mapActions(['fetchApi']),
    ...mapActions('Plan', ['getPlan', 'deletePlan']),
    ...mapActions('PlanDetails', ['deletePlanDetail', 'createPlanDetail', 'updatePlanDetail']),
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry']),
    ...mapActions('Position', ['fetchPosition', 'setPosition', 'getPosition']),
    ...mapActions('Branch', ['getBranchs', 'setBranch']),
    ...mapActions('Employee', ['getEmployees', 'setEmployee']),
    ...mapActions('Candidate', ['createCandidate', 'updateCandidate', 'deleteCandidate']),
    formTitle (type) {
      if (type === 'detail') {
        return this.isEditDetail === 0 ? 'Thêm ' : 'Sửa '
      } else {
        return this.isEditCandidate === 0 ? 'Thêm ' : 'Sửa '
      }
    },
    removeInterview (item) {
      console.log('item', item)
      const index = this.candidate.interview_by.indexOf(item)
      if (index >= 0) this.candidate.interview_by.splice(index, 1)
    },
    // -------Plan------
    // remove
    removeConfirm () {
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deletePlan({
          id: this.$route.params.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'plan',
              data: this.planDetail,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.plan.success_delete'),
              color: 'success'
            })
            this.dialogDelete = false
            this.$router.push({ name: 'plans' })
          },
          error: (error) => {
            this.callbackError(error)
          }
        })
      }
    },
    // -------End Plan-----
    // ------Plan Detail-------
    // edit
    editDetail (item, id) {
      this.$nextTick(() => this.$validator.reset('details'))
      this.idDetail = id
      this.isEditDetail = 1
      if (item.department) {
        this.setBranch({ branchs: [item.department.data.branch.data] })
      }
      this.setPosition({
        position: [
          {
            'id': item.position_id,
            'name': item.position_txt
          }
        ]
      })
      this.details = Object.assign({}, item)
      if (item.department) {
        this.details.branch_id = item.department.data.branch_id
      }
      this.dialogEditDetail = true
    },
    // end edit
    // remove
    removeDetail (confirm) {
      if (confirm) {
        this.dialogDeleteDetail = false
        this.deletePlanDetail({
          id: this.details.id,
          cb: (response) => {
            this.callbackSubmit(this.$t('alert.plan.success_delete_detail'))
          },
          error: (error) => {
            this.callbackError(error)
          }
        })
      }
    },
    removeConfirmDetail (idDetail) {
      this.details.id = idDetail
      this.dialogDeleteDetail = true
    },
    // filter
    searchBranch: debounce(function (value) {
      this.isLoadingBranch = true
      this.getBranchs({ params: { q: value.target.value, limit: 10 } })
      if (value.target.value === '') {
        this.details.department_id = ''
        // this.details.branch_id = ''
      }
      setTimeout(() => {
        this.isLoadingBranch = false
      }, 500)
    }, 500),
    searchPosition: debounce(function (value) {
      this.isLoadingPositon = true
      this.fetchPosition({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingPositon = false
      }, 500)
    }, 500),
    searchEmployee: debounce(function (value) {
      this.isLoadingEmployee = true
      this.getEmployees({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingEmployee = false
      }, 500)
    }, 500),
    resetBranch () {
      this.getBranchs({ params: { limit: 10 } })
    },
    clearBranch () {
      this.params.departmentId = null
      this.changeSearch()
    },
    getDepartmentByBranch (branchId) {
      let array = []
      if (this.departments.length) {
        array = filter(this.departments, function (object) {
          return parseInt(object.branch_id) === parseInt(branchId)
        })
      }
      return array
    },
    // add
    addPlanDetail () {
      this.$nextTick(() => this.$validator.reset('detail'))
      this.details = Object.assign({}, this.defaultValues)
      this.details.plan_id = this.$route.params.id
      this.isEditDetail = 0
      this.dialogEditDetail = true
    },
    // commom
    backTabIndex (type) {
      if (type === 'detail') {
        this.$refs.firstInputDetail.focus()
      } else {
        this.$refs.firstInputCandidate.focus()
      }
    },
    closeDialog (type) {
      if (type === 'Detail') {
        this.dialogEditDetail = false
      } else {
        this.dialogCandidate = false
      }
    },
    submitForm (scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          this.dialogEditDetail = false
          if (this.isEditDetail === 0) {
            this.createPlanDetail({
              planDetail: this.details,
              cb: (response) => {
                this.callbackSubmit(this.$t('alert.plan.success_create_detail'))
              }
            })
          } else {
            this.updatePlanDetail({
              id: this.idDetail,
              planDetail: this.details,
              cb: (response) => {
                this.callbackSubmit(this.$t('alert.plan.success_edit_detail'))
              }
            })
          }
        }
      })
    },
    // -----End Plan Detail------
    // -----Candidate-------
    changeInterview (value) {
      console.log('value', value)
      this.candidate.interview_by.push(value.id)
    },
    save (date) {
      this.$refs.dateApply.save(date)
    },
    dateCandidate () {
      let today = new Date()
      let dd = this.formatTime(today.getDate())
      let mm = this.formatTime(today.getMonth() + 1)
      let yyyy = today.getFullYear()
      today = yyyy + '-' + mm + '-' + dd
      this.candidate.date_apply = today
    },
    addCandidate (item) {
      this.dialogCandidate = true
      this.isPosition = false
      this.$nextTick(() => this.$validator.reset('candidate'))
      this.candidate = Object.assign({}, this.defaultValues)
      if (item) {
        this.isPosition = true
        this.setPosition({
          position: [
            {
              'id': item.position_id,
              'name': item.position_txt
            }
          ]
        })
        this.candidate.position_id = item.position_id
      }
      this.candidate.plan_id = this.$route.params.id
      this.candidate.status = 0
      this.dateCandidate()
      this.isEditCandidate = 0
    },
    formatTime (type) {
      if (type < 10) {
        return '0' + type
      } else {
        return type
      }
    },
    formatDate (d) {
      // format neu < 10 thi them 0 dang truoc
      let mm = this.formatTime(d.getMonth() + 1)
      let dd = this.formatTime(d.getDate())
      let hour = this.formatTime(d.getHours())
      let minute = this.formatTime(d.getMinutes())
      let second = this.formatTime(d.getSeconds())
      let dateFormat = [d.getFullYear(), mm, dd].join('-') + ' ' +
          [hour, minute, second].join(':')
      this.candidate.time_interview = dateFormat
    },
    callbackSubmit (textSuccess) {
      setTimeout(() => {
        this.candidate = Object.assign({}, this.defaultValues)
      }, 300)
      this.showNotify({
        color: 'success',
        text: textSuccess
      })
      this.getPlan({
        planId: this.$route.params.id,
        params: { include: 'details.department.branch,candidates.employees' },
        cb: (response) => {
          this.updateDataviewEntry({
            name: 'plan',
            data: response,
            key: 'id'
          })
        }
      })
    },
    callbackError (error) {
      if (error.status === 404) {
        this.$store.dispatch('showNotify', {
          text: this.$t('alert.not-found'),
          color: 'warning'
        })
      }
    },
    submitFormCandidate (scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          this.dialogCandidate = false
          let data = { ...this.candidate }
          if (data.interview_by) {
            data.interview_by = map(data.interview_by, 'id')
          }
          if (this.isEditCandidate === 0) {
            if (this.candidate.time_interview) {
              this.formatDate(this.candidate.time_interview)
            }
            this.createCandidate({
              candidate: data,
              cb: (response) => {
                this.callbackSubmit(this.$t('alert.plan.success_create_candidate'))
              }
            })
          } else {
            this.updateCandidate({
              id: this.idCandidate,
              candidate: data,
              cb: (response) => {
                this.callbackSubmit(this.$t('alert.plan.success_edit_candidate'))
              }
            })
          }
        }
      })
    },
    removeConfirmCandidate (id) {
      this.candidate.id = id
      this.dialogDeleteCandidate = true
    },
    removeCandidate (confirm) {
      if (confirm) {
        this.deleteCandidate({
          id: this.candidate.id,
          cb: (response) => {
            this.dialogDeleteCandidate = false
            this.callbackSubmit(this.$t('alert.plan.success_delete_candidate'))
          },
          error: (error) => {
            this.callbackError(error)
          }
        })
      }
    },
    editCadidate (item, id) {
      this.$nextTick(() => this.$validator.reset('candidate'))
      this.employees = []
      this.isPosition = false
      this.idCandidate = id
      this.isEditCandidate = 1
      this.setPosition({
        position: [
          {
            'id': item.position_id,
            'name': item.position_txt
          }
        ]
      })
      if (item.employees) {
        this.setEmployee({ employees: item.employees.data })
      }
      this.candidate = Object.assign({}, item)
      this.candidate.interview_by = item.employees.data
      this.dialogCandidate = true
    },
    checkInput (val) {
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          if (typeof val[i] !== 'object') {
            val.splice(i, 1)
          }
        }
      }
    }
  },
  created () {
    this.setMiniDrawer(true)
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 44
    if (!this.branchAll.length) {
      this.getBranchs({ params: { limit: 10 } })
    }
    if (!this.positionAll.length) {
      this.fetchPosition({ params: { limit: 10 } })
    }
    if (!this.employeeAll.length) {
      this.getEmployees({ params: { limit: 10 } })
    }
    if (!this.planDetail.id) {
      this.getPlan({
        planId: this.$route.params.id,
        params: { include: 'details.department.branch,candidates.employees' }
      })
    }
    // get department
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
  }
}
</script>

<style scoped>
  .scroll-y {
    height: 360px;
    overflow-y: scroll;
  }
  th {
    color: black !important;
  }
  .lb {
    margin-top: 17px;
    margin-bottom: -12px;
    color: #67757c;
    height: 20px;
    line-height: 20px;
    max-width: 90%;
    overflow: hidden;
    pointer-events: none;
    text-overflow: ellipsis;
    top: 6px;
    transform-origin: top left;
    white-space: nowrap;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
  }
</style>
