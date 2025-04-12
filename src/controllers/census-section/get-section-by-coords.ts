import { NextFunction, Request, Response } from "express";
import { CoordinatesParams } from "../../types/section.types";
import { findCensusSection } from "../../services/census-section.service";

export type SectionByCoordsRequest = Request<{}, {}, {}, CoordinatesParams>;

/**
 * Get the census section for a given set of coordinates.
 */
export const getSectionByCoords = async (req: SectionByCoordsRequest, res: Response, next: NextFunction) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
    const section = await findCensusSection(coords);

    if (!section) {
      res
        .status(404)
        .json({ error: "No matching census section found." });
    }

    res.json({ section });
  } catch (error) {
    next(error);
  }
}