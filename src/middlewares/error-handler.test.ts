import request from "supertest";
import express from "express";
import { errorHandler } from "./error-handler";
import { AppError } from "../errors/app-error";
import { describe, it, expect, vi } from "vitest";

const app = express();

// Middleware to simulate errors
app.use((req, res, next) => {
  if (req.query.type === "known") {
    next(new AppError("Known error occurred", 400));
  } else if (req.query.type === "unknown") {
    next(new Error("Unknown error occurred"));
  } else {
    res.send("No error");
  }
});

// Error handler middleware
app.use(errorHandler);

describe("Error Handler Middleware", () => {
  it("should handle known errors and return the correct status and message", async () => {
    const response = await request(app).get("/?type=known");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: true,
      message: "Known error occurred",
    });
  });

  it("should handle unknown errors and return a 500 status with a generic message", async () => {
    const response = await request(app).get("/?type=unknown");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: true,
      message: "Internal Server Error",
    });
  });

  it("should not trigger the error handler if no error occurs", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("No error");
  });

  it('should log errors to the console if NODE_ENV is not "test"', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await request(app).get("/?type=unknown");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("❌ Error:"),
      "Unknown error occurred"
    );
    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('should not log errors to the console if NODE_ENV is "test"', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await request(app).get("/?type=unknown");

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
