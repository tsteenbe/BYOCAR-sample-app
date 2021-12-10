// SPDX-License-Identifier: MIT

import { expect } from "chai";
import DashboardPage from "./DashboardPage.vue";
import { specHelpers } from "../../../tests/unit/before-all";

describe("DashboardPage.vue", () => {
  before(() => {
    specHelpers();
  });

  it("should set ring color to #ff1414 in case of error", () => {
    const color = "#ff1414";
    const data = "No data available";
    expect(DashboardPage.methods.setRingColor(data)).to.equal(color);
  });

  it("should set ring color to #ff1414 in case of 0", () => {
    const color = "#ff1414";
    const data = 0;
    expect(DashboardPage.methods.setRingColor(data)).to.equal(color);
  });

  it("should set ring color to #00adef in case of number > 0", () => {
    const color = "#00adef";
    const data = 50;
    expect(DashboardPage.methods.setRingColor(data)).to.equal(color);
  });

  it("should set progress to 100 in case of error", () => {
    const data = "No data available";
    expect(DashboardPage.methods.setProgress(data)).to.equal(100);
  });

  it("should set progress to 100 in case of 0", () => {
    const data = 0;
    expect(DashboardPage.methods.setProgress(data)).to.equal(100);
  });

  it("should set ring color to #00adef in case of number > 0", () => {
    const data = 50;
    expect(DashboardPage.methods.setProgress(data)).to.equal(data);
  });
});
