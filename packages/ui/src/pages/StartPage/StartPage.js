// SPDX-License-Identifier: MIT

import Header from "@/components/Header/Header.vue";
import ErrorToolTip from "@/components/ErrorToolTip/ErrorToolTip.vue";
import Alert from "@/components/Alert/Alert.vue";
import { config } from "../../config";
import router from "../../router";
import axios from "axios";

/**
 * The StartPage component has an input form for the VIN. It initiates the
 * OAuth flow and navigates to the dashboard page
 */

export default {
  name: "StartPage",
  components: {
    Header,
    Alert,
    ErrorToolTip,
  },
  data() {
    return {
      vehicleId: "",
      errorMessage: "",
      alertMessage: "",
      isSubmitted: false,
      showLoader: false,
      showAlert: false,
      code: "",
    };
  },

  /**
   * On component mount, mounted -
   * Grabs Auth code from the url
   * Clears the auth code from the url
   * call getDashboardData
   */
  mounted() {
    if (this.$route.query.code !== undefined) {
      this.code = this.$route.query.code;
      window.history.pushState({}, "", "/");
      this.vehicleId = localStorage.getItem("vehicleId");
      localStorage.removeItem("vehicleId");
      this.getDashboardData();
    }
  },

  /**
   * Call validateVin when vehicleId is updated
   */

  watch: {
    vehicleId(value) {
      this.vehicleId = value;
      this.validateVin(value);
    },
  },

  methods: {
    /**
     * Validates the vehicleId(VIN) on user input
     */

    validateVin() {
      if (
        !this.vehicleId ||
        !(/^([a-z0-9]+$)/i.test(this.vehicleId) && this.vehicleId.length === 17)
      ) {
        this.errorMessage = "Please enter a valid VIN";
      } else {
        this.errorMessage = "";
      }
    },

    /**
     * Makes post request to fetch dashboard data
     * Navigates to dashboard page after data is recieved
     */
    async getDashboardData() {
      this.setAlertMessage();
      if (!this.errorMessage && this.vehicleId.length === 17) {
        try {
          this.showLoader = true;
          const vehicleData = await axios.get(
            `${config.API_URL}/vehicle/${this.vehicleId}`,
            {
              headers: { 'X-Authorization-Code': this.code },
            }
          );
          if (vehicleData.status === 200) {
            localStorage.setItem(
              "vehicleData",
              JSON.stringify(vehicleData.data)
            );
            router.push({
              path: "dashboard",
            });
          }
        } catch ({ response }) {
          const msg =
            response && response.data.message
              ? response.data.message
              : "Something went wrong, please try again later :(";
          this.setAlertMessage(msg);
          this.showLoader = false;
        }
      }
      this.showLoader = false;
    },

    /**
     * Triggers the Authorization code flow when user submits the VIN
     */
    async authenticateUser() {
      if (!this.errorMessage && this.vehicleId.length === 17) {
        this.showLoader = true;
        localStorage.setItem("vehicleId", this.vehicleId);
        window.location.href = `${config.OAUTH_URL}?response_type=code&client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URI}&scope=${config.SCOPE}`;
      } else {
        this.errorMessage = "Please enter a valid VIN";
      }
    },
    setAlertMessage(msg = "") {
      this.alertMessage = msg;
    },
  },
};
