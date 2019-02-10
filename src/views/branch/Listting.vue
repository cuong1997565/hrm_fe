<template>
  <v-layout ref="laylout" column fill-height>
   <div ref="header">
    <v-toolbar height="50px" color="white" flat>
      <v-layout row wrap>
        <v-flex xs1 :class="isMini && 'full-flex-basic max-width-col-2'">
          <v-tooltip bottom>
            <v-btn slot="activator" v-if="canAccess('branch.create')" class="mt-3" icon color="primary" @click="$router.push({name: 'branch-create'})">
              <v-icon>add</v-icon>
            </v-btn>
            <span>Thêm mới</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs4 class="mt-1" :class="isMini && 'full-flex-basic full-width-col-10'">
          <v-text-field
          hide-details
          single-line
          placeholder="Nhập tên, sđt, email ..."
          v-model="filterQ"
          @keyup="changeSearch"
          clearable
          @click:clear="changeSearch"
          ></v-text-field>
        </v-flex>
        <v-flex xs3 class='mt-1' :class="isMini && 'd-none'">
          <v-autocomplete
          class='ml-2'
          @change="changedCity"
          placeholder="Thành phố"
          item-text="name"
          item-value="id"
          :items="cityAll"
          v-model="filterByCity"
          hide-details
          single-line
          clearable
          @click:clear="clearCity"
          >
          <template slot="no-data">
            <v-list-tile>
              <v-list-tile-title>
                Không tìm thấy thành phố
              </v-list-tile-title>
            </v-list-tile>
          </template>
        </v-autocomplete>
      </v-flex>
      <v-flex xs3 class='mt-1' :class="isMini && 'd-none'">
        <v-autocomplete
        :disabled = "!filterByCity"
        class='ml-2'
        @change="filter"
        placeholder="Quận huyện"
        item-text="name"
        item-value="id"
        :items="districtByCity"
        v-model="filterByDistrict"
        menu-props="auto"
        hide-details
        single-line
        clearable
        >
        <template slot="no-data">
          <v-list-tile>
            <v-list-tile-title>
              Không tìm thấy quân huyện
            </v-list-tile-title>
          </v-list-tile>
        </template>
      </v-autocomplete>
    </v-flex>
    <v-flex xs1 :class="isMini && 'd-none'">
      <v-tooltip bottom>
        <v-btn class="mt-3 ml-4" slot="activator" icon color="primary" @click="resetForm()">
          <v-icon>close</v-icon>
        </v-btn>
        <span>Reset bộ lọc</span>
      </v-tooltip>
    </v-flex>
  </v-layout>
  <v-layout slot="extension" v-if="!isMini">
    <v-flex style="flex-basis:55px;" sm1 class="text-bold">
      #
    </v-flex>
    <v-flex sm3 class="text-bold">
      Tên chi nhánh
    </v-flex>
    <v-flex sm3 class="text-bold">
      Địa chỉ
    </v-flex>
    <v-flex sm2 class="text-bold">
      Thành phố
    </v-flex>
    <v-flex sm2 class="text-bold">
      Quận, huyện
    </v-flex>
    <v-flex sm1 class="text-bold mr-3">
      Hành động
    </v-flex>
  </v-layout>
</v-toolbar>
</div>
<v-flex xs12 class="border-e0-top">
  <data-view
  :name="dataViewName"
  api-url="branches?sort=status:-1,id:-1"
  v-if="dataViewHeight"
  :viewHeight="dataViewHeight"
  :params="filterParams"
  :ref="dataViewName"
  >
  <template slot-scope="{items}">
    <v-list three-line>
      <template v-for="(item, index) in items.data">
        <v-list-tile
        :key="'item' + item.id"
        avatar
        @click="branchDetail(item)"
        :inactive="item.id === $route.params.id"
        :class="item.id === $route.params.id && 'grey lighten-2'"
        >
        <v-layout class="pa-2">
          <v-flex style="flex-basis:55px;" sm1 :class="isMini && 'd-none'">
            {{index + 1}}
          </v-flex>
          <v-flex sm3 :class="isMini && 'full-flex-basic full-max-width'">
            {{ item.name}}
            <v-tooltip bottom v-if="item.type===1">
              <v-icon @click.stop class="mb-1" size="15px" slot="activator" color="red">fa fa-star</v-icon>
              <span>Chi nhánh chính</span>
            </v-tooltip>
            <v-icon v-else id="subBranch" @click.stop="updatedTypeBranch(item)" class="mb-1" size="15px" slot="activator" color="red lighten-4">fa fa-star</v-icon>
            <v-list-tile-sub-title class="text--primary copytext" v-if="item.email" :class="isMini && 'd-none'">
              <v-icon size="16px">email</v-icon>
              <span @click.stop="clickToCopy" class="click-copy">{{ item.email }}</span>
            </v-list-tile-sub-title>
            <v-list-tile-sub-title class="text--primary copytext" v-if="item.phone" :class="isMini && 'd-none'">
              <v-icon size="16px">phone</v-icon>
              <span @click.stop="clickToCopy" class="click-copy">{{ item.phone }}</span>
            </v-list-tile-sub-title>
          </v-flex>
          <v-flex sm3 class="ml-1 pr-3" :class="isMini && 'd-none'">
            {{ item.address }}
          </v-flex>
          <v-flex sm2 class='ml-2' :class="isMini && 'd-none'">
            {{ item.city_name }}
          </v-flex>
          <v-flex sm2 :class="isMini && 'd-none'">
            {{ item.district_name }}
          </v-flex>
          <v-flex sm1 :class="isMini && 'd-none'">
            <v-tooltip bottom sm6>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('branch.update')" icon @click.stop="$router.push({name: 'branch-edit', params: {id: item.id}})">
                <v-icon class='theme--light teal--text'>edit</v-icon>
              </v-btn>
              <span>Sửa</span>
            </v-tooltip>
            <v-tooltip bottom sm6>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('branch.delete')" icon @click.stop="removeConfirm(item)">
                <v-icon class="theme--light pink--text">delete</v-icon>
              </v-btn>
              <span>Xóa</span>
            </v-tooltip>
            <v-tooltip bottom sm12>
              <v-switch
              @click.native.stop
              @change="changeStatus(item.id)"
              class='ml-3'
              name="status"
              slot="activator"
              v-model="item.status"
              ></v-switch>
              <span v-if="item.status">Hoạt Động</span>
              <span v-else>Không hoạt động</span>
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
  <dialog-confirm v-model="dialogDelete" @input="remove" />
</template>
</data-view>
</v-flex>
</v-layout>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { debounce, findIndex } from 'lodash'
import DialogConfirm from '@/components/DialogConfirm'
import DataView from '@/components/DataView/DataView'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'BranchListting',
  components: {
    DataView,
    DialogConfirm
  },
  props: {
    type: {
      type: String,
      default: 'index'
    },
    isMini: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    branch: {
      status: 1,
      type: 1
    },
    districtActive: false,
    dialogDelete: false,
    item: {},
    idBranch: null,
    title: [
      { text: 'Tên chi nhánh', sortable: false },
      { text: 'Email', sortable: false },
      { text: 'Mã sô thuế', sortable: false },
      { text: 'Địa chỉ', sortable: false },
      { text: 'Trạng thái', sortable: false },
      { text: 'Hành động', sortable: false }
    ],
    dataViewHeight: 0,
    dataViewName: 'branch'
  }),
  computed: {
    ...mapGetters('City', ['cityAll', 'districtByCity']),
    ...mapGetters('Branch', ['filterParams']),
    isIndex () {
      return this.type === 'index'
    },
    isBranchMain () {
      let array = this.$store.getters['Dataview/dataViews']('branch')
      return array.data
    },
    ...mapFields(`Branch`, {
      filterQ: 'params.q',
      filterByCity: 'params.cityId',
      filterByDistrict: 'params.districtId'
    })
  },
  methods: {
    ...mapActions(['setMiniDrawer']),
    ...mapActions('Dataview', ['removeDataviewEntry', 'updateDataviewEntry']),
    ...mapActions('Branch', ['getBranch', 'updateTypeBranch', 'deleteBranch', 'updateStatusBranch', 'clearFilter', 'clearFilterCity']),
    ...mapActions(['showNotify', 'setMiniDrawer']),
    ...mapActions('City', ['getCity', 'getDistrictByCity']),
    branchDetail (branch) {
      this.clearFilter()
      this.filter()
      this.getBranch({ branchId: branch.id })
      // this.clearFilter()
      this.$router.push({ name: 'branch-detail', params: { id: branch.id } })
    },
    clearCity () {
      this.clearFilterCity()
    },
    resetForm () {
      this.clearFilter()
    },
    changeSearch: debounce(function () {
      this.filter()
    }, 500),
    changedCity: debounce(function (value) {
      if (value) {
        this.districtActive = true
        this.getDistrictByCity({
          cityId: value,
          cb: () => {
            this.districtAll = this.districtByCity
          }
        })
      } else {
        this.districtActive = false
      }
      this.filter()
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    },
    updatedTypeBranch (item) {
      this.updateTypeBranch({
        id: item.id,
        cb: (response) => {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.updateTypeBranchSuccess'),
            color: 'success'
          })
          // tìm trong mảng vị trí index có kiểu chi nhánh chính
          let index = findIndex(this.isBranchMain, { type: 1 })
          if (index > -1) {
            let object = Object.assign({}, this.isBranchMain[index])
            object.type = 0
            this.updateDataviewEntry({
              name: 'branch',
              data: object,
              key: 'id'
            })
          }
          this.updateDataviewEntry({
            name: 'branch',
            data: response.data,
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
    },
    changeStatus (idBranch) {
      this.updateStatusBranch({
        id: idBranch,
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
    removeConfirm (item) {
      this.branch = item
      this.idBranch = item.id
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteBranch({
          id: this.idBranch,
          cb: (response) => {
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.deleteBranchSuccess'),
              color: 'success'
            })
            this.removeDataviewEntry({
              name: 'branch',
              data: this.branch,
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
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 48
    } else {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 110
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
  },
  created () {
    this.getCity()
  }
}
</script>
<style scoped>
.v-toolbar__extension{
  height: 43px;
}
#subBranch:hover{
  caret-color: #f44336 !important;
  color: #f44336 !important;
  transition: all 1s 0.5s;
}
.copytext{
  overflow: unset;
}
</style>
