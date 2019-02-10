import Vue from 'vue'
import VeeValidate from 'vee-validate'
import vi from 'vee-validate/dist/locale/vi'
import en from 'vee-validate/dist/locale/en'

Vue.use(VeeValidate, {
  locale: 'vi',
  dictionary: { vi, en }
})
