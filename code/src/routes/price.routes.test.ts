import request from "supertest";
import express from "express";
import priceRoutes from "./price.routes";
import { describe, expect, it } from "vitest";

const app = express();
app.use(express.json());
app.use("/price", priceRoutes);

describe("Price Routes", () => {
  describe("GET /price/initial", () => {
    it("should return the initial price", async () => {
      const response = await request(app).get("/price/initial").query({
        codsec: "0801906007",
        surface: 121,
      });
      expect(response.status).toBe(200);
    });
    it("should return 400 status if there are missing params", async () => {
      const response = await request(app).get("/price/initial").query({
        codsec: "0801906007",
      });
      expect(response.status).toBe(400);
    });
    it("should return 404 status if codsec is not found", async () => {
      const response = await request(app).get("/price/initial").query({
        codsec: "1234567",
        surface: 121,
      });
      expect(response.status).toBe(404);
    });
  });
  describe("GET /price/final", () => {
    const params = {
      codsec: "0801906007",
      surface: 121,
      maintenance: "regular",
      floor: "3-4",
      constructionYear: "1979-2007",
      energyCertification: "G",
      elevator: "false",
      parking: "false",
      furnished: "false",
      sharedAreas: "false",
      pool: "false",
      conciergeServices: "false",
      specialViews: "false",
    };
    it("should return the final price", async () => {
      const response = await request(app).get("/price/final").query(params);
      expect(response.status).toBe(200);
    });
    it("should return 400 status if there are missing params", async () => {
      const response = await request(app).get("/price/final").query({ ...params, codsec: undefined });
      expect(response.status).toBe(400);
    });
    it("should return 404 status if codsec is not found", async () => {
      const response = await request(app).get("/price/final").query({ ...params, codsec: "1234567" });
      expect(response.status).toBe(404);
    });
  });
});
