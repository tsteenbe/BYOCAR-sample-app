// SPDX-License-Identifier: MIT

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import VueAxios from "vue-axios";
import {
  faBatteryThreeQuarters,
  faTachometerAlt,
  faGasPump,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

library.add(
  faBatteryThreeQuarters,
  faTachometerAlt,
  faGasPump,
  faExclamationTriangle
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
