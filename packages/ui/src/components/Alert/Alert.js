// SPDX-License-Identifier: MIT

/**
 * The Alert component is an alert to display error messages
 *
 * The component accepts:
 * title - title for the error
 * message - description about the error
 */

export default {
  name: "Alert",
  props: {
    title: String,
    message: String,
  },
};
