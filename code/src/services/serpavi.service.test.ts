import { describe, it, expect } from "vitest";
import { getCodsecData } from "./serpavi.service";
import { NotFoundError } from "../errors";

describe("getCodsecData", () => {
  it("returns codsec data for a valid code", () => {
    const row = getCodsecData("0801906007");
    expect(row).toHaveProperty("p25");
    expect(row).toHaveProperty("p75");
    expect(row).toHaveProperty("smed");
  });

  it("throws an error for an invalid code", () => {
    expect(() => getCodsecData("INVALID")).toThrow(new NotFoundError("Codsec INVALID not found"));
  });
});
