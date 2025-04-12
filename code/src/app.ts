import express from "express";
import bodyParser from "body-parser";
import sectionRoutes from "./routes/census-section.routes";
import priceRoutes from "./routes/price.routes";
import { errorHandler } from "./middlewares/error-handler";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const openapiSpec = YAML.load(path.resolve(__dirname, "../../api/openapi.yml"));

const app = express();

app.use(bodyParser.json());
app.use("/census-section", sectionRoutes);
app.use("/price", priceRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use(errorHandler);

export default app;
