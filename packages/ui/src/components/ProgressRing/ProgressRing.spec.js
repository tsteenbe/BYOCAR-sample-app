// SPDX-License-Identifier: MIT

import { expect } from "chai";
import { shallowMount, mount } from "@vue/test-utils";
import ProgressRing from "./ProgressRing.vue";
import { specHelpers } from "../../../tests/unit/before-all";

describe("ProgressRing.vue", () => {
  before(() => {
    specHelpers();
  });

  const propsData = {
    radius: 10,
    progress: 70,
    stroke: 2,
    icon: "gas-pump",
    text: "Fuel Status",
    toolTipTitle: "example title",
    dashboardItemValue: 20,
    ringColor: "#00adef",
  };

  it("should accept 'radius', 'progress', 'stroke', 'icon', 'text', 'ringColor', 'toolTipTitle' and 'dashboardItemValue' as props", () => {
    const wrapper = shallowMount(ProgressRing, {
      propsData: propsData,
    });
    expect(wrapper.props("radius")).to.equal(propsData.radius);
    expect(wrapper.props("progress")).to.equal(propsData.progress);
    expect(wrapper.props("stroke")).to.equal(propsData.stroke);
    expect(wrapper.props("icon")).to.equal(propsData.icon);
    expect(wrapper.props("text")).to.equal(propsData.text);
    expect(wrapper.props("toolTipTitle")).to.equal(propsData.toolTipTitle);
    expect(wrapper.props("vahicleData")).to.equal(propsData.vahicleData);
    expect(wrapper.props("ringColor")).to.equal(propsData.ringColor);
  });

  it("strokeDashoffset should calculate stroke-dashoffset", () => {
    const localThis = { circumference: 400, progress: 70 };
    expect(ProgressRing.computed.strokeDashoffset.call(localThis)).to.equal(
      120
    );
  });

  it("setIcon should return the expected config array", () => {
    const localThis = { icon: "fuel-tank" };
    expect(ProgressRing.computed.setIcon.call(localThis))
      .to.be.an("array")
      .that.includes("fas", "fuel-tank");
  });

  it("normalizedRadius and radius should be calculated as expected", () => {
    const wrapper = shallowMount(ProgressRing, {
      propsData: propsData,
    });
    expect(wrapper.vm.normalizedRadius).to.equal(6);
    expect(wrapper.vm.circumference).to.equal(37.69911184307752);
  });

  it("should display error when dashboardItemValue is a string", () => {
    const props = { ...propsData, dashboardItemValue: "No data available" };
    const wrapper = mount(ProgressRing, {
      propsData: props,
    });
    expect(wrapper.find(".error-tooltip-container").exists()).to.be.true;
  });

  it("should not display error when dashboardItemValue is 0", () => {
    const props = { ...propsData, dashboardItemValue: 0 };
    const wrapper = mount(ProgressRing, {
      propsData: props,
    });
    expect(wrapper.find(".error-tooltip-container").exists()).to.be.false;
  });
});
