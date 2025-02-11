import { NextFunction, Request, Response } from "express";
import { registerUserSchema } from "../models/dtos/registerDtos";
import registerUserService from "../services/registerUserService";

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("registerController initiated, receiving:");
  console.dir(req.body);

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
  
  console.log("Leaving registercontroller, here is value:");
  console.dir(value);
  try {
    const response = await registerUserService(value);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default registerController;
