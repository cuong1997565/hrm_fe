<template>
  <v-form @submit.prevent="validateBeforeSubmit">
    <v-text-field
      :error-messages="errors.has('name') ? errors.collect('name') : []"
      v-validate="'required|min:2|max:255'"
      data-vv-as="Họ tên"
      name="name"
      placeholder="Nguyễn Văn A"
      autocomplete="off"
      label="Họ tên *"
      v-model="register.name">
    </v-text-field>
    <v-text-field
      :error-messages="errors.has('company_name') ? errors.collect('company_name') : []"
      v-validate="'min:2|max:255'"
      data-vv-as="Tên công ty"
      placeholder="Gostore"
      autocomplete="off"
      name="company_name"
      label="Tên công ty"
      v-model="register.company_name">
    </v-text-field>
    <v-text-field
      :error-messages="errors.has('phone') ? errors.collect('phone') : []"
      v-validate="'min:8|max:12'"
      data-vv-as="Số điện thoại"
      placeholder="0123456789"
      type="tel"
      v-number-only
      autocomplete="off"
      name="phone"
      label="Số điện thoại"
      v-model="register.phone">
    </v-text-field>
    <v-text-field
      :error-messages="errors.has('email') ? errors.collect('email') : []"
      v-validate="'required|email'"
      data-vv-as="Tài khoản"
      placeholder="example@gmail.com"
      type="email"
      autocomplete="off"
      name="email"
      label="Tài khoản *"
      v-model="register.email">
    </v-text-field>
    <v-text-field
      :error-messages="errors.has('password') ? errors.collect('password') : []"
      v-validate="'required|min:5'"
      data-vv-as="Mật khẩu"
      placeholder="......"
      autocomplete="off"
      :append-icon="showPassword ? 'visibility_off' : 'visibility'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
      name="password"
      label="Mật khẩu *"
      v-model="register.password">
    </v-text-field>
    <v-text-field
      :error-messages="errors.has('password_confirmation') ? errors.collect('password_confirmation') : []"
      v-validate="'required|min:5|confirmed:password'"
      placeholder="......"
      autocomplete="off"
      :append-icon="showPasswordConfirmation ? 'visibility_off' : 'visibility'"
      :type="showPasswordConfirmation ? 'text' : 'password'"
      @click:append="showPasswordConfirmation = !showPasswordConfirmation"
      data-vv-as="Nhập lại mật khẩu"
      name="password_confirmation"
      label="Nhập lại mật khẩu"
      v-model="register.password_confirmation">
    </v-text-field>
    <v-card-actions class="mt-3 mb-3">
      <v-btn
        :loading="isFetchingApi"
        :disabled="isFetchingApi"
        color="primary"
        type="submit"
        block
        >
        Đăng ký
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Register',
  data () {
    return {
      register: {
        name: '',
        company_name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      showPassword: false,
      showPasswordConfirmation: false
    }
  },
  computed: {
    ...mapGetters(['isFetchingApi'])
  },
  methods: {
    ...mapActions(['fetchApi', 'setLogged', 'getProfile']),
    validateBeforeSubmit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.fetchApi({
            baseURL: process.env.VUE_APP_API_URL,
            url: 'register',
            method: 'post',
            data: this.register,
            success: this.loggedSuccess
          })
        } else {
          this.$store.dispatch('showNotify', {
            text: 'Vui lòng kiểm tra các trường cần nhập!',
            color: 'warning'
          })
        }
      })
    },
    loggedSuccess (response) {
      this.setLogged(response)
      this.getProfile({ params: { include: 'roles' } })
      this.$store.dispatch('showNotify', {
        text: 'Đăng ký thành công!',
        color: 'success'
      })
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="css" scoped>
</style>
