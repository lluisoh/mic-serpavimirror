// scripts/fetch-geojson.ts
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const FILE_URL = process.env.GEOJSON_URL!;
const OUTPUT_PATH = path.resolve(__dirname, '../../data/census-sections.geojson');

console.log('⬇️ Downloading GeoJSON file from:', FILE_URL);

https.get(FILE_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: Status code ${res.statusCode}`);
    return;
  }

  const fileStream = fs.createWriteStream(OUTPUT_PATH);
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close();
    console.log('✅ GeoJSON file downloaded and saved.');
  });
});
