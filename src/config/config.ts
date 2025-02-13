import dotenv from "dotenv";
import Joi from "joi";
import path from "path";

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  AUTH_KEY: Joi.string().required(),
  UPLOAD_DIR: Joi.string().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  PORT: envVars.PORT as number,
  AUTH_KEY: envVars.AUTH_KEY as string,
  FULL_AUDIO_DIR: path.join(__dirname, "../../", envVars.UPLOAD_DIR) as string,
  AUDIO_DIR: envVars.UPLOAD_DIR as string,
};
