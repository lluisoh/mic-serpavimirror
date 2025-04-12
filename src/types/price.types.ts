
export type Maintenace = "perfect" | "good" | "regular" | "bad";
export type ConstructionYear = "2008-2019" | "1979-2007" | "1945-1978" | "1918-1944" | "-1918";
export type Floor = "baja" | "baja_patio" | "1-2" | "3-4" | "5-6" | "7+" | "atico";
export type EnergyCertification = "A" | "B" | "C" | "D" | "E" | "F" | "G";

/**
 * Apartment score query params
 */
export type ScoreParams = {
  maintenance?: Maintenace;
  elevator?: boolean;
  parking?: boolean;
  constructionYear?: ConstructionYear;
  furnished?: boolean;
  floor?: Floor;
  energyCertification?: EnergyCertification;
  sharedAreas?: boolean;
  pool?: boolean;
  conciergeServices?: boolean;
  specialViews?: boolean;
};

/**
 * Weights for each score variable
 */
export type ScoreWeights = {
  maintenance: Record<Maintenace, number>;
  elevator: Record<string, number>;
  parking: Record<string, number>;
  constructionYear: Record<ConstructionYear, number>;
  furnished: Record<string, number>;
  floor: Record<Floor, number>;
  energyCertification: Record<EnergyCertification, number>;
  sharedAreas: Record<string, number>;
  pool: Record<string, number>;
  conciergeServices: Record<string, number>;
  specialViews: Record<string, number>;
}

/**
 * Normalization factors for each score variable
 */
export type ScoreFactors = Record<keyof ScoreParams, number>;

/**
 * Initial price query params
 */
export type InitialPriceParams = {
  codsec: string;
  surface: string;
  debug?: string;
};

/**
 * Initial price query params
 */
export type FinalPriceParams = InitialPriceParams & ScoreParams & {
  unit?: "€/month" | "€/m²/month";
  corrected?: string;
};


