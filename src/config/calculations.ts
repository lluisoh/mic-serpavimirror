import { ScoreFactors, ScoreWeights } from "../types/price.types";

/**
 * Score weights for each parameter.
 */
export const SCORE_WEIGHTS: ScoreWeights = {
  maintenance: {
    perfect: 10,
    good: 7.5,
    regular: 5,
    bad: 2.5,
  },
  elevator: {
    true: 10,
    false: 1,
  },
  parking: {
    true: 10,
    false: 1,
  },
  constructionYear: {
    "2008-2019": 10,
    "1979-2007": 6.6,
    "1945-1978": 4.9,
    "1918-1944": 3.2,
    "-1918": 1.5,
  },
  furnished: {
    true: 10,
    false: 1,
  },
  floor: {
    baja: 2,
    baja_patio: 10,
    "1-2": 2.5,
    "3-4": 5,
    "5-6": 7.5,
    "7+": 10,
    atico: 10,
  },
  energyCertification: {
    A: 10,
    B: 8.6,
    C: 7.2,
    D: 5.8,
    E: 4.4,
    F: 3.0,
    G: 1.6,
  },
  sharedAreas: {
    true: 10,
    false: 1,
  },
  pool: {
    true: 10,
    false: 1,
  },
  conciergeServices: {
    true: 10,
    false: 1,
  },
  specialViews: {
    true: 10,
    false: 1,
  },
};

/**
 * Normalization factors for each parameter.
 */
export const SCORE_FACTORS: ScoreFactors = {
  maintenance: 3.5,
  elevator: 1.75,
  parking: 1.5,
  constructionYear: 0.75,
  furnished: 0.75,
  floor: 0.5,
  energyCertification: 0.15,
  sharedAreas: 0.75,
  pool: 0.75,
  conciergeServices: 0.75,
  specialViews: 0.75,
};

/**
 * Delta value for the SERPAVI formula.
 */
export const DELTA_VALUE = 0.277

/**
 * Gamma value for the SERPAVI formula.
 */
export const GAMMA_VALUE = 0.692

/**
 * Empirical correction factor for the SERPAVI formula.
 * This factor is applied to the final price to adjust it to the values returned by the SERPAVI form.
 */
export const CORRECTION_FACTOR = 0.92;