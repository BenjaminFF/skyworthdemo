// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Icon from 'vue-svg-icon/Icon.vue';
import axios from 'axios'
import basefunc from './baseFunc'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(basefunc)

Vue.config.productionTip = false
Vue.component('icon', Icon);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
