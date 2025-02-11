import express, { Express, Request, Response } from "express";
import corsOptions from "./config/corsOptions";
import { config } from "./config/config";
import cors from "cors";
import prisma from "../prisma/db/prisma";
import errorHandler from "./middleware/errorHandler";
import registerController from "./controllers/registerController";
import bodyParser from "body-parser";

const app: Express = express();

// Middlewares
app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));
app.use(cors(corsOptions));
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${config.PORT}`);
});

const main = async () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
};

app.post("/api/register", registerController);

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
