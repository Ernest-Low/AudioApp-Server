import Joi from "joi";

export const loginUserSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.base": "Username must be a string",
  }),
  password: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.base": "Username must be a string",
  }),
});

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface LoginUserResponseDto {
  userId: string;
  username: string;
  //   isPrivate: boolean;
  //   email: string;
  //   bio: string;
  // Should return a list of their uploaded audios / playlist
  jwtToken: string;
}
