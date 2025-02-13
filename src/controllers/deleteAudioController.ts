import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authHandler";
import { deleteAudioService } from "../services/audioService";

export const deleteAudioController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const audioId = req.params.audioId;
  const userId = req.userId;

  console.log("audioId in deleteAudioController: " + audioId);
  try {
    await deleteAudioService(userId!, audioId);
    res
      .status(200)
      .json({ success: true, message: "Audio file deleted successfully" });
  } catch (err) {
    next(err);
  }
};
