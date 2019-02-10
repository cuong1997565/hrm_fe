<template>
  <v-form @submit.prevent="validateBeforeSubmit">
    <v-flex>
      <!-- branch,department,position -->
      <v-layout style="position: relative" row wrap sm12 class="mt-3">
        <!-- <v-flex xs8> -->
          <v-flex md4>
            <h3>Chi nhánh</h3>
          </v-flex>
          <v-flex md4 class="pl-3">
            <h3>Phòng ban</h3>
          </v-flex>
          <v-flex md3 style="margin-left: 30px;">
            <h3>Chức danh</h3>
          </v-flex>
        </v-layout>
        <v-layout v-if="employee.departments.length" style="clear: both;" row wrap :key="index" v-for="(department, index) in employee.departments">
          <v-flex md4>
            <v-autocomplete
            :loading="isLoadingBranch && branchIndex === index"
            ref="focusInput"
            tabindex=1
            v-validate="'required'"
            :error-messages="errors.has(`branch_${index}`) ? errors.collect(`branch_${index}`) : []"
            :data-vv-as="$t('label.name_branch')"
            :name="`branch_${index}`"
            v-model="employee.departments[index].branch_id"
            label="Chi nhánh"
            @keyup = "searchBranch(index, $event)"
            :items="employee.departments[index].branchs"
            item-text="name"
            item-value="id"
            placeholder="Chi nhánh"
            single-line
            clearable
            @click:clear="clearBranch(index)"
            @change="changeBranch()"
            >
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color:blue">
                  Không tìm thấy chi nhánh
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-autocomplete> </v-flex>
          <v-spacer></v-spacer>
          <!-- department -->
          <v-flex md4 id="department_text_long">
            <v-select
            tabindex=2
            v-validate="'required'"
            v-model="employee.departments[index].department_id"
            label="Phòng ban"
            :error-messages="errors.has(`department_${index}`) ? errors.collect(`department_${index}`) : []"
            :data-vv-as="$t('label.name_department')"
            :name="`department_${index}`"
            :disabled="!employee.departments[index].branch_id"
            :items="getDepartmentByBranch(employee.departments[index].branch_id)"
            item-text="name"
            item-value="id"
            placeholder="Phòng ban"
            single-line
            @change="changeDepartment">
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color:blue">
                  Không có phòng ban
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-select>
        </v-flex>
        <v-spacer></v-spacer>
        <!-- postion -->
        <v-flex md3>
          <v-autocomplete
          tabindex=3
          :disabled="!employee.departments[index].department_id"
          v-validate="'required'"
          :loading="isLoadingPosition && positionIndex === index"
          v-model="employee.departments[index].position_id"
          :items="employee.departments[index].positions"
          item-text="name"
          item-value="id"
          :error-messages="errors.has(`position_${index}`) ? errors.collect(`position_${index}`) : []"
          :data-vv-as="$t('label.name_position')"
          :name="`position_${index}`"
          placeholder="Chức danh"
          single-line
          clearable
          @click:clear="clearPosition(index)"
          @keyup = "searchPosition(index, $event)"
          @change="changePosition">
          <template slot="no-data">
            <v-list-tile>
              <v-list-tile-title style="color:blue">
                Không tìm thấy chức danh
              </v-list-tile-title>
            </v-list-tile>
          </template>
        </v-autocomplete>
      </v-flex>
      <v-flex xs1 style="flex-basis:55px;">
        <v-tooltip bottom>
          <v-btn slot="activator"
          style="margin-top:10px;"
          icon color="error"
          @click="deleteDepartment(index)">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Xóa</span>
      </v-tooltip>
    </v-flex>
  </v-layout>
  <v-layout row wrap>
    <v-tooltip bottom style="position: absolute; right: 18px; margin-top: -10px;">
      <v-btn slot="activator" class="mr-3 mt-0"
      icon color="primary"
      id="addDepartment"
      @click="addDepartment()">
      <v-icon>add</v-icon> </v-btn>
      <span>Thêm chức danh</span>
    </v-tooltip>
  </v-layout>
</v-flex>
</v-form>
</template>
<script>
import { filter, debounce } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'employeeFormSub',
  data () {
    return {
      colorAddDepartment: 'primary',
      departments: [],
      positions: [],
      branches: [],
      isLoadingBranch: false,
      branchIndex: 0,
      isLoadingPosition: false,
      positionIndex: 0,
      employee: {
        departments: []
      }
    }
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    dataEmployee: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    dataEmployee (val) {
      this.setInitData()
    }
  },
  computed: {
    ...mapGetters('Department', ['departmentByBranch']),
    ...mapGetters('Position', ['positionAll']),
    ...mapGetters('Branch', ['branchAll'])
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Department', ['getDepartmentForEmployee']),
    ...mapActions('Position', ['fetchPosition']),
    ...mapActions('Branch', ['getBranchs', 'setBranch']),
    addDepartment () {
      this.employee.departments.push({})
      this.employee.departments[this.employee.departments.length - 1].branchs = this.branchAll
      this.employee.departments[this.employee.departments.length - 1].positions = this.positionAll
      this.employee.departments[this.employee.departments.length - 1].loadingBranch = false
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
          this.stepEmployee = 1
        }
      })
    },
    deleteDepartment (index) {
      this.employee.departments.splice(index, 1)
      // this.emitDepartment()
    },
    focusInput () {
      this.$nextTick(() => {
        this.$refs.focusInput[0].focus()
      })
    },
    searchBranch: debounce(function (index, value) {
      this.branchIndex = index
      this.isLoadingBranch = true
      this.employee.departments[index].department_id = ''
      this.employee.departments[index].branch_id = ''
      this.employee.departments[index].branchs = []
      this.getBranchs({ params: { q: value.target.value, limit: 10 },
        cb: (response) => {
          this.employee.departments[index].branchs = response
          this.isLoadingBranch = false
        }
      })
    }, 500),
    clearBranch (index) {
      this.getBranchs({ params: { q: '', limit: 10 },
        cb: (response) => {
          this.employee.departments[index].branchs = response
        }
      })
      this.employee.departments[index].department_id = ''
      this.employee.departments[index].branch_id = ''
    },
    clearPosition (index) {
      this.employee.departments[index].position_id = ''
      this.fetchPosition({ params: { q: '', limit: 10 },
        cb: (response) => {
          this.employee.departments[index].positions = response
        }
      })
    },
    searchPosition: debounce(function (index, value) {
      this.isLoadingPosition = true
      this.positionIndex = index
      this.employee.departments[index].position_id = ''
      this.employee.departments[index].positions = []
      this.fetchPosition({ params: { q: value.target.value, limit: 10 },
        cb: (response) => {
          this.employee.departments[index].positions = response
          this.isLoadingPosition = false
        }
      })
    }, 500),
    changeBranch () {
      this.departmentRequired = 'required'
    },
    changeDepartment () {
      this.emitDepartment()
    },
    getDepartmentByBranch (branchId) {
      let array = []
      if (this.departments.length) {
        array = filter(this.departments, function (object) { return parseInt(object.branch_id) === parseInt(branchId) })
      }
      return array
    },
    changePosition () {
      this.emitDepartment()
    },
    // thực hiện emit khi có sự thay đổi về dữ liệu
    emitDepartment () {
      this.$emit('positionAndDepartment', this.employee.departments)
    },
    setInitData () {
      let dataEmployee = { ...this.dataEmployee }
      this.employee = { ...this.employee, ...dataEmployee }
      // nếu mảng dataemployee.departments không có gía trị thì push thêm một mảng rỗng
      if (this.dataEmployee.departments.data) {
        this.employee.departments = this.dataEmployee.departments.data.length ? this.employee.departments.data : [{}]
        if (this.employee.departments.length) {
          this.employee.departments.map((item) => {
            item.department_id = item.id
            return item
          })
        }
      } else {
        if (this.employee.departments[0]) {
          this.employee.departments[0].branchs = this.branchAll
          this.employee.departments[0].positions = this.positionAll
        }
      }
    }
  },
  mounted () {
    if (!this.dataEmployee.departments.data) {
      this.employee.departments.push({})
      this.employee.departments[0].branchs = this.branchAll
      this.employee.departments[0].positions = this.positionAll
      this.employee.departments[0].loadingBranch = false
      this.employee.departments[0].loadingPosition = false
      /* this.employee.departments[this.employee.departments.length-1].branchs = this.branchAll */
    }
    if (!this.branchAll.length) {
      this.getBranchs({ params: { limit: 10 } })
    }
    if (!this.positionAll.length) {
      this.fetchPosition({ params: { limit: 10 } })
    }
  },
  created () {
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
    !!this.dataEmployee && this.setInitData()
  }
}
</script>
<style>
#department_text_long .v-select__selection {
  /* BOTH of the following are required for text-overflow */
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  width: 250px;
}
#department_text_long .v-select__selection input::after{
  width: 260px;
  content: "...";
}
</style>
