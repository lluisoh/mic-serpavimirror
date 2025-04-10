import fs from 'fs';
import path from 'path';
import { point } from '@turf/turf';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Coordinates } from './geocoder.service';
import { Feature, Polygon } from 'geojson';

let sectionsGeoJSON: Feature<Polygon>[] = [];

/**
 * Loads the census section GeoJSON into memory.
 * This is done once when the app starts.
 */
function loadCensusSections() {
  const filePath = path.resolve(__dirname, '../../data/census-sections.geojson');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const geojson = JSON.parse(rawData);

  if (!geojson.features || !Array.isArray(geojson.features)) {
    throw new Error('Invalid GeoJSON file.');
  }

  sectionsGeoJSON = geojson.features;
  console.log(`✅ Loaded ${sectionsGeoJSON.length} census sections`);
}

/**
 * Finds the census section that contains the given coordinates.
 * @param coords A point in [lat, lon]
 * @returns The matching census section's properties or null.
 */
export async function findCensusSection(coords: Coordinates): Promise<any | null> {
  const pt = point([coords.lon, coords.lat]);

  for (const feature of sectionsGeoJSON) {
    if (booleanPointInPolygon(pt, feature)) {
      return feature.properties;
    }
  }

  return null;
}

// Load census sections once at startup
loadCensusSections();
