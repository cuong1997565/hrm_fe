<template>
  <v-layout ref="laylout" column fill-height>
    <div ref="header">
      <v-toolbar height="50px" color="white" flat>
        <v-layout row wrap class="pt-3">
          <v-flex xs1 :class="isMini && 'max-width-col-2'">
            <v-tooltip bottom>
              <v-btn slot="activator" v-if="canAccess('candidate.create')" class="mr-3 mt-3" icon color="primary" @click="$router.push({name: 'candidate-create'})">
                <v-icon>add</v-icon>
              </v-btn>
              <span>Thêm mới</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs5 class="mt-1" :class="isMini && 'full-flex-basic full-width-col-10'">
            <v-tooltip bottom>
             <v-text-field
             hide-details
             slot="activator"
             single-line
             placeholder="Nhập tên, sđt, email ..."
             @keyup="changeSearch"
             v-model="params.q"
             @click:clear="changeSearch"
             clearable
             ></v-text-field>
             <span>Nhập tên, sđt, email ...</span>
            </v-tooltip>
          </v-flex>
           <v-flex xs5 class="mt-1 pl-3" :class="isMini && 'd-none'">
            <v-tooltip bottom>
            <v-autocomplete
            slot="activator"
            :items="plans"
            item-text="title"
            clearable
            item-value="id"
            v-model="params.planId"
            @change="changeSearch"
            @click:clear="changeSearch"
            placeholder="Chọn kế hoạch tuyển dụng"
            ></v-autocomplete>
            <span>Kế hoạch tuyển dụng</span>
            </v-tooltip>
          </v-flex>
             <v-flex xs1  :class="isMini && 'd-none'">
                   <v-tooltip bottom  v-if="isBoolean == false">
                      <v-btn slot="activator"
                      class="mr-3 mt-3" icon color="primary"
                      @click="listSreach"
                      >
                      <v-icon>list</v-icon
                        ></v-btn>
                        <span>Lọc nhiều hơn ...</span>
                    </v-tooltip>
                     <v-tooltip bottom  v-if="isBoolean == true">
                      <v-btn slot="activator"
                      class="mr-3 mt-3" icon color="primary"
                      @click="listSreach"
                      >
                      <v-icon>close</v-icon
                        ></v-btn>
                        <span>Lọc ít hơn ...</span>
                    </v-tooltip>
              </v-flex>
        </v-layout>
    </v-toolbar>
       <v-toolbar height="20" color="white" v-if="isBoolean == false" flat :class="isMini && 'd-none'" class="pb-3">
       <v-layout slot="extension" v-if="!isMini" class="pt-2 pb-2">
          <v-flex sm1 class="text-bold text-uppercase">
            #
          </v-flex>
          <v-flex sm3 class="text-bold text-uppercase">
            Thông tin ứng viên
          </v-flex>
          <v-flex sm3 class="text-bold text-uppercase">
            Thời gian
          </v-flex>
          <v-flex sm4 class="text-bold text-uppercase">
           Kế hoạch
         </v-flex>
         <v-flex sm1 class="text-bold text-uppercase mr-3">
          Hành động
        </v-flex>
      </v-layout>
              </v-toolbar>
   <v-toolbar height="50px" color="white" flat :class="isMini && 'd-none'" v-if="isBoolean == true">
    <v-layout row wrap class="pt-2">
          <v-flex xs2 class="mt-1" :class="isMini && 'd-none'">
            <v-tooltip bottom>
              <v-select
              :items="status"
              placeholder="trạng thái"
              item-text="name"
              item-value="id"
              v-model="params.status"
              @change="changeSearch"
              clearable
              @click:clear="changeSearch"
              slot="activator"
              ></v-select>
              <span>Chọn trạng thái</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs3 class="mt-1 ml-2" :class="isMini && 'd-none'">
             <v-tooltip bottom>
                  <v-autocomplete
               slot="activator"
               :items="positions"
               item-text="name"
               clearable
               item-value="id"
               placeholder="Chọn chức danh"
               v-model="params.positionId"
               @change="changeSearch"
               @click:clear="changeSearch"
              ></v-autocomplete>
              <span>Chức danh</span>
             </v-tooltip>
          </v-flex>
          <v-flex xs3 class="ml-2 pt-1" :class="isMini && 'd-none'" >
             <v-menu
            ref="dateApply"
            :close-on-content-click="false"
            v-model="dateApply"
            :nudge-right="40"
            :return-value.sync="params.dateApply"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            >
            <v-text-field
            slot="activator"
            v-model="params.dateApply"
            clearable
            @click:clear="changeSearch"
            readonly
            placeholder="Nhập ngày ứng tuyển"
            ></v-text-field>
            <v-date-picker  v-model="params.dateApply" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="dateApply = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="submitDateApply">OK</v-btn>
            </v-date-picker>
          </v-menu>
          </v-flex>
          <v-flex xs3 class="ml-2 pt-1" :class="isMini && 'd-none'" >
             <v-menu
            ref="timeInterview"
            :close-on-content-click="false"
            v-model="timeInterview"
            :nudge-right="40"
            :return-value.sync="params.timeInterview"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            >
            <v-text-field
            slot="activator"
            v-model="params.timeInterview"
            clearable
            @click:clear="changeSearch"
            readonly
            placeholder="Nhập thời gian phỏng vấn"
            ></v-text-field>
            <v-date-picker  v-model="params.timeInterview" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="timeInterview = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="submitTimeInterview">OK</v-btn>
            </v-date-picker>
          </v-menu>
          </v-flex>
    </v-layout>
     <v-layout slot="extension" v-if="!isMini" class="pt-2 pb-2">
            <v-flex sm1 class="text-bold text-uppercase">
              #
            </v-flex>
            <v-flex sm3 class="text-bold text-uppercase">
              Thông tin ứng viên
            </v-flex>
            <v-flex sm3 class="text-bold text-uppercase">
              Thời gian
            </v-flex>
            <v-flex sm4 class="text-bold text-uppercase">
             Kế hoạch
           </v-flex>
           <v-flex sm1 class="text-bold text-uppercase mr-3">
            Hành động
           </v-flex>
        </v-layout>
   </v-toolbar>
  </div>
  <v-flex xs12 class="border-e0-top">
    <data-view
    :name="dataViewName"
    api-url="candidates"
    v-if="dataViewHeight"
    :viewHeight="dataViewHeight"
    :params="params"
    :ref="dataViewName">
    <template slot-scope="{items}">
      <v-list three-line>
        <template v-for="(item, index) in items.data">
          <v-layout class="pa-2" :key="index">
            <v-flex xs1 class="pl-3" :class="isMini && 'd-none'">
              {{index + 1}}
            </v-flex>
            <v-flex xs3 class="pl-3" :class="isMini && 'd-none'">
              <v-list-tile-sub-title class="text--primary" v-if="item.name" :class="isMini && 'd-none'">
                <v-tooltip bottom>
                    <v-flex xs12 slot="activator">
                         {{ item.name }}
                    </v-flex>
                    <span>Tên ứng viên</span>
                </v-tooltip>
              </v-list-tile-sub-title>
              <v-list-tile-sub-title class="text--primary" v-if="item.email" :class="isMini && 'd-none'">
                <v-tooltip bottom>
                  <v-flex xs12 slot="activator">
                <v-icon size="16px">email</v-icon>
                     {{ item.email }}
                  </v-flex>
                  <span>Email ứng viên</span>
                </v-tooltip>
              </v-list-tile-sub-title>
              <v-list-tile-sub-title class="text--primary" v-if="item.phone" :class="isMini && 'd-none'">
                 <v-tooltip bottom>
                  <v-flex xs12 slot="activator">
                <v-icon size="16px">phone</v-icon>
                      {{ item.phone }}
                  </v-flex>
                  <span>Số điện thoại</span>
                </v-tooltip>
              </v-list-tile-sub-title>
            </v-flex>
            <v-flex xs3 class="pl-2" :class="isMini && 'd-none'">
             <v-list-tile-sub-title class="text--primary" v-if="item.date_apply" :class="isMini && 'd-none'">
               <span style="font-size: 16px">Ngày nộp đơn : </span>
               {{ item.date_apply }}
             </v-list-tile-sub-title>
             <v-list-tile-sub-title class="text--primary" v-if="item.time_interview" :class="isMini && 'd-none'">
               <span style="font-size: 16px">Phỏng vấn : </span>
               {{ item.time_interview }}
             </v-list-tile-sub-title>
           </v-flex>
           <v-flex xs4 class="pl-1" :class="isMini && 'd-none'">
              <div>
                <v-list-tile-sub-title class="text--primary" v-if="item.plan_txt.length > 30"
                  :class="isMini && 'd-none'" style="white-space: nowrap;">
                    <v-tooltip bottom>
                       <v-flex xs12 slot="activator">
                          <span style="font-size: 16px" v-html="item.plan_txt.slice(0,30) + ' ...'"></span>
                          <v-btn slot="activator" icon @click="detailPlan(item)"><v-icon color="blue" size="16px">fas fa-eye</v-icon></v-btn>
                       </v-flex>
                         <span>Kế hoạch</span>
                    </v-tooltip>
                </v-list-tile-sub-title>
             <v-list-tile-sub-title class="text--primary" v-else :class="isMini && 'd-none'" style="white-space: nowrap;">
                  <v-tooltip bottom>
                     <v-flex xs12 slot="activator">
                     <span style="font-size:16px">{{item.plan_txt}}</span>
                     </v-flex>
                    <span>Kế hoạch</span>
                  </v-tooltip>
             </v-list-tile-sub-title>
              </div>
             <v-list-tile-sub-title class="text--primary" v-if="item.position_id" :class="isMini && 'd-none'">
               <span style="font-size: 16px">Chức danh</span>
               <span style="padding-left:2px">:</span>
               {{ item.position_txt }}
             </v-list-tile-sub-title>
             <v-list-tile-sub-title class="text--primary" v-if="item.status == 0" :class="isMini && 'd-none'">
              <span style="font-size: 16px">Trạng thái</span>
              <span style="padding-left:8px;padding-right: 3px">:</span>
              <v-tooltip bottom>
              <img src="../../assets/moi2.png" height="22px" width="22px" slot="activator" alt="">
                <span style="font-size:16px">Trạng thái : mới</span>
              </v-tooltip>
            </v-list-tile-sub-title>
            <v-list-tile-sub-title class="text--primary" v-else-if="item.status == 1" :class="isMini && 'd-none'">
              <span style="font-size: 16px">Trạng thái</span>
              <span style="padding-left:8px;padding-right: 3px">:</span>
              <v-tooltip bottom>
                <img src="../../assets/chodoi.png"  height="22px" width="22px" slot="activator" alt="">
                <span style="font-size:16px">Trạng thái : chờ đợi</span>
              </v-tooltip>
            </v-list-tile-sub-title>
            <v-list-tile-sub-title class="text--primary" v-else-if="item.status == 2" :class="isMini && 'd-none'">
              <span style="font-size:16px">Trạng thái</span>
              <span style="padding-left:8px;padding-right: 3px">:</span>
              <v-tooltip bottom>
                <img src="../../assets/truot.png" height="22px" slot="activator" width="22px" alt="">
                <span>Trạng thái : trượt</span>
              </v-tooltip>
            </v-list-tile-sub-title>
            <v-list-tile-sub-title class="text--primary" v-else-if="item.status == 3" :class="isMini && 'd-none'">
              <span style="font-size: 16px">Trạng thái</span>
              <span style="padding-left:8px;padding-right: 3px">:</span>
              <v-tooltip bottom>
                <img src="../../assets/trungtuyen.jpg" height="22px" slot="activator" width="22px" alt="">
                <span style="font-size:16px">Trạng thái : trúng tuyển</span>
              </v-tooltip>
            </v-list-tile-sub-title>
            <v-list-tile-sub-title class="text--primary" v-else-if="item.status == 4" :class="isMini && 'd-none'">
              <span style="font-size:16px">Trạng thái</span>
              <span style="padding-left:8px">:</span>
              <v-tooltip bottom>
                <img src="../../assets/danhsachden.png"  height="22px" width="22px" slot="activator" alt="">
                <span style="font-size:16px">Trạng thái : danh sách đen</span>
              </v-tooltip>
            </v-list-tile-sub-title>
           </v-flex>
           <v-flex xs1 class="pl-1" :class="isMini && 'd-none'" style="margin-right: 15px">
             <v-tooltip bottom>
               <v-btn slot="activator" class="ma-0" v-if="canAccess('candidate.update')" icon @click.stop="editCandidate(item.id)">
                <v-icon class='theme--light teal--text'>edit</v-icon>
              </v-btn>
              <span>Sửa</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-btn slot="activator" class="ma-0" v-if="canAccess('candidate.delete')" icon @click.stop="removeConfirm(item.id)">
                <v-icon class="theme--light pink--text">delete</v-icon>
              </v-btn>
              <span>Xóa</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
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
<!-- dialog detail plan -->
<v-dialog v-model="dialogDetail" max-width="900px">
     <v-card class="pa-0">
    <v-card-title v-if="valuePlan">
      <span class="headline" width="100%" style="margin:0 auto">{{ valuePlan.name }}</span>
       <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon flat @click="dialogDetail = false">
        <v-icon>close</v-icon >
      </v-btn>
    </v-card-actions>
    </v-card-title>
      <v-divider></v-divider>
    <!-- form edit -->
    <v-card-text id="formSub">
      <v-container fluid class="white scroll-y pt-0" v-if="valuePlan">
        <v-flex v-html="valuePlan.plan_txt">
        </v-flex>
      </v-container>
    </v-card-text>
  </v-card>
</v-dialog>
</v-layout>
</template>
<script>
import { debounce } from 'lodash'
import DialogConfirm from '@/components/DialogConfirm'
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
    dialog: false,
    dataViewName: 'candidate',
    idCandidate: null,
    dialogDetail: false,
    plans: [],
    positions: [],
    dateApply: false,
    timeInterview: false,
    isBoolean: false,
    valuePlan: '',
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
    ],
    params: {
      q: '',
      planId: '',
      status: '',
      positionId: '',
      dateApply: '',
      timeInterview: ''
    }
  }),
  computed: {
    ...mapGetters(['isFetchingApi'])
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Dataview', ['removeDataviewEntry']),
    ...mapActions('Candidate', ['deleteCandidate', 'getCandidate']),
    // submit time date_apply
    submitDateApply () {
      this.$refs.dateApply.save(this.params.dateApply)
      this.changeSearch()
    },
    // submit time interview
    submitTimeInterview () {
      this.$refs.timeInterview.save(this.params.timeInterview)
      this.changeSearch()
    },
    // open sereach
    listSreach () {
      if (this.isBoolean === false) {
        this.isBoolean = true
        this.dataViewHeight = this.$refs.laylout.clientHeight - 152
      } else {
        this.isBoolean = false
        this.dataViewHeight = this.$refs.laylout.clientHeight - 113
      }
    },
    // detail candidate
    candidateDetail (candidate) {
      this.getCandidate({ candidateId: candidate.id })
      this.filter()
    },
    // detailPlan
    detailPlan (item) {
      this.valuePlan = item
      this.dialogDetail = true
    },
    closeDialog () {
      this.dialogDetail = false
    },
    // edit candidate
    editCandidate (id) {
      this.getCandidate({ candidateId: id })
      this.$router.push({ name: 'candidate-edit', params: { id: id } })
    },
    removeConfirm (id) {
      this.idCandidate = id
      this.dialogDelete = true
      console.log('id :', this.idCandidate)
    },
    remove (confirm) {
      if (confirm) {
        this.deleteCandidate({
          id: this.idCandidate,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'candidate',
              data: this.candidateDetail,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.success'),
              color: 'success'
            })
            this.dialogDelete = false
            this.$refs[this.dataViewName].$emit('reload')
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
    // sreach
    changeSearch: debounce(function () {
      this.filter()
    }, 500),
    filter () {
      this.$refs[this.dataViewName].$emit('reload')
    }
  },
  mounted () {
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
    this.dataViewHeight = this.$refs.laylout.clientHeight - 113
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
  .v-input.v-text-field{
  margin-top: 0px !important;
}
</style>
