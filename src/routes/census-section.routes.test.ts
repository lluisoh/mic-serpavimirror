import request from "supertest";
import express from "express";
import sectionRoutes from "./census-section.routes";
import { describe, it, expect, vi } from "vitest";

// vi.mock("../utils/read-census-data");

const app = express();
app.use(express.json());
app.use("/census-section", sectionRoutes);

describe("Census Section Routes", () => {
  describe("GET /census-section/by-address", () => {
    it("should return 200 and the section data when a valid address is provided", async () => {
      const response = await request(app).get("/census-section/by-address").query({
        street: "Avinguda República Argentina",
        number: "166",
        postalCode: "08023",
        municipality: "Barcelona",
        province: "Barcelona",
       });
      expect(response.status).toBe(200);
    });

    it("should return 404 when when no section is found with the given address", async () => {
      const response = await request(app).get("/census-section/by-address").query({
        street: "Not found street",
        number: "123",
        postalCode: "01001",
        municipality: "Barcelona",
        province: "Barcelona",
       });
      expect(response.status).toBe(404);
    });

    it("should return 400 when no address is provided", async () => {
      const response = await request(app).get("/census-section/by-address");
      expect(response.status).toBe(400);
    });
  });

  describe("GET /census-section/by-coords", () => {
    it("should return 200 and the section data when valid coordinates are provided", async () => {
      const response = await request(app).get("/census-section/by-coords").query({ lat: "41.41233311966451", lon: "2.1420714053307925" });
      expect(response.status).toBe(200);
    });

    it("should return 404 when no section is found with the given coordinates", async () => {
      const response = await request(app).get("/census-section/by-coords").query({ lat: "0", lon: "0" });
      expect(response.status).toBe(404);
    });

    it("should return 400 when no coordinates are provided", async () => {
      const response = await request(app).get("/census-section/by-coords");
      expect(response.status).toBe(400);
    });
  });
});