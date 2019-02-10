<template>
  <v-card flat>
    <v-form @submit.prevent="validateBeforeSubmit">
      <v-container>
        <v-layout row wrap justify-content-center>
          <v-flex xs12 sm6>
            <!-- <div class="display-flex justify-content-center">
              <v-avatar
                class="mb-3"
                size="100"
                color="grey lighten-4"
                >
                <img :src="account.avatar_url" :alt="account.name">
              </v-avatar>
            </div> -->

            <v-text-field
              :error-messages="errors.has('name') ? errors.collect('name') : []"
              v-validate="'required|min:6|max:255'"
              :data-vv-as="$t('label.name')"
              name="name"
              :label="$t('label.name') + ' *'"
              autocomplete="off"
              v-model="account.name">
            </v-text-field>
            <v-text-field
              :error-messages="errors.has('phone') ? errors.collect('phone') : []"
              v-validate="'min:8|max:12'"
              :data-vv-as="$t('label.phone')"
              name="phone"
              autocomplete="off"
              :label="$t('label.phone')"
              v-model="account.phone">
            </v-text-field>
            <v-text-field
              disabled
              name="email"
              :label="$t('label.email') + ' *'"
              autocomplete="off"
              v-model="account.email">
            </v-text-field>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <v-btn
              :loading="isFetchingApi"
              :disabled="isFetchingApi"
              color="primary"
              type="submit"
              >
                <v-icon left>save</v-icon> {{$t('control.save')}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {

  name: 'ChangeInformation',

  data () {
    return {
      account: {
        name: '',
        phone: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isFetchingApi', 'userProfile'])
  },
  methods: {
    ...mapActions(['showNotify', 'getProfile']),
    ...mapActions('Account', ['changeInformation']),
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let obj = {}
          obj.name = this.account.name
          obj.phone = this.account.phone
          this.changeInformation({
            data: obj,
            cb: (response) => {
              this.getProfile({ params: { include: 'roles' } })
              this.showNotify({
                color: 'success',
                text: 'Thay đổi thông tin cá nhân thành công'
              })
            }
          })
        } else {
          this.$store.dispatch('showNotify', {
            text: this.$t('alert.invalid'),
            color: 'warning'
          })
        }
      })
    }
  },
  watch: {
    userProfile: {
      handler: function (newVal) {
        this.account = { ...this.account, ...newVal }
      },
      deep: true
    }
  },
  mounted () {
    if (this.userProfile.id) {
      this.account = { ...this.account, ...this.userProfile }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
