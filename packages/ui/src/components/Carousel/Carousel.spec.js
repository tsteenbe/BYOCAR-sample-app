// SPDX-License-Identifier: MIT

import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Carousel from "./Carousel.vue";
import { specHelpers } from "../../../tests/unit/before-all";

describe("Carousel.vue", () => {
  before(() => {
    specHelpers();
  });

  it("should accept 'carouselImages' and 'toolTipTitle' as props", () => {
    const propsData = {
      carouselImages: ["imageurl1", "imageurl2"],
      toolTipTitle: "example title",
    };
    const wrapper = shallowMount(Carousel, {
      propsData: propsData,
    });
    expect(wrapper.props("carouselImages"))
      .to.be.an("array")
      .that.includes("imageurl1", "imageurl2");
    expect(wrapper.props("toolTipTitle")).to.equal(propsData.toolTipTitle);
  });

  it("should display error + placeholder image carouselImages is empty", () => {
    const carouselImages = [];
    const wrapper = shallowMount(Carousel, {
      propsData: { carouselImages },
    });
    expect(wrapper.find(".carousel-tooltip").exists()).to.be.true;
    expect(wrapper.find(".placeholder-image").exists()).to.be.true;
  });

  it("should display error + placeholder image when carouselImages is undefined", () => {
    const carouselImages = undefined;
    const wrapper = shallowMount(Carousel, {
      propsData: { carouselImages },
    });
    expect(wrapper.find(".carousel-tooltip").exists()).to.be.true;
    expect(wrapper.find(".placeholder-image").exists()).to.be.true;
  });

  it("should not display/placeholder image error when carouselImages has data", () => {
    const carouselImages = ["imageurl1", "imageurl2", "imageurl3", "imageurl4"];
    const wrapper = shallowMount(Carousel, {
      propsData: { carouselImages },
    });
    expect(wrapper.find(".carousel-tooltip").exists()).to.be.false;
    expect(wrapper.find(".placeholder-image").exists()).to.be.false;
  });
});
