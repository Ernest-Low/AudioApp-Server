import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/authHandler";
import { getAudioDataService } from "../../services/audioService";

const getAudioDataController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { audioId } = req.params;
  const requesterId = req.userId;

  try {
    const audioFile = await getAudioDataService(audioId, requesterId);

    if (!audioFile) {
      res.status(403).json({
        success: false,
        message: "Audio file is private or does not exist",
      });
      return;
    }

    res.status(200).json({ success: true, data: audioFile });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default getAudioDataController;
