import { Response } from "express";
import { ResponseBody } from "./global.types";

/**
 * Address query params
 */
export type AddressParams = {
  street: string;
  number: string;
  postalCode: string;
  municipality: string;
  province: string;
};

/**
 * Coordinates query params
 */
export type CoordinatesParams = {
  lat: string;
  lon: string;
};
