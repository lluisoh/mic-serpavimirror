import { NextFunction, Request, Response } from "express";
import { InitialPriceParams } from "../../types/price.types";
import { getCodsecData } from "../../services/serpavi.service";
import { calculateInitialPrice } from "../../services/price.service";

export type InitialPriceRequest = Request<{}, {}, {}, InitialPriceParams>;

/**
 * Get the initial price for a given census section and surface area.
 */
export const getInitialPrice = async (req: InitialPriceRequest, res: Response, next: NextFunction) => {
  const { codsec, surface, debug } = req.query;

  try {
    const row = getCodsecData(codsec);
    const { price, details } = calculateInitialPrice({ surface, ...row });

    res.json({ price, details: debug !== undefined ? details : undefined });
  } catch (error) {
    next(error);
  }
}