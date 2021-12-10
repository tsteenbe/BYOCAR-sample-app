// SPDX-License-Identifier: MIT

import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Alert from "./Alert.vue";
import { specHelpers } from "../../../tests/unit/before-all";

describe("Alert.vue", () => {
  before(() => {
    specHelpers();
  });

  it("should display title and message from props", () => {
    const title = "example title";
    const message = "example message";
    const wrapper = shallowMount(Alert, {
      propsData: { title, message },
    });
    expect(wrapper.text()).to.include(title);
    expect(wrapper.text()).to.include(message);
  });
});
