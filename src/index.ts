import express, { Express, Request, Response } from "express";
import corsOptions from "./config/corsOptions";
import { config } from "./config/config";
import cors from "cors";
import prisma from "../prisma/db/prisma";
import errorHandler from "./middlewares/errorHandler";
import registerController from "./controllers/registerController";
import bodyParser from "body-parser";
import loginController from "./controllers/loginController";
import getProfileController from "./controllers/getProfileController";
import { optionalAuth, requiredAuth } from "./middlewares/authHandler";
import { updateProfileController } from "./controllers/updateProfileController";
import { deleteProfileController } from "./controllers/deleteProfileController";
import { uploadAudioController } from "./controllers/uploadAudioController";
import handleFileUpload from "./middlewares/handleFileUpload";
import { updateAudioController } from "./controllers/updateAudioController";
import { deleteAudioController } from "./controllers/deleteAudioController";

const app: express.Express = express();

// Middlewares
app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));
app.use(cors(corsOptions));

const main = async () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.post("/api/register", registerController);
  app.post("/api/login", loginController);
  app.get("/api/profile/:username", optionalAuth, getProfileController);
  app.patch("/api/profile/:userId", requiredAuth, updateProfileController);
  app.delete("/api/profile/:userId", requiredAuth, deleteProfileController);
  app.post(
    "/api/audio/new",
    requiredAuth,
    handleFileUpload,
    uploadAudioController
  );
  app.patch("/api/audio/:audioId", requiredAuth, updateAudioController);
  app.delete("/api/audio/:audioId", requiredAuth, deleteAudioController);

  app.use(errorHandler);

  app.listen(config.PORT, () => {
    console.log(
      `[server]: Server is running at http://localhost:${config.PORT}`
    );
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
