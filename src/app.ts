import express from "express";
import bodyParser from "body-parser";
import sectionRoutes from "./routes/census-section.routes";
import priceRoutes from "./routes/price.routes";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(bodyParser.json());
app.use("/census-section", sectionRoutes);
app.use("/price", priceRoutes);

app.use(errorHandler);

export default app;
