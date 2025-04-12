import { describe, it, expect, vi, beforeEach } from "vitest";
import { getInitialPrice, InitialPriceRequest } from "./get-initial-price";
import { Request, Response, NextFunction } from "express";
import * as serpaviService from "../../services/serpavi.service";
import * as priceService from "../../services/price.service";

vi.mock("../../services/serpavi.service");
vi.mock("../../services/price.service");

describe("getInitialPrice", () => {
  const mockRequest = (query: any): Partial<Request> => ({ query });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res;
  };
  const mockNext: NextFunction = vi.fn();
  const sectionData = {
    p25: 10.782633928571428,
    p75: 17.568812417909747,
    smed: 72.5,
  };
  const initialPrice = {
    price: {
      lowerValue: 9.408454426167067,
      higherValue: 15.85174639840237,
    },
    details: {
      logFactor: 0.6818437980090029,
      lowerBase: 8.767246377321431,
      higherBase: 15.050543535034748,
      S: 100,
    },
  };

  it("should return the calculated price and details when debug is true", async () => {
    const params = { codsec: "123", surface: "100", debug: "true" };
    const req = mockRequest(params);
    const res = mockResponse();


    vi.spyOn(serpaviService, "getCodsecData").mockReturnValue(sectionData);
    vi.spyOn(priceService, "calculateInitialPrice").mockReturnValue(initialPrice);

    await getInitialPrice(
      req as InitialPriceRequest,
      res as Response,
      mockNext
    );

    expect(serpaviService.getCodsecData).toHaveBeenCalledWith("123");
    expect(priceService.calculateInitialPrice).toHaveBeenCalledWith({
      surface: "100",
      ...sectionData,
    });
    expect(res.json).toHaveBeenCalledWith(initialPrice);
  });

  it("should return the calculated price without details when debug flag is missing", async () => {
    const req = mockRequest({ codsec: "123", surface: "100" });
    const res = mockResponse();

    vi.spyOn(serpaviService, "getCodsecData").mockReturnValue(sectionData);
    vi.spyOn(priceService, "calculateInitialPrice").mockReturnValue(initialPrice);

    await getInitialPrice(
      req as InitialPriceRequest,
      res as Response,
      mockNext
    );

    expect(serpaviService.getCodsecData).toHaveBeenCalledWith("123");
    expect(priceService.calculateInitialPrice).toHaveBeenCalledWith({
      surface: "100",
      ...sectionData
    });
    expect(res.json).toHaveBeenCalledWith({ price: initialPrice.price, details: undefined });
  });

  it("should call next with an error if an exception occurs", async () => {
    const req = mockRequest({ codsec: "123", surface: "100" });
    const res = mockResponse();
    const error = new Error("Test error");

    vi.spyOn(serpaviService, "getCodsecData").mockImplementation(() => {
      throw error;
    });

    await getInitialPrice(
      req as InitialPriceRequest,
      res as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
