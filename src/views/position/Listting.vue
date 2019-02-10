<template>
  <v-layout ref="laylout" column fill-height>
    <div ref="header">
      <v-toolbar height="50px" color="white" flat>
        <v-layout row wrap>
          <v-flex md1 xs3 sm1 xl2 :class="isMini">
           <!--  <v-tooltip bottom> -->
           <v-tooltip bottom>
            <v-btn slot="activator" v-if="canAccess('position.create')"
            class="mr-3 mt-3" icon color="primary"
            @click="openDialog">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Thêm mới</span>
        </v-tooltip>
      </v-flex>
      <v-flex md5 xs7 sm5 xl5 class="mt-1 mr-2" :class="isMini && 'full-flex-basic'">
         <v-text-field
         hide-details
         single-line
         slot="activator"
         placeholder="Nhập chức danh"
         v-model="nameFilter"
         @click:clear="changeSearch"
         @keyup="changeSearch"
         clearable
         >
       </v-text-field>
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
              <v-flex xs12 sm12 md12>
                <v-text-field
                placeholder="Nhập  chức danh"
                ref = "firstInput"
                :tabindex="1"
                :error-messages="errors.has('name_position') ? errors.collect('name_position') : []"
                v-validate="'required'"
                :data-vv-as="$t('label.name_position')"
                :label="$t('label.name_position')"
                class="input-required"
                name="name_position"
                autofocus
                v-model="position.name"> </v-text-field>
              </v-flex>
              <!-- value -->
              <!-- status -->
              <v-flex xs12 sm12 md12>
                <label class="title-position">Trạng thái</label>
                <v-flex xs1>
                 <v-tooltip bottom>
                  <v-switch
                  @click.native.stop
                  :tabindex="2"
                  style="outline-style: none;"
                  name="status"
                  slot="activator"
                  v-model="position.status"
                  ></v-switch>
                  <span v-if="position.status">Hiển thị</span>
                  <span v-else>Không hiển thị</span>
                </v-tooltip>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
       <v-spacer></v-spacer>
       <v-btn color="error" flat  :tabindex="3" @click.native="close">Hủy bỏ</v-btn>
       <v-btn class="green--text text-uppercase"  :tabindex="4" flat @click.native="submitFrom">
        <span v-if="editTitle==-2">Lưu lại</span>
        <span v-else class="text-uppercase">Thêm mới</span></v-btn>
        <div :tabindex="5"  @focus="backTabIndex"></div>
      </v-card-actions>
    </form>
  </v-card>
</v-dialog>
</v-layout>
<v-layout slot="extension" v-if="!isMini">
  <v-flex xl1 lg1 md1 sm1 xs1 class="text-bold flex-basis">
    #
  </v-flex>
  <v-flex xl8 lg8 md6  sm6 xs6 class="text-bold">
   Chức danh
 </v-flex>
 <v-flex xl2  lg2 md2 sm2 xs6 class="text-bold">
  Trạng thái
</v-flex>
<v-flex xl1 lg2 md2 sm2 xs2 class="text-bold">
  Hành động
</v-flex>
</v-layout>
</v-toolbar>
</div>
<v-flex xs12 class="border-e0-top">
  <data-view
  :name="dataViewName"
  api-url="positions?sort=status:-1,id:-1"
  v-if="dataViewHeight"
  :viewHeight="dataViewHeight"
  :params="filterParams"
  :ref="dataViewName"
  >
  <template slot-scope="{items}">
    <v-list>
      <template v-for="(item, index) in items.data">
        <v-list-tile class="lighten-2 v-list-tile" :key="index">
          <v-layout class="paddLeft-8" :key="'index'+index">
            <v-flex xl1 lg1 md1 sm1 xs1 class="flex-basis" :class="isMini && 'd-none'">
                {{ index + 1 }}
            </v-flex>
            <v-flex xl8 lg8 md6  sm6 xs6 :class="isMini && 'd-none'">
              {{ item.name }}
            </v-flex>
            <v-flex xl2  lg2 md2 sm2 xs6 class="paddLeft-9" :class="isMini && 'd-none'">
             <v-tooltip bottom sm12>
              <v-switch
              @click.native.stop
              @change="changeStatus(item.id)"
              class='paddLeft'
              name="status"
              slot="activator"
              v-model="item.status"
              ></v-switch>
              <span v-if="item.status">Hiển thị</span>
              <span v-else>Không hiển thị</span>
            </v-tooltip>
          </v-flex>
          <v-flex xl1 lg2 md2 sm2 xs2  class='paddLeft' :class="isMini && 'd-none'">
            <v-tooltip bottom>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('position.update')" icon @click="editItem(item,item.id)">
                <v-icon class='theme--light teal--text'>edit</v-icon>
              </v-btn>
              <span>Sửa</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('position.delete')" icon @click.stop="removeConfirm(item)">
                <v-icon class="theme--light pink--text">delete</v-icon>
              </v-btn>
              <span>Xóa</span>
            </v-tooltip>
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
</v-layout>
</template>
<script type="text/javascript">
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
    dataViewName: 'position',
    idPosition: null,
    dialogDelete: false,
    status: 'Hiển thị',
    dialog: false,
    editedIndex: -1,
    editTitle: -1,
    dataPosition: {},
    position: {
      status: true,
      name: ''
    },
    params: {
      q: ''
    },
    defaultItem: {
    }
  }),
  computed: {
    formTitle () {
      return this.editTitle === -1 ? 'Thêm chức danh' : 'Sửa chức danh'
    },
    ...mapGetters('Position', ['positionDetail', 'filterParams']),
    ...mapGetters(['isFetchingApi']),
    ...mapFields('Position', {
      nameFilter: 'params.q'
    })
  },
  watch: {
    dialog (val) {
      val || this.close()
      if (!val) return
      requestAnimationFrame(() => {
        this.$refs.firstInput.focus()
      })
    }
  },
  created () {
    this.fetchPosition()
  },
  methods: {
    ...mapActions(['setMiniDrawer']),
    ...mapActions('Position', ['fetchPosition', 'createPosition', 'deletePosition', 'updatePosition', 'updateStatusPosition', 'clearFilter']),
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry']),
    backTabIndex () {
      this.$refs.firstInput.focus()
    },
    // update status
    changeStatus (idPosition) {
      this.updateStatusPosition({
        id: idPosition,
        cb: (response) => {
          this.showNotify({
            color: 'success',
            text: this.$t('alert.status-edit-position')
          })
        }
      })
    },
    resetForm () {
      this.clearFilter()
      this.filter()
    },
    // dialog
    openDialog () {
      this.$validator.reset()
      this.editTitle = -1
      this.position.status = true
      this.dialog = true
    },
    // show data edit
    editItem (item, id) {
      this.$validator.reset()
      this.editTitle = -2
      this.idPosition = id
      this.editedIndex = this.positionDetail.indexOf(item)
      this.position = Object.assign({}, item)
      this.status_txt()
      this.dialog = true
    },
    // remove position
    removeConfirm (item) {
      this.dataPosition = item
      this.idPosition = item.id
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deletePosition({
          id: this.idPosition,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'position',
              data: this.dataPosition,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.delete-position'),
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
    /// close dialog
    close () {
      this.dialog = false
      setTimeout(() => {
        this.position = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    status_txt () {
      if (this.position.status) {
        this.status = 'Hiển thị'
      } else {
        this.status = 'Không hiển thị'
      }
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.submitFrom()
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    },
    /// add and edit data position
    submitFrom () {
      if (this.editTitle === -1) {
        let position = Object.assign({}, this.position)
        position.status = position.status ? 1 : 0
        this.createPosition({
          position: position,
          cb: (response) => {
            this.dialog = false
            setTimeout(() => {
              console.log('data position :', position)
              this.editedIndex = -1
            }, 300)
            this.showNotify({
              color: 'success',
              text: this.$t('alert.add-position')
            })
            this.resetForm()
          }
        })
      } else {
        // edit data
        let position = Object.assign({}, this.position)
        position.status = position.status ? 1 : 0
        this.updatePosition({
          id: this.idPosition,
          position: position,
          cb: (response) => {
            this.updateDataviewEntry({
              name: 'position',
              data: response.data,
              key: 'id'
            })
            this.showNotify({
              color: 'success',
              text: this.$t('alert.edit-position')
            })
            this.dialog = false
            setTimeout(() => {
              console.log('data position :', position)
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
    }
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
  }
}
</script>
<style scoped>
  .v-input.v-text-field{
    margin-top: 0px;
  }
  .title-position{
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
    .paddLeft-8{
      padding-left: 8px;
    }
   /* .paddLeft{
       padding-left: 3px;
    }*/
    .paddLeft-9{
      padding-left: 9px;
    }

  }
  @media (min-width: 960px){
    .flex-basis{
      flex-basis:55px;
    }
    .paddLeft-8{
      padding-left: 8px;
    }
    .paddLeft-9{
      padding-left: 12px;
    }
    .v-list-tile{
       padding-top: 0px 16px;
       height: none !important;
      }
  }
  @media (min-width: 600px){
    .flex-basis{
      flex-basis:55px;
    }
    .paddLeft-9{
      padding-left: 10px;
    }
    .v-list-tile{
       padding-top: 0px !important;
    height: 48px !important;
    }
    .paddLeft{
      padding-left: 5px !important;
    }
  }
   @media (min-width: 250px){
    .flex-basis{
      flex-basis:55px;
    }
    .v-list-tile{
       padding-top: 14px;
       height: 75px;
    }
    .paddLeft-9{
      padding-left: 9px;
    }
    .paddLeft{
      padding-left: 16px;
    }
   }
</style>
