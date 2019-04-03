import Vue from 'vue'
import router from './js/router'
import store from './js/store'
import MainView from './index.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import likeLog from '../../../../other_modules/like-statistics/vuePlugins'

require('./css/reset.css')
require('../../../component/rem')

Vue.use(likeBase)
Vue.use(likeLog)

new Vue({
  el:"#app",
  router,
  store,
  render: c => c(MainView)
})
