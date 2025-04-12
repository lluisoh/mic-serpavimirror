import { NextFunction, Request, Response } from "express";
import { FinalPriceParams } from "../../types/price.types";
import { getCodsecData } from "../../services/serpavi.service";
import {
  calculateFinalPrice,
  calculateScore,
} from "../../services/price.service";

export type FinalPriceRequest = Request<{}, {}, {}, FinalPriceParams>;

export type FinalPriceResponse = {
  price: {
    lowerValue: number;
    higherValue: number;
  };
  details?: {
    originalLowerValue: number;
    originalHigherValue: number;
    initialLowerValue: number;
    initialHigherValue: number;
    logFactor: number;
    lowerBase: number;
    higherBase: number;
    score: number;
  };
};
/**
 * Get the final price for a given census section, surface area and property variables
 */
export const getFinalPrice = async (
  req: FinalPriceRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    codsec,
    surface,
    debug,
    unit = "€/month",
    corrected,
    ...params
  } = req.query;

  try {
    const P = calculateScore(params);
    const row = getCodsecData(codsec);
    const { price, details } = calculateFinalPrice({ P, surface, corrected, ...row });
    const perSqMt = unit === "€/m²/month";
    const lowerValue = perSqMt ? price.lowerValue : price.lowerValue * details.S;
    const higherValue = perSqMt ? price.higherValue : price.higherValue * details.S;

    res.json({
      price: { lowerValue, higherValue },
      details: debug !== undefined ? { ...details, score: P, ...row } : undefined,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
