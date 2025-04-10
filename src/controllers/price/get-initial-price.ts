import { NextFunction, Request, Response } from "express";
import { InitialPriceParams } from "../../types/price.types";
import { getCodsecData } from "../../services/serpavi.service";
import { calculateInitialPrice } from "../../services/price.service";

/**
 * Get the initial price for a given census section and surface area.
 */
export const getInitialPrice = async (req: Request<{}, {}, {}, InitialPriceParams>, res: Response, next: NextFunction) => {
  const { codsec, surface, debug } = req.query;

  if (!codsec || !surface) {
    res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    const row = getCodsecData(codsec);
    const { price, details } = calculateInitialPrice({ S: parseFloat(surface), ...row });

    res.json({ price, details: debug ? details : undefined });
  } catch (error) {
    next(error);
  }
}