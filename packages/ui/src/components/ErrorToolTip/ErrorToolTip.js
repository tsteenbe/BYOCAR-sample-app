// SPDX-License-Identifier: MIT

/**
 * The ErrorToolTip is a combination of exclamation-triangle
 * and a hovering tooltip to display message in case of error.
 *
 * The component accepts:
 * toolTipTitle - message string about error
 * placement - the placement of the hovering tooltip
 */

export default {
  name: "ErrorToolTip",
  props: {
    toolTipTitle: String,
    placement: {
      type: String,
      default: "top",
    },
  },
  data() {
    return {
      toolTipConfig: Object.assign(
        {},
        {
          placement: this.placement,
          variant: "danger",
        }
      ),
    };
  },
};
