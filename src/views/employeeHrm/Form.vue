<template>
  <v-app>
    <v-stepper style="text-shadow: none inline !important" flat v-model="stepEmployee">
      <v-stepper-header  absolute style="height: 50px;position: fixed; width: 100%;z-index: 1;background-color: white">
       <v-stepper-step :rules="[() => !errors.has('name') && !errors.has('email') && !errors.has('phone')]"  :complete="stepEmployee > 1" step="1">Thông tin cá nhân
       </v-stepper-step>
       <v-spacer></v-spacer>
       <v-stepper-step  step="2">Công việc</v-stepper-step>
       <v-spacer></v-spacer>
       <v-tooltip bottom style="margin-right: -50px;">
        <v-btn slot="activator" icon @click="$router.push({name: 'employee-hrm'})" >
          <v-icon>close</v-icon>
        </v-btn>
        <span>Đóng</span>
      </v-tooltip>
      <v-spacer></v-spacer>
    </v-stepper-header>
    <!-- step 1 ======================================================  -->
    <v-stepper-items>
      <v-stepper-content step="1" style="min-height: 630px; margin-top: 30px;">
        <v-form @submit.prevent="nextStepEmployee()">
         <v-layout>
          <v-flex md6 style="margin-right:10px">
            <!-- name -->
            <v-text-field
            tabindex="1"
            ref="firstInput1"
            autofocus
            placeholder="Nhập vào tên"
            :error-messages="errors.has('name') ? errors.collect('name') : []"
            v-validate="'required'"
            :data-vv-as="$t('label.name')"
            name="name"
            :label="$t('label.name')"
            class="input-required"
            v-model="employee.name"></v-text-field>

            <!-- email -->
            <v-text-field
            tabindex="3"
            placeholder="Example@gmail.com"
            :error-messages="errors.has('email') ? errors.collect('email') : []"
            v-validate="'required|email'"
            :class="{'input': true, 'is-danger': errors.has('email') }"
            :data-vv-as="$t('label.email')"
            name="email"
            :label="$t('label.email')"
            class="input-required"
            type="email"
            :disabled="!isCreate"
            v-model="employee.email"> </v-text-field>

            <!-- phone -->
            <v-text-field
            tabindex="5"
            placeholder="Nhập số điện thoại"
            :error-messages="errors.has('phone') ? errors.collect('phone') : []"
            :data-vv-as="$t('label.phone')"
            name="phone"
            :counter="12"
            type="number"
            v-validate="'required|min:10|max:12|numeric'"
            class="input-required"
            :label="$t('label.phone')"
            v-model="employee.phone"></v-text-field>
            <!-- address -->
            <v-text-field
            tabindex="7"
            :error-messages="errors.has('address') ? errors.collect('address') : []"
            placeholder="Nhập địa chỉ"
            :data-vv-as="$t('label.address')"
            name="address"
            :label="$t('label.address')"
            v-model="employee.address">
          </v-text-field>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex md6 style="margin-left:10px">
          <!-- qualification -->
          <v-select
          tabindex="2"
          :items="qualificationForEmployee"
          item-text="name"
          item-value="value"
          placeholder="Nhập trình độ học vấn"
          name="qualification"
          :label="$t('label.qualification')"
          v-model="employee.qualification"></v-select>

          <!-- birth_day -->
          <template>
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
            placeholder="Nhập ngày sinh"
            slot="activator"
            tabindex="4"
            v-model="employee.date_of_birth"
            label="Ngày sinh"
            readonly > </v-text-field>
            <v-date-picker
            ref="picker"
            v-model="employee.date_of_birth"
            :max="new Date().toISOString().substr(0, 10)"
            min="1950-01-01"
            @change="save"> </v-date-picker> </v-menu>
          </template>
          <v-layout xs12>
            <v-flex class="pr-2" md7 sm12 style=" margin-left:5px;">
             <!-- gender -->
             <v-select
             tabindex="6"
             class="mb-3"
             :items="genderEmployee"
             item-text="name"
             item-value="value"
             v-model="employee.gender"
             label="Giới tính"
             ></v-select>
             <!-- status -->
             <label>Trạng thái</label>
             <v-tooltip bottom>
              <v-switch
              class="mt-0"
              tabindex="8"
              style="outline-style: none;"
              @change="employee.status !== employee.status"
              name="status"
              slot="activator"
              v-model="employee.status"
              ></v-switch>
              <span v-if="employee.status">Kích hoạt</span>
              <span v-else>Không kích hoạt</span>
            </v-tooltip>
          </v-flex>
          <!-- image -->
          <v-flex md5 sm12 class="mt-3">
            <label style="color: #7f8c91; outline-style: none;">Ảnh đại diện</label>
            <vue-upload-multiple-image
            @upload-success="uploadImageSuccess"
            @before-remove="beforeRemove"
            @edit-image="editImage"
            :data-images="images"
            :multiple ='false'
            ></vue-upload-multiple-image>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <h3 class="mt-3" v-if="isCreate">Tài khoản</h3>
      <v-tooltip class="ml-3" bottom v-if="isCreate">
        <v-btn tabindex="10" @click="addAccount" slot="activator" color="primary" icon><v-icon>add</v-icon></v-btn>
        <span>Thêm tài khoản</span>
      </v-tooltip>
    </v-layout>
    <v-layout class="mt-2" wrap v-if="accountUser">
      <v-flex row xs6>
        <!-- password -->
        <v-text-field
        :autofocus="true"
        placeholder="Nhập mật khẩu"
        :error-messages="errors.has('password') ? errors.collect('password') : []" v-validate="'required|min:6'"
        :data-vv-as="$t('label.password')"
        ref="password"
        name="password"
        tabindex="1"
        :label="$t('label.password')"
        class="pr-2 input-required"
        type="password"
        v-model="employee.password"> </v-text-field>
      </v-flex>
      <v-flex xs6>
        <!-- password confirm -->
        <v-text-field
        tabindex="2"
        placeholder="Nhập lại mật khẩu"
        :error-messages="errors.has('password_confirmation') ? errors.collect('password_confirmation') : []"
        v-validate="'required|min:6|confirmed:password'"
        :data-vv-as="$t('label.password_confirmation')"
        name="password_confirmation"
        :label="$t('label.password_confirmation')"
        class="pl-2 input-required"
        type="password"
        v-model="employee.password_confirmation"> </v-text-field>
      </v-flex>
    </v-layout>
    <v-flex xs12>
      <v-spacer></v-spacer>
      <v-btn
      tabindex="11"
      style="margin-top: 50px: position: absolute; left: 44%;"
      color="primary"
      type="submit">
      Tiếp tục</v-btn>
      <v-spacer></v-spacer>
      <div :tabindex="10"  @focus="backTabIndex1"></div>
    </v-flex>
  </v-form>
</v-stepper-content>
<!-- step 2 ======================================================  -->
<v-stepper-content style="min-height: 630px; margin-top: 30px;" step="2">
  <v-form @submit.prevent="validateBeforeSubmit">
    <formSub
    ref="formSub"
    style="margin-bottom: 20px;"
    :dataEmployee = "employee"
    v-on:positionAndDepartment="positionAndDepartment($event)"
    ></formSub>
    <!-- khi update hợp đồng -->
     <v-flex style="clear: both;" class="mt-5" xs12 v-if="employeeDetail.contracts && !isCreate">
          <h3 style="margin-top: 40px;">Hợp đồng
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
            id="tableContract"
            :headers="headersContract"
            :items="employeeDetail.contracts.data"
            hide-actions
            style="margin-bottom: 30px;"
            class="elevation-1 mt-2"
            >
            <template slot="items" slot-scope="props">
              <td colspan="2">{{ props.item.title }}</td>
              <td> {{props.item.type_txt}} </td>
                <td colspan="3">
                <b>Ngày kí:</b> {{ props.item.date_sign_format }}<br>
                <b>Hiệu lực :</b> {{ props.item.date_effective_format }}<br>
                <b>Kết thúc:</b> {{ props.item.date_expiration_format }}<br>
              </td>
              <td>{{ props.item.status_txt }}</td>
               <td colspan="2" style="padding:2px;">
                <v-tooltip bottom class="ml-3">
                  <v-btn style="margin:0px;" slot='activator' v-if="canAccess('employee.update')" icon  @click="editContract(props.item,props.item.id)">
                    <v-icon size="19px" class='theme--light teal--text'>edit</v-icon>
                  </v-btn>
                  <span>Sửa</span>
                </v-tooltip>
                 <v-tooltip bottom>
                  <v-btn style="margin: 0px;" slot="activator" v-if="canAccess('employee.delete')" icon @click="removeConfirmContract(props.item.id)">
                    <v-icon size="19px" class="theme--light pink--text">delete</v-icon>
                  </v-btn>
                  <span>Xóa</span>
                </v-tooltip>
               </td>
            </template>
          </v-data-table>
        </v-flex>
     <dialog-confirm v-model="dialogDeleteContract" @input="removeContract" />
       <v-dialog v-model="dialogEditContract" max-width="800px" v-if="!isCreate">
            <v-form @submit.prevent="submitForm">
              <v-card class="pa-0">
                <v-card-title class="pa-0 pt-3">
                  <span class="headline" width="100%" style="margin:0 auto">{{ formTitle }}</span>
                </v-card-title>
                <!-- form edit -->
                <v-card-text id="formSub" class="pt-0">
                  <v-container grid-list-md class="white scroll-y">
                    <v-layout row wrap>
                      <v-flex xs6 class="pr-2">
                        <!-- title contract -->
                        <v-text-field
                        :autofocus="true"
                        tabindex="1"
                        v-validate="validatorRequired"
                        ref="firstInput2"
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
                        :error-messages="errors.has('type') ? errors.collect('type') : []"
                        :data-vv-as="$t('label.type')"
                        name="type"
                        placeholder="Nhập loại hợp đồng"
                        :label="$t('label.type')"
                        v-model="contracts.type"
                        :items="typeContract"
                        item-value="value"
                        item-text="name"> </v-select>
                         <!-- link contract -->
                        <v-text-field
                        placeholder="Nhập link hợp đồng"
                        v-validate="'url:require_protocol'"
                        :error-messages="errors.has('link_contract') ? errors.collect('link_contract') : []"
                        :data-vv-as="$t('label.link_contract')"
                        :tabindex="7"
                        :label="'Link hợp đồng'"
                        name="link_contract"
                        v-model="contracts.link"> </v-text-field>
                        <!-- status contract -->
                        <v-select
                        tabindex="5"
                        :error-messages="errors.has('status') ? errors.collect('status') : []"
                        :data-vv-as="$t('label.status')"
                        name="status"
                        :label="$t('label.status')"
                        placeholder="Nhập trạng thái hợp đồng"
                        v-model="contracts.status"
                        :items="statusContract"
                        item-value="value"
                        item-text="name"> </v-select>
                      </v-flex>
                      <v-flex xs6>
                         <template>
                          <v-menu
                          class="input-required"
                          ref="sign"
                          :close-on-content-click="false"
                          v-model="sign"
                          :nudge-right="40"
                          lazy transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px">
                          <v-text-field
                          tabindex="4"
                          placeholder="Ngày có hiệu lực"
                          slot="activator"
                          v-model="contracts.date_sign"
                          label="Ngày có hiệu lực"
                          readonly > </v-text-field>
                          <v-date-picker
                          v-model="contracts.date_sign"
                          :min="new Date().toISOString().substr(0, 10)"
                          no-title @input="sign = false"
                          > </v-date-picker> </v-menu>
                        </template>

                           <!-- date_effective -->
                        <template>
                          <v-menu
                          class="input-required"
                          ref="dateEffective"
                          :close-on-content-click="false"
                          v-model="dateEffective"
                          :nudge-right="40"
                          lazy transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px">
                          <v-text-field
                          tabindex="4"
                          placeholder="Ngày có hiệu lực"
                          slot="activator"
                          v-model="contracts.date_effective"
                          label="Ngày có hiệu lực"
                          readonly > </v-text-field>
                          <v-date-picker
                          v-model="contracts.date_effective"
                          :min="new Date().toISOString().substr(0, 10)"
                          no-title @input="dateEffective = false"
                          > </v-date-picker> </v-menu>
                        </template>
                        <!-- date_expiration -->
                        <template>
                          <v-menu
                          class="input-required"
                          ref="dateExpiration"
                          :close-on-content-click="false"
                          v-model="dateExpiration"
                          :nudge-right="40"
                          lazy transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px">
                          <v-text-field
                          tabindex="6"
                          placeholder="Ngày hết hạn"
                          slot="activator"
                          v-model="contracts.date_expiration"
                          label="Ngày hết hạn"
                          readonly > </v-text-field>
                          <v-date-picker
                          v-model="contracts.date_expiration"
                          :min="new Date().toISOString().substr(0, 10)"
                          no-title @input="dateExpiration = false"
                          > </v-date-picker> </v-menu>
                        </template>

                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                 <!-- end form edit -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn tabindex="9" color="error" flat @click.native="closeContract">Hủy bỏ</v-btn>
                  <v-btn tabindex="8" class="green--text text-uppercase" flat type="submit"><span v-if="editedIndex!==-1">Lưu lại</span><span v-else>Thêm mới</span></v-btn>
                  <div :tabindex="9"  @focus="backTabIndex2"></div>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>

            <!-- when create employee -->
          <h3 v-if="isCreate">Hợp đồng</h3>
            <v-layout row wrap v-if="isCreate">
            <v-flex xs6 class="pr-2">
              <!-- title contract -->
              <v-text-field
              tabindex="1"
              ref="firstInput2"
              placeholder="Nhập tiêu đề hợp đồng"
              :error-messages="errors.has('title') ? errors.collect('title') : []"
              :data-vv-as="$t('label.title')"
              name="title"
              :label="$t('label.title')"
              v-model="employee.contracts.title"> </v-text-field>
              <!-- type contract -->
              <v-select
              tabindex="3"
              :error-messages="errors.has('type') ? errors.collect('type') : []"
              :data-vv-as="$t('label.type')"
              name="type"
              placeholder="Nhập loại hợp đồng"
              :label="$t('label.type')"
              v-model="employee.contracts.type"
              :items="typeContract"
              item-value="value"
              item-text="name"> </v-select>
              <!-- link contract -->
              <v-text-field
              placeholder="Nhập link hợp đồng"
              v-validate="'url:require_protocol'"
              :error-messages="errors.has('link_contract') ? errors.collect('link_contract') : []"
              :data-vv-as="$t('label.link_contract')"
              :tabindex="7"
              :label="'Link hợp đồng'"
              name="link_contract"
              v-model="employee.contracts.link"> </v-text-field>
              <!-- status contract -->
              <v-select
              tabindex="5"
              :error-messages="errors.has('status') ? errors.collect('status') : []"
              :data-vv-as="$t('label.status')"
              name="status"
              :label="$t('label.status')"
              placeholder="Nhập trạng thái hợp đồng"
              v-model="employee.contracts.status"
              :items="statusContract"
              item-value="value"
              item-text="name"> </v-select>
            </v-flex>
            <v-flex xs6>
              <template>
                <v-menu
                class="input-required"
                ref="sign"
                :close-on-content-click="false"
                v-model="sign"
                :nudge-right="40"
                lazy transition="scale-transition"
                offset-y
                full-width
                min-width="290px">
                <v-text-field
                tabindex="4"
                placeholder="Ngày có hiệu lực"
                slot="activator"
                v-model="employee.contracts.date_sign"
                label="Ngày có hiệu lực"
                readonly > </v-text-field>
                <v-date-picker
                v-model="employee.contracts.date_sign"
                :min="new Date().toISOString().substr(0, 10)"
                no-title @input="sign = false"
                > </v-date-picker> </v-menu>
              </template>

              <!-- date_effective -->
              <template>
                <v-menu
                class="input-required"
                ref="dateEffective"
                :close-on-content-click="false"
                v-model="dateEffective"
                :nudge-right="40"
                lazy transition="scale-transition"
                offset-y
                full-width
                min-width="290px">
                <v-text-field
                tabindex="4"
                placeholder="Ngày có hiệu lực"
                slot="activator"
                v-model="employee.contracts.date_effective"
                label="Ngày có hiệu lực"
                readonly > </v-text-field>
                <v-date-picker
                v-model="employee.contracts.date_effective"
                :min="new Date().toISOString().substr(0, 10)"
                no-title @input="dateEffective = false"
                > </v-date-picker> </v-menu>
              </template>
              <!-- date_expiration -->
              <template>
                <v-menu
                class="input-required"
                ref="dateExpiration"
                :close-on-content-click="false"
                v-model="dateExpiration"
                :nudge-right="40"
                lazy transition="scale-transition"
                offset-y
                full-width
                min-width="290px">
                <v-text-field
                tabindex="6"
                placeholder="Ngày hết hạn"
                slot="activator"
                v-model="employee.contracts.date_expiration"
                label="Ngày hết hạn"
                readonly > </v-text-field>
                <v-date-picker
                v-model="employee.contracts.date_expiration"
                :min="new Date().toISOString().substr(0, 10)"
                no-title @input="dateExpiration = false"
                > </v-date-picker> </v-menu>
                </template>
            </v-flex>
            </v-layout>
            <v-btn
            style="position:absolute; left: 40%; margin-top: 20px;"
            tabindex="7"
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
          <v-btn
      tabindex="8"
      style="margin-top: 19px; margin-left: 55%;"
      dark color="warning" @click="backStep">
    Quay lại</v-btn>
    <div :tabindex="8"  @focus="backTabIndex2"></div>

  </v-form>
</v-stepper-content>
</v-stepper-items>
</v-stepper>
</v-app>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { map } from 'lodash'
import DialogConfirm from '@/components/DialogConfirm'
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import formSub from './FormSub'
export default{
  name: 'employeeForm',
  components: {
    VueUploadMultipleImage,
    DialogConfirm,
    formSub
  },
  computed: {
    ...mapGetters(['isFetchingApi']),
    ...mapGetters('Contracts', ['contractDetail']),
    ...mapGetters('Employee', ['employeeDetail']),
    isCreate () {
      return this.type === 'create'
    },
    formTitle () {
      return this.editedIndex = -1 ? 'Thêm hợp đồng' : 'Sửa hợp đồng'
    }
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataEmployee: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    dateOfBirth (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    dataEmployee () {
      this.setInitData()
    }
  },
  data () {
    return {
      accountUser: false,
      stepEmployee: 1,
      dateOfBirth: false,
      sign: null,
      dateEffective: null,
      dateExpiration: null,
      images: [],
      validatorRequired: '',
      dialogDeleteContract: false,
      dialogEditContract: false,
      // trình độ học vấn
      qualificationForEmployee: [
        { name: 'Cao học', value: 'Cao học' },
        { name: 'Đại học', value: 'Đại học' },
        { name: 'Cao đẳng', value: 'Cao đẳng' },
        { name: 'Trung cấp', value: 'Trung cấp' },
        { name: 'Sơ cấp', value: 'Sơ cấp' },
        { name: 'Khác', value: 'Khác' }
      ],
      // giới tính
      genderEmployee: [
        { name: 'Nam', value: 1 },
        { name: 'Nữ', value: 0 },
        { name: 'Khác', value: 2 }
      ],
      // tiêu đề của bảng hợp đồng
      headersContract: [
        { text: 'Tên hợp đồng', value: 'title', sortable: false },
        { text: '', sortable: false },
        { text: 'Loai hợp đồng', value: 'type', sortable: false },
        { text: 'Thời gian', value: 'date_sign', sortable: false },
        { text: '', sortable: false },
        { text: '', sortable: false },
        { text: 'Trạng thái', sortable: false },
        { text: 'Hành động', value: 'action', sortable: false }
      ],
      typeContract: [
        { name: 'Học việc', value: 0 },
        { name: 'Cộng tác viên', value: 1 },
        { name: 'Thử việc', value: 2 },
        { name: 'Có thời hạn', value: 3 },
        { name: 'Không thời hạn', value: 4 },
        { name: 'Khác', value: 5 }
      ],
      statusContract: [
        { name: 'Tiêu chuẩn', value: 0 },
        { name: 'Chấm dứt', value: 1 },
        { name: 'Gia hạn', value: 2 }
      ],
      contracts:
      {
        title: '',
        status: 0,
        type: 0,
        employee_id: '',
        date_sign: null,
        date_effective: null,
        date_expiration: null
      },
      employee: {
        name: 'ng',
        phone: '09722409082',
        email: 'cuong@gmail.com',
        address: 'ha ',
        avatar: null,
        gender: 1,
        status: true,
        roles: [],
        departments: [],
        contracts:
          {
            title: '',
            status: 0,
            type: 0,
            date_sign: null,
            date_effective: null,
            date_expiration: null
          }
      }
    }
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Contracts', ['createContract', 'updateContract', 'deleteContract']),
    ...mapActions('Employee', ['getEmployee', 'setEmployee', 'deleteEmployee', 'uploadItem']),
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry', 'reloadDataview']),
    ...mapActions(['showNotify']),
    // save date birth of user
    save (date) {
      this.$refs.dateOfBirth.save(date)
    },
    // upload images
    uploadImageSuccess (formData, index, fileList) {
      this.uploadItem({
        data: formData,
        cb: (response) => {
          this.employee.avatar = response.data.name
        }
      })
    },
    // remove image
    beforeRemove (index, done, fileList) {
      var r = confirm('remove images')
      if (r === true) {
        done()
      } else {

      }
    },
    // edit images
    editImage (formData, index, fileList) {
      this.uploadItem({
        data: formData,
        cb: (response) => {
          this.employee.avatar = response.data.name
        }
      })
    },
    // add count user
    addAccount () {
      this.$validator.reset()
      this.accountUser = !this.accountUser
    },
    // focus form 1
    backTabIndex1 () {
      this.$refs.firstInput1.focus()
    },
    backTabIndex2 () {
      this.$refs.firstInput2.focus()
    },
    // contract
    editContract (item, id) {
      this.validatorRequired = 'required'
      this.$validator.reset()
      this.idContract = id
      this.editedIndex = 1
      this.contracts = Object.assign({}, item)
      this.dialogEditContract = true
    },
    // validator form 1
    nextStepEmployee () {
      this.validatorRequired = ''
      this.$validator.validateAll().then(result => {
        if (result) {
          this.stepEmployee = 2
          setTimeout(() => {
            this.$refs.formSub.focusInput()
          }, 300)
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    },
    // tro lai form 1
    backStep () {
      this.validatorRequired = ''
      this.stepEmployee = 1
    },
    // data form sub
    positionAndDepartment (updated) {
      this.employee.departments = updated
    },
    // add contract
    addContract () {
      this.validatorRequired = 'required'
      this.$validator.reset()
      this.editedIndex = -1
      this.contracts = Object.assign({}, this.defaultContract)
      this.contracts.employee_id = this.employeeDetail.id
      this.dialogEditContract = true
    },
    // close contract
    closeContract () {
      this.validatorRequired = ''
      this.dialogEditContract = false
      setTimeout(() => {
        if (this.editedIndex === -1) {
          this.editedIndex = -1
        } else {
          this.employee.contracts = Object.assign({}, this.defaultContract)
          this.editedIndex = -1
        }
      }, 300)
    },
    // remove contract
    removeConfirmContract (idContract) {
      this.employee.contracts.id = idContract
      this.dialogDeleteContract = true
    },
    removeContract (confirm) {
      if (confirm) {
        this.deleteContract({
          id: this.employee.contracts.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'contract',
              data: this.employee.contracts,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.deleteContract'),
              color: 'success'
            })
            this.dialogDeleteContract = false
            this.getEmployee({ employeeId: this.$route.params.id,
              params: { include: 'roles,departments.branch,contracts' },
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
    // catch error before update or create
    validateBeforeSubmit () {
      this.validatorRequired = ''
      setTimeout(() => {
        this.$refs.formSub.validateBeforeSubmit()
        this.$validator.validateAll().then(result => {
          if (result) {
            let employee = Object.assign({}, this.employee)
            employee.status = employee.status ? 1 : 0
            this.$emit('submit', employee)
          } else {
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.invalid'),
              color: 'warning'
            })
            this.stepEmployee = 1
          }
        })
      }, 100)
    },
    // submit form contract
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.editedIndex === -1) {
            this.createContract({
              contract: this.contracts,
              cb: (response) => {
                this.showNotify({
                  color: 'success',
                  text: this.$t('alert.addContract')
                })
                setTimeout(() => {
                  this.contracts = Object.assign({}, this.defaultContract)
                  this.editedIndex = -1
                }, 300)
                this.getEmployee({
                  employeeId: this.$route.params.id,
                  params: { include: 'roles,departments.branch,contracts' },
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
                this.dialogEditContract = false
                this.getEmployee({
                  employeeId: this.$route.params.id,
                  params: { include: 'roles,departments.branch,contracts' },
                  cb: (response) => {
                    this.updateDataviewEntry({
                      name: 'employee',
                      data: response,
                      key: 'id'
                    })
                  }
                })
              }
            })
          }
        }
      })
    },

    stepError () {
      this.stepEmployee = 1
    },
    // set data form employee
    setInitData () {
      let dataEmployee = { ...this.dataEmployee }
      if (dataEmployee.roles) {
        dataEmployee.roles = map(dataEmployee.roles.data, (role) => {
          return role.id
        })
      }
      this.employee = { ...this.employee, ...dataEmployee }
      if (this.employee.avatar_path) {
        this.images = [{ path: this.employee.avatar_path, default: 1, highlight: 1 }]
      }
      if (this.employee.departments.data) {
        this.employee.departments.data.map((item) => {
          if (item.branch) {
            item.branchs = [item.branch.data]
          }
          item.positions = [
            {
              'id': item.position_id,
              'name': item.position_name
            }
          ]
        })
      }
    }
  },
  mounted () {
    this.dataEmployee && this.setInitData()
  }

}
</script>
