<template>
  <section>
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile
        avatar
        :to="{name: 'account-change-information'}"
        >
        <v-list-tile-avatar>
          <v-icon style="margin-left:-17px">fa-address-book</v-icon>
          <!-- <img :src="userProfile.avatar_url" alt=".name"> -->
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>
            <v-tooltip bottom>
              <span slot="activator" style="color:green">
                {{ userName }}
              </span>
              <span>{{userProfile.name}}</span>
            </v-tooltip>
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn
          icon
          @click.prevent.stop="setMiniDrawer(!miniDrawer)"
          >
          <v-icon>chevron_left</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</v-toolbar>

<v-list dense>
  <template v-for="(item, index) in items" v-if="canAccess(item.access_permission)">
    <v-layout
    v-if="item.heading"
    :key="item.heading"
    row
    align-center
    >
    <v-flex xs6>
      <v-subheader v-if="item.heading">
        {{ item.heading }}
      </v-subheader>
    </v-flex>
    <v-flex xs6 class="text-xs-center">
      <a href="#!" class="body-2 black--text">EDIT</a>
    </v-flex>
  </v-layout>
  <v-list-group
  v-else-if="item.children"
  v-model="item.model"
  :key="item.text"
  :prepend-icon="item.icon"
  append-icon="keyboard_arrow_down"
  :value="checkOpenGroup(item.children, index)"
  >
  <v-list-tile slot="activator">
    <v-list-tile-content>
      <v-list-tile-title>
        {{ item.text }}
      </v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
  <v-list-tile
  ripple
  v-for="(child, i) in item.children"
  :key="i"
  @click="$router.push(child.router)"
  :class="child.router.name === $route.name && 'grey lighten-2'"
  >
  <v-list-tile-action v-if="child.icon">
    <v-icon>{{ child.icon }}</v-icon>
  </v-list-tile-action>
  <v-list-tile-content>
    <v-list-tile-title>
      {{ child.text }}
    </v-list-tile-title>
  </v-list-tile-content>
</v-list-tile>
</v-list-group>
<v-list-tile v-else ripple :key="item.text" @click="$router.push(item.router)" :class="item.router.name === $route.name && 'grey lighten-2'">
  <v-list-tile-action>
    <v-icon>{{ item.icon }}</v-icon>
  </v-list-tile-action>
  <v-list-tile-content>
    <v-list-tile-title>
      {{ item.text }}
    </v-list-tile-title>
  </v-list-tile-content>
</v-list-tile>
</template>
</v-list>

</section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { vnFilter } from '@/helpers'
export default {
  name: 'GostoreNavigation',
  data () {
    return {
      items: [
        {
          icon: 'home',
          text: this.$t('title.home'),
          router: { name: 'home' },
          access_permission: true
        },
        {
          icon: 'fas fa-users',
          text: this.$t('title.employee.index'),
          children: [
            {
              icon: 'fas fa-user',
              text: this.$t('title.employee.index'),
              router: { name: 'employee' },
              access_permission: 'employee.view'
            },
            {
              icon: 'fas fa-file-contract',
              text: this.$t('title.contract.index'),
              router: { name: 'contract' },
              access_permission: 'contract.view'
            }
          ]
        },
        {
          icon: 'fas fa-briefcase',
          text: this.$t('title.positions.index'),
          children: [
            {
              icon: 'fas fa-code-branch',
              text: this.$t('title.branch.index'),
              router: { name: 'branch' },
              access_permission: 'branch.view'
            },
            {
              icon: 'far fa-building',
              text: this.$t('title.department.index'),
              router: { name: 'department' },
              access_permission: 'department.view'
            },
            {
              icon: 'fas fa-map-marker-alt',
              text: this.$t('title.position.index'),
              router: { name: 'position' },
              access_permission: 'position.view'
            }
          ]
        },
        {
          icon: 'fas fa-map-marker-alt',
          text: this.$t('title.setting.index'),
          router: { name: 'setting-hrm' },
          access_permission: 'setting.view'
        },
        {
          icon: 'far fa-building',
          text: this.$t('title.branch.index'),
          router: { name: 'branch-hrm' },
          access_permission: 'branch.view'
        },
        {
          icon: 'fas fa-map-marker-alt',
          text: this.$t('title.employees.index'),
          router: { name: 'employee-hrm' },
          access_permission: 'employees.view'
        },
        {
          icon: 'fa-address-card',
          text: this.$t('title.plans.plans'),
          router: { name: 'plans-hrm' },
          access_permission: 'plan.view'
        },
        // {
        //   icon: 'far fa-id-card',
        //   text: this.$t('title.candidate.index'),
        //   router: { name: 'candidate' },
        //   access_permission: 'candidate.view'
        // },
        {
          icon: 'fas fa-cogs',
          text: this.$t('title.config.index'),
          access_permission: 'config.view',
          children: [
            {
              icon: 'fas fa-cog',
              text: this.$t('title.setting.index'),
              router: { name: 'setting' },
              access_permission: 'setting.view'
            },
            // {
            //   icon: 'fa-key',
            //   text: this.$t('title.role.index'),
            //   router: { name: 'role' },
            //   access_permission: 'role.view'
            // },
            {
              icon: 'fas fa-users-cog',
              text: this.$t('title.user.index'),
              router: { name: 'user' },
              access_permission: 'user.view'
            }
          ]
        },
        {
          icon: 'fas fa-user-plus',
          text: this.$t('title.plan.index'),
          children: [
            {
              icon: 'fa-address-card',
              text: this.$t('title.plan.plan'),
              router: { name: 'plans' },
              access_permission: 'plan.view'
            },
            {
              icon: 'fas fa-microphone-alt',
              text: this.$t('title.plan.interview'),
              router: { name: '' },
              access_permission: ''
            },
            {
              icon: 'fa-id-card-alt',
              text: this.$t('title.plan.candidate'),
              router: { name: 'candidate' },
              access_permission: 'candidate.view'
            }
            // {
            //   icon: 'fa-id-card-alt',
            //   text: this.$t('title.plan.candidate'),
            //   router: { name: 'candidate' },
            //   access_permission: 'candidate.view'
            // }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['miniDrawer', 'userProfile']),
    userName () {
      return this.userProfile.name && this.userProfile.name.length > 13 ? vnFilter(this.userProfile.name).match(/\b(\w)/g).join('').toUpperCase() : this.userProfile.name
    }
  },
  methods: {
    ...mapActions(['setMiniDrawer']),
    checkOpenGroup (routers, index) {
      if (routers.length) {
        routers.forEach(router => {
          if (router.router.name === this.$route.name) {
            this.items[index].model = true
          }
        })
      }
    }
  }
}
</script>
<style>
.fa-cogs,.fa-users, .fa-user-plus{
  font-size:20px !important;
}
</style>
