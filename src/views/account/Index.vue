<template>
  <v-app>
    <div class="">
      <div class="account-pages"></div>
      <v-content>
          <v-container fluid fill-height>
            <v-layout align-center justify-center>
              <v-flex xs12 class="wrapper-page">
                <v-card class="card-box">
                  <div v-if="tab === 'login'">
                    <div class="panel-heading">
                      <h4 class="text-center"> Đăng nhập vào <strong>HRM</strong></h4>
                    </div>
                    <v-card flat>
                      <v-card-text class="p-20">
                        <login />
                      </v-card-text>
                    </v-card>
                  </div>
                  <div v-else>
                    <div class="panel-heading">
                      <h4 class="text-center"> Đăng ký đến <strong>HRM</strong></h4>
                    </div>
                    <v-card flat>
                      <v-card-text class="p-20">
                        <register />
                      </v-card-text>
                    </v-card>
                  </div>
                </v-card>
                <div class="white--text ">
                  <p class="text-center" v-if="tab === 'login'">
                    Bạn chưa có tài khoản?
                    <a class="white--text" @click.prevent="tab = 'register'">
                      <b>Đăng ký</b>
                    </a>
                  </p>
                  <p class="text-center" v-else>
                    Bạn đã có tài khoản?
                    <a class="white--text" @click.prevent="tab = 'login'">
                      <b>Đăng nhập</b>
                    </a>
                  </p>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import Login from './Login'
import Register from './Register'
import { mapActions } from 'vuex'
export default {

  name: 'LoginRegister',

  data () {
    return {
      tab: 'login',
      fbSignInParams: {
        scope: 'email,user_likes',
        return_scopes: true
      }
    }
  },
  components: {
    Login,
    Register
  },
  methods: {
    ...mapActions('Account', ['loginFacebook']),
    ...mapActions(['showNotify', 'setLogged', 'getProfile']),
    onSignInFacebookSuccess (response) {
      window.FB.api('/me?fields=email,name', me => {
        let params = {
          provider_user_id: me.id,
          name: me.name,
          email: me.email
        }
        this.loginFacebook({
          params: params,
          cb: this.loggedSuccess
        })
        console.log(me)
      })
    },
    onSignInFacebookError (error) {
      console.log('OH NOES', error)
    },
    loggedSuccess (response) {
      this.setLogged(response)
      this.getProfile({ params: { include: 'roles' } })
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  },
  watch: {
    tab: {
      handler: function (value) {
        this.$router.replace({
          hash: value
        })
      },
      deep: true
    }
  },
  mounted () {
    let hashTag = this.$route.hash.substr(1) || ''
    if (hashTag === 'register') {
      this.tab = 'register'
    } else {
      this.tab = 'login'
    }
  }
}
</script>

<style lang="css" scoped>
.scroll-container {
  height: 100vh;
  overflow-y: auto;
  background: #f4f6f9;
}
.account-pages {
  background: url(../../assets/bg.png);
  position: absolute;
  background-size: cover;
  height: 100%;
  width: 100%;
  top: 0;
}
.wrapper-page {
  position: relative;
  max-width: 420px;
  margin-top: 30px;
}
.card-box {
  border: 1px solid rgba(54, 64, 74, 0.1);
  padding: 20px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  margin-bottom: 30px;
  background-clip: padding-box;
  background-color: #ffffff;
}
.panel-heading h4 {
  font-size: 2rem;
  font-weight: 400;
}
.p-20 {
  padding: 20px;
}
.btn-shadow {
  transition: all 0.3s ease-out;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.btn-shadow:hover {
  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15)
}
.login-social h5 {
  font-size: 18px;
  text-align: center;
}
.login-social-button {
  display: flex;
  justify-content: center;
  padding: 10px;
}
.icon-facebook {
  padding-right: 15px;
}
.fb-signin-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 16px;
  background-color: #4267b2;
  color: #fff;
  cursor: pointer;
}
</style>
<style>
  /*.card-box .v-label--active {
    color: #007bff !important;
  }
  .card-box .v-input__icon .primary--text {
    color: #007bff !important;
  }
  .card-box .v-input__slot:after {
    border-color: #007bff;
  }*/
</style>
