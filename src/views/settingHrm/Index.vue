<template>
  <v-layout ref="laylout" column fill-height>
   <div ref="header">
    <v-toolbar height="50px" color="white" flat>
      <v-layout row wrap>
        <v-tooltip bottom class="mt-2">
          <v-btn slot="activator" v-if="canAccess('setting.create')"
          class="mr-5" icon color="primary"
          @click="addSetting"
          >
          <v-icon>add</v-icon>
        </v-btn>
        <span>Thêm mới</span>
      </v-tooltip>
      <v-flex xs10 class="mt-1" :class="isMini && 'full-flex-basic full-width-col-10'">
        <v-text-field
        hide-details
        single-line
        placeholder="Tìm kiếm ..."
        v-model="filterQ"
        @click:clear="clearSearch"
        @keyup="changeSearch"
        clearable
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout slot="extension" v-if="!isMini">
      <v-flex style="flex-basis:55px;" sm1 class="text-bold">
        #
      </v-flex>
      <v-flex sm2 class="text-bold">
        Tên
      </v-flex>
      <v-flex sm2 class="text-bold">
        Key
      </v-flex>
      <v-flex sm6 class="text-bold">
        Giá trị
      </v-flex>
<!--       <v-flex sm2 class="text-bold ml-2">
        Trạng thái
      </v-flex> -->
      <v-flex sm2 class="text-bold ml-2">
        Hành động
      </v-flex>
    </v-layout>
  </v-toolbar>
</div>
<v-flex>
 <v-dialog v-model="dialog" :max-width="widthDiglogDefault">
  <v-form @submit.prevent="submitForm"  class="pa-0" style="position: relative;">
   <v-card>
    <div :style="{width:widthDiglogDefault}" style="position: fixed; z-index: 1000; background-color: #fff;">
      <v-card-title sm12 >
        <span class="headline" style="margin: 0 auto;">{{ formTitle }}
        </span>
      </v-card-title>
      <v-divider></v-divider>
    </div>
    <!-- form edit -->
    <v-card-text id="formSub">
      <v-container fluid class="white scroll-y pt-5">
        <v-layout wrap>
         <!-- name -->
         <v-flex xs12 sm6 md12>
          <v-text-field
          autofocus
          tabindex="1"
          ref="firstInput"
          placeholder="Nhập thông tin"
          :error-messages="errors.has('name') ? errors.collect('name') : []"
          v-validate="'required'"
          :data-vv-as="$t('label.name')"
          name="name"
          label="Thông tin"
          class="input-required"
          v-model="setting.name"> </v-text-field>
        </v-flex>

        <!-- slug -->
        <v-layout row xs12 sm6 md12>
          <v-text-field
          placeholder="Nhập key"
          v-validate="'required'"
          tabindex="2"
          :error-messages="errors.has('slug') ? errors.collect('slug') : []"
          :data-vv-as="$t('label.slug')"
          name="slug"
          id="input"
          :label="$t('label.key')"
          class="input-required"
          v-model="setting.slug">
          <v-fade-transition slot="append">
            <v-tooltip bottom>
              <v-icon slot="activator" color="primary" @click="copy">save</v-icon>
              <span>Sao chép</span>
            </v-tooltip>
            </v-fade-transition
            > </v-text-field>
          </v-layout>
          <v-flex xs12>
            <v-select
            :disabled="!(editedIndex===-1)"
            tabindex="3"
            label="Kiểu nhập"
            :items="typeValueSetting"
            placeholder="Chọn kiểu nhập"
            item-text="name"
            item-value="value"
            v-model="defaultValue"
            @change="changeTypeSetting"
            ></v-select>
          </v-flex>
          <v-flex xs12>
            <label style="color:#859197;font-size: 17px;" v-if="isEditor">Giá trị <span style="color:red;">*</span>
            </label>
            <tinymce
            id="d1"
            tabindex="4"
            toolbar1="formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | codesample"
            toolbar2=""
            :other_options="{ height: '300px', images_upload_handler: handleImageAdded }"
            v-if="isEditor"
            v-validate ="'required'"
            :error-messages="errors.has('value') ? errors.collect('value') : []"
            :data-vv-as="$t('label.value')"
            placeholder="Nhập giá trị"
            name="value"
            :label="$t('label.value')"
            v-model="setting.value"
            @editorInit="setEditorContent($event, setting.value)"
            ></tinymce>
            <span v-if="isEditor" v-show="errors.has('value')" style="color: #ff5252; margin-top: 15px; font-size:12px;">{{ errors.first('value') }}</span>
            <!-- phone or hotline -->
            <v-text-field
            tabindex="4"
            v-if="isPhone"
            placeholder="Nhập giá trị"
            v-validate="'required|numeric|min:10|max:12'"
            :error-messages="errors.has('value') ? errors.collect('value') : []"
            :data-vv-as="$t('label.value')"
            name="value"
            :counter="12"
            type="number"
            :label="$t('label.value')"
            class="input-required"
            v-model="setting.value"> </v-text-field>
            <!-- email -->
            <v-text-field
            tabindex="4"
            v-if="isEmail"
            placeholder="Example@gmail.com"
            v-validate="'required|email'"
            :error-messages="errors.has('value') ? errors.collect('value') : []"
            :data-vv-as="$t('label.value')"
            name="value"
            :label="$t('label.value')"
            class="input-required"
            v-model="setting.value"> </v-text-field>
            <!-- url-->
            <v-text-field
            tabindex="4"
            v-if="isUrl"
            placeholder="https://vnexpress.net"
            v-validate="'required|url:require_protocol'"
            :error-messages="errors.has('value') ? errors.collect('value') : []"
            :data-vv-as="$t('label.value')"
            name="value"
            :label="$t('label.value')"
            class="input-required"
            v-model="setting.value"> </v-text-field>
            <!-- number-->
            <v-text-field
            tabindex="4"
            v-if="isNumber"
            placeholder="Nhập số"
            v-validate="'required|numeric'"
            :error-messages="errors.has('value') ? errors.collect('value') : []"
            :data-vv-as="$t('label.value')"
            name="value"
            type="number"
            min=1
            :label="$t('label.value')"
            class="input-required"
            v-model="setting.value"> </v-text-field>
            <!-- key othor -->
            <v-text-field
            tabindex="4"
            v-if="isNomal"
            placeholder="Nhập giá trị"
            v-validate="'required'"
            :error-messages="errors.has('value') ? errors.collect('value') : []"
            :data-vv-as="$t('label.value')"
            name="value"
            :label="$t('label.value')"
            class="input-required"
            v-model="setting.value">
          </v-text-field>
          </v-flex>
          <v-flex xs3 class="mt-3">
              <label slot="activator">Trạng thái</label>
              <v-tooltip bottom>
                  <v-switch
                  style="margin-top:-4px; outline-style: none;"
                  v-validate = "'required'"
                  tabindex = "5"
                  name = "status"
                  slot="activator"
                  v-model="setting.status"
                  ></v-switch>
                  <span v-if="setting.status">Hiển thị</span>
                  <span v-else>Không hiển thị</span>
              </v-tooltip>
          </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
  <div style="margin-top: -40px;">
      <v-divider></v-divider>
      <v-card-actions style="">
         <v-spacer></v-spacer>
              <v-btn tabindex="6" color="error" flat @click.native="close">Hủy bỏ</v-btn>
              <v-btn tabindex="7" type="submit" class="green--text text-uppercase" flat><span v-if="editedIndex!==-1">Lưu lại</span><span v-else class="text-uppercase">Thêm mới</span></v-btn>
              <div :tabindex="7"  @focus="backTabIndex"></div>
      </v-card-actions>
  </div>
</v-card>
</v-form>
</v-dialog>
</v-flex>

<v-flex xs12 class="border-e0-top">
  <data-view
  :name="dataViewName"
  api-url="settings?sort=status:-1,id:-1"
  v-if="dataViewHeight"
  :viewHeight="dataViewHeight"
  :params="filterParams"
  :ref="dataViewName"
  >
  <template slot-scope="{items}">
    <v-list three-line>
      <template v-for="(item, index) in items.data">
        <v-layout class="pa-2" :key="index" >
          <v-flex style="flex-basis:55px;" class="ml-3" sm1 :class="isMini && 'd-none'">
            {{ index + 1 }}
          </v-flex>
          <v-flex sm2 class="pr-1" :class="isMini && 'd-none'">
            {{ item.name }}
          </v-flex>
          <v-flex sm2 class="pr-1 copytext" :class="isMini && 'd-none'">
            <span @click.stop="clickToCopy" class="click-copy text-capitalize">{{ item.slug }}</span>
          </v-flex>
          <v-flex
          row
          class="mr-1"
          sm6
          style="white-space: nowrap;"
          v-if="item.value.length > 56"
          >
          <v-flex style="float:left">
            <span v-html="item.value.slice(0,55) + ' ...'"></span>
          </v-flex>
          <v-flex sm1 style="margin-top: -13px;">
            <v-tooltip bottom>
              <v-btn slot="activator" icon @click="DetailSetting(item)"><v-icon color="green" size="19px">fas fa-eye</v-icon></v-btn>
              <span>Xem thêm</span>
            </v-tooltip>
          </v-flex>
          <v-menu
          style="left:50px !important;"
          v-model="dialogDetail"
          >
          <v-card>
            <v-list>
              <v-list-tile>
                <v-list-tile-content  v-if="valueSetting">
                  <v-list-tile-title class="text-xs-center" >{{ valueSetting.name }}</v-list-tile-title>
                </v-list-tile-content>
                <v-btn icon flat @click="dialogDetail = false">
                  <v-icon color="primary">close</v-icon>
                </v-btn>
              </v-list-tile>
              <v-divider></v-divider>
              <v-container fluid class="white scroll-y" v-if="valueSetting">
                <v-flex v-html="valueSetting.value">
                </v-flex>
              </v-container>
            </v-list>
          </v-card>
        </v-menu>
      </v-flex>
      <v-flex
      class="mr-1"
      sm6
      v-else
      v-html="item.value"> </v-flex>
      <v-flex sm2 :class="isMini && 'd-none'">
        <v-layout row xs12>
          <v-tooltip bottom sm6>
            <v-btn slot="activator" class="ma-0" v-if="canAccess('setting.update')"  @click="editSetting(item,item.id)" icon>
              <v-icon class='theme--light teal--text'>edit</v-icon>
            </v-btn>
            <span>Sửa</span>
          </v-tooltip>
          <v-tooltip bottom sm6>
            <v-btn slot="activator" class="ma-0" v-if="canAccess('setting.delete')" @click.stop="removeConfirm(item)" icon >
              <v-icon class="theme--light pink--text">delete</v-icon>
            </v-btn>
            <span>Xóa</span>
          </v-tooltip>
        </v-layout>
        <v-tooltip bottom sm12>
          <v-switch
          @click.native.stop
          @change="changeStatus(item.id)"
          class='ml-3'
          name="status"
          slot="activator"
          v-model="item.status"
          ></v-switch>
          <span v-if="item.status">Hiển thị</span>
          <span v-else>Không hiển thị</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
    <v-divider
    :key="'div'+ item.id"
    v-if="index + 1 < items.data.length"
    ></v-divider>
  </template>
</v-list>
</template>
</data-view>
</v-flex>
<dialog-confirm v-model="dialogDelete" @input="remove" />
</v-layout>
</template>
<script>
import axios from '../../plugins/axios'
import { debounce } from 'lodash'
import DataView from '@/components/DataView/DataView'
import DialogConfirm from '@/components/DialogConfirm'
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
export default{
  name: 'setingIndex',
  components: {
    DataView,
    DialogConfirm
  },
  props: {
    isMini: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialogDetail: false,
    valueSetting: null,
    width: 500,
    dataViewHeight: 0,
    dataViewName: 'setting',
    defaultValue: null,
    idSetting: null,
    dialogDelete: false,
    dialog: false,
    widthDiglogDefault: '600px',
    typeValueSetting: [
      { name: 'Bình thường', value: 0 },
      { name: 'Số điện thoại', value: 1 },
      { name: 'Văn bản', value: 2 },
      { name: 'Email', value: 3 },
      { name: 'Url', value: 4 },
      { name: 'Số', value: 5 }
    ],
    editedIndex: -1,
    setting: {
      name: '',
      value: '',
      slug: '',
      status: true
    },
    defaultItem: {
      value: '',
      status: true,
      type: 0
    }
  }),
  watch: {
    dialog (val) {
      if (!val) return
      requestAnimationFrame(() => {
        this.$refs.firstInput.focus()
      })
    }
  },
  computed: {
    ...mapGetters('Setting', [ 'filterParams']),
    ...mapGetters(['isFetchingApi']),
    ...mapFields(`Setting`, {
      filterQ: 'params.q'
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'Thêm thiết lập' : 'Sửa thiết lập'
    },
    isNomal () {
      return this.defaultValue === 0
    },
    isPhone () {
      return this.defaultValue === 1
    },
    isEditor () {
      return this.defaultValue === 2
    },
    isEmail () {
      return this.defaultValue === 3
    },
    isUrl () {
      return this.defaultValue === 4
    },
    isNumber () {
      return this.defaultValue === 5
    }
  },
  created () {
    this.FetchSetting()
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 104
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
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions(['setMiniDrawer']),
    ...mapActions('Setting', ['FetchSetting', 'updateStatusSetting', 'createSetting', 'updateSetting', 'deleteSetting']),
    ...mapActions('Dataview', ['updateDataviewEntry', 'removeDataviewEntry']),
    ...mapActions(['showNotify', 'setMiniDrawer']),

    backTabIndex () {
      this.$refs.firstInput.focus()
    },
    // close dialog
    close () {
      this.dialog = false
      setTimeout(() => {
        this.setting = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    // nut copy
    copy () {
      var copyText = document.querySelector('#input')
      copyText.select()
      document.execCommand('copy')
    },
    DetailSetting (item) {
      this.valueSetting = item
      this.dialogDetail = true
    },
    // open dialog
    addSetting () {
      this.setting = Object.assign({}, this.defaultItem)
      this.$validator.reset()
      this.editedIndex = -1
      this.changeTypeSetting(-1)
      this.dialog = true
    },
    // reset all search
    clearSearch () {
      this.changeSearch()
      this.filter()
    },
    // copy
    copy () {
      var copyText = document.querySelector('#input')
      copyText.select()
      document.execCommand('copy')
    },
    // change filter
    changeSearch: debounce(function () {
      this.filter()
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    },
    // change changeTypeSetting
    changeTypeSetting (value) {
      this.defaultValue = value
      this.setting.type = value
      setTimeout(() => {
        if (value === 2) {
          this.widthDiglogDefault = '1000px'
        } else {
          this.widthDiglogDefault = '600px'
        }
      }, 500)
    },
    // set upload images editor
    handleImageAdded: async function (file, success, failure) {
      let formData = new FormData()
      formData.append('file', file.blob())
      // try {
      //   let response = await axios.post('/branches/upload', formData)
      //   if (response.data.code === 1) {
      //     success(response.data.data.path)
      //   } else {
      //     return false
      //   }
      // } catch (err) {
      //   if (err.status === 422) {
      //     this.$store.dispatch('showNotify', {
      //       text: this.$t('alert.error'),
      //       color: 'error'
      //     })
      //   }
      // }
    },

    removeConfirm (item) {
      this.valueSetting = item
      this.idSetting = item.id
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteSetting({
          id: this.idSetting,
          cb: (response) => {
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.deleteSettingSuccess'),
              color: 'success'
            })
            this.removeDataviewEntry({
              name: 'setting',
              data: this.valueSetting,
              key: 'id'
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
    // validator
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.editedIndex === -1) {
            this.createSetting({
              setting: this.setting,
              cb: (response) => {
                this.clearFilter()
                this.dialog = false
                setTimeout(() => {
                  this.setting = Object.assign({}, this.defaultItem)
                  this.editedIndex = -1
                }, 300)
                this.$refs[this.dataViewName].$emit('reload')
                this.showNotify({
                  color: 'success',
                  text: this.$t('alert.addSettingSuccess')
                })
              }
            })
            this.dialog = false
          } else {
            this.updateSetting({
              id: this.idSetting,
              setting: this.setting,
              cb: (response) => {
                this.showNotify({
                  color: 'success',
                  text: this.$t('alert.updateSettingSuccess')
                })
                this.updateDataviewEntry({
                  name: 'setting',
                  data: response.data,
                  key: 'id'
                })
                this.dialog = false
                setTimeout(() => {
                  this.setting = Object.assign({}, this.defaultItem)
                  this.editedIndex = -1
                }, 300)
              }
            })
            this.dialog = false
          }
        }
      })
    },
    // set value editor
    setEditorContent (e, content) {
      e.setContent(content || '')
    },
    // edit setting
    editSetting (item, id) {
      this.defaultValue = item.type
      this.$validator.reset()
      this.idSetting = id
      this.editedIndex = 1
      this.setting = Object.assign({}, item)
      this.dialog = true
    },
    // change status
    changeStatus (idSetting) {
      this.updateStatusSetting({
        id: idSetting,
        cb: (response) => {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.statusSuccess'),
            color: 'success'
          })
          this.updateDataviewEntry({
            name: 'setting',
            data: response,
            key: 'id'
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
  }
}
</script>

<style scoped>
  span.status{
    position: absolute;
    bottom: 118px;
    left:70px;
  }
  #d1 {
    height:600px !important;
  }
  .title-department{
   color: #67757c;
   -webkit-transform: translateY(-25px) translateX(-12px);
   transform: translateY(-25px) translateX(-12px);
   top: 0;
 }
 .v-menu__content{
  position: none !important;
  left: 20% !important;
  right: 20% !important;
  top: 20% !important;
}
</style>
