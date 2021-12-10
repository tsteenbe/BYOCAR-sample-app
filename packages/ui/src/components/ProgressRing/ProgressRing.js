// SPDX-License-Identifier: MIT

import ErrorToolTip from "@/components/ErrorToolTip/ErrorToolTip.vue";

/**
 * The ProgressRing displays a calculated arc in percentage to showcase the data.
 *
 * The component accepts:
 * radius - the radius of the ring
 * progress - accepts a number which paints the percentage of the arc to display
 * stroke - the stroke-dashoffset
 * icon - the icon-class from
 * text - the title of the ring
 * dashboardItemValue - the value to be displayed in the ring
 * toolTipTitle - message string in case of error
 * ringColor -the color of the ring
 */

export default {
  name: "ProgressRing",
  components: {
    ErrorToolTip,
  },
  props: {
    radius: Number,
    progress: Number,
    stroke: Number,
    icon: String,
    text: String,
    dashboardItemValue: Number,
    toolTipTitle: String,
    ringColor: String,
  },
  data() {
    const normalizedRadius = this.radius - this.stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    return {
      normalizedRadius,
      circumference,
    };
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - (this.progress / 100) * this.circumference;
    },
    setIcon() {
      return ["fas", this.icon];
    },
  },
};
