import axios from 'axios';
import fs from 'fs';
import path from 'path';

const FILE_URL = process.env.GEOJSON_URL!;
const OUTPUT_PATH = path.resolve(__dirname, '../../data/census-sections.geojson');

console.log('⬇️ Downloading GeoJSON file from:', FILE_URL);

axios({
  method: 'get',
  url: FILE_URL,
  responseType: 'stream',
})
  .then((response) => {
    const writer = fs.createWriteStream(OUTPUT_PATH);
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('✅ GeoJSON file downloaded and saved.');
    });

    writer.on('error', (err) => {
      console.error('❌ File write error:', err.message);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('❌ Error downloading file:', err.message);
    process.exit(1); // Fail Railway build on error
  });
