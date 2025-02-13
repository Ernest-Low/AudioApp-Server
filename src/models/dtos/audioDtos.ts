import Joi from "joi";

// Will be validated against for incoming categories
export enum AudioCategory {
  Pop = "Pop",
  Rock = "Rock",
  HipHop = "HipHop",
  Electronic = "Electronic",
  RnB = "RnB",
  Jazz = "Jazz",
  Classical = "Classical",
  Latin = "Latin",
  Folk = "Folk",
  World = "World",
  Other = "Other",
}

export const uploadAudioSchema = Joi.object({
  audioName: Joi.string().min(2).max(128).required().messages({
    "any.required": "Audio name is required",
    "string.base": "Audio name must be a string",
    "string.min": "Audio name must be at least 2 characters long",
    "string.max": "Audio name cannot be longer than 128 characters",
  }),
  isPublic: Joi.boolean().required().messages({
    "boolean.base": "isPublic must be a boolean value",
  }),
  description: Joi.string().messages({
    "string.base": "Description must be a string",
  }),
  category: Joi.array().items(Joi.string()).required().messages({
    "any.required": "Category is required",
    "array.base": "Category must be an array of strings",
    "string.base": "Each category item must be a string",
  }),
});

export interface UploadAudioDto {
  audioName: string;
  isPublic: boolean;
  description?: string; // Maybe there's no description, same as bio
  category: string[];
}

export const updateAudioSchema = Joi.object({
  audioName: Joi.string().min(2).max(128).messages({
    "string.base": "Audio name must be a string",
    "string.min": "Audio name must be at least 2 characters long",
    "string.max": "Audio name cannot be longer than 128 characters",
  }),
  isPublic: Joi.boolean().messages({
    "boolean.base": "isPublic must be a boolean value",
  }),
  category: Joi.array().items(Joi.string()).messages({
    "array.base": "Category must be an array of strings",
    "string.base": "Each category item must be a string",
  }),
  description: Joi.string().messages({
    "string.base": "Description must be a string",
  }),
});

export interface UpdateAudioDto {
  audioName?: string;
  isPublic?: boolean;
  category?: string[];
  description?: string;
}

export interface ShortAudioResponseDto {
  audioId: string;
  audioName: string;
  category: string[];
  length: string; // Or should I give it as the raw seconds?
  // size: string; // Same here, though wondering if the frontend even needs to know the size
}

export interface AudioResponseDto extends ShortAudioResponseDto {
  description: string;
}

// export interface AudioStreamResponseDto {
//   audioId: string;
//   audioName: string;
//   category: string[];
//   description: string;
//   length: number;
//   filePath: string;
// }
