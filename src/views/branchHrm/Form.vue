<template>
  <v-stepper class="xs8" style="text-shadow: none inline !important;" flat v-model="stepBranch">
  <v-stepper-header absolute style="height: 50px;position: fixed; width: 100%;z-index: 1;background-color: white">
    <!--:rule canh bao loi step 1-->
    <v-stepper-step
     :complete="stepBranch > 1"
      :rules="[() => !errors.has('name')
    && !errors.has('email')
    && !errors.has('phone')
    && !errors.has('address')
    && !errors.has('tax_number')
    && !errors.has('city_id')
    && !errors.has('district_id')]"
    step="1">Thông tin chi nhánh</v-stepper-step>
    <v-spacer></v-spacer>
    <v-stepper-step :complete="stepBranch > 2" step="2">Thông tin thêm</v-stepper-step>
    <v-spacer></v-spacer>
    <v-tooltip bottom style="margin-right: -50px; float: right;">
      <v-btn slot="activator" icon @click="$router.push({name: 'branch-hrm'})" >
        <v-icon>close</v-icon>
      </v-btn>
      <span>Đóng</span>
    </v-tooltip>
    <v-spacer></v-spacer>
  </v-stepper-header>
  <v-stepper-items>
    <!-- step 1 ===================================== -->
    <v-stepper-content step="1" style="min-height: 570px;margin-top:30px">
      <v-form @submit.prevent="nextStep">
        <!-- <h4>Thông tin chính</h4> -->
        <v-layout>
          <v-flex md6 xs6>
            <!-- name -->
            <v-text-field
            :tabindex="1"
            autofocus
            ref="firstInput"
            placeholder="Tên chi nhánh"
            :error-messages="errors.has('name') ? errors.collect('name') : []"
            v-validate="'required'"
            :data-vv-as="$t('label.name')"
            name="name"
            :label="$t('label.name')"
            class="input-required"
            v-model="branch.name"> </v-text-field>
            <!-- address -->

            <v-text-field
            :tabindex="3"
            placeholder="Nhập địa chỉ"
            :error-messages="errors.has('address') ? errors.collect('address') : []"
            :data-vv-as="$t('label.address')"
            name="address"
            v-validate="'required'"
            :label="$t('label.address')"
            class="input-required"
            v-model="branch.address"> </v-text-field>
            <!-- city -->
            <v-select
            :tabindex="5"
            v-if="Array.isArray(cityAll)"
            v-validate="'required'"
            :error-messages="errors.has('city_id') ? errors.collect('city_id') : []"
            :data-vv-as="$t('label.city_id')"
            name="city_id"
            :label="$t('label.city_id')"
            class="input-required"
            v-model="branch.city_id"
            :items="cityAll"
            item-value="id"
            item-text="name"
            @change="changedCity"
            placeholder="Chọn thành phố" > </v-select>
            <!-- tax_number -->
            <v-text-field
            :tabindex="7"
            placeholder="Nhập mã số thuế"
            :error-messages="errors.has('tax_number') ? errors.collect('tax_number') : []"
            :data-vv-as="$t('label.tax_number')"
            name="tax_number"
            v-validate="'required'"
            :label="$t('label.tax_number')"
            class="input-required"
            v-model="branch.tax_number"> </v-text-field>
          </v-flex>
          <v-flex md6 xs6 style="margin-left:10px">
            <!-- email -->
            <v-text-field
            :tabindex="2"
            placeholder="example@gmail.com"
            :error-messages="errors.has('email') ? errors.collect('email') : []"
            :data-vv-as="$t('label.email')"
            name="email"
            v-validate="'required|email'"
            :label="$t('label.email')"
            class="input-required"
            v-model="branch.email"> </v-text-field>
              <!-- phone -->
            <v-text-field
            :tabindex="4"
            placeholder="Nhập số điện thoại"
            :error-messages="errors.has('phone') ? errors.collect('phone') : []"
            :data-vv-as="$t('label.phone')"
            name="phone"
            v-validate="'required|numeric|min:10|max:12'"
            :counter="12"
            type="number"
            class="input-required"
            :label="$t('label.phone')"
            v-model="branch.phone"> </v-text-field>
            <!-- district -->
            <v-select
            v-if="Array.isArray(districtAll)"
            :disabled = "!districtActive"
            v-validate="'required'"
            :error-messages="errors.has('district_id') ? errors.collect('district_id') : []"
            :data-vv-as="$t('label.district_id')"
            name="district_id"
            :label="$t('label.district_id')"
            class="input-required"
            v-model="branch.district_id"
            :items="districtAll"
            item-value="id"
            item-text="name"
            :tabindex="6"
            placeholder="Hãy chọn quận hoặc huyện"> </v-select>
            <v-layout row wrap class='mt-3 ml-1'>
                 <v-flex xs6>
                <!-- type_branch -->
                <label>Chi nhánh chính</label>
                <v-switch
                style="margin-top:0px; outline-style: none;"
                :tabindex="8"
                name="type"
                slot="activator"
                v-model="branch.type"
                ></v-switch>
              </v-flex>
              <v-flex xs6>
                <!-- status -->
                <label>Trạng thái</label>
                <v-flex xs1>
                  <v-tooltip bottom>
                    <v-switch
                    style="margin-top:0px; outline-style: none;"
                    :label='status'
                    :tabindex="9"
                    name="status"
                    slot="activator"
                    v-model="branch.status"
                    ></v-switch>
                    <span v-if="branch.status">Hoạt động</span>
                    <span v-else>Không hoạt động</span></v-tooltip>
                  </v-flex>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12>
                   <v-flex xs12 >
                      <v-btn
                      style="position: absolute; right: 46%; margin-top: 20px;"
                      :tabindex="10"
                      color="primary"
                      type="submit">
                    Tiếp tục</v-btn>
                    <div :tabindex="10"  @focus="backTabIndex"></div>
                  </v-flex>
                </v-flex>
            </v-layout>
            </v-flex>
          </v-layout>
      </v-form>
    </v-stepper-content>
      <!-- step 2========================================= -->
    <v-stepper-content step="2" style="margin-top:30px">
      <v-form @submit.prevent="validateBeforeSubmit">
         <v-layout>
          <v-flex md6 xs6 style="margin-right:10px">
            <!-- facebook -->
            <v-text-field
            tabindex="1"
            ref="secondInput"
            autofocus
            placeholder="https://www.facebook.com/tienlee.ask"
            :error-messages="errors.has('facebook') ? errors.collect('facebook') : []"
            :data-vv-as="$t('label.facebook')"
            name="facebook"
            :label="$t('label.facebook') "
            v-model="branch.facebook"> </v-text-field>
              <!-- website -->
            <v-text-field
            tabindex="3"
            placeholder="https://vnexpress.net"
            :error-messages="errors.has('website') ? errors.collect('website') : []"
            :data-vv-as="$t('label.website')"
            name="website"
            :label="$t('label.website')"
            v-model="branch.website"> </v-text-field>
            </v-flex>
              <v-flex md6 xs6 style="margin-left:10px">
            <!-- bank -->
            <v-text-field
            tabindex="2"
            placeholder="Nhập tài khoản ngân hàng"
            :error-messages="errors.has('bank') ? errors.collect('bank') : []"
            :data-vv-as="$t('label.bank')"
            name="bank"
            :label="$t('label.bank')"
            v-model="branch.bank"> </v-text-field>
            <!-- instagram -->
            <v-text-field
            placeholder="https://www.instagram.com/nht"
            :error-messages="errors.has('instagram') ? errors.collect('instagram') : []"
            :data-vv-as="$t('label.instagram')"
            name="instagram"
            :label="$t('label.instagram')"
            v-model="branch.instagram"> </v-text-field>
            <!-- zalo -->
            <v-text-field
            tabindex="4"
            placeholder="https://oa.zalo.me/home"
            :error-messages="errors.has('zalo') ? errors.collect('zalo') : []"
            :data-vv-as="$t('label.zalo')"
            name="zalo"
            :label="$t('label.zalo')"
            v-model="branch.zalo"> </v-text-field>
          </v-flex>
        </v-layout>
        <!-- about -->
        <v-flex style="margin-top: 10px">
          <label>Thông tin</label>
          <tinymce
          id="d2"
          tabindex="5"
          class="mr-1"
          :plugins="plugins"
          :error-messages="errors.has('about') ? errors.collect('about') : []"
          :data-vv-as="$t('label.about')"
          name="about"
          toolbar1="formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | codesample"
          toolbar2=""
          :other_options="{ height: '300px', images_upload_handler: handleImageAdded }"
          :label="$t('label.about')"
          v-model="branch.about"
          v-if="parseInt(stepBranch) === 2"
          @editorInit="setEditorContent($event, branch.description)"
          ></tinymce>
        </v-flex>
        <!-- description -->
        <v-flex style="margin-top: 30px;">
          <label>Mô tả</label>
          <tinymce
          id="d1"
          tabindex="6"
          :plugins="plugins"
          class="mr-1"
          toolbar1="formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | codesample"
          toolbar2=""
          :other_options="{ height: '300px', images_upload_handler: handleImageAdded }"
          placeholder="Nhập mô tả"
          :error-messages="errors.has('description') ? errors.collect('description') : []"
          :data-vv-as="$t('label.description')"
          name="description"
          :label="$t('label.description')"
          v-model="branch.description"
          v-if="parseInt(stepBranch) === 2"
          @editorInit="setEditorContent($event, branch.about)"
          ></tinymce>
        </v-flex>
          <v-btn
        style="position: absolute; right: 46%; margin-top: 20px;"
        class="mt-5"
        tabindex="8"
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
        </template> </v-btn>

        <v-btn tabindex="9" style="margin-top: 47px; left:54%;" color="warning" @click="stepBranch = 1">Quay lại</v-btn>
        <div :tabindex="9"  @focus="backTabIndex2"></div>
      </v-form>
    </v-stepper-content>
  </v-stepper-items>
  </v-stepper>
</template>
<script>
import axios from '../../plugins/axios'
import { mapGetters, mapActions } from 'vuex'
export default{
  name: 'BranchForm',
  components: {
    DataView
  },
  computed: {
    ...mapGetters(['isFetchingApi']),
    ...mapGetters('City', ['cityAll', 'districtByCity']),
    isCreate () {
      return this.type === 'create'
    }
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataBranch: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      stepBranch: 0,
      districtActive: false,
      type_branch: '',
      status: '',
      districtAll: {},
      branch: {
        type: false,
        status: true
      },
      plugins: [
        'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
        'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
        'save table contextmenu directionality emoticons template paste textcolor codesample'
      ]
    }
  },
  watch: {
    dataBranch () {
      this.setInitData()
    }
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('City', ['getCity', 'getDistrictByCity']),
    setInitData () {
      let dataBranch = { ...this.dataBranch }
      this.branch = { ...this.branch, ...dataBranch }
    },
    // change city
    changedCity (value) {
      this.districtActive = true
      this.getDistrictByCity({
        cityId: value,
        cb: () => {
          this.districtAll = this.districtByCity
        }
      })
    },
    // upload file trong ckditor
    handleImageAdded: async function (file, success, failure) {
      let formData = new FormData()
      formData.append('file', file.blob())
      try {
        let response = await axios.post('/branches/upload', formData)
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
    // forcus form step 1
    backTabIndex () {
      this.$refs.firstInput.focus()
    },
    // focus form step 2
    backTabIndex2 () {
      this.$refs.secondInput.focus()
    },
    // next step 2 neu ko bi validator
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.stepBranch = 2
          setTimeout(() => {
            this.$refs.secondInput.focus()
          }, 300)
        }
      })
    },
    // nếu insert lỗi quay lại step 1
    stepError () {
      this.stepBranch = 1
    },
    setEditorContent (e, content) {
      e.setContent(content || '')
    },
    // bẳt lỗi trước khi submit
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let branch = Object.assign({}, this.branch)
          branch.status = branch.status ? 1 : 0
          branch.type = branch.type ? 1 : 0
          this.$emit('submit', branch)
        } else {
          this.stepBranch = 1
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    }
  },
  mounted () {
    // insert error thi quay lai step 1 focus input name firstInput
    this.$nextTick(this.$refs.firstInput.focus)
  },
  created () {
    !!this.dataBranch && this.setInitData()
    if (this.$route.params.id) {
      this.districtActive = true
      this.getDistrictByCity({
        cityId: this.dataBranch.city_id,
        cb: () => {
          this.districtAll = this.districtByCity
        }
      })
    } else {
      this.getDistrictByCity({
        cityId: 1,
        cb: () => {
          this.districtAll = this.districtByCity
        }
      })
    }
    this.getCity()
  }

}
</script>
