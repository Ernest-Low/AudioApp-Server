import { Response, NextFunction } from "express";
import {
  UpdateProfileDto,
  updateProfileSchema,
} from "../../models/dtos/profileDtos";
import { updateProfileService } from "../../services/profileService";
import { AuthRequest } from "../../middlewares/authHandler";

const updateProfileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  if (req.userId !== userId) {
    res.status(403).json({
      success: false,
      message: "You are not authorized to update this profile",
    });
    return;
  }

  const { error, value } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const updatedProfile = await updateProfileService(
      userId,
      value as UpdateProfileDto
    );
    res.status(200).json({
      success: true,
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};

export default updateProfileController;
