import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot be longer than 30 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  isPrivate: Joi.boolean().required().messages({
    "any.required": "Privacy setting is required",
  }),
});

export interface RegisterUserDto {
  username: string;
  isPrivate: boolean;
  email: string;
  password: string;
}

export interface RegisterUserResponseDto {
  userId: string;
  username: string;
  isPrivate: boolean;
  email: string;
  jwtToken: string;
}
