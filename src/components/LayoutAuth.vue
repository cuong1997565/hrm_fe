<template>
  <v-app>
    <v-navigation-drawer
      width="230"
      fixed
      v-model="drawer"
      app
      :mini-variant.sync="miniDrawerState"
    >
      <navigation />
    </v-navigation-drawer>
    <v-toolbar
      class="primary header-background"
      dark
      dense
      app
    >
      <v-toolbar-title style="width: 300px" class="ml-0 display-flex align-items-center">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <img
          class="mr-2"
          width="25"
          src="../assets/logo.png"
          alt="Gostore"
        >
        <span class="hidden-sm-and-down">HRM</span>
      </v-toolbar-title>
      <breadcrumb class="hidden-sm-and-down" />
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn> -->
      <v-menu offset-y>
        <v-btn icon slot="activator">
          <v-icon>settings</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            :to="{name: 'account-change-information'}"
          >
            <v-list-tile-action style="min-width: 25px;">
              <i class="fa fa-user"></i>
            </v-list-tile-action>
            <v-list-tile-title>Thông tin cá nhân</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            :to="{name: 'account-change-password'}"
          >
            <v-list-tile-action style="min-width: 25px;">
              <i class="fa fa-key"></i>
            </v-list-tile-action>
            <v-list-tile-title>Đổi mật khẩu</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="logout"
          >
            <v-list-tile-action style="min-width: 25px;">
              <i class="fa fa-sign-out-alt"></i>
            </v-list-tile-action>
            <v-list-tile-title>Đăng xuất</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <div class="scroll-container">
        <v-slide-x-transition>
            <router-view />
        </v-slide-x-transition>
      </div>
    </v-content>

    <delete-message />

  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Navigation from './Navigation'
import Breadcrumb from './Breadcrumb'
import DeleteMessage from './DeleteMessage'
export default {
  components: {
    Navigation,
    Breadcrumb,
    DeleteMessage
  },
  computed: {
    ...mapGetters(['miniDrawer', 'drawerModel']),
    drawer: {
      get () {
        return this.drawerModel
      },
      set (value) {
        this.setDrawer(value)
      }
    },
    miniDrawerState: {
      get () {
        return this.miniDrawer
      },
      set (value) {
        this.setMiniDrawer(value)
      }
    }
  },
  methods: {
    ...mapActions(['setMiniDrawer', 'setDrawer', 'clearLogged']),
    logout () {
      this.clearLogged()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
 <style lang="css" scoped>
  .scroll-container {
    height: calc(100vh - 48px);
    overflow-y: auto;
    overflow-x: hidden;
    background: #f4f6f9;
  }
</style>
