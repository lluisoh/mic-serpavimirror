/**
 * This script imports the data from the SERPAVI Excel file into a SQLite database.
 * CAUTION: This script will overwrite the existing database file!
 */

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const xlsx = require("xlsx");

// Load Excel file
const xlsxPath = path.resolve(__dirname, "../data/serpavi.xlsx");
const workbook = xlsx.readFile(xlsxPath);
const sheet = workbook.Sheets["Secciones censales"];
const data = xlsx.utils.sheet_to_json(sheet);

// Ensure the directory exists
const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Define new database path
const dbPath = path.join(dataDir, "serpavi.sqlite");

// This will create the DB if it doesn't exist
const db = new Database(dbPath);

// Drop + create table
db.exec(`
  DROP TABLE IF EXISTS secciones_censales;
  CREATE TABLE secciones_censales (
    codsec TEXT PRIMARY KEY,
    p25 REAL,
    p75 REAL,
    smed REAL
  );
`);

// Prepare statement and insert in transaction
const insert = db.prepare(`
  INSERT INTO secciones_censales (codsec, p25, p75, smed)
  VALUES (?, ?, ?, ?)
`);

const insertMany = db.transaction((rows) => {
  for (const row of rows) {
    const codsec = row.CUSEC;
    const p25 = row.ALQM2_LV_25_VC_23;
    const p75 = row.ALQM2_LV_75_VC_23;
    const smed = row.SLVM2_M_VC_23;

    if (p25 != null && p75 != null && smed != null) {
      insert.run(codsec, p25, p75, smed);
    }
  }
});

insertMany(data);

console.log("✅ Data imported successfully");
