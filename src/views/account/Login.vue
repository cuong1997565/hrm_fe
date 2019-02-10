<template>
  <div>
    <v-form @submit.prevent="validateBeforeSubmit">
      <v-text-field
        :error-messages="errors.has('username') ? errors.collect('username') : []"
        v-validate="'required|email'"
        data-vv-as="Tài khoản"
        name="username"
        label="Tài khoản"
        placeholder="example@gmail.com"
        type="email"
        autocomplete="off"
        v-model="login.username">
      </v-text-field>
      <v-text-field
        :error-messages="errors.has('password') ? errors.collect('password') : []"
        v-validate="'required|min:5'"
        data-vv-as="Mật khẩu"
        :append-icon="showPassword ? 'visibility_off' : 'visibility'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
        name="password"
        label="Mật khẩu"
        placeholder="......"
        autocomplete="off"
        v-model="login.password">
      </v-text-field>
      <v-card-actions class="mt-3 mb-3">
        <v-btn
          block
          :loading="isFetchingApi"
          :disabled="isFetchingApi"
          color="primary"
          type="submit"
          >
          Đăng nhập
        </v-btn>
      </v-card-actions>
      <!-- <a class="forgot-password" href="#" @click="forgotPassword"><i class="mr-2 fas fa-lock"></i> Quên mật khẩu?</a> -->
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      login: {
        username: '',
        password: ''
      },
      showPassword: false
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
            url: 'login',
            method: 'post',
            data: this.login,
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
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push({ name: 'home' })
      }
    },
    forgotPassword () {
    }
  },
  mounted () {

  }
}
</script>

<style lang="css" scoped>
.forgot-password {
  color: #797979 !important;
  text-decoration: none;
}
.forgot-password:hover {
  color: #343a40!important;
}
</style>
