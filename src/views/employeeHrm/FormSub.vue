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
          <v-flex md4 class="mr-3">
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
        <!-- department -->
          <v-flex md4 id="department_text_long" class="mr-2">
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
            @change="changeDepartment"
            >
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title style="color:blue">
                  Không có phòng ban
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-select>
        </v-flex>
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
          @change="changePosition"
          >
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
  computed: {
    ...mapGetters('Department', ['departmentByBranch']),
    ...mapGetters('Position', ['positionAll']),
    ...mapGetters('Branch', ['branchAll'])
  },
  watch: {
    dataEmployee (val) {
      this.setInitData()
    }
  },
  methods: {
    ...mapActions(['fetchApi']),
    ...mapActions('Department', ['getDepartmentForEmployee']),
    ...mapActions('Position', ['fetchPosition']),
    ...mapActions('Branch', ['getBranchs', 'setBranch']),
    // screach branch
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
    }),
    changeBranch () {
      this.departmentRequired = 'required'
    },
    // get department theo branch
    getDepartmentByBranch (branchId) {
      let array = []
      if (this.departments.length) {
        array = filter(this.departments, function (object) {
          return parseInt(object.branch_id) === parseInt(branchId)
        })
      }
      return array
    },
    // clear branch
    clearBranch (index) {
      this.getBranchs({
        params: { q: '', limit: 10 },
        cb: (response) => {
          this.employee.departments[index].branchs = response
        }
      })
      this.employee.departments[index].department_id = ''
      this.employee.departments[index].branch_id = ''
    },
    // clear position
    clearPosition (index) {
      this.employee.departments[index].position_id = ''
      this.fetchPosition({ params: { q: '', limit: 10 },
        cb: (response) => {
          this.employee.departments[index].positions = response
        }
      })
    },
    // sreach positions
    searchPosition: debounce(function (index, value) {
      this.isLoadingPosition = true
      this.positionIndex = index
      this.employee.departments[index].position_id = ''
      this.employee.departments[index].positions = []
      this.fetchPosition({
        params: { q: value.target.value, limit: 10 },
        cb: (response) => {
          this.employee.departments[index].positions = response
          this.isLoadingPosition = false
        }
      })
    }, 500),
    // focusInput
    focusInput () {
      this.$nextTick(() => {
        this.$refs.focusInput[0].focus()
      })
    },
    // deleteDepartment remove 1 row
    deleteDepartment (index) {
      this.employee.departments.splice(index, 1)
    },
    // add 1 row
    addDepartment () {
      this.employee.departments.push({})
      this.employee.departments[this.employee.departments.length - 1].branchs = this.branchAll
      this.employee.departments[this.employee.departments.length - 1].positions = this.positionAll
      this.employee.departments[this.employee.departments.length - 1].isLoadingBranch = false
    },
    // change department
    changeDepartment () {
      this.emitDepartment()
    },
    // change positions
    changePosition () {
      this.emitDepartment()
    },
    // validator form sub
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
    // emit data form sub about form
    emitDepartment () {
      this.$emit('positionAndDepartment', this.employee.departments)
    },
    // set data about form sub
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
        this.employee.departments.push({})
        if (this.employee.departments[0]) {
          this.employee.departments[0].branchs = this.branchAll
          this.employee.departments[0].positions = this.positionAll
        }
      }
    }
  },
  mounted () {
    // data form sub cua phan  add
    if (!this.dataEmployee.departments.data) {
      this.employee.departments.push({})
      this.employee.departments[0].branchs = this.branchAll
      this.employee.departments[0].positions = this.positionAll
      this.employee.departments[0].loadingBranch = false
      this.employee.departments[0].loadingPosition = false
      /* this.employee.departments[this.employee.departments.length-1].branchs = this.branchAll */
    }
    // branch rong
    if (!this.branchAll.length) {
      this.getBranchs({
        params: { limit: 10 },
        cb: (response) => {
          this.employee.departments[0].branchs = response
        }
      })
    }
    // position
    if (!this.positionAll.length) {
      this.fetchPosition({
        params: { limit: 10 },
        cb: (response) => {
          this.employee.departments[0].positions = response
        }
      })
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
