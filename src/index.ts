import express, { Express, Request, Response } from "express";
import corsOptions from "./config/corsOptions";
import { config } from "./config/config";
import cors from "cors";
import prisma from "../prisma/db/prisma";

const app: Express = express();

// Middlewares
app.use(cors(corsOptions));

app.listen(config.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${config.PORT}`);
});

const main = async () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
