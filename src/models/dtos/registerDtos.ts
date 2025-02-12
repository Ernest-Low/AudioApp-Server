import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "any.required": "Username is required",
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot be longer than 30 characters",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.base": "Email must be a string.",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "any.required": "Password is required",
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot be longer than 30 characters",
  }),
  isPrivate: Joi.boolean().required().messages({
    "any.required": "Privacy setting is required.",
    "boolean.base": "Privacy setting value must be a boolean.",
  }),
  bio: Joi.string().messages({
    "string.base": "Bio must be a string.",
  }),
});

export interface RegisterUserDto {
  username: string;
  isPrivate: boolean;
  email: string;
  password: string;
  bio?: string; // Lets make this optional in case people don't wanna talk about it
}

export interface RegisterUserResponseDto {
  userId: string;
  username: string;
  // isPrivate: boolean;
  // email: string;
  // bio: string;
  // Same as login, could return a list of their uploaded songs / playlist
  jwtToken: string;
}
