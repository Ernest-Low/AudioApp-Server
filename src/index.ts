import express, { Express, Request, Response } from "express";
import corsOptions from "./config/corsOptions";
import { config } from "./config/config";
import cors from "cors";
import prisma from "../prisma/db/prisma";
import errorHandler from "./middlewares/errorHandler";
import bodyParser from "body-parser";
import { optionalAuth, requiredAuth } from "./middlewares/authHandler";
import handleFileUpload from "./middlewares/handleFileUpload";
import controllers from "./controllers/controllers";

const app: express.Express = express();

// Middlewares
app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));
app.use(cors(corsOptions));

const main = async () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.post("/api/register", controllers.registerController);
  app.post("/api/login", controllers.loginController);
  app.get(
    "/api/profile/:username",
    optionalAuth,
    controllers.getProfileController
  );
  app.patch(
    "/api/profile/:userId",
    requiredAuth,
    controllers.updateProfileController
  );
  app.delete(
    "/api/profile/:userId",
    requiredAuth,
    controllers.deleteProfileController
  );
  app.post(
    "/api/audio/new",
    requiredAuth,
    handleFileUpload,
    controllers.uploadAudioController
  );
  app.patch(
    "/api/audio/:audioId",
    requiredAuth,
    controllers.updateAudioController
  );
  app.delete(
    "/api/audio/:audioId",
    requiredAuth,
    controllers.deleteAudioController
  );
  app.get(
    "/api/audio/stream/:audioId",
    optionalAuth,
    controllers.streamAudioController
  );
  app.get("/api/audiolist", optionalAuth, controllers.listAudioController);
  app.get(
    "/api/audio/:audioId",
    optionalAuth,
    controllers.getAudioDataController
  );

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
