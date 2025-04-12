import { describe, it, expect, vi, Mock } from 'vitest';
import axios from 'axios';
import { geocodeAddress } from './geocoder.service';
import { NotFoundError } from '../errors';

vi.mock('axios');

describe('geocodeAddress', () => {
  it('should return coordinates when a valid address is provided', async () => {
    const mockResponse = {
      data: [
        {
          lat: '40.7128',
          lon: '-74.0060',
        },
      ],
    };
    (axios.get as Mock).mockResolvedValue(mockResponse);

    const address = 'New York, NY';
    const result = await geocodeAddress(address);

    expect(result).toEqual({ lat: 40.7128, lon: -74.006 });
    expect(axios.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search', {
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
  });

  it('should throw NotFoundError when no results are found', async () => {
    const mockResponse = { data: [] };
    (axios.get as Mock).mockResolvedValue(mockResponse);

    await expect(geocodeAddress("")).rejects.toThrow(new NotFoundError("[Geocoder] Address not found."));
  });

  it('should handle API errors gracefully', async () => {
    (axios.get as Mock).mockRejectedValue(new Error('API Error'));

    await expect(geocodeAddress("")).rejects.toThrow('API Error');
  });
});