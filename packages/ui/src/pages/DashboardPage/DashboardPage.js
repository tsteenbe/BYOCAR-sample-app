// SPDX-License-Identifier: MIT

import Header from "@/components/Header/Header.vue";
import Carousel from "@/components/Carousel/Carousel.vue";
import ProgressRing from "@/components/ProgressRing/ProgressRing.vue";
import ErrorToolTip from "@/components/ErrorToolTip/ErrorToolTip.vue";
import Alert from "@/components/Alert/Alert.vue";

/**
 * The DashboardPage component is responsible to display the vehicle images
 * in the form of a carousel and the vehicle data using the progress rings.
 */

export default {
  name: "DashboardPage",
  components: {
    Header,
    Carousel,
    ProgressRing,
    ErrorToolTip,
    Alert,
  },
  data() {
    return {
      carouselImages: [],
      vehicleData: {},
      dashBoardData: {},
      dashboardItemValue: 0,
      alertMessage: "",
      showAlert: false,
      toolTipTitle: "could not load image",
    };
  },

  /**
   * On component mount -
   * Grab vehicleData from localStorage
   * Set vehicleData to appropriate component variables
   */

  mounted() {
    this.dashBoardData = JSON.parse(localStorage.getItem("vehicleData"));
    if (this.dashBoardData.message) {
      this.alertMessage = this.dashBoardData.message;
      this.showAlert = true;
    }
    this.carouselImages = this.dashBoardData.imageUrls;
    this.vehicleData = this.dashBoardData;
  },

  methods: {
    /**
     * Sets the appropriate ring color of the ProgressRing Component
     * #00adef - on error
     * #ff1414 - when data is available
     */

    setRingColor(data) {
      if (data === 0 || typeof data === "string") {
        return "#ff1414";
      }
      return "#00adef";
    },

    /**
     * Sets the progress prop of the ProgressRing Component
     */
    setProgress(data) {
      if (data === 0 || typeof data === "string") {
        return 100;
      } else {
        return parseInt(data);
      }
    },
  },
};
