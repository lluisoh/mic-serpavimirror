import { point } from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { Coordinates } from "./geocoder.service";
import { Feature, Polygon } from "geojson";
import { NotFoundError } from "../errors";
import { readCensusData } from "../utils/read-census-data";

let sectionsGeoJSON: Feature<Polygon>[] = [];

function loadCensusData() {
  sectionsGeoJSON = readCensusData();
  console.log(`✅ Loaded ${sectionsGeoJSON.length} census sections`);
}

/**
 * Finds the census section that contains the given coordinates.
 * @param coords A point in [lat, lon]
 * @returns The matching census section's properties.
 */
export async function findCensusSection(coords: Coordinates) {
  const pt = point([coords.lon, coords.lat]);

  for (const feature of sectionsGeoJSON) {
    if (booleanPointInPolygon(pt, feature)) {
      return feature.properties;
    }
  }

  throw new NotFoundError("[CensusSection] No matching census section found.");
}

// Load census sections once at startup
loadCensusData();
