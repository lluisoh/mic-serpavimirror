import express from "express";
import { getFinalPrice, getInitialPrice } from "../controllers";

const priceRoutes = express.Router();

priceRoutes.get("/initial", getInitialPrice);
priceRoutes.get("/final", getFinalPrice);

export default priceRoutes;
