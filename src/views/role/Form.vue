<template>
  <v-form @submit.prevent="validateBeforeSubmit">
    <v-text-field
      :error-messages="errors.has('name') ? errors.collect('name') : []"
      v-validate="'required|min:3'"
      :data-vv-as="$t('label.name')"
      name="name"
      :label="$t('label.name') + ' *'"
      v-model="role.name">
    </v-text-field>
    <v-text-field
      :error-messages="errors.has('slug') ? errors.collect('slug') : []"
      v-validate="'required'"
      :data-vv-as="$t('label.slug')"
      name="slug"
      :label="$t('label.slug') + ' *'"
      type="slug"
      v-model="role.slug">
    </v-text-field>
    <v-textarea
      solo
      name="description"
      label="Mô tả"
      v-model="role.description"
    ></v-textarea>
    <v-checkbox
      label="Quyền danh riêng cho admin"
      v-model="role.admin_only"
    ></v-checkbox>
    <h3>Danh sách quyền truy cập</h3>
    <v-container v-for="(perG, key) in allPermission" :key="key">
      <h4>{{ perG.title }}</h4>
      <v-flex d-flex>
        <v-checkbox v-model="role.permissions" v-for="(per, k) in perG.list" :key="`${key}.${k}`" :label="per" :value="`${key}.${k}`" />
      </v-flex>
    </v-container>
    <v-flex xs12 text-xs-center>
      <v-btn
        :loading="isFetchingApi"
        :disabled="isFetchingApi"
        color="primary"
        type="submit"
        >
        <template v-if="isCreate">
          <v-icon left>add</v-icon> {{$t('control.create')}}
        </template>
        <template v-else>
          <v-icon left>save</v-icon> {{$t('control.save')}}
        </template>
      </v-btn>
    </v-flex>
  </v-form>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { map, chain } from 'lodash'
export default{
  name: 'RoleForm',
  computed: {
    ...mapGetters(['isFetchingApi', 'allPermission']),
    isCreate () {
      return this.type === 'create'
    }
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataRole: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      role: {
        name: '',
        slug: '',
        description: '',
        admin_only: false,
        permissions: []
      }
    }
  },
  methods: {
    ...mapActions(['getAllPermission']),
    setInitData () {
      let initData = { ...this.dataRole }
      initData.permissions = map(initData.permissions, (value, key) => key)
      this.role = { ...this.role, ...initData }
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let submitData = { ...this.role }
          submitData.permissions = chain(submitData.permissions).map((value) => {
            return [value, true]
          }).fromPairs()
            .value()
          this.$emit('submit', submitData)
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    }
  },
  created () {
    !!this.dataRole && this.setInitData()
    !!this.allPermission && this.getAllPermission()
  }
}
</script>
