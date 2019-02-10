<template>
  <v-layout ref="laylout" row fill-height>
    <v-flex xl4 lg4 md4  sm4 class="display-detail">
      <listting type="detail" :is-mini="true" />
    </v-flex>
    <v-flex xl8 lg8 md8 sm8 xs12 class="border-e0-left">
     <v-toolbar dense color="white" flat>
       <v-toolbar-title>{{contractDetail.title}} </v-toolbar-title>
       <v-spacer></v-spacer>
       <v-menu :nudge-width="100" offset-y>
        <v-list>
          <v-list-tile
          v-for="item in 10"
          :key="item"
          >
          <v-list-tile-title v-text="item"></v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-tooltip bottom>
      <v-btn slot="activator"  v-if="canAccess('contract.update')" icon @click="editContract(contractDetail)">
        <v-icon class='theme--light teal--text'>edit</v-icon>
      </v-btn>
      <span>Sửa</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn slot="activator" class="theme--light pink--text" v-if="canAccess('contract.delete')" @click="removeConfirm()" icon>
        <v-icon>delete</v-icon>
      </v-btn>
      <span>Xóa</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click="closeContract" >
        <v-icon>close</v-icon>
      </v-btn>
      <span>Đóng</span>
    </v-tooltip>
  </v-toolbar>
  <v-container fluid class="white scroll-y border-e0-top" :style="{height: dataViewHeight + 'px'}">
    <v-layout row wrap>
      <v-flex xl4 lg4 md4  sm4 xs5>
           <p class="fontSize"><b>Tiêu đề</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
           <p class="fontSize"> {{ contractDetail.title }}</p>
      </v-flex>
      <v-flex xl4 lg4 md4  sm4 xs5>
          <p class="fontSize"><b>Link</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
            <p class="fontSize"><a v-bind:href="contractDetail.link" target="_blank">{{ contractDetail.link }} </a></p>
      </v-flex>
       <v-flex xl4 lg4 md4  sm4 xs5>
        <p class="fontSize"><b>Loại hợp đồng</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
        <p class="fontSize">{{ contractDetail.type_txt }}</p>
      </v-flex>
       <v-flex xl4 lg4 md4  sm4 xs5>
          <p class="fontSize"> <b>Trạng thái</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
          <p class="fontSize" style=" color:#03A9F4" v-if="contractDetail.status == 0" >{{ contractDetail.status_txt }}</p>
          <p class="fontSize" style="color:#FF5722" v-else-if="contractDetail.status == 1" >{{ contractDetail.status_txt }}</p>
          <p class="fontSize" style="color:green" v-else-if="contractDetail.status == 2" >{{ contractDetail.status_txt }}</p>
      </v-flex>
      <v-flex xl4 lg4 md4  sm4 xs5>
        <p class="fontSize"><b>Ngày ký</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
        <p class="fontSize"> {{contractDetail.date_sign_format}}</p>
      </v-flex>
       <v-flex xl4 lg4 md4  sm4 xs5>
        <p class="fontSize"><b>Ngày hiệu lực</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
        <p class="fontSize">{{ contractDetail.date_effective_format }}</p>
      </v-flex>
      <v-flex xl4 lg4 md4  sm4 xs5>
          <p class="fontSize"><b>Ngày kết thúc hợp đồng</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
          <p class="fontSize"> {{contractDetail.date_expiration_format}}</p>
      </v-flex>
      <v-flex xl4 lg4 md4  sm4 xs5>
         <p class="fontSize"><b>Tên nhân viên</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
          <p class="fontSize"> <a @click.stop="editEmployee(contractDetail.employee_id)">{{contractDetail.employee_name}}</a></p>
      </v-flex>
       <v-flex xl4 lg4 md4  sm4 xs5>
        <p class="fontSize"><b>Số điện thoại</b></p>
      </v-flex>
      <v-flex xl8 lg8 md8  sm8 xs7>
         <p class="fontSize"> {{contractDetail.employee_phone}}</p>
       </v-flex>
    </v-layout>
  </v-container>
</v-flex>
  <dialog-confirm v-model="dialogDelete" @input="remove" />
</v-layout>
</template>
<script type="text/javascript">
import Listting from './Listting'
import { mapActions, mapGetters } from 'vuex'
import DialogConfirm from '@/components/DialogConfirm'
export default{
  name: 'ContractDetail',
  components: {
    Listting,
    DialogConfirm
  },
  data () {
    return {
      dataViewHeight: 0,
      dialogDelete: false,
      dataViewName: 'contract'
    }
  },
  computed: {
    ...mapGetters('Contracts', ['contractDetail'])
  },
  methods: {
    ...mapActions(['setMiniDrawer']),
    ...mapActions('Contracts', ['getContract', 'deleteContract']),
    ...mapActions('Dataview', ['removeDataviewEntry']),
    ...mapActions('Employee', ['getEmployee', 'getEmployees']),
    /// detail employee
    editEmployee (id) {
      this.getEmployee({ employeeId: id, params: { include: 'roles,departments,contracts' } })
      this.$router.push({ name: 'employee-detail', params: { id: id } })
    },
    editContract (contractDetail) {
      this.getContract({ params: { include: 'employee' }, contractId: contractDetail.id })
      this.getEmployees({ q: contractDetail.employee_name })
      this.$router.push({ name: 'contract-edit', params: { id: contractDetail.id } })
    },
    removeConfirm () {
      this.dialogDelete = true
    },
    closeContract () {
      this.setMiniDrawer(false)
      this.$router.push({ name: 'contract' })
    },
    remove (confirm) {
      if (confirm) {
        this.deleteContract({
          id: this.$route.params.id,
          cb: (response) => {
            this.removeDataviewEntry({
              name: 'contract',
              data: this.contractDetail,
              key: 'id'
            })
            this.$store.dispatch('showNotify', {
              text: this.$t('alert.delete-contract'),
              color: 'success'
            })
            this.dialogDelete = false
            this.$router.push({ name: 'contract' })
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
  created () {
    this.setMiniDrawer(true)
    if (!this.contractDetail.id) {
      this.getContract({ params: { include: 'employee' }, contractId: this.$route.params.id })
    }
  },
  mounted () {
    this.dataViewHeight = this.$refs.laylout.clientHeight - 50
  }
}
</script>
<style scoped>
  @media (min-width: 250px){
    .display-detail{
      display: none;
    }
    .fontSize{
      font-size: 16px;
    }
  }
  @media (min-width: 600px){
     .display-detail{
       display: block ;
     }
  }
</style>
