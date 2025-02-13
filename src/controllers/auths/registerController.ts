import { NextFunction, Request, Response } from "express";
import { registerUserSchema } from "../../models/dtos/registerDtos";
import registerUserService from "../../services/registerUserService";

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = registerUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
    return;
  }

  try {
    const response = await registerUserService(value);
    res.status(201).json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
};

export default registerController;
