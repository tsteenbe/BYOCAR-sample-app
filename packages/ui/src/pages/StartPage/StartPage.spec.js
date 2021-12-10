// SPDX-License-Identifier: MIT

import { expect } from "chai";
import StartPage from "./StartPage.vue";
import { specHelpers } from "../../../tests/unit/before-all";

describe("StartPage.vue", () => {
  before(() => {
    specHelpers();
  });

  it("should validate VIN: In case of invalid VIN", () => {
    const localThis = { vehicleId: "WDB111111ZZZ2222", errorMessage: "xyz" };
    StartPage.methods.validateVin.call(localThis);
    expect(localThis.errorMessage).to.equal("Please enter a valid VIN");
  });

  it("should validate VIN: In case of empty VIN", () => {
    const localThis = { vehicleId: "", errorMessage: "xyz" };
    StartPage.methods.validateVin.call(localThis);
    expect(localThis.errorMessage).to.equal("Please enter a valid VIN");
  });
});
