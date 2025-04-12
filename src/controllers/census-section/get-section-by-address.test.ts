import { describe, it, expect, vi, Mock } from "vitest";
import { getSectionByAddress, SectionByAddressRequest } from "./get-section-by-address";
import { Request, Response, NextFunction } from "express";
import { geocodeAddress } from "../../services/geocoder.service";
import { findCensusSection } from "../../services/census-section.service";

vi.mock("../../services/geocoder.service");
vi.mock("../../services/census-section.service");
vi.mock("../../utils/read-census-data");

describe("getSectionByAddress", () => {
  const mockRequest = (query: any): Partial<Request> => ({ query });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res;
  };
  const mockNext: NextFunction = vi.fn();

  it("should return the census section if found", async () => {
    const req = mockRequest({
      street: "Main St",
      number: "123",
      postalCode: "12345",
      municipality: "TestCity",
      province: "TestProvince",
    });
    const res = mockResponse();

    const mockCoords = { lat: 1, lng: 2 };
    const mockSection = { id: "section-1", name: "Test Section" };

    (geocodeAddress as Mock).mockResolvedValue(mockCoords);
    (findCensusSection as Mock).mockResolvedValue(mockSection);

    await getSectionByAddress(req as SectionByAddressRequest, res as Response, mockNext);

    expect(res.json).toHaveBeenCalledWith({ section: mockSection });
  });

  it("should call next with an error if an exception occurs", async () => {
    const req = mockRequest({
      street: "Main St",
      number: "123",
      postalCode: "12345",
      municipality: "TestCity",
      province: "TestProvince",
    });
    const res = mockResponse();
    const error = new Error("Test error");

    (geocodeAddress as Mock).mockRejectedValue(error);

    await getSectionByAddress(req as SectionByAddressRequest, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

// We recommend installing an extension to run vitest tests.
