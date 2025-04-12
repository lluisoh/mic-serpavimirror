import path from "path";
import Database from "better-sqlite3";
import { CODSEC_TABLE } from "../config/db";
import { NotFoundError } from "../errors";

const dbPath = path.resolve(__dirname, "../..//data/serpavi.sqlite");
const db = new Database(dbPath);

export type CodsecRow = {
  p25: number;
  p75: number;
  smed: number;
};

/**
 * Get data for census section from SERPAVI 'secciones_censales' database table
 * @param codsec - Census section code
 */
export const getCodsecData = (codsec: string) => {
  const row = db.prepare<string, CodsecRow>(`SELECT p25, p75, smed FROM ${CODSEC_TABLE} WHERE codsec = ?`).get(codsec);

  if (!row) {
    throw new NotFoundError(`Codsec ${codsec} not found`);
  }

  return row;
};
