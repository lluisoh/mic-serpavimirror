import { NextFunction, Request, Response } from "express";
import { FinalPriceParams, InitialPriceParams } from "../../types/price.types";
import { getCodsecData } from "../../services/serpavi.service";
import {
  calculateFinalPrice,
  calculateScore,
} from "../../services/price.service";

/**
 * Get the final price for a given census section, surface area and property variables
 */
export const getFinalPrice = async (
  req: Request<{}, {}, {}, FinalPriceParams>,
  res: Response,
  next: NextFunction
) => {
  const { codsec, surface, debug, unit = "€/month", corrected, ...params } = req.query;

  if (!codsec || !surface) {
    res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    const P = calculateScore(params);
    const S = parseFloat(surface);
    const row = getCodsecData(codsec);
    const { price, details } = calculateFinalPrice({ P, S, corrected, ...row });
    const perSqMt = unit === "€/m²/month";
    const lowerValue = perSqMt ? price.lowerValue : price.lowerValue * S;
    const higherValue = perSqMt ? price.higherValue : price.higherValue * S;

    res.json({
      price: { lowerValue, higherValue },
      details: debug ? { ...details, score: P } : undefined,
    });
  } catch (error) {
    next(error);
  }
};
