import Joi from "joi";
import { ShortAudioResponseDto } from "./audioDtos";

export interface ProfileResponseDto {
  userId: string;
  username: string;
  isPrivate: boolean;
  bio: string;
  email: string;
  audioFiles: ShortAudioResponseDto[];
}

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot be longer than 30 characters",
  }),
  isPrivate: Joi.boolean().messages({
    "boolean.base": "Privacy setting value must be a boolean",
  }),
  bio: Joi.string().messages({
    "string.base": "Bio must be a string",
  }),
  email: Joi.string().email().messages({
    "string.base": "Email must be a string",
    "string.email": "Invalid email format",
  }),
  oldPassword: Joi.string().min(6).messages({
    "string.base": "Old password must be a string",
    "string.min": "Old password must be at least 6 characters long",
  }),
  newPassword: Joi.string().min(6).max(30).messages({
    "string.base": "New password must be a string",
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password cannot be longer than 30 characters",
  }),
})
  .and("oldPassword", "newPassword")
  .messages({
    "object.and":
      "oldPassword and newPassword must both be provided when updating the password. If you are not updating your password, do not include either field.",
  });

export interface UpdateProfileDto {
  username?: string;
  isPrivate?: boolean;
  bio?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
}
