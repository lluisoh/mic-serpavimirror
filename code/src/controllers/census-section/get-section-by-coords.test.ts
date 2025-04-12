import { describe, it, expect, vi, Mock } from "vitest";
import { getSectionByCoords, SectionByCoordsRequest } from "./get-section-by-coords";
import { findCensusSection } from "../../services/census-section.service";
import { Response, NextFunction } from "express";

vi.mock("../../services/census-section.service");
vi.mock("../../utils/read-census-data");

describe("getSectionByCoords", () => {
  const mockRequest = (query: any): Partial<SectionByCoordsRequest> => ({ query });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res;
  };
  const mockNext: NextFunction = vi.fn();

  it("should return 400 if lat or lon is missing", async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await getSectionByCoords(req as SectionByCoordsRequest, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required query parameters." });
  });

  it("should return 404 if no matching census section is found", async () => {
    const req = mockRequest({ lat: "40.7128", lon: "-74.0060" });
    const res = mockResponse();
    (findCensusSection as Mock).mockResolvedValue(null);

    await getSectionByCoords(req as SectionByCoordsRequest, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No matching census section found." });
  });

  it("should return the census section if found", async () => {
    const req = mockRequest({ lat: "40.7128", lon: "-74.0060" });
    const res = mockResponse();
    const mockSection = { id: 1, name: "Section A" };
    (findCensusSection as Mock).mockResolvedValue(mockSection);

    await getSectionByCoords(req as SectionByCoordsRequest, res as Response, mockNext);

    expect(res.json).toHaveBeenCalledWith({ section: mockSection });
  });

  it("should call next with an error if an exception occurs", async () => {
    const req = mockRequest({ lat: "40.7128", lon: "-74.0060" });
    const res = mockResponse();
    const error = new Error("Something went wrong");
    (findCensusSection as Mock).mockRejectedValue(error);

    await getSectionByCoords(req as SectionByCoordsRequest, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});