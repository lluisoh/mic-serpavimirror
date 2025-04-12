import axios from "axios";
import { BadRequestError, NotFoundError } from "../errors";
import { AddressParams } from "../types/section.types";

export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Geocodes a full address using the Nominatim API (OpenStreetMap).
 * @param params Address query params.
 * @returns Coordinates object or null if not found.
 */
export async function geocodeAddress(params: Partial<AddressParams>): Promise<Coordinates> {

  const { street, number, postalCode, municipality, province } = params;

  if (!street || !number || !postalCode || !municipality || !province) {
    throw new BadRequestError("[Geocoder] Missing required query parameters.");
  }

  const address = `${street} ${number}, ${postalCode}, ${municipality}, ${province}, España`;

  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        "User-Agent": "census-section-lookup/1.0 (luisponshernandez@gmail.com)",
      },
    }
  );

  if (response.data.length === 0) {
    throw new NotFoundError("[Geocoder] Address not found.");
  }

  const { lat, lon } = response.data[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}
