import axios from 'axios';

export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Geocodes a full address using the Nominatim API (OpenStreetMap).
 * @param address The full address string.
 * @returns Coordinates object or null if not found.
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'User-Agent': 'census-section-lookup/1.0 (luisponshernandez@gmail.com)',
      },
    });

    if (response.data.length === 0) return null;

    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  } catch (error) {
    console.error('Error during geocoding:', error);
    return null;
  }
}
