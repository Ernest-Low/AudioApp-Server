import { Response, NextFunction } from "express";
import { getProfileService } from "../../services/profileService";
import { AuthRequest } from "../../middlewares/authHandler";

const getProfileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username } = req.params;
  const requesterId = req.userId;

  try {
    const profile = await getProfileService(username, requesterId);

    if (!profile) {
      res.status(403).json({
        success: false,
        message: "Profile is private or does not exist",
      });
      return;
    }

    res.status(200).json({ success: true, data: profile });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default getProfileController;
