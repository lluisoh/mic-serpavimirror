import { describe, it, expect, vi } from "vitest";
import { NotFoundError } from "../errors";
import { findCensusSection } from "./census-section.service";

vi.mock("../utils/read-census-data");

describe("findCensusSection", () => {
  it("returns the census section for a matching point", async () => {
    const result = await findCensusSection({ lat: 5, lon: 5 });
    expect(result).toEqual({ codsec: "1234" });
  });

  it("throws NotFoundError for a point outside all polygons", async () => {
    await expect(findCensusSection({ lat: 50.0, lon: 0.0 })).rejects.toThrow(
      NotFoundError
    );
  });
});
