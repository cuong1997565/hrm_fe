<template>
  <v-form  @submit.prevent="validateBeforeSubmit">
    <v-container fluid>
      <v-layout row wrap class="marTop-22">
          <v-flex xs6>
            <v-text-field
              :error-messages="errors.has('name') ? errors.collect('name') : []"
              v-validate="'required|min:3'"
              :data-vv-as="$t('label.name')"
              name="name"
              placeholder="Xin vui lòng nhập tên"
              :label="$t('label.name')"
              class="input-required"
              autofocus="autofocus"
              v-model="candidate.name">
            </v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              :error-messages="errors.has('email') ? errors.collect('email') : []"
              v-validate="'required|min:3'"
              :data-vv-as="$t('label.email')"
              placeholder="Xin vui lòng nhập email"
              name="email"
              :label="$t('label.email')"
              class="input-required"
              v-model="candidate.email">
            </v-text-field>
          </v-flex>
      </v-layout>

      <v-layout row wrap class="marTop-22">
          <v-flex xs6>
            <v-text-field
              :error-messages="errors.has('phone') ? errors.collect('phone') : []"
              v-validate="'required|numeric|min:9|max:12'"
              :data-vv-as="$t('label.phone')"
              name="phone"
              class="input-required"
              placeholder="Xin vui lòng nhập số điện thoại"
              :label="$t('label.phone')"
              v-model="candidate.phone">
            </v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              :error-messages="errors.has('source') ? errors.collect('source') : []"
              v-validate="'required|min:3'"
              class="input-required"
              :data-vv-as="$t('label.source')"
              name="source"
              placeholder="Chọn source"
              :label="$t('label.source')"
              v-model="candidate.source">
            </v-text-field>
          </v-flex>
      </v-layout>
      <v-layout row wrap class="marTop-22">
        <v-flex xs6>
           <v-autocomplete
             v-validate="'required'"
             :error-messages="errors.has('plan_id') ? errors.collect('plan_id') : []"
             :data-vv-as="$t('label.plan_id')"
             name="plan_id"
             :label="$t('label.plan_id')"
             placeholder="Xin vui lòng chọn kế hoạch tuyển dụng"
             :items="plans"
             item-value="id"
             class="input-required"
             item-text="title"
             v-model="candidate.plan_id"
           >
           </v-autocomplete>
        </v-flex>
        <v-flex xs6>
          <v-autocomplete
            v-validate="'required'"
            :error-messages="errors.has('position_id') ? errors.collect('position_id') : []"
            :data-vv-as="$t('label.position_id')"
            placeholder="Xin vui lòng chọn vị trí ứng tuyển"
            name="position_id"
            :label="$t('label.position_id')"
            :items="positions"
            class="input-required"
            item-value="id"
            item-text="name"
            v-model="candidate.position_id"
          >
          </v-autocomplete>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="marTop-22">
        <v-flex xs6>
         <!--  <template>
            <v-menu
              ref="dateApply"
              :close-on-content-click="false"
              v-model="dateApply"
              :nudge-right="40"
              lazy transition="scale-transition"
              offset-y
              full-width
              min-width="290px">
              <v-text-field
                slot="activator"
                placeholder="Chọn ngày nộp đơn"
                v-model="candidate.date_apply"
                label="Ngày nộp đơn"
                readonly >
              </v-text-field>
              <v-date-picker
                ref="picker"
                v-model="candidate.date_apply"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save">
              </v-date-picker>
            </v-menu>
          </template> -->
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
        <v-flex xs6>
          <v-datetime-picker
            label="Thời gian phỏng vấn"
            placeholder="Chọn thời gian phỏng vấn"
            v-model="candidate.time_interview">
        </v-datetime-picker>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="marTop-22">
        <v-flex xs6>
           <v-select
            :items="status"
            v-model="candidate.status"
            item-text="name"
            item-value="id"
             name="status"
            :label="$t('label.status')"
          ></v-select>
        </v-flex>
    </v-layout>
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

</v-container>
</v-form>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default{
  name: 'CandidateForm',
  computed: {
    ...mapGetters(['isFetchingApi']),
    ...mapGetters('Position', ['positionAll']),
    ...mapGetters('Plan', ['planAll']),
    isCreate () {
      return this.type === 'create'
    }
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataCandidate: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      menu: null,
      menu1: null,
      plans: [],
      dateApply: false,
      positions: [],
      candidate: {
        name: '',
        email: '',
        phone: '',
        source: '',
        date_apply: '',
        time_interview: '',
        plan_id: '',
        position_id: '',
        status: 0
      },
      status: [
        {
          'id': 0,
          'name': 'Mới'
        },
        {
          'id': 1,
          'name': 'Chờ kết quả'
        },
        {
          'id': 2,
          'name': 'Trượt'
        },
        {
          'id': 3,
          'name': 'Đỗ'
        },
        {
          'id': 4,
          'name': 'Danh sách đen'
        }
      ]
    }
  },
  watch: {
    // dateApply (val) {
    //   val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    // },
    dataCandidate () {
      this.setInitData()
    },
    menu1 (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  mounted () {
    !!this.dataCandidate && this.setInitData()
    // fetch api plans
    this.fetchApi({
      url: 'plans',
      method: 'GET',
      params: {
        limit: -1
      },
      success: (response) => {
        this.plans = response.data
      }
    })
    this.fetchApi({
      url: 'positions',
      method: 'GET',
      params: {
        limit: -1
      },
      success: (response) => {
        this.positions = response.data
      }
    })
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Position', ['fetchPosition']),
    ...mapActions('Plan', ['fetchPlan']),
    setInitData () {
      this.candidate = { ...this.candidate, ...this.dataCandidate }
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$emit('submit', this.candidate)
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    },
    save (date) {
      this.$refs.dateApply.save(date)
    },
    dateCandidate () {
      let today = new Date()
      let dd = today.getDate()
      let mm = today.getMonth() + 1
      let yyyy = today.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd
      this.candidate.date_apply = today
    },
    // thời gian kết thúc hợp đồng
    dateExpirationCandidate () {
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
      this.candidate.date_apply = today
    }
  },
  created () {
    this.fetchPosition()
    this.fetchPlan()
    this.dateCandidate()
    this.dateExpirationCandidate()
  }
}
</script>
<style scoped>
  .marTop-22{
    margin-top: -22px !important;
  }
</style>
