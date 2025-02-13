import { AudioCategory } from "../models/dtos/audioDtos";
import Joi from "joi";
import { CustomError } from "./CustomError";

const validateAudioCategory = (genres: string[]): AudioCategory[] => {
  const audioSchema = Joi.array()
    .items(Joi.string().valid(...Object.values(AudioCategory)))
    .required();

  const { error, value } = audioSchema.validate(genres);

  if (error) {
    throw new CustomError(
      "Invalid audio category",
      400,
      error.details.map((detail) => detail.message).join(", ")
    );
  }

  return value as AudioCategory[];
};

export default validateAudioCategory;
