<template>
  <v-form @submit.prevent="submitFormCandidate" class="pa-0">
    <v-card class="pa-0">
      <v-card-title class="pt-3">
        <span class="headline" width="100%" style="margin:0 auto">Thêm hồ sơ ứng viên</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-0">
        <v-container grid-list-md style="padding-top: 0px !important;padding-bottom: 0px !important"
                     class="white scroll-y">
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                ref="firstInputCandidate"
                tabindex="1"
                :error-messages="errors.has('candidate.name') ? errors.collect('candidate.name') : []"
                v-validate="'required|min:3'"
                :data-vv-as="$t('label.name')"
                name="candidate.name"
                placeholder="Xin vui lòng nhập tên"
                :label="$t('label.name')"
                class="input-required"
                autofocus
                v-model="candidate.name">
              </v-text-field>

              <v-text-field
                tabindex="3"
                :error-messages="errors.has('candidate.phone') ? errors.collect('candidate.phone') : []"
                v-validate="'numeric|min:10|max:12'"
                :data-vv-as="$t('label.phone')"
                name="candidate.phone"
                placeholder="Xin vui lòng nhập số điện thoại"
                :label="$t('label.phone')"
                v-model="candidate.phone">
              </v-text-field>

            </v-flex>
            <v-flex xs6>
              <v-text-field
                tabindex="2"
                :error-messages="errors.has('candidate.email') ? errors.collect('candidate.email') : []"
                v-validate="'required|min:3'"
                :data-vv-as="$t('label.email')"
                placeholder="Xin vui lòng nhập email"
                name="candidate.email"
                :label="$t('label.email')"
                class="input-required"
                v-model="candidate.email">
              </v-text-field>

              <v-text-field
                tabindex="4"
                :error-messages="errors.has('candidate.source') ? errors.collect('candidate.source') : []"
                v-validate="'url:require_protocol'"
                :data-vv-as="$t('label.source')"
                name="candidate.source"
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
                  v-validate="'required'"
                  v-model="candidate.position_id"
                  :items="positionsCandidate"
                  item-text="name"
                  item-value="id"
                  :data-vv-as="$t('label.name_position')"
                  :error-messages="errors.has('candidate.position') ? errors.collect('candidate.position') : []"
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
                clearable
                @input="checkInput"
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { map, debounce } from 'lodash'
export default {
  name: 'FormCandidate',
  data () {
    return {
      isLoadingEmployee: false,
      dateApply: false,
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
      status: [
        { 'id': 0, 'name': 'Mới' },
        { 'id': 1, 'name': 'Chờ kết quả' },
        { 'id': 2, 'name': 'Trượt' },
        { 'id': 3, 'name': 'Đỗ' },
        { 'id': 4, 'name': 'Danh sách đen' }
      ],
      isEditCandidate: null,
      defaultValues: {}
    }
  },
  props: {
    planId: {
      type: Number,
      default: 0
    },
    positionsCandidate: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    positionsCandidate (val) {
      this.$validator.reset()
      this.dateCandidate()
    }
  },
  computed: {
    ...mapGetters('Employee', ['employeeAll'])
  },
  methods: {
    ...mapActions(['showNotify']),
    ...mapActions('Candidate', ['createCandidate', 'updateCandidate', 'deleteCandidate']),
    ...mapActions('Employee', ['getEmployees']),
    dateCandidate () {
      let today = new Date()
      let dd = this.formatTime(today.getDate())
      let mm = this.formatTime(today.getMonth() + 1)
      let yyyy = today.getFullYear()
      today = yyyy + '-' + mm + '-' + dd
      this.candidate.date_apply = today
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
      return dateFormat
    },
    submitFormCandidate () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let data = { ...this.candidate }
          if (data.interview_by) {
            data.interview_by = map(data.interview_by, 'id')
          }
          if (data.time_interview) {
            data.time_interview = this.formatDate(data.time_interview)
          }
          data.plan_id = this.planId
          console.log('data', data)
          this.createCandidate({
            candidate: data,
            cb: (response) => {
              this.candidate = Object.assign({}, this.defaultValues)
              this.showNotify({
                color: 'success',
                text: this.$t('alert.plan.success_create_candidate')
              })
              this.closeDialog()
            }
          })
        } else {
          this.showNotify({
            color: 'warning',
            text: this.$t('alert.invalid')
          })
        }
      })
      // this.$emit('submit')
    },
    searchEmployee: debounce(function (value) {
      this.isLoadingEmployee = true
      this.getEmployees({ params: { q: value.target.value, limit: 10 } })
      setTimeout(() => {
        this.isLoadingEmployee = false
      }, 500)
    }, 500),
    removeInterview (item) {
      const index = this.candidate.interview_by.indexOf(item)
      if (index >= 0) this.candidate.interview_by.splice(index, 1)
    },
    closeDialog () {
      this.$emit('closeDialogCandidate', false)
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
  mounted () {
  }
}
</script>

<style scoped>
  .scroll-y {
    height: 360px;
    overflow-y: scroll;
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
