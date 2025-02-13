import { Response, NextFunction } from "express";
import { streamAudioService } from "../../services/audioService";
import { AuthRequest } from "../../middlewares/authHandler";
import path from "path";
import fs from "fs";

const streamAudioController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { audioId } = req.params;
  const requesterId = req.userId;

  try {
    const audioFile = await streamAudioService(audioId, requesterId);
    const audioFilePath = path.join(__dirname, "../../../", audioFile.filePath);

    if (!fs.existsSync(audioFilePath)) {
      res.status(404).json({ message: "Audio file not found in storage." });
    }

    res.setHeader("Content-Type", "audio/mpeg");

    const readStream = fs.createReadStream(audioFilePath);
    readStream.pipe(res);

    readStream.on("error", (err) => {
      console.error("Error streaming the audio file:", err);
      res.status(500).json({
        message: "Error streaming the audio file",
        error: err.message,
      });
    });
  } catch (error) {
    next(error);
    return;
  }
};

export default streamAudioController;
