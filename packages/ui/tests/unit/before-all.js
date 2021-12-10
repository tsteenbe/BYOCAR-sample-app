// SPDX-License-Identifier: MIT

import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
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

export const specHelpers = () => {
  library.add(
    faBatteryThreeQuarters,
    faTachometerAlt,
    faGasPump,
    faExclamationTriangle
  );
  Vue.component("font-awesome-icon", FontAwesomeIcon);
  Vue.use(BootstrapVue);
  Vue.use(IconsPlugin);
  Vue.config.productionTip = false;
};
