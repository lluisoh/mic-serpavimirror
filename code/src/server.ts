// src/server.ts
import app from "./app";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost";

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en ${BASE_URL}:${PORT}`);
});
