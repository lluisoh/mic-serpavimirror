import { CORRECTION_FACTOR, DELTA_VALUE, GAMMA_VALUE, SCORE_FACTORS, SCORE_WEIGHTS } from "../config/calculations";
import { BadRequestError } from "../errors";
import { ScoreParams } from "../types/price.types";
import { CodsecRow } from "./serpavi.service";

/**
 * Gets the score for a property based on the given parameters.
 * @param params - The parameters for the property.
 * @param params.maintenance - The maintenance level of the property.
 * @param params.elevator - Whether the property has an elevator.
 * @param params.parking - Whether the property has parking.
 * @param params.constructionYear - The construction year (range) of the property.
 * @param params.furnished - Whether the property is furnished.
 * @param params.floor - The floor (range) of the property.
 * @param params.energyCertification - The energy certification of the property.
 * @param params.sharedAreas - Whether the property has shared areas.
 * @param params.pool - Whether the property has a swimming pool.
 * @param params.conciergeServices - Whether the property has concierge services.
 * @param params.specialViews  - Whether the property has special views.
 */
export function calculateScore(params: ScoreParams) {
  let score = 0;

  (Object.keys(SCORE_WEIGHTS)).forEach((key) => {
    const _key = key as keyof ScoreParams;
    const value = params[_key];
    // Check if the parameter is defined
    if (value === undefined) {
      throw new BadRequestError(`Missing value for param '${key}'`);
    }
    const options = SCORE_WEIGHTS[_key] as Record<string, number>;
    const weight = options[String(value)]
    // Check if the parameter has a valid value
    if (weight === undefined) {
      throw new BadRequestError(`Invalid value for param '${key}': '${params[_key]}' (possible values are ${Object.keys(SCORE_WEIGHTS[_key]).join(", ")})`);
    }
    // Calculate the score for the current parameter and add it to the total score
    const factor = SCORE_FACTORS[_key];
    score += weight * factor;
  });

  return score;
}

export type InitialRangeProps = CodsecRow & {
  surface?: string;
}

/**
 * Calculate the initial price range based on the given parameters.
 * @param params - The input parameters
 * @param params.S - Surface in m².
 * @param params.smed - Median surface in m².
 * @param params.p25 - 25th percentile price in €/m²/mes.
 * @param params.p75 - 75th percentile price in €/m²/mes.
 */
export function calculateInitialPrice({ surface, smed, p25, p75 }: InitialRangeProps) {
  if (!surface) {
    throw new BadRequestError("Surface is required");
  }

  const S = parseFloat(surface);
  const logFactor = Math.log(((99 * (smed - 30)) / 120 * (p75 - 2.58) / 23.776) + 1) / Math.log(100);

  const lowerBase = (
    0.00001007 * (smed ** 3 - S ** 3) +
    0.0037 * (S ** 2 - smed ** 2) +
    0.4688 * (smed - S) + p25
  );
  const lowerValue = logFactor * lowerBase + (1 - logFactor) * p25;

  const higherBase = (
    0.000014401 * (smed ** 3 - S ** 3) +
    0.0057 * (S ** 2 - smed ** 2) +
    0.742 * (smed - S) + p75
  );
  const higherValue = logFactor * higherBase + (1 - logFactor) * p75;

  return {
    price: {
      lowerValue,
      higherValue,
    },
    details: {
      logFactor,
      lowerBase,
      higherBase,
      S,
    },
  };
}


export type FinalRangeProps = InitialRangeProps & {
  P: number;
  corrected?: string;
}

/**
 * Get the final price range based on the given parameters, score and initial range.
 * @param params - The parameters for the Censal Section
 * @param params.S - Surface in m².
 * @param params.smed - Median surface in m².
 * @param params.p25 - 25th percentile price in €/m²/mes.
 * @param params.p75 - 75th percentile price in €/m²/mes.
 * @param params.P - The score of the property.
 */
export function calculateFinalPrice({ surface, smed, p25, p75, P, corrected }: FinalRangeProps) {
  const { price: { lowerValue, higherValue }, details } = calculateInitialPrice({ surface, smed, p25, p75 });
  const adjustedScore = (P - 18.115) / 100.885;
  const percentileDifference = p75 - p25;

  const finalLowerValue = lowerValue + percentileDifference * DELTA_VALUE * (adjustedScore - 0.260);
  const finalHigherValue = higherValue + percentileDifference * GAMMA_VALUE * (adjustedScore - (0.5 / GAMMA_VALUE));

  const shouldCorrect = corrected !== undefined;
  const adjLowerValue = shouldCorrect ? finalLowerValue * CORRECTION_FACTOR : finalLowerValue;
  const adjHigherValue = shouldCorrect ? finalHigherValue * CORRECTION_FACTOR : finalHigherValue;

  return {
    price: {
      lowerValue: adjLowerValue,
      higherValue: adjHigherValue,
    },
    details: {
      originalLowerValue: finalLowerValue,
      originalHigherValue: finalHigherValue,
      initialLowerValue: lowerValue,
      initialHigherValue: higherValue,
      ...details,
    }
  };
}