import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { readCensusData } from "./read-census-data";
import { AppError } from "../errors";

vi.mock("fs");
vi.mock("path");

describe("readCensusData", () => {
  const mockFilePath = "/mock/path/census-sections.geojson";
  const mockGeoJSON = {
    features: [{ id: 1 }, { id: 2 }]
  };

  beforeEach(() => {
    vi.spyOn(path, "resolve").mockReturnValue(mockFilePath);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should read and parse the GeoJSON file correctly", () => {
    vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockGeoJSON));

    const result = readCensusData();

    expect(path.resolve).toHaveBeenCalledWith(
      __dirname,
      "../../../data/census-sections.geojson"
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, "utf-8");
    expect(result).toEqual(mockGeoJSON.features);
  });

  it("should throw an error if the GeoJSON file is invalid", () => {
    vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify({}));

    expect(() => readCensusData()).toThrow(AppError);
    expect(() => readCensusData()).toThrow("Invalid GeoJSON file.");
  });

  it("should throw an error if the file content is not valid JSON", () => {
    vi.spyOn(fs, "readFileSync").mockReturnValue("invalid-json");

    expect(() => readCensusData()).toThrow(SyntaxError);
  });
});