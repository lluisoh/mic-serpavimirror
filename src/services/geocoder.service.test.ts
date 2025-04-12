import { describe, it, expect, vi, Mock } from 'vitest';
import axios from 'axios';
import { geocodeAddress } from './geocoder.service';
import { BadRequestError, NotFoundError } from '../errors';

vi.mock('axios');

describe('geocodeAddress', () => {
  const address = {
    street: 'Some street',
    number: '123',
    postalCode: '08001',
    municipality: 'Barcelona',
    province: 'Barcelona',
  };

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

    const result = await geocodeAddress(address);

    expect(result).toEqual({ lat: 40.7128, lon: -74.006 });
    expect(axios.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search', {
      params: {
        q: 'Some street 123, 08001, Barcelona, Barcelona, España',
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'User-Agent': 'census-section-lookup/1.0 (luisponshernandez@gmail.com)',
      },
    });
  });

  it('should throw a BadRequest when there are missing params', async () => {
    const mockResponse = { data: [] };
    (axios.get as Mock).mockResolvedValue(mockResponse);

    await expect(geocodeAddress({})).rejects.toThrow(new BadRequestError("[Geocoder] Missing required query parameters."));
  });

  it('should throw NotFoundError when no results are found', async () => {
    const mockResponse = { data: [] };
    (axios.get as Mock).mockResolvedValue(mockResponse);

    await expect(geocodeAddress({ ...address, street: "unkown" })).rejects.toThrow(new NotFoundError("[Geocoder] Address not found."));
  });

  it('should handle API errors gracefully', async () => {
    (axios.get as Mock).mockRejectedValue(new Error('API Error'));

    await expect(geocodeAddress(address)).rejects.toThrow('API Error');
  });
});