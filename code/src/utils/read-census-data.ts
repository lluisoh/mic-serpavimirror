import fs from "fs";
import path from "path";
import { AppError } from "../errors";

/**
 * Loads the census section GeoJSON into memory.
 * This is done once when the app starts.
 */
export const readCensusData = () => {
  const filePath = path.resolve(
    __dirname,
    "../../../data/census-sections.geojson"
  );
  const rawData = fs.readFileSync(filePath, "utf-8");
  const geojson = JSON.parse(rawData);

  if (!geojson.features || !Array.isArray(geojson.features)) {
    throw new AppError("Invalid GeoJSON file.");
  }

  return geojson.features;
}