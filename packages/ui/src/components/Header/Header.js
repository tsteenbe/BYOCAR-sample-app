// SPDX-License-Identifier: MIT

import router from "../../router";

/**
 * The Header component displays the App heading
 */

export default {
  name: "Header",
  methods: {
    navigateToStartPage() {
      const currentUrl = window.location.href;
      if (currentUrl.includes("dashboard")) {
        router.push({
          path: "/",
        });
      }
    },
  },
};
