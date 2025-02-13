import { Response, NextFunction } from "express";
import { deleteProfileService } from "../../services/profileService";
import { AuthRequest } from "../../middlewares/authHandler";

const deleteProfileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  if (req.userId !== userId) {
    res.status(403).json({
      success: false,
      message: "You are not authorized to delete this profile.",
    });
    return;
  }

  try {
    await deleteProfileService(userId);
    res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

export default deleteProfileController;
