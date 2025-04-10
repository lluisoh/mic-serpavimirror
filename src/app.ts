import express from "express";
import bodyParser from "body-parser";
import sectionRoutes from "./routes/census-section.routes";
import priceRoutes from "./routes/price.routes";

const app = express();

app.use(bodyParser.json());
app.use("/census-section", sectionRoutes);
app.use("/price", priceRoutes);

export default app;
