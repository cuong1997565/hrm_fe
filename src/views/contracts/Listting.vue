 <template>
  <v-layout ref="laylout" column fill-height>
    <div ref="header">
      <v-toolbar height="60px" color="white" flat>
        <v-layout row wrap>
          <v-flex xl1 lg1 md1 sm1 xs2  class="paddTop-10" :class="isMini  && 'max-width-col-2'">
            <!--  <v-tooltip bottom> -->
            <v-tooltip bottom>
              <v-btn slot="activator" v-if="canAccess('contract.create')"
              @click="createContract"
              icon color="primary"
              >
              <v-icon>add</v-icon
                ></v-btn>
                <span>Thêm mới</span>
              </v-tooltip>
              <!--  <span>Thêm mới</span> -->
              <!-- </v-tooltip> -->
            </v-flex>
            <v-flex xl4 lg4 md4 sm4 xs10 class="paddRight-10" :class="isMini && 'full-flex-basic full-width-col-10'">
             <v-text-field
             hide-details
             single-line
             placeholder="Nhập tiêu đề hợp đồng"
             v-model="titleFilter"
             slot="activator"
             clearable
             @click:clear="resetSreach"
             @keyup="changeSearch"
             ></v-text-field>
           </v-flex>
           <v-flex xl5 lg5 md5 sm5  class="display"  :class="isMini && 'd-none'">
             <v-autocomplete
             @change="filter"
             v-model="employeeFilter"
             :items="employeeAll"
             @keyup="sreachEmployeeList"
             :class="isMini && 'd-none'"
             :item-text="twoparams"
             clearable
             @click:clear="resetEmployee"
             :loading="isLoadingEmployeeList"
             item-value="id"
             placeholder="Chọn tên nhân viên"
             >
             <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color: blue">
                  Không có tên nhân viên trong hệ thống
                </v-list-tile-title>
              </v-list-tile>
            </template>
            <template slot="item" slot-scope="{ item }">
              {{item.name}} - {{item.phone}}
            </template>
          </v-autocomplete>
        </v-flex>
           <v-flex xl1 lg1 md1 sm1  class="display"  :class="isMini && 'd-none'">
            <v-menu
            :class="isMini && 'd-none'"
            :close-on-content-click="false"
            :nudge-width="400"
            absolute
            v-model="menu"
            right
            >
            <v-btn slot="activator" icon color="primary" class="mt-3 ml-4">
              <v-icon>list</v-icon>
            </v-btn>
            <v-card>
              <v-list class="pa-0">
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="text-xs-center text-bold ml-4">Lọc nhiều hơn</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon @click="menu = false">
                      <v-icon color="primary">close</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
              <v-divider></v-divider>
              <v-flex xs12 :class="isMini && 'd-none'" class="pl-2 pr-2">
                  <v-autocomplete
                  slot="activator"
                  :items="types"
                  item-value="id"
                  @change="filter"
                  v-model="typeFilter"
                  placeholder="Chọn loại hợp đồng"
                  item-text="name"
                  clearable
                  >
                </v-autocomplete>
            </v-flex>
            <v-divider></v-divider>
            <v-flex xs12 class="pl-2 pr-2" :class="isMini && 'd-none'">
               <v-autocomplete
               slot="activator"
               :items="status"
               item-value="id"
               @change="filter"
               v-model="statusFilter"
               placeholder="Chọn trạng thái  hợp đồng"
               item-text="name"
               clearable >
             </v-autocomplete>
         </v-flex>
         <v-divider></v-divider>
         <v-flex xs12 class="pl-2 pr-2 pb-3" :class="isMini && 'd-none'">
           <v-text-field
           hide-details
           single-line
           slot="activator"
           v-model="date"
           placeholder="Tìm kiếm theo thời hạn hợp đồng "
           clearable
           @click:clear="resetSreach"
           @click="openDialog">
         </v-text-field>
       <v-dialog style="margin-left:10px" v-model="dialog" max-width="900px" max-height="1200px">
        <v-card>
          <v-daterange id='dateRange'
          :options="dateRangeOptions"
          :labels="dateRangeOptionsLabel"
          :first-day-of-week="1"
          next-icon="arrow_forward"
          prev-icon="arrow_back"
          @input="onDateRangeChange">
        </v-daterange>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat
          @click.native="submitDate"
          color="success darken-1"
          >
          <span>Đồng ý</span>
        </v-btn>
        <v-btn color="error darken-1" flat  @click.native="close" class="ml-2">Hủy bỏ</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-flex>
</v-card>
</v-menu>
</v-flex>
<v-flex xl1 lg1 md1 sm1  class="display"  :class="isMini && 'd-none'">
  <!--  <v-tooltip bottom> -->
  <v-tooltip bottom>
  <v-btn slot="activator"
    @click="clearAll"
    class=" mt-3" icon color="primary"
    :class="isMini && 'd-none'"
    >
    <v-icon>close</v-icon
      ></v-btn>
      <span>Reset bộ lọc</span>
    </v-tooltip>
    <!--  <span>Thêm mới</span> -->
    <!-- </v-tooltip> -->
  </v-flex>
</v-layout>
</v-toolbar>
<v-toolbar height="20" color="white" flat :class="isMini && 'd-none'" class="pb-3">
 <v-layout slot="extension" v-if="!isMini" class="pt-2 pb-2">
  <v-flex style="flex-basis:55px;" xl1 lg1 md1 sm1 xs1  class="text-bold text-uppercase">
    #
  </v-flex>
  <v-flex xl3 lg3 md3 sm3 xs4 class="text-bold">
    Tiêu đề
  </v-flex>
  <v-flex xl2 lg2 md2 sm2 xs3 class="text-bold">
    Loại hợp đồng
  </v-flex>
  <v-flex  xl2 lg2 md2 sm2 xs3  class="text-bold marRight-4">
    Tên nhân viên
  </v-flex>
  <v-flex xl3 lg3 md3 sm3  class="text-bold display">
    <v-flex sm12>Thời gian</v-flex>
  </v-flex>
  <v-flex xl1 lg1 md1 sm1 xs1 class="text-bold">
    Hành động
  </v-flex>
</v-layout>
</v-toolbar>
</div>
<v-flex xl12 lg12 md12 sm12 xs12  class="border-e0-top">
  <data-view
  :name="dataViewName"
  api-url="contracts"
  v-if="dataViewHeight"
  :viewHeight="dataViewHeight"
  :params="filterParams"
  :ref="dataViewName">
  <template slot-scope="{items}">
    <v-list three-line>
      <template v-for="(item, index) in items.data">
       <v-list-tile
       :key="'item' + item.id"
       avatar
       @click="contractDetail(item)"
       :inactive="item.id === $route.params.id"
       :class="item.id === $route.params.id && 'grey lighten-2'"
       >
       <v-layout v-bind:key="index" class="padd-4">
        <v-flex style="flex-basis:55px;" xl1 lg1 md1 sm1 xs1  :class="isMini && 'd-none'">
          {{index + 1}}
        </v-flex>
        <v-flex   xl3 lg3 md3 sm3 xs4 class="paddLef-3" :class="isMini && 'full-flex-basic full-max-width'">
          {{ item.title }}
        </v-flex>
        <v-flex  xl2 lg2 md2 sm2 xs3  :class="isMini && 'd-none'">
         <v-tooltip bottom xl12 lg12 md12 sm12 xs12>
           <v-flex xl12 lg12 md12 sm12 xs12  slot="activator">
            {{ item.type_txt }}
          </v-flex>
          <span> Loại hợp đồng</span>
        </v-tooltip>
        <v-tooltip bottom xl12 lg12 md12 sm12 xs12>
          <v-flex xl12 lg12 md12 sm12 xs12 slot="activator" v-if="item.status == 0" style="color:#03A9F4">
            {{ item.status_txt }}
          </v-flex>
           <v-flex xl12 lg12 md12 sm12 xs12 slot="activator" v-if="item.status == 1" style="color:#FF5722">
            {{ item.status_txt }}
          </v-flex>
           <v-flex xl12 lg12 md12 sm12 xs12 slot="activator" v-if="item.status == 2" style="color:green">
            {{ item.status_txt }}
          </v-flex>
          <span>Trạng thái hợp đồng</span>
        </v-tooltip>
      </v-flex>
      <v-flex xl2 lg2 md2 sm2 xs3  class="marLeft-3"  :class="isMini && 'd-none'">
       <!--  {{item.employee_name}} -->
       <v-list-tile-sub-title class="text--primary" v-if="item.employee_name" :class="isMini && 'd-none'">
        {{ item.employee_name }}
      </v-list-tile-sub-title>
      <v-list-tile-sub-title class="text--primary" v-if="item.employee_phone" :class="isMini && 'd-none'">
        <v-icon size="16px">phone</v-icon>
        {{item.employee_phone}}
      </v-list-tile-sub-title>
    </v-flex>
    <v-flex xl3 lg3 md3 sm3  class="display" :class="isMini  && 'd-none'">
      <v-tooltip  bottom xl12 lg12 md12 sm12 xs12>
        <v-flex xl12 lg12 md12 sm12 xs12 slot="activator" :class="isMini && 'd-none'">
         <span style="padding-right: 45px;"><b>Ký</b></span>
         {{item.date_sign_format}}
       </v-flex>
       <span>Ngày  ký</span>
     </v-tooltip>
     <v-tooltip bottom xl12 lg12 md12 sm12 xs12 :class="isMini && 'd-none'">
       <v-flex xl12 lg12 md12 sm12 xs12 slot="activator">
        <span style="padding-right: 4px;"><b>Hiệu lực</b></span>
        {{item.date_effective_format}}
      </v-flex>
      <span>Ngày hiệu lực</span>
    </v-tooltip>
    <v-tooltip bottom xl12 lg12 md12 sm12 xs12 :class="isMini && 'd-none'">
     <v-flex xl12 lg12 md12 sm12 xs12 slot="activator">
       <span  style="padding-right: 4px;"><b>Kết thúc </b></span>
       {{ item.date_expiration_format }}
     </v-flex>
     <span>Ngày  kết thúc</span>
   </v-tooltip>
 </v-flex>
 <v-flex xl1 lg1 md1 sm1 xs1  :class="isMini && 'd-none'">
   <v-tooltip bottom>
    <v-btn slot="activator" class="ma-0" v-if="canAccess('contracts.update')" icon @click.stop="editContract(item)">
      <v-icon class='theme--light teal--text'>edit</v-icon>
    </v-btn>
    <span>Sửa</span>
  </v-tooltip>
  <v-tooltip bottom>
    <v-btn slot="activator" class="ma-0" v-if="canAccess('contracts.delete')" icon @click.stop="removeConfirm(item)">
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
<!--open link-->
<dialog-confirm v-model="dialogDelete" @input="remove" />
</v-layout>
</template>
<script type="text/javascript">
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css'
import DialogConfirm from '@/components/DialogConfirm'
import { mapFields } from 'vuex-map-fields'
import { debounce } from 'lodash'
import { format, subMonths } from 'date-fns'
import DataView from '@/components/DataView/DataView'
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'ContractListting',
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
    dialogDelete: false,
    dataViewHeight: 0,
    date: '',
    menu: false,
    dialog: false,
    dialogLink: false,
    listEmployees: [],
    dataContracts: {},
    range: [],
    isLoadingEmployeeList: false,
    dateRangeOptionsLabel: {
      start: 'Ngày ký',
      end: 'Ngày hết hạn',
      preset: 'Thời gian'
    },
    dateRangeOptions: {
      maxDate: format('2030-12-30', 'YYYY-MM-DD'),
      startDate: format(new Date(), 'YYYY-MM-DD'),
      endDate: format(new Date(), 'YYYY-MM-DD'),
      format: 'DD/MM/YYYY',
      presets: [
        {
          label: 'Hôm nay',
          range: [
            format(new Date(), 'YYYY-MM-DD'),
            format(new Date(), 'YYYY-MM-DD')
          ]
        },
        {
          label: '2 tháng sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -2), 'YYYY-MM-DD')
          ]
        },
        {
          label: '6 tháng sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -6), 'YYYY-MM-DD')
          ]
        },
        {
          label: '1 năm sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -12), 'YYYY-MM-DD')
          ]
        },
        {
          label: '2 năm sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -24), 'YYYY-MM-DD')
          ]
        },
        {
          label: '3 năm sau',
          range: [
            format(subMonths(new Date(), 0), 'YYYY-MM-DD'),
            format(subMonths(new Date(), -36), 'YYYY-MM-DD')
          ]
        }
      ]
    },
    employees: [],
    dataViewName: 'contract',
    idContract: null,
    types: [
      { 'id': 0, 'name': 'Học việc' },
      { 'id': 1, 'name': 'Cộng tác viên' },
      { 'id': 2, 'name': 'Thử việc' },
      { 'id': 3, 'name': 'Có thời hạn' },
      { 'id': 4, 'name': 'Không thời hạn' },
      { 'id': 5, 'name': 'Khác' }
    ],
    status: [
      { 'id': 0, 'name': 'Tiêu chuẩn' },
      { 'id': 1, 'name': 'Chấm dứt' },
      { 'id': 2, 'name': 'Gia hạn' }
    ]
  }),
  computed: {
    ...mapGetters(['isFetchingApi']),
    ...mapGetters('Employee', ['employeeAll']),
    // map filter params
    ...mapGetters('Contracts', ['filterParams']),
    ...mapFields('Contracts', {
      titleFilter: 'params.q',
      employeeFilter: 'params.employeeId',
      typeFilter: 'params.type',
      statusFilter: 'params.status',
      dateSignFilter: 'params.dateSign',
      dateExpirationFilter: 'params.dateExpiration'
    })
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Dataview', ['removeDataviewEntry']),
    ...mapActions('Contracts', ['deleteContract', 'getContract']),
    ...mapActions('Employee', ['getEmployees']),
    resetEmployee () {
      this.getEmployees({ params: { limit: 10 } })
    },
    clearAll () {
      this.titleFilter = ''
      this.employeeFilter = ''
      this.typeFilter = ''
      this.statusFilter = ''
      this.dateSignFilter = ''
      this.dateExpirationFilter = ''
      this.resetEmployee()
      this.filter()
    },
    // Passes 2 parameters to item text selectbox
    twoparams (item) {
      return item.name + ' - ' + item.phone
    },
    // open dialog
    openDialog () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    },
    onDateRangeChange (range) {
      this.range = range
      this.dateRangeOptions.presets[1].range[0] = format(range[0], 'YYYY-MM-DD')
      this.dateRangeOptions.presets[1].range[1] = format(subMonths(range[0], -2), 'YYYY-MM-DD')
      this.dateRangeOptions.presets[2].range[0] = format(range[0], 'YYYY-MM-DD')
      this.dateRangeOptions.presets[2].range[1] = format(subMonths(range[0], -6), 'YYYY-MM-DD')
      this.dateRangeOptions.presets[3].range[0] = format(range[0], 'YYYY-MM-DD')
      this.dateRangeOptions.presets[3].range[1] = format(subMonths(range[0], -12), 'YYYY-MM-DD')
    },
    submitDate () {
      if (this.range[0] === undefined || this.range[1] === undefined) {
        this.range[0] = this.dateRangeOptions.startDate
        this.range[1] = this.dateRangeOptions.endDate
      } else {
        this.dateSignFilter = this.range[0]
        this.dateExpirationFilter = this.range[1]
      }
      this.date = 'Từ ngày ' + this.range[0]
      this.date += ' đến ngày ' + this.range[1]
      this.dialog = false
      this.changeSearch()
    },
    // screach api employee
    sreachEmployeeList: debounce(function (value) {
      this.getEmployees({
        params: { q: value.target.value, limit: 10 }
      })
      this.isLoadingEmployeeList = true
      setTimeout(() => {
        this.isLoadingEmployeeList = false
      }, 1000)
    }, 500),
    // deteail contract
    contractDetail (contract) {
      this.getContract({ contractId: contract.id })
      this.$router.push({ name: 'contract-detail', params: { id: contract.id } })
    },
    // create contract
    createContract () {
      // this.getEmployees({ params: { limit: 10 } })
      this.$router.push({ name: 'contract-create' })
    },
    // edit contract
    editContract (item) {
      this.getContract({ params: { include: 'employee' }, contractId: item.id })
      this.getEmployees({ params: { q: item.employee_name } })
      this.$router.push({ name: 'contract-edit', params: { id: item.id } })
    },
    /// screach
    changeSearch: debounce(function () {
      this.filter()
      if (this.$route.params.id) {
        /// khi titlefilter detail ==0 thi clear  title
        if (this.titleFilter.length === 0) {
          this.titleFilter = ''
        } else {
          console.log('khong co gia tri')
        }
      }
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    },
    /// / reset screach
    resetSreach: debounce(function () {
      this.dateSignFilter = ''
      this.dateExpirationFilter = ''
      this.filter()
      // khi click vao dau x trang detail thi clear het
      if (this.$route.params.id) {
        this.titleFilter = ''
        this.employeeFilter = ''
        this.typeFilter = ''
        this.statusFilter = ''
        this.dateSignFilter = ''
        this.dateExpirationFilter = ''
      }
    }, 100),
    removeConfirm (item) {
      this.dataContracts = item
      this.idContract = item.id
      this.dialogDelete = true
    },
    remove (confirm) {
      if (confirm) {
        this.deleteContract({
          id: this.idContract,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'contract',
              data: this.dataContracts,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.delete-contract'),
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
    if (!this.employeeAll.length) {
      this.getEmployees({ params: { limit: 10 } })
    }
    // dataviewhieght của trang contract detail
    if (this.$route.params.id) {
      this.dataViewHeight = this.$refs.laylout.clientHeight - 60
    } else {
    // dataviewhieght của trang listting
      this.dataViewHeight = this.$refs.laylout.clientHeight - 120
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
<style type="text/css" media="screen" scoped>
  .v-input.v-text-field{
   margin-top: 4px;
 }
.v-select.v-select--chips .v-select__selections{
    min-height: 30px !important;
 }
 .paddTop-10{
   padding-top: 10px;
 }
 .paddRight-10{
   padding-right: 10px;
 }
 .padd-4{
  padding: 4px;
 }
 @media (min-width: 960px){
  .padd-4{
    padding: 8px;
  }
  .paddLef-3{
     padding-left: 3px;
  }
 }
 @media (min-width: 600px){
    .display{
       display: block !important;
    }
    .paddLef-3{
      padding-right: 4px !important;
    }
    .marRight-4{
      margin-right: 0px !important;
    }
 }
 @media (min-width: 250px){
    .display{
        display: none;
    }
    .marRight-4{
      margin-right: 4px;
    }
  .marLeft-3{
     margin-left: 3px;
  }
}

</style>
