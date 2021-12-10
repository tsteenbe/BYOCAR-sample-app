// SPDX-License-Identifier: MIT

import ErrorToolTip from "@/components/ErrorToolTip/ErrorToolTip.vue";

/**
 * The Carousel component is an image slider using bootstrap carousel
 *
 * The component accepts:
 * carouselImages - accepts an array of images
 * toolTipTitle - message string in case of error
 */

export default {
  name: "Carousel",
  props: {
    carouselImages: Array,
    toolTipTitle: String,
  },
  components: {
    ErrorToolTip,
  },
};
