import { AuthRequest } from "../../middlewares/authHandler";
import { Response, NextFunction } from "express";
import { updateAudioSchema } from "../../models/dtos/audioDtos";
import { updateAudioService } from "../../services/audioService";

const updateAudioController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = updateAudioSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const userId = req.userId;
    const audioId = req.params.audioId;
    const updatedAudio = await updateAudioService(userId!, audioId, value);
    res.status(200).json({
      success: true,
      message: "Audio file updated successfully",
      data: updatedAudio,
    });
  } catch (err) {
    next(err);
  }
};

export default updateAudioController;
