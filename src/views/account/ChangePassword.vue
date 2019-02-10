<template>
  <v-card flat>
    <v-form @submit.prevent="validateBeforeSubmit">
      <v-container>
        <v-layout row wrap justify-content-center>
          <v-flex xs12 sm6>
            <v-text-field
              type="password"
              :error-messages="errors.has('old_password') ? errors.collect('old_password') : []"
              v-validate="'required|min:5|max:255'"
              :data-vv-as="$t('label.old_password')"
              name="old_password"
              autocomplete="off"
              :label="$t('label.old_password') + ' *'"
              v-model="account.old_password">
            </v-text-field>
            <v-text-field
              type="password"
              :error-messages="errors.has('password') ? errors.collect('password') : []"
              v-validate="'required|min:5|max:255'"
              :data-vv-as="$t('label.new_password')"
              name="password"
              autocomplete="off"
              :label="$t('label.new_password') + ' *'"
              v-model="account.password">
            </v-text-field>
            <v-text-field
              type="password"
              :error-messages="errors.has('password_confirmation') ? errors.collect('password_confirmation') : []"
              v-validate="'required|min:5|max:255|confirmed:password'"
              :data-vv-as="$t('label.new_password_confirmation')"
              name="password_confirmation"
              autocomplete="off"
              :label="$t('label.new_password_confirmation') + ' *'"
              v-model="account.password_confirmation">
            </v-text-field>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <v-btn
              :loading="isFetchingApi"
              :disabled="isFetchingApi"
              color="primary"
              type="submit"
              >
                <v-icon left>lock</v-icon> {{$t('control.change-password')}}
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

  name: 'ChangePassword',

  data () {
    return {
      account: {
        old_password: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isFetchingApi'])
  },
  methods: {
    ...mapActions(['clearLogged', 'showNotify']),
    ...mapActions('Account', ['changePassword']),
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.changePassword({
            data: this.account,
            cb: (response) => {
              this.showNotify({
                color: 'success',
                text: response.data.message
              })
              this.clearLogged()
              this.$router.push({ name: 'login' })
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
  }
}
</script>

<style lang="css" scoped>
</style>
