import { Response, NextFunction } from "express";
import { getAudioService } from "../../services/audioService";
import { AuthRequest } from "../../middlewares/authHandler";
import path from "path";
import fs from "fs";
import { formatSeconds } from "../../utils/formatValues";

const getAudioController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { audioId } = req.params;
  const requesterId = req.userId;

  try {
    const audioFile = await getAudioService(audioId, requesterId);
    const audioFilePath = path.join(__dirname, "../../../", audioFile.filePath);

    console.log("audioFilePath: " + audioFilePath);

    if (!fs.existsSync(audioFilePath)) {
      res.status(404).json({ message: "Audio file not found in storage." });
    }

    res.setHeader("X-Audio-Id", audioFile.audioId);
    res.setHeader("X-Audio-Name", audioFile.audioName);
    res.setHeader("X-Audio-Category", JSON.stringify(audioFile.category));
    res.setHeader("X-Audio-Length", formatSeconds(audioFile.length));
    res.setHeader("X-Audio-Description", audioFile.description);

    res.setHeader("Content-Type", "audio/mpeg");

    const readStream = fs.createReadStream(audioFilePath);
    readStream.pipe(res);

    // Handle errors during file streaming
    readStream.on("error", (err) => {
      console.error("Error streaming the audio file:", err);
      res.status(500).json({
        message: "Error streaming the audio file",
        error: err.message,
      });
    });
  } catch (error) {
    console.error("Error fetching audio file:", error);
    res.status(404).json({ message: "Audio file not found or access denied" });
  }
};

export default getAudioController;
