import express from "express";
import { getAboutSectionData } from "../controllers/Other.controler.js";

const other = express.Router();

other.get("/about/getdata", getAboutSectionData);

export default other;
