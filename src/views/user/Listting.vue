<template>
  <v-layout ref="laylout" column fill-height>
    <div ref="header">
      <v-toolbar height="50px" color="white" flat>
        <v-layout row wrap>
          <v-flex xs1 :class="isMini && 'max-width-col-2'">
            <v-tooltip bottom>
              <v-btn slot="activator" v-if="canAccess('user.create')" class="mr-3 mt-3" icon color="primary" @click="addUser">
                <v-icon>add</v-icon>
              </v-btn>
              <span>Thêm mới</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs8 class="mt-1" :class="isMini && 'full-flex-basic full-width-col-10'">
            <v-text-field
            hide-details
            single-line
            placeholder="Nhập tên, sđt, email ..."
            v-model="filterQ"
            @keyup="changeSearch"
            clearable
            @click:clear="clearSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs3 class='mt-1' :class="isMini && 'd-none'">
            <!-- filter by status -->
            <v-tooltip bottom>
              <v-select
              slot="activator"
              class='ml-2'
              @change="filter"
              placeholder="Trạng thái"
              item-text="status_txt"
              item-value="status"
              :items="statusUser"
              v-model="filterByStatus"
              menu-props="auto"
              hide-details
              single-line
              clearable
              ></v-select>
              <span>Lọc theo trạng thái</span>
            </v-tooltip>
          </v-flex>
<!--           <v-flex xs1>
            <v-tooltip bottom>
              <v-btn class="mt-3 ml-4" slot="activator" icon color="primary" @click="resetForm()">
                <v-icon>close</v-icon>
              </v-btn>
              <span>Reset bộ lọc</span>
            </v-tooltip>
          </v-flex> -->
        </v-layout>
      </v-toolbar>
      <v-toolbar height="45px" color="white" flat v-if="!isMini">
        <v-layout>
          <v-flex style="flex-basis:55px;" sm1 class="text-bold">
            #
          </v-flex>
          <v-flex sm4 class="text-bold">
            Tên người dùng
          </v-flex>
          <v-flex sm3 class="text-bold">
            Quyền truy cập
          </v-flex>
          <v-flex sm2 class="text-bold">
            Trạng thái
          </v-flex>
          <v-flex sm2 class="text-bold">
            Hành động
          </v-flex>
        </v-layout>
      </v-toolbar>
    </div>
    <!-- dialog create and edit -->
    <v-dialog v-model="dialogUser" max-width="700px">
      <v-form @submit.prevent="submitForm">
        <v-card class="pa-0">
          <v-card-title class="pa-0 pt-3">
            <span class="headline" width="100%" style="margin:0 auto">{{ formTitle }}</span>
          </v-card-title>
          <!-- form edit -->
          <v-card-text id="formSub" class="pt-0">
            <v-container grid-list-md class="white scroll-y">
              <v-layout row wrap>
                <v-flex md6>
                  <!-- name -->
                  <v-text-field
                  tabindex="1"
                  ref="firstInput"
                  :autofocus="true"
                  placeholder="Nhập vào tên"
                  :error-messages="errors.has('name') ? errors.collect('name') : []"
                  v-validate="'required'"
                  :data-vv-as="$t('label.name')"
                  name="name"
                  :label="$t('label.name')"
                  class="input-required"
                  v-model="user.name"></v-text-field>
                  <!-- password -->
                  <v-text-field
                  tabindex="3"
                  placeholder="Nhập mật khẩu"
                  v-if="isCreate"
                  :error-messages="errors.has('password') ? errors.collect('password') : []" v-validate="'required|min:6'"
                  :data-vv-as="$t('label.password')"
                  name="password"
                  :label="$t('label.password')"
                  class="input-required"
                  type="password"
                  v-model="user.password"> </v-text-field>
                  <!-- quyền truy cập -->
<!--                   <v-autocomplete
                  multiple
                  tabindex="5"
                  label="Quyền truy cập"
                  v-model="user.roles"
                  :items="roles"
                  chips
                  item-text="name"
                  item-value="id"
                  color="white"
                  hide-no-data
                  hide-selected
                  placeholder="Tìm kiếm"
                  style="margin-left:-30px;"
                  prepend-icon="mdi-database-search">
                  <template slot="selection" slot-scope="data">
                    <v-chip
                    :selected="data.selected"
                    close class="chip--select-multi"
                    @input="data.parent.selectItem(data.item)">
                    {{ data.item.name }}
                  </v-chip></template></v-autocomplete> -->
                  <!-- status -->
                  <!-- phone -->
                  <v-text-field
                  tabindex="6"
                  :autofocus="true"
                  placeholder="Nhập số điện thoại "
                  :error-messages="errors.has('phone') ? errors.collect('phone') : []"
                  v-validate="'required|numeric|min:10|max:12'"
                  :data-vv-as="$t('label.phone')"
                  name="phone"
                  :counter="12"
                  type="number"
                  :label="$t('label.phone')"
                  class="input-required"
                  v-model="user.phone"></v-text-field>
                </v-flex>
                <v-flex md6>
                  <!-- email -->
                  <v-text-field
                  tabindex="2"
                  placeholder="Example@gmail.com"
                  :error-messages="errors.has('email') ? errors.collect('email') : []"
                  v-validate="'required|email'"
                  :data-vv-as="$t('label.email')"
                  name="email"
                  :label="$t('label.email')"
                  class="input-required"
                  type="email"
                  :disabled="!isCreate"
                  v-model="user.email"> </v-text-field>
                  <!-- password confirm -->
                  <v-text-field
                  placeholder="Nhập lại mật khẩu"
                  v-if="isCreate"
                  tabindex="4"
                  ref="password"
                  :error-messages="errors.has('password_confirmation') ? errors.collect('password_confirmation') : []"
                  v-validate="'required|min:6'"
                  :data-vv-as="$t('label.password_confirmation')"
                  name="password_confirmation"
                  :label="$t('label.password_confirmation')"
                  class="input-required"
                  type="password"
                  v-model="user.password_confirmation"> </v-text-field>
                  <v-flex style="margin-top:20px;">

                  </v-flex>
                   <label style="color:#616161">Trạng thái</label>
                  <v-tooltip bottom>
                    <v-switch
                    class="mt-0"
                    tabindex="7"
                    style="outline-style: none;"
                    @change="user.status !== user.status"
                    name="status"
                    slot="activator"
                    v-model="user.status"
                    ></v-switch>
                    <span v-if="user.status">Kích hoạt</span>
                    <span v-else>Không kích hoạt</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <!-- end form edit -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tabindex="9" color="error" flat @click.native="closeUser">Hủy bỏ</v-btn>
            <v-btn tabindex="8" class="green--text text-uppercase" flat type="submit"><span v-if="editedIndex!==-1">Lưu lại</span><span v-else>Thêm mới</span></v-btn>
            <div :tabindex="9"  @focus="backTabIndex"></div>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- end created and edit -->
    <v-flex xs12 class="border-e0-top">
      <data-view
      :name="dataViewName"
      api-url="users?sort=status:-1,id:-1"
      v-if="dataViewHeight"
      :viewHeight="dataViewHeight"
      :params="filterParams"
      :ref="dataViewName"
      >
      <template slot-scope="{items}">
        <v-list three-line>
          <template  v-for="(item, index) in items.data">
            <v-list-tile
            :key="index"
            :inactive="item.id === $route.params.id"
            :class="item.id === $route.params.id && 'grey lighten-2'"
            >
            <v-layout class="pa-2">
              <v-flex style="flex-basis:55px;" sm1 :class="isMini && 'd-none'">
                {{index + 1}}
              </v-flex>
              <!-- name -->
              <v-flex sm4 :class="isMini && 'full-flex-basic full-max-width'">
                {{ item.name}}
                <v-list-tile-sub-title class="text--primary copytext" v-if="item.email" :class="isMini && 'd-none'">
                  <v-icon size="16px">email</v-icon>
                  <span @click.stop="clickToCopy" class="click-copy">{{ item.email }}</span>
                </v-list-tile-sub-title>
                <v-list-tile-sub-title class="text--primary copytext" v-if="item.phone" :class="isMini && 'd-none'">
                  <v-icon size="16px">phone</v-icon>
                  <span @click.stop="clickToCopy" class="click-copy">{{ item.phone }}</span>
                </v-list-tile-sub-title>
              </v-flex>
              <v-flex sm3 :class="isMini && 'full-flex-basic full-max-width'">
                <v-flex v-if="item.roles">
                  <v-flex :key="index" v-for="(role, index) in item.roles.data">
                    {{ role.name }}
                  </v-flex>
                </v-flex>
              </v-flex>
              <!-- trạng thái -->
              <v-flex sm2 :class="isMini && 'full-flex-basic full-max-width'">
               <v-tooltip bottom sm12>
                <v-switch
                class="ml-3"
                @click.native.stop
                @change="changeStatus(item.id)"
                name="status"
                slot="activator"
                v-model="item.status"
                ></v-switch>
                <span v-if="item.status">Kích hoạt</span>
                <span v-else>Không kích hoạt</span>
              </v-tooltip>
            </v-flex>
            <v-flex sm2 class="ml-2" :class="isMini && 'd-none'">
             <v-tooltip bottom sm6>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('user.update')" icon @click="editUser(item.id, item)">
                <v-icon class='theme--light teal--text'>edit</v-icon>
              </v-btn>
              <span>Sửa</span>
            </v-tooltip>
            <v-tooltip bottom sm6>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('user.delete')" icon @click.stop="removeConfirm(item)">
                <v-icon class="theme--light pink--text">delete</v-icon>
              </v-btn>
              <span>Xóa</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-list-tile>
      <v-divider
      :key="'div' + index + item.id"
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
import DialogConfirm from '@/components/DialogConfirm'
import { debounce } from 'lodash'
import DataView from '@/components/DataView/DataView'
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
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
    // filter by date
    dialogUser: false,
    dialogDelete: false,
    dataUser: {},
    dataViewHeight: 0,
    dataViewName: 'user',
    editedIndex: -1,
    idUser: null,
    defaultUser: {
      status: 1
    },
    user: {
      status: true
    },
    roles: [],
    statusUser: [
      { status_txt: 'Kích hoạt', status: 1 },
      { status_txt: 'Không kích hoạt', status: 0 }
    ]
  }),
  watch: {
    dialogUser (val) {
      if (!val) return
      requestAnimationFrame(() => {
        this.$refs.firstInput.focus()
      })
    }
  },
  computed: {
    ...mapGetters('User', ['filterParams']),
    ...mapFields(`User`, {
      filterQ: 'params.q',
      filterByStatus: 'params.status'
    }),
    // title of form User modal
    formTitle () {
      return this.editedIndex === -1 ? 'Thêm người dùng' : 'Sửa người dùng'
    },
    isCreate () {
      return this.editedIndex === -1
    }
  },
  methods: {
    ...mapActions('Dataview', ['updateDataviewEntry', 'removeDataviewEntry', 'setDataview']),
    ...mapActions('User', ['getUser', 'createUser', 'deleteUser', 'updateUser', 'updateStatusUser', 'clearFilter']),
    ...mapActions(['fetchApi']),
    ...mapActions(['showNotify']),
    clearSearch () {
      this.changeSearch()
      this.filter()
    },
    changeSearch: debounce(function () {
      this.filter()
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    },
    changeStatus (idUser) {
      this.updateStatusUser({
        id: idUser,
        user: this.user,
        cb: (response) => {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.statusSuccess'),
            color: 'success'
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
    },
    closeUser () {
      this.dialogUser = false
      setTimeout(() => {
        this.user = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      }, 300)
    },
    addUser () {
      this.$validator.reset()
      this.user = Object.assign({}, this.defaultUser)
      this.editedIndex = -1
      this.dialogUser = true
    },
    editUser (userId, item) {
      this.idUser = userId
      this.$validator.reset()
      this.getUser({ userId: userId, params: { include: 'roles' } })
      this.editedIndex = 1
      this.user = Object.assign({}, item)
      this.dialogUser = true
    },
    // reset all filter
    resetForm () {
      this.clearFilter()
    },
    backTabIndex () {
      this.$refs.firstInput.focus()
    },
    // Thêm sửa user
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.editedIndex === -1) {
            this.createUser({
              user: this.user,
              cb: (response) => {
                this.$refs[this.dataViewName].$emit('reload')
                this.dialogUser = false
                setTimeout(() => {
                  this.user = Object.assign({}, this.defaultUser)
                  this.editedIndex = -1
                }, 300)
                this.showNotify({
                  color: 'success',
                  text: this.$t('alert.addUserSuccess')
                })
              }
            })
          } else {
            // console.log("user", this.user)
            this.updateUser({
              id: this.idUser,
              user: this.user,
              cb: (response) => {
                this.showNotify({
                  color: 'success',
                  text: this.$t('alert.updateUserSuccess')
                })
                this.updateDataviewEntry({
                  name: 'user',
                  data: this.user,
                  key: 'id'
                })
                this.dialogUser = false
                setTimeout(() => {
                  this.user = Object.assign({}, this.defaultUser)
                  this.editedIndex = -1
                }, 300)
              }
            })
          }
        }
      })
    },
    // xóa user
    removeConfirm (item) {
      this.dataUser = item
      this.idUser = item.id
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteUser({
          id: this.idUser,
          cb: (response) => {
            this.dialogDelete = false
            this.removeDataviewEntry({
              name: 'user',
              data: this.dataUser,
              key: 'id'
            })
            this.setDataview({
              name: 'employee',
              data: [],
              uniqueKey: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.deleteUserSucces'),
              color: 'success'
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
  },
  mounted () {
    if (this.$route.params.id) {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 55
    } else {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 100
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
.v-toolbar__content{
  height: 80px !important;
}
.copytext{
  overflow: unset;
}
</style>
