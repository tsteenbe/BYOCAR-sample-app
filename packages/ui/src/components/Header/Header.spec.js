// SPDX-License-Identifier: MIT

import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Header from "./Header.vue";
import { specHelpers } from "../../../tests/unit/before-all";

describe("Header.vue", () => {
  before(() => {
    specHelpers();
  });

  it("Displays the title correctly", () => {
    const title = "/My Mercedes-Benz";
    const wrapper = shallowMount(Header);
    expect(wrapper.text()).to.include(title);
  });
});
