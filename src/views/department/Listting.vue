<template>
  <v-layout ref="laylout" column fill-height>
    <div ref="header">
      <v-toolbar height="60px" color="white" flat>
        <v-layout row wrap>
          <v-flex xl1 lg1 md1 sm1  xs2 :class="isMini">
            <!--  <v-tooltip bottom> -->
            <v-tooltip bottom>
              <v-btn slot="activator" v-if="canAccess('department.create')"
              class="mr-3 mt-4" icon color="primary"
              @click="openDialog">
              <v-icon>add</v-icon
                >
              </v-btn>
              <span>Thêm mới</span>
            </v-tooltip>
            <!--  <span>Thêm mới</span> -->
            <!-- </v-tooltip> -->
          </v-flex>
          <v-flex xl5 lg5 md5 sm5 xs9 class="mt-1 paddRight-4" :class="isMini && 'full-flex-basic'">
             <v-text-field
             hide-details
             single-line
             slot="activator"
             placeholder="Nhập  phòng ban"
             v-model="nameFilter"
             @keyup="changeSearch"
             @click:clear="changeSearch"
             clearable
             ></v-text-field>
         </v-flex>
         <v-flex  xl5 lg5 md5 sm5  class='mt-1 display'  :class="isMini && 'd-none'">
          <v-autocomplete
          v-model="branchFilter"
          :items="listBranch"
          @keyup="sreachBranch"
          @change="filter"
          @click:clear="clearFilterBranch"
          item-text="name"
          clearable
          item-value="id"
          :loading="isLoadingBranch"
          placeholder="Chọn chi nhánh"
          >
             <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color: blue">
                Không có   chi nhánh  này trong hệ thống
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-autocomplete>
        </v-flex>
        <!--dialog-->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <form @submit.prevent="validateBeforeSubmit">
              <v-card-title>
                <span class="headline" width="100%" style="margin:0 auto">{{ formTitle }}</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text id="formSub">
                <v-container grid-list-md>
                  <v-layout wrap>
                    <!-- name -->
                    <v-flex xs12 sm6 md12>
                      <v-text-field
                      placeholder="Nhập tên phòng ban"
                      :error-messages="errors.has('name_department') ? errors.collect('name_department') : []"
                      v-validate="'required'"
                      :label="$t('label.name_department')"
                      :tabindex="1"
                      ref="firstInput"
                      class="input-required"
                      :data-vv-as="$t('label.name_department')"
                      name="name_department"
                      autofocus
                      v-model="department.name">
                    </v-text-field>
                  </v-flex>
                  <!-- value -->
                  <!--branch_id-->
                   <v-flex md12>
            <v-autocomplete
            :loading="isLoadingBranchAdd"
            :error-messages="errors.has('name_branch') ? errors.collect('name_branch') : []"
            v-validate="'required'"
            :data-vv-as="$t('label.name_branch')"
            v-model="department.branch_id"
            :items="branchAll"
            :tabindex="2"
            @blur="closeBlur()"
            @keyup="sreachBranchAdd"
            @click:clear="clearFilterBranchAdd"
            item-text="name"
            clearable
            item-value="id"
            :label="$t('label.name_branch')"
             class="input-required"
             name="name_branch"
             placeholder="Chọn chi nhánh"
            >
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color:blue">
                Không có  chi nhánh  này trong hệ thống
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-autocomplete> </v-flex>
                 <v-flex xs12 sm6 md12>
                  <label class="title-department">Trạng thái</label>
                  <v-flex xs1>
                    <v-tooltip bottom>
                      <v-switch
                      @click.native.stop
                      class=''
                      style="outline-style: none;"
                      :tabindex="3"
                      name="status"
                      slot="activator"
                      v-model="department.status"
                      ></v-switch>
                      <span v-if="department.status">Hiển thị</span>
                      <span v-else>Không hiển thị</span>
                    </v-tooltip>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-container>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error darken-1" :tabindex="4" flat  @click.native="close" class="ml-2">Hủy bỏ</v-btn>
            <v-btn flat
            :tabindex="5"
            :loading="isFetchingApi"
            :disabled="isFetchingApi"
            type="submit"
            color="success darken-1">
            <span v-if="editTitle==-2">Lưu lại</span><span v-else>Thêm mới</span>
          </v-btn>
          <div :tabindex="6" @focus="backTabIndex"></div>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</v-layout>
<v-layout slot="extension" class="pt-2 pb-2" v-if="!isMini">
 <v-flex xl1 lg1 md1 sm1 xs1  class="text-bold flex-basis">
  #
</v-flex>
<v-flex xl4 lg4 md4 sm4 xs4 class="text-bold">
  Phòng ban
</v-flex>
<v-flex xl4 lg4 md4 sm4 xs4 class="text-bold">
  Chi nhánh
</v-flex>
<v-flex xl2 lg2 md2 sm2 xs2 class="text-bold">
  <v-flex sm12> Trạng thái </v-flex>
</v-flex>
<v-flex xl1 lg1 md1 sm1 xs1  class="text-bold">
  Hành động
</v-flex>
</v-layout>
</v-toolbar>
</div>
<v-flex xs12 class="border-e0-top">
  <data-view
  :name="dataViewName"
  api-url="departments?include=branch&sort=status:-1,id:-1"
  v-if="dataViewHeight"
  :viewHeight="dataViewHeight"
  :params="filterParams"
  :ref="dataViewName"
  >
  <template slot-scope="{items}">
    <v-list>
      <template v-for="(item, index) in items.data">
       <v-list-tile class="lighten-2 v-list-tile"  :key="index">
         <v-layout>
           <v-flex class="flex-basis" xl1 lg1 md1 sm1 xs1   :class="isMini && 'd-none'">
            {{index + 1}}
          </v-flex>
          <v-flex xl4 lg4 md4 sm4 xs4 class="paddRight-5" :class="isMini && 'd-none'">
            {{ item.name }}
          </v-flex>
          <v-flex  xl4 lg4 md4 sm4 xs4 class="paddRight-5" :class="isMini && 'd-none'">
            {{ item.branch_name }}
          </v-flex>
          <v-flex xl2 lg2 md2 sm2 xs2  class="paddingLeft-10" :class="isMini && 'd-none'">
           <v-tooltip bottom sm12>
            <v-switch
            @click.native.stop
            @change="changeStatus(item.id)"
            name="status"
            slot="activator"
            v-model="item.status"
            ></v-switch>
            <span v-if="item.status">Hiển thị</span>
            <span v-else>Không hiển thị</span>
          </v-tooltip>
        </v-flex>
        <v-flex xl1 lg1 md1 sm1 xs1  :class="isMini && 'd-none'">
          <v-tooltip bottom>
            <v-btn slot="activator" class="ma-0" v-if="canAccess('department.update')" icon @click="editItem(item,item.id)">
              <v-icon class='theme--light teal--text'>edit</v-icon>
            </v-btn>
            <span>Sửa</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" class="ma-0" v-if="canAccess('department.delete')" icon @click.stop="removeConfirm(item)">
              <v-icon class="theme--light pink--text">delete</v-icon>
            </v-btn>
            <span>Xóa</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-list-tile>
    <v-divider
    :key="'div'  + item.id"
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
import { mapFields } from 'vuex-map-fields'
import DialogConfirm from '@/components/DialogConfirm'
import { debounce } from 'lodash'
import DataView from '@/components/DataView/DataView'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'UserListting',
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
    dataViewHeight: 0,
    dataViewName: 'department',
    idDepartment: null,
    dialogDelete: false,
    dialog: false,
    dataDepartment: {},
    editedIndex: -1,
    editTitle: -1,
    branches: [],
    listBranch: [],
    isLoadingBranchAdd: false,
    isLoadingBranch: false,
    department: {
      name: '',
      status: true,
      branch_id: ''
    },
    params: {
      q: '',
      branch_id: ''
    },
    defaultItem: {
    }
  }),
  computed: {
    formTitle () {
      return this.editTitle === -1 ? 'Thêm phòng ban' : 'Sửa phòng ban'
    },
    ...mapGetters('Branch', ['branchAll']),
    ...mapGetters('Department', ['departmentDetail', 'filterParams']),
    ...mapGetters(['isFetchingApi']),
    ...mapFields('Department', {
      nameFilter: 'params.q',
      branchFilter: 'params.branch_id'
    })
  },
  watch: {
    dialog (val) {
      val || this.close()
      // autofocus for form
      if (!val) return
      requestAnimationFrame(() => {
        this.$refs.firstInput.focus()
      })
    }
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions(['setMiniDrawer']),
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Department', ['fetchDepartment', 'getDepartment', 'createDepartment', 'deleteDepartment', 'updateDepartment', 'updateStatusDepartment', 'clearFilter']),
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry']),
    ...mapActions('Branch', ['getBranchs', 'setBranch']),
    backTabIndex () {
      this.$refs.firstInput.focus()
    },
    // reset filter
    resetFilter () {
      this.clearFilter()
      this.filter()
    },
    /// screach api branch
    sreachBranch: debounce(function (value) {
      this.getBranchs({
        params: { q: value.target.value, limit: 10 },
        cb: (params) => {
          this.listBranch = params
          console.log('data params', params)
        }
      })
      this.isLoadingBranch = true
      setTimeout(() => {
        this.isLoadingBranch = false
      }, 500)
    }, 500),

    closeBlur () {
      // nếu có thay đổi branch_id trong department thì thay đổi
      if (this.department.id && this.department.branch_id !== this.department.branch.data.id) {
          console.log("data response :", this.department.branch_id)
          // this.setBranch({
          //    branchs: [this.department.branch_id]
          // })
      }
      // mặc định không chọn branch_id ở ngoài 10 bản ghi thì lấy bản ghi cũ
      else if (this.department.branch) {
        this.setBranch({
          branchs: [this.department.branch.data]
        })
      }
    },
    // serach api form add
    sreachBranchAdd: debounce(function (value) {
      this.getBranchs({ params: { q: value.target.value, limit: 10 } })
      this.isLoadingBranchAdd = true
      setTimeout(() => {
        this.isLoadingBranchAdd = false
      }, 500)
    }, 500),
    /// change status
    changeStatus (idDepartment) {
      this.updateStatusDepartment({
        id: idDepartment,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.status-edit-department')
          })
        }
      })
    },
    // khi clear giá trị ô branch mặc định lấy 10 bản ghi
    clearFilterBranch () {
      this.getBranchs({ params: { limit: 10 } })
    },
    clearFilterBranchAdd () {
      this.getBranchs({ params: { limit: 10 } })
    },
    /// /label status
    status_txt () {
      if (this.department.status) {
        this.status = 'Hiển thị'
      } else {
        this.status = 'Không hiển thị'
      }
    },
    // dialog
    openDialog () {
      // reset validator
      this.$validator.reset()
      this.editTitle = -1
      this.getBranchs({ params: { limit: 10 } })
      this.dialog = true
      this.department.status = true
    },
    // end dialog
    close () {
      this.dialog = false
      setTimeout(() => {
        this.department = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    // đổ dữ liệu from edit
    editItem (item, id) {
      this.$validator.reset()
      this.editTitle = -2
      this.idDepartment = id
      // lọc branch_id theo branch
      this.getBranchs({ params: { q: item.branch_name } })
      this.editedIndex = this.departmentDetail.indexOf(item)
      this.department = Object.assign({}, item)
      this.status_txt()
      this.dialog = true
      console.log('data item :', item)
    },
    validateBeforeSubmit () {
      // check validate
      this.$validator.validateAll().then(result => {
        if (result) {
          this.submitForm()
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    },
    // add and edit data
    submitForm () {
      if (this.editTitle === -1) {
        let department = Object.assign({}, this.department)
        department.status = department.status ? 1 : 0
        this.createDepartment({
          department: department,
          cb: (response) => {
            this.dialog = false
            setTimeout(() => {
              this.editedIndex = -1
            }, 300)
            this.showNotify({
              color: 'success',
              text: this.$t('alert.add-department')
            })
            this.getBranchs({ params: { limit: 10 } })
            this.resetFilter()
          }
        })
      } else {
        let department = Object.assign({}, this.department)
        department.status = department.status ? 1 : 0
        this.updateDepartment({
          id: this.idDepartment,
          department: department,
          cb: (response) => {
            this.showNotify({
              color: 'success',
              text: this.$t('alert.edit-department')
            })
            this.updateDataviewEntry({
              name: 'department',
              data: response.data,
              key: 'id'
            })
            this.dialog = false
            setTimeout(() => {
              this.editedIndex = -1
            }, 300)
          }
        })
      }
    },
    /// screach
    changeSearch: debounce(function () {
      this.filter()
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    },
    // xóa department
    removeConfirm (item) {
      this.dataDepartment = item
      this.idDepartment = item.id
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteDepartment({
          id: this.idDepartment,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'department',
              data: this.dataDepartment,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.delete-department'),
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
    // mặc định lấy 10 bản ghi
    if (!this.branchAll.length) {
      this.getBranchs({ params: { limit: 10 } })
    }
    // mặc định lấy 10 bản ghi screach
    if (!this.listBranch.length) {
      this.getBranchs({
        params: { limit: 10 },
        cb: (params) => {
          this.listBranch = params
          console.log('data params', params)
        }
      })
    }
    this.dataViewHeight = this.$refs.laylout.clientHeight - 122
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
  .v-toolbar__extension{
    height: 60px !important;
  }
  .v-input.v-text-field{
    margin-top: 11px !important;
  }
  .title-department{
   color: #67757c;
   -webkit-transform: translateY(-25px) translateX(-12px);
   transform: translateY(-25px) translateX(-12px);
   top: 0;
 }
 .v-input--selection-controls{
  margin-top: 0px;
}
.v-card__text{
  padding: 0px !important
}
@media (min-width: 1264px){
    .flex-basis{
      flex-basis:55px;
    }
  }
  @media (min-width: 960px){
    .flex-basis{
      flex-basis:55px;
    }

    .v-list-tile{
     height: 48px !important;
     padding: 0 11px !important;

    }
  }
  @media (min-width: 600px){
    .flex-basis{
      flex-basis:55px;
    }
    .paddRight-4{
      padding-right: 10px;
    }
    .paddingLeft-10{
      padding-left: 10px;
    }
    .paddRight-5{
       padding-right: 5px !important;
    }

    .v-list-tile{
      height: 76px !important;
      padding-top: 16px !important;
    }

    .display{
      display: block !important;
    }

  }
  @media (min-width: 425px){
  }
  @media (min-width: 250px){
    .flex-basis{
      flex-basis:55px;
      margin-right: 10px;
    }
    .display{
      display: none;
    }
    .paddRight-5{
       padding-right: 10px;
    }
    .v-list-tile{
   height: 117px;
    padding-top: 35px;
    }

  }

   </style>
