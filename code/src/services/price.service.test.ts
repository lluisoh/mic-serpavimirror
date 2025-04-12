import { describe, it, expect } from "vitest";
import {
  calculateFinalPrice,
  calculateInitialPrice,
  calculateScore,
} from "./price.service";
import { ScoreParams } from "../types/price.types";
import { BadRequestError } from "../errors";

describe("calculateScore", () => {
  const params: ScoreParams = {
    constructionYear: "1979-2007",
    maintenance: "good",
    energyCertification: "G",
    floor: "3-4",
    conciergeServices: false,
    elevator: false,
    furnished: false,
    parking: false,
    pool: false,
    sharedAreas: false,
    specialViews: true,
  };
  it("returns the score for the given parameters", () => {
    const score1 = calculateScore(params);
    expect(score1).toBe(47.690000000000005);

    // With elevator
    params.elevator = true;
    const score2 = calculateScore(params);
    expect(score2).toBe(63.440000000000005);

    // With parking
    params.parking = true;
    const score3 = calculateScore(params);
    expect(score3).toBe(76.94);

    // With concierge services
    params.conciergeServices = true;
    const score4 = calculateScore(params);
    expect(score4).toBe(83.69);

    // With shared areas
    params.sharedAreas = true;
    const score5 = calculateScore(params);
    expect(score5).toBe(90.44);

    // With pool
    params.pool = true;
    const score6 = calculateScore(params);
    expect(score6).toBe(97.19);

    // With furnished
    params.furnished = true;
    const score7 = calculateScore(params);
    expect(score7).toBe(103.94);

    // With parking
    params.parking = true;
    const score8 = calculateScore(params);
    expect(score8).toBe(103.94);

    // With better energy certification
    params.energyCertification = "A";
    const score9 = calculateScore(params);
    expect(score9).toBe(105.2);

    // With better maintenance
    params.maintenance = "perfect";
    const score10 = calculateScore(params);
    expect(score10).toBe(113.95);

    // With better construction year
    params.constructionYear = "2008-2019";
    const score11 = calculateScore(params);
    expect(score11).toBe(116.5);

    // With better floor
    params.floor = "7+";
    const score12 = calculateScore(params);
    expect(score12).toBe(119.0);
  });

  it("throws an error if there are missing params", () => {
    expect(() => calculateScore({})).toThrow(
      new BadRequestError("Missing value for param 'maintenance'")
    );
  });

  it("throws an error if there some param has an invalid value", () => {
    expect(() =>
      calculateScore({
        ...params,
        constructionYear: "2000",
      } as unknown as ScoreParams)
    ).toThrow(
      new BadRequestError(
        "Invalid value for param 'constructionYear': '2000' (possible values are 2008-2019, 1979-2007, 1945-1978, 1918-1944, -1918)"
      )
    );
  });
});

describe("calculateInitialPrice", () => {
  it("returns the initial price range for the given parameters", () => {
    const params = {
      surface: "121",
      smed: 73,
      p25: 10.8,
      p75: 17.6,
    };
    const price = calculateInitialPrice(params);

    expect(price).toStrictEqual({
      price: {
        lowerValue: 9.450979265685286,
        higherValue: 15.924101803035215,
      },
      details: {
        lowerBase: 8.829781919999999,
        higherBase: 15.152383856000007,
        logFactor: 0.6847063013017902,
        S: 121,
      },
    });
  });
});

describe("calculateFinalPrice", () => {
  const params = {
    surface: "121",
    smed: 73,
    p25: 10.8,
    p75: 17.6,
    P: 47.79,
    corrected: "",
  };
  const expectedDetails = {
    initialLowerValue: 9.450979265685286,
    initialHigherValue: 15.924101803035215,
    originalHigherValue: 13.908238988939958,
    originalLowerValue: 9.515298179696288,
    lowerBase: 8.829781919999999,
    higherBase: 15.152383856000007,
    logFactor: 0.6847063013017902,
    S: 121,
  };
  it("returns the final price range for the given parameters", () => {
    const price = calculateFinalPrice(params);

    expect(price).toStrictEqual({
      price: {
        higherValue: 12.795579869824762,
        lowerValue: 8.754074325320586,
      },
      details: expectedDetails,
    });
  });
  it("returns the final price range without correction", () => {
    const price = calculateFinalPrice({ ...params, corrected: undefined });

    expect(price).toStrictEqual({
      price: {
        higherValue: expectedDetails.originalHigherValue,
        lowerValue: expectedDetails.originalLowerValue,
      },
      details: expectedDetails,
    });
  });
});
