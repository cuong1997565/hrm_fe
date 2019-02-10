import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: '#034694',
    secondary: '#005894',
    accent: '#0088C7',
    error: '#FF5252',
    info: '#2196F3',
    success: '#6EC05D',
    warning: '#FFC107'
  }
})
