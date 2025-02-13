import prisma from "../../prisma/db/prisma";
import { UpdateAudioDto, UploadAudioDto } from "../models/dtos/audioDtos";
import { CustomError } from "../utils/CustomError";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";
import { getAudioDuration, convertToMp3 } from "../utils/audioUtils";
import validateAudioCategory from "../utils/validateAudioCategory";
import { AudioResponseDto } from "../models/dtos/audioDtos";
import { formatSeconds } from "../utils/formatValues";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const uploadAudioService = async (
  userId: string,
  file: Express.Multer.File,
  metadata: UploadAudioDto
): Promise<AudioResponseDto> => {
  let filePath = `/uploads/audio/${file.filename}`;
  let size = file.size;
  const targetFormat = "mp3";
  const ext = path.extname(file.filename).toLowerCase();
  const needsConversion = ext !== ".mp3" && ext !== ".wav";
  const tempFilePaths: string[] = [file.path];

  if (needsConversion) {
    const outputFileName = file.filename.replace(ext, `.${targetFormat}`);
    const outputFullPath = path.join(path.dirname(file.path), outputFileName);

    try {
      await convertToMp3(file.path, outputFullPath);
      filePath = `/uploads/audio/${outputFileName}`;
      const stats = fs.statSync(outputFullPath);
      size = stats.size;
      tempFilePaths.push(outputFullPath);
    } catch (error) {
      tempFilePaths.forEach((tempFilePath) => {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      });
      throw new CustomError("Failed to convert audio file", 500, error);
    }
  }

  let length = 0;
  try {
    length = await getAudioDuration(
      needsConversion
        ? path.join(
            file.destination,
            file.filename.replace(ext, `.${targetFormat}`)
          )
        : file.path
    );
  } catch (error) {
    tempFilePaths.forEach((tempFilePath) => {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    });
    throw new CustomError("Failed to extract audio duration", 500, error);
  }

  try {
    const audioFile = await prisma.audioFile.create({
      data: {
        songName: metadata.songName,
        filePath,
        size,
        length,
        isPublic: metadata.isPublic ?? false,
        description: metadata.description ? metadata.description : "",
        category: validateAudioCategory(metadata.category),
        user: { connect: { id: userId } },
      },
    });

    const resDto: AudioResponseDto = {
      songId: audioFile.id,
      songName: audioFile.songName,
      description: audioFile.description,
      category: audioFile.category,
      length: formatSeconds(audioFile.length),
    };

    return resDto;
  } catch (error) {
    tempFilePaths.forEach((tempFilePath) => {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    });
    throw new CustomError("Failed to save audio file to database", 500, error);
  }
};

export const updateAudioService = async (
  userId: string,
  audioId: string,
  updates: UpdateAudioDto
): Promise<AudioResponseDto> => {
  const audioFile = await prisma.audioFile.findUnique({
    where: { id: audioId },
  });

  if (updates.category !== undefined) {
    validateAudioCategory(updates.category);
  }

  if (!audioFile) {
    throw new CustomError("Audio file not found", 404);
  }

  if (audioFile.userId !== userId) {
    throw new CustomError("Unauthorized to update this audio file", 403);
  }

  const updatedAudio = await prisma.audioFile.update({
    where: { id: audioId },
    data: updates,
  });

  const resDto: AudioResponseDto = {
    songId: updatedAudio.id,
    songName: updatedAudio.songName,
    description: updatedAudio.description,
    category: updatedAudio.category,
    length: formatSeconds(updatedAudio.length),
  };

  return resDto;
};
