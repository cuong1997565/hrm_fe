<template>
  <v-form @submit.prevent="validateBeforeSubmit">
    <v-container>
      <v-layout row wrap class="mt-3">
        <!-- <v-flex xs8> -->
        <v-flex md3>
          <h3>Chi nhánh</h3>
        </v-flex>
        <v-flex md3 class="pr-2">
          <h3>Phòng ban</h3>
        </v-flex>
        <v-flex md3 class="pr-2">
          <h3>Chức danh</h3>
        </v-flex>
        <v-flex xs2 class="pr-2">
          <h3>Số lượng</h3>
        </v-flex>
      </v-layout>

      <v-layout row wrap align-center class="mb-1 mt-1" :key="index" v-for="(department, index) in plan.details">
        <v-flex xs3>
          <v-autocomplete
            tabindex="6"
            class="pr-2"
            v-validate="'required'"
            :loading="isLoadingBranch && branchIndex === index"
            v-model="plan.details[index].branch_id"
            :items="plan.details[index].branchs"
            item-text="name"
            @keyup="searchBranch(index,$event)"
            item-value="id"
            :error-messages="errors.has(`branch_${index}`) ? errors.collect(`branch_${index}`) : []"
            :data-vv-as="$t('label.name_branch')"
            :name="`branch_${index}`"
            placeholder="Chi nhánh"
            @change="changeBranch(index)"
            clearable
          >
            <!-- @click:clear="resetBranch(index)"
              clearable -->
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color:blue">
                  Không tìm thấy chi nhánh
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-autocomplete>
        </v-flex>

        <v-flex xs3 id="department_text_long">
          <v-select
            tabindex="7"
            v-validate="'required'"
            v-model="plan.details[index].department_id"
            label="Phòng ban"
            :error-messages="errors.has(`department_${index}`) ? errors.collect(`department_${index}`) : []"
            :data-vv-as="$t('label.name_department')"
            :name="`department_${index}`"
            :disabled="!plan.details[index].branch_id"
            :items="getDepartmentByBranch(plan.details[index].branch_id)"
            item-text="name"
            item-value="id"
            class="pr-2"
            placeholder="Phòng ban"
            single-line
            @change="changeDepartment">
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color:blue">
                  Không tìm thấy phòng ban
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-select>
        </v-flex>

        <v-flex xs3>
          <v-tooltip bottom>
            <v-autocomplete
              tabindex="8"
              slot="activator"
              v-validate="'required'"
              :loading="isLoadingPosition && positionIndex === index"
              v-model="plan.details[index].position_id"
              :items="plan.details[index].positions"
              item-text="name"
              item-value="id"
              :error-messages="errors.has(`position_${index}`) ? errors.collect(`position_${index}`) : []"
              :name="`position_${index}`"
              @keyup="searchPosition(index,$event)"
              placeholder="Chức danh"
              single-line
              :data-vv-as="$t('label.name_position')"
              class='pr-2'
              clearable
              @click:clear="clearPositon(index)"
              @change="changePosition">
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-title style="color:blue">
                    Không tìm thấy chức danh
                  </v-list-tile-title>
                </v-list-tile>
              </template>
            </v-autocomplete>
            <span>Chọn chức danh</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs2>
          <v-text-field
            tabindex="9"
            :error-messages="errors.has(`quantity_${index}`) ? errors.collect(`quantity_${index}`) : []"
            v-validate="'required|numeric|min_value:1'"
            :data-vv-as="$t('label.quantity')"
            :name="`quantity_${index}`"
            v-model="plan.details[index].quantity"
            type="number"
            placeholder="Số lượng"
            @change="changeQuantity"
          >
          </v-text-field>

        </v-flex>
        <v-tooltip bottom xs1 style="flex-basis: 50px;">
          <v-btn slot="activator" class="mb-3 ml-4"
                 icon color="error"
                 @click="deleteDepartment(index)">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>Xóa</span>
        </v-tooltip>
      </v-layout>
      <v-tooltip bottom style="float: right; margin-top: -3px; margin-right: 0px;">
        <v-btn slot="activator" class="mr-3 mt-0"
               icon color="primary"
               id="addDepartment"
               @click="addDepartment()">
          <v-icon>add</v-icon>
        </v-btn>
        <span>Thêm chức danh</span>
      </v-tooltip>
    </v-container>
    <dialog-confirm v-model="dialogDeleteDetail" @input="removeDetail"/>
  </v-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { filter, debounce, cloneDeep } from 'lodash'
import DialogConfirm from '@/components/DialogConfirm'
export default {
  name: 'PlanFormSub',
  components: {
    DialogConfirm
  },
  data () {
    return {
      colorAddDepartment: 'primary',
      isLoadingBranch: false,
      branchIndex: 0,
      isLoadingPosition: false,
      positionIndex: 0,
      dialogDeleteDetail: false,
      idDeleteDetail: null,
      departments: [],
      plan: {
        details: []
      }
    }
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    dataPlan: {
      type: Object,
      default: () => {
        return {
          details: []
        }
      }
    }
  },
  computed: {
    ...mapGetters('Department', ['departmentDetail']),
    ...mapGetters('Branch', ['branchAll']),
    ...mapGetters('Position', ['positionAll'])
  },
  watch: {
    dataPlan (val) {
      this.setInitData()
    }
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Department', ['fetchDepartment']),
    ...mapActions('Position', ['fetchPosition']),
    ...mapActions('PlanDetails', ['deletePlanDetail']),
    ...mapActions('Branch', ['getBranchs']),
    addDepartment () {
      this.plan.details.push({})
      this.plan.details[this.plan.details.length - 1].branchs = this.branchAll
      this.plan.details[this.plan.details.length - 1].positions = this.positionAll
      this.plan.details[this.plan.details.length - 1].loadingBranch = false
      this.emitDepartment()
    },
    changeBranch (index) {
      this.emitDepartment()
    },
    getDepartmentByBranch (branchId) {
      let array = []
      if (this.departments.length) {
        array = filter(this.departments, function (object) {
          return parseInt(object.branch_id) === parseInt(branchId)
        })
      }
      return array
    },
    changePosition () {
      this.emitDepartment()
    },
    changeDepartment () {
      this.emitDepartment()
    },
    changeQuantity () {
      this.emitDepartment()
    },
    emitDepartment () {
      this.$emit('positionAndDepartment', this.plan.details)
    },
    setInitData () {
      let dataPlan = { ...this.dataPlan }
      this.plan = { ...this.plan, ...dataPlan }
      if (this.dataPlan.details.data) {
        this.plan.details = this.dataPlan.details.data.length ? cloneDeep(this.plan.details.data) : [{}]
        if (this.plan.details.length) {
          this.plan.details.map((item) => {
            if (item.department) {
              item.branch_id = item.department.data.branch_id
            }
            item.loadingBranch = false
            return item
          })
        }
      } else {
        if (!this.branchAll.length) {
          this.getBranchs({
            params: { limit: 10 },
            cb: (response) => {
              this.plan.details[0].branchs = response
            }
          })
        }
        if (!this.positionAll.length) {
          this.fetchPosition({
            params: { limit: 10 },
            cb: (response) => {
              this.plan.details[0].positions = response
            }
          })
        }
      }
    },
    removeDetail (confirm) {
      if (confirm) {
        this.dialogDeleteDetail = false
        this.deletePlanDetail({
          id: this.plan.details[this.idDeleteDetail].id
        })
        this.plan.details.splice(this.idDeleteDetail, 1)
        this.emitDepartment()
      }
    },
    deleteDepartment (index) {
      this.plan.details.splice(index, 1)
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    },
    searchBranch: debounce(function (index, value) {
      if (value.target.value === '') {
        this.plan.details[index].branch_id = ''
      }
      this.branchIndex = index
      this.isLoadingBranch = true
      this.plan.details[index].department_id = ''
      this.plan.details[index].branchs = []
      this.getBranchs({
        params: { q: value.target.value, limit: 10 },
        cb: (response) => {
          this.plan.details[index].branchs = response
          this.isLoadingBranch = false
        }
      })
      // setTimeout(() => { this.plan.details[index].loadingBranch = false }, 500)
    }, 500),
    searchPosition: debounce(function (index, value) {
      this.isLoadingPosition = true
      this.positionIndex = index
      this.plan.details[index].positions = []
      this.fetchPosition({
        params: { q: value.target.value, limit: 10 },
        cb: (response) => {
          this.plan.details[index].positions = response
          this.isLoadingPosition = false
        }
      })
    }, 500),
    resetBranch (index) {
      console.log(1)
      this.plan.details[index].department_id = ''
      this.getBranchs({
        params: { limit: 10 },
        cb: (response) => {
          this.plan.details[index].branchs = response
          console.log('this.branchAll', this.branchAll)
        }
      })
    },
    clearPositon (index) {
      this.plan.details[index].position_id = ''
      this.fetchPosition({
        params: { q: '', limit: 10 },
        cb: (response) => {
          this.plan.details[index].positions = response
        }
      })
    }
  },
  mounted () {
    if (!this.dataPlan.details.data) {
      this.plan.details.push({})
      this.plan.details[0].branchs = this.branchAll
      this.plan.details[0].positions = this.positionAll
      this.plan.details[0].loadingBranch = false
    }
    if (!this.branchAll.length) {
      this.getBranchs({ params: { limit: 10 } })
    }
    if (!this.positionAll.length) {
      this.fetchPosition({ params: { limit: 10 } })
    }
  },
  created () {
    // get department
    this.fetchApi({
      url: 'departments',
      method: 'GET',
      params: {
        limit: -1
      },
      success: (response) => {
        this.departments = response.data
      }
    })
    !!this.dataPlan && this.setInitData()
  }
}
</script>

<style scoped>
  .v-input.v-text-field {
    margin-top: 0px;
  }
  .v-form > .container > .layout > .flex {
    padding: 3px;
  }
  .v-text-field {
    margin-top: 0px;
  }
</style>

<style>
  #department_text_long .v-select__selection {
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    width: 180px;
  }
  #department_text_long .v-select__selection input::after {
    width: 180px;
    content: "...";
  }
</style>
