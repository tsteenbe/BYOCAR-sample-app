// SPDX-License-Identifier: MIT

import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import ErrorToolTip from "./ErrorToolTip.vue";
import { specHelpers } from "../../../tests/unit/before-all";

describe("ErrorToolTip.vue", () => {
  before(() => {
    specHelpers();
  });

  it("should accept 'title' and 'placement' as props", () => {
    const toolTipTitle = "example title";
    const placement = "top";
    const wrapper = shallowMount(ErrorToolTip, {
      propsData: { toolTipTitle, placement },
    });
    expect(wrapper.props("toolTipTitle")).to.be.equal(toolTipTitle);
    expect(wrapper.props("placement")).to.be.equal(placement);
  });

  it("should use the value 'top' for 'placement' when it is not provided", () => {
    const wrapper = shallowMount(ErrorToolTip);
    expect(wrapper.props("placement")).to.equal("top");
  });

  it("should build the expected toolTipConfig using the passed props", () => {
    const toolTipTitle = "example title";
    const placement = "top";
    const wrapper = shallowMount(ErrorToolTip, {
      propsData: { toolTipTitle, placement },
    });
    expect(wrapper.vm.toolTipConfig).to.deep.include({
      placement: placement,
      variant: "danger",
    });
  });
});
