<template>
  <v-form @submit.prevent="validateBeforeSubmit">
    <v-container fluid style="position:relative">
      <v-layout row>
        <v-flex xs6>
          <v-text-field
            tabindex="1"
            class="input-required"
            :error-messages="errors.has('title') ? errors.collect('title') : []"
            v-validate="'required|min:3'"
            :data-vv-as="$t('label.title')"
            name="title"
            placeholder="Tiêu đề"
            autofocus
            :label="$t('label.title')"
            v-model="plan.title">
          </v-text-field>

          <template>
            <v-menu
              class="input-required"
              ref="dateStart"
              :close-on-content-click="false"
              v-model="dateStart"
              :nudge-right="40"
              lazy transition="scale-transition"
              offset-y
              full-width
              min-width="290px">
              <v-text-field
                tabindex="3"
                placeholder="Nhập ngày bắt đầu"
                slot="activator"
                v-model="plan.date_start"
                label="Ngày bắt đầu"
                readonly></v-text-field>
              <v-date-picker
                v-model="plan.date_start"
                :min="new Date().toISOString().substr(0, 10)"
                no-title @input="dateStart = false"
              ></v-date-picker>
            </v-menu>
          </template>
        </v-flex>

        <v-flex xs6>
          <v-select
            tabindex="2"
            :items="status"
            :disabled="isCreate"
            v-model="plan.status"
            item-text="name"
            item-value="id"
            name="status"
            :label="$t('label.status')"
          ></v-select>

          <template>
            <v-menu
              class="input-required"
              ref="dateEnd"
              :close-on-content-click="false"
              v-model="dateEnd"
              :nudge-right="40"
              lazy transition="scale-transition"
              offset-y
              full-width
              min-width="290px">
              <v-text-field
                tabindex="4"
                placeholder="Nhập ngày kết thúc"
                slot="activator"
                v-model="plan.date_end"
                label="Ngày kết thúc"
                readonly></v-text-field>
              <v-date-picker
                v-model="plan.date_end"
                :min="new Date().toISOString().substr(0, 10)"
                no-title @input="dateEnd = false"
              ></v-date-picker>
            </v-menu>
          </template>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <label style="color:#67757c; font-size: 16px; margin-bottom: 3px">Nội dung</label>
          <tinymce
            id="d1"
            tabindex="5"
            class="mr-1"
            v-model="plan.content"
            :other_options="{ height: '300px', images_upload_handler: handleImageAdded }"
            placeholder="Nhập nội dung"
            :error-messages="errors.has('content') ? errors.collect('content') : []"
            :data-vv-as="$t('label.content')"
            name="content"
            @editorInit="setEditorContent($event, plan.content)"
            :label="$t('label.content')"
          ></tinymce>
        </v-flex>

        <!-- form sub -->
        <!--  khi create -->
      </v-layout>
      <formsub
        ref="formSub"
        :dataPlan="plan"
        v-on:positionAndDepartment="positionAndDepartment($event)">
      </formsub>
      <v-layout>
        <v-flex xs12 text-xs-center>
          <v-btn
            :loading="isFetchingApi"
            :disabled="isFetchingApi"
            color="primary"
            type="submit">
            <template v-if="isCreate">
              <v-icon left>add</v-icon>
              {{$t('control.create')}}
            </template>
            <template v-else>
              <v-icon left>save</v-icon>
              {{$t('control.save')}}
            </template>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import axios from 'axios'
import formsub from './Form_sub'
import DialogConfirm from '@/components/DialogConfirm'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PlanForm',
  components: {
    formsub,
    DialogConfirm
  },
  computed: {
    ...mapGetters(['isFetchingApi']),
    isCreate () {
      return this.type === 'create'
    }
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataPlan: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dateStart: false,
      dateEnd: false,
      plan: {
        title: '',
        content: '',
        status: 0,
        date_start: null,
        date_end: null,
        details: []
      },
      status: [
        { 'id': 0, 'name': 'Mới' },
        { 'id': 1, 'name': 'Chờ duyệt' },
        { 'id': 2, 'name': 'Đã duyệt' },
        { 'id': 3, 'name': 'Không duyệt' },
        { 'id': 4, 'name': 'Hoàn thành' },
        { 'id': 5, 'name': 'Hủy' }
      ]
    }
  },
  watch: {
    dataPlan () {
      this.setInitData()
    },
    dateStart (val) {
      this.plan.date_start = this.formatDate(this.plan.date_start)
    },
    dateEnd (val) {
      this.plan.date_end = this.formatDate(this.plan.date_end)
    }
  },

  methods: {
    ...mapActions(['fetchApi']),
    setEditorContent (e, content) {
      e.setContent(content || '')
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${year}-${month}-${day}`
    },
    save (date) {
      this.$refs.dateEnd.save(date)
    },
    dateStarts () {
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
      this.plan.date_start = today
    },
    // thời gian kết thúc
    dateEnds () {
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
      this.plan.date_end = today
    },
    handleImageAdded: async function (file, success, failure) {
      let formData = new FormData()
      formData.append('file', file.blob())
      try {
        let response = await axios.post('/blogs/upload', formData)
        if (response.data.code === 1) {
          success(response.data.data.path)
        } else {
          return false
        }
      } catch (err) {
        if (err.status === 422) {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.error'),
            color: 'error'
          })
        }
      }
    },
    validateBeforeSubmit () {
      this.$refs.formSub.validateBeforeSubmit()
      this.$validator.validateAll().then(result => {
        if (result) {
          let submitData = { ...this.plan }
          this.$emit('submit', submitData)
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    },
    positionAndDepartment (updated) {
      this.plan.details = updated
    },
    setInitData () {
      let dataPlan = { ...this.dataPlan }
      this.plan = { ...this.plan, ...dataPlan }
      if (this.plan.details.data) {
        this.plan.details.data.map((item) => {
          if (item.department) {
            if (item.department.data.branch) {
              item.branchs = [item.department.data.branch.data]
              item.positions = [
                {
                  'id': item.position_id,
                  'name': item.position_txt
                }
              ]
            }
          }
          return item
        })
      }
    }

  },
  created () {
    this.dateEnds()
    this.dateStarts()
    !!this.dataPlan && this.setInitData()
  }
}
</script>
<style scoped>
  iframe {
    height: 300px !important;
  }
</style>
