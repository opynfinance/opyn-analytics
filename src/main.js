import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";
import axios from 'axios';
import VueAxios from 'vue-axios';
import Buefy from 'buefy';
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VueGoogleCharts from 'vue-google-charts'

Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(VueAxios, axios);
Vue.use(Chartkick.use(Chart));
Vue.use(vueNumeralFilterInstaller, { currency: 'USD', locale: 'en' });
Vue.use(require('vue-moment'));
Vue.use(VueLodash, { lodash: lodash })
Vue.use(VueGoogleCharts)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");