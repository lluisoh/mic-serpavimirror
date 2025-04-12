# SERPAVI Mirror Microservice

This microservice exposes a REST API for querying rental price reference indexes based on Spanish census sections. It mirrors the logic and methodology used by the Sistema Estatal de Referencia de Precios de Alquiler de Vivienda ([SERPAVI](https://serpavi.mivau.gob.es/))  to calculate reference rental prices. Since their API is not public, I´ve decided to create my own with the procedure explained in their (methodology)[https://www.mivau.gob.es/recursos_mfom/comodin/recursos/2025-03-03_metodologia_serpavi.pdf] so it can be used freely by third parties

## Features

- Get the census section corresponding to a given address or geographic coordinates.
- Retrieve the initial and final reference rental price per square meter for a census section.
- Local SQLite database with P25, P75, and Smed SERPAVI data.
- Uses geocoding to resolve addresses and matches them to census shapefiles.

## Tech Stack

- Node.js + TypeScript
- Express
- SQLite
- Vitest (for testing)
- OpenAPI (for API documentation)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-user/mic-serpavimirror.git
cd mic-serpavimirror/code
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Prepare the Data

The microservice requires local geospatial data and SERPAVI values:

- Use the script `scripts/fetch-geojson.ts` to download and prepare GeoJSON files from INE shapefiles.

### 4. Start the Server

```bash
npm run dev
```

Server will start on `http://localhost:3000` by default.

### 5. Run Tests

```bash
npm test
```

## API Endpoints

### Get Census Section by Address
```http
GET /api/census-section/address?street=...&municipality=...
```

### Get Census Section by Coordinates
```http
GET /api/census-section/coords?lat=...&lng=...
```

### Get Initial Price
```http
GET /api/price/initial
```

### Get Final Price
```http
GET /api/price/final
```

Full OpenAPI documentation is available in [`api/openapi.yml`](../api/openapi.yml).

## Data Sources

- **SERPAVI**: Reference rental price data used by the Ministerio de Vivienda y Agenda Urbana.
- **INE Shapefiles**: Used to determine the census section based on coordinates or address.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
