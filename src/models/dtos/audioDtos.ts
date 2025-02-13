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
  songName: Joi.string().min(2).max(128).required().messages({
    "any.required": "Song name is required",
    "string.base": "Song name must be a string",
    "string.min": "Song name must be at least 2 characters long",
    "string.max": "Song name cannot be longer than 128 characters",
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
  songName: string;
  isPublic: boolean;
  description?: string; // Maybe there's no description, same as bio
  category: string[];
}

export const updateAudioSchema = Joi.object({
  songName: Joi.string().min(2).max(128).messages({
    "string.base": "Song name must be a string",
    "string.min": "Song name must be at least 2 characters long",
    "string.max": "Song name cannot be longer than 128 characters",
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
  songName?: string;
  isPublic?: boolean;
  category?: string[];
  description?: string;
}

export interface ShortAudioResponseDto {
  songId: string;
  songName: string;
  category: string[];
  length: string; // Or should I give it as the raw seconds?
  // size: string; // Same here, though wondering if the frontend even needs to know the size
}

export interface AudioResponseDto extends ShortAudioResponseDto {
  description: string;
}
