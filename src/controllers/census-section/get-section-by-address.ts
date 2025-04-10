import { NextFunction, Request, Response } from "express";
import { AddressParams } from "../../types/section.types";
import { Coordinates, geocodeAddress } from "../../services/geocoder.service";
import { findCensusSection } from "../../services/census-section.service";

/**
 * Get the census section for a given address.
 */
export const getSectionByAddress = async (
  req: Request<{}, {}, {}, AddressParams>,
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

    if (!coords) {
      res.status(404).json({ error: "Address could not be geocoded." });
    }

    // Step 2: Match coordinates with census section
    const section = await findCensusSection(coords as Coordinates);

    if (!section) {
      res.status(404).json({ error: "No matching census section found." });
    }

    res.json({ section });
  } catch (error) {
    next(error);
  }
};
