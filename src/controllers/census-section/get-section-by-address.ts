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
  try {
    // Step 1: Geocode the full address to get coordinates
    const coords = await geocodeAddress(req.query);

    // Step 2: Match coordinates with census section
    const section = await findCensusSection(coords as Coordinates);

    res.json({ section });
  } catch (error) {
    next(error);
  }
};
