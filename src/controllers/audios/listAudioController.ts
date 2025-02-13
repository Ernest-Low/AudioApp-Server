import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/authHandler";
import { listAudioFilesService } from "../../services/audioService";
import validateAudioCategory from "../../utils/validateAudioCategory";

const listAudioController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const requesterId = req.userId;
    const rawCategories = req.query.category
      ? req.query.category.toString().split(",")
      : undefined;
    const categories = rawCategories
      ? validateAudioCategory(rawCategories)
      : undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const audioList = await listAudioFilesService(
      requesterId,
      categories,
      page,
      pageSize
    );
    res.status(200).json({ success: true, data: audioList });
  } catch (error) {
    next(error);
  }
};

export default listAudioController;
