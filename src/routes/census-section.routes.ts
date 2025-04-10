import express from "express";
import { getSectionByAddress, getSectionByCoords } from "../controllers";

const sectionRoutes = express.Router();

sectionRoutes.get("/by-address", getSectionByAddress);
sectionRoutes.get("/by-coords", getSectionByCoords);

export default sectionRoutes;
