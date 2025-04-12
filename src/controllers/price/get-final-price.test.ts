import { describe, it, expect, vi, beforeEach } from "vitest";
import { FinalPriceRequest, getFinalPrice } from "./get-final-price";
import { Request, Response, NextFunction } from "express";
import * as priceService from "../../services/price.service";
import * as serpaviService from "../../services/serpavi.service";

vi.mock("../../services/price.service");
vi.mock("../../services/serpavi.service");

describe("getFinalPrice", () => {
  const mockRequest = (query: any): Partial<FinalPriceRequest> => ({ query });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res;
  };
  const mockNext: NextFunction = vi.fn();
  const params = {
    codsec: "12345",
    surface: "100",
    unit: "€/month",
    debug: "",
    constructionYear: "-1917",
    hasElevator: "false",
    hasParking: "false",
  };
  const score = 32.19;
  const sectionData = {
    p25: 10.782633928571428,
    p75: 17.568812417909747,
    smed: 72.5,
  };
  const finalPrice = {
    price: {
      lowerValue: 11.110184557377322,
      higherValue: 15.867729349808635,
    },
    details: {
      originalLowerValue: 9.1819707085763,
      originalHigherValue: 13.113825908932757,
      initialLowerValue: 9.408454426167067,
      initialHigherValue: 15.85174639840237,
      logFactor: 0.6818437980090029,
      lowerBase: 8.767246377321431,
      higherBase: 15.050543535034748,
    },
  };

  it("should return 400 if required query parameters are missing", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await getFinalPrice(req as FinalPriceRequest, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing required query parameters.",
    });
  });

  it("should return the calculated final price", async () => {
    const req = mockRequest(params);
    const res = mockResponse();

    vi.spyOn(priceService, "calculateScore").mockReturnValue(score);
    vi.spyOn(serpaviService, "getCodsecData").mockReturnValue(sectionData);
    vi.spyOn(priceService, "calculateFinalPrice").mockReturnValue(finalPrice);

    await getFinalPrice(req as FinalPriceRequest, res as Response, mockNext);

    expect(priceService.calculateScore).toHaveBeenCalledWith({
      constructionYear: "-1917",
      hasElevator: "false",
      hasParking: "false",
    });
    expect(serpaviService.getCodsecData).toHaveBeenCalledWith("12345");
    expect(priceService.calculateFinalPrice).toHaveBeenCalledWith({
      ...sectionData,
      S: 100,
      P: score,
      corrected: undefined,
    });
    expect(res.json).toHaveBeenCalledWith({
      price: {
        lowerValue: finalPrice.price.lowerValue * 100,
        higherValue: finalPrice.price.higherValue * 100,
      },
      details: {
        ...finalPrice.details,
        score,
        ...sectionData,
      },
    });
  });

  it("should return the calculated final price per in €/m²/month", async () => {
    const req = mockRequest({ ...params, debug: undefined, unit: "€/m²/month" });
    const res = mockResponse();

    vi.spyOn(priceService, "calculateScore").mockReturnValue(score);
    vi.spyOn(serpaviService, "getCodsecData").mockReturnValue(sectionData);
    vi.spyOn(priceService, "calculateFinalPrice").mockReturnValue(finalPrice);

    await getFinalPrice(req as FinalPriceRequest, res as Response, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      price: {
        lowerValue: finalPrice.price.lowerValue,
        higherValue: finalPrice.price.higherValue,
      },
      details: undefined,
    });
  });

  it("should return the calculated final price without details when debug flag is missing", async () => {
    const req = mockRequest({ ...params, debug: undefined });
    const res = mockResponse();

    vi.spyOn(priceService, "calculateScore").mockReturnValue(score);
    vi.spyOn(serpaviService, "getCodsecData").mockReturnValue(sectionData);
    vi.spyOn(priceService, "calculateFinalPrice").mockReturnValue(finalPrice);

    await getFinalPrice(req as FinalPriceRequest, res as Response, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      price: {
        lowerValue: finalPrice.price.lowerValue * 100,
        higherValue: finalPrice.price.higherValue * 100,
      },
      details: undefined,
    });
  });

  it("should handle errors and call next with the error", async () => {
    const req = mockRequest({
      codsec: "12345",
      surface: "100",
    });
    const res = mockResponse();
    const error = new Error("Test error");

    vi.spyOn(priceService, "calculateScore").mockImplementation(() => {
      throw error;
    });

    await getFinalPrice(req as FinalPriceRequest, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
