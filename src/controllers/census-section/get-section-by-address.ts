import { NextFunction, Request, Response } from "express";
import { AddressParams } from "../../types/section.types";
import { Coordinates, geocodeAddress } from "../../services/geocoder.service";
import { findCensusSection } from "../../services/census-section.service";

export type SectionByAddressRequest = Request<{}, {}, {}, AddressParams>;

/**
 * Get the census section for a given address.
 */
export const getSectionByAddress = async (
  req: SectionByAddressRequest,
  res: Response,
  next: NextFunction
) => {
  const { street, number, postalCode, municipality, province } = req.query;

  if (!street || !number || !postalCode || !municipality || !province) {
    res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    // Step 1: Geocode the full address to get coordinates
    const fullAddress = `${street} ${number}, ${postalCode}, ${municipality}, ${province}, España`;
    const coords = await geocodeAddress(fullAddress);

    // Step 2: Match coordinates with census section
    const section = await findCensusSection(coords as Coordinates);

    res.json({ section });
  } catch (error) {
    next(error);
  }
};
