import axios from 'axios';
import fs from 'fs';
import path from 'path';

const FILE_URL = process.env.GEOJSON_URL!;
const OUTPUT_PATH = path.resolve(__dirname, '../data/census-sections.geojson');

// Only run on Railway
const isRunningOnRailway = process.env.RAILWAY_ENVIRONMENT_NAME !== undefined;

if (!isRunningOnRailway) {
  console.log('ℹ️ Not running on Railway — skipping GeoJSON download.');
  process.exit(0);
}

if (fs.existsSync(OUTPUT_PATH)) {
  console.log('📁 GeoJSON already downloaded — skipping.');
  process.exit(0);
}

console.log('⬇️ Downloading GeoJSON file from:', FILE_URL);

axios.get(FILE_URL, {
  responseType: 'stream',
  headers: {
    'User-Agent': 'RailwayBot/1.0 (+https://railway.app)',
    'Accept': 'application/octet-stream'
  }
})
  .then(response => {
    const writer = fs.createWriteStream(OUTPUT_PATH);
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('✅ GeoJSON file downloaded and saved.');
    });

    writer.on('error', err => {
      console.error('❌ File write error:', err.message);
      process.exit(1);
    });
  })
  .catch(err => {
    if (err.response) {
      console.error(`❌ Failed to download: Status code ${err.response.status}`);
    } else {
      console.error('❌ Error downloading file:', err.message);
    }
    process.exit(1);
  });
