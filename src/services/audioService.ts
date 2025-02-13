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
import { config } from "../config/config";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const uploadAudioService = async (
  userId: string,
  file: Express.Multer.File,
  metadata: UploadAudioDto
): Promise<AudioResponseDto> => {
  // let filePath = `/uploads/audio/${file.filename}`;
  let filePath = `${config.FULL_AUDIO_DIR}${file.filename}`;
  // console.log("config.upload_dir: " + config.FULL_AUDIO_DIR);
  // console.log(`initial filepath: ${config.FULL_AUDIO_DIR}${file.filename}`);
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
      // filePath = `/uploads/audio/${outputFileName}`;
      filePath = `${config.FULL_AUDIO_DIR}${outputFileName}`;
      console.log(`new filepath: ${config.FULL_AUDIO_DIR}${outputFileName}`);
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
        audioName: metadata.audioName,
        filePath: `${config.AUDIO_DIR}${file.filename}`,
        size,
        length,
        isPublic: metadata.isPublic ?? false,
        description: metadata.description ? metadata.description : "",
        category: validateAudioCategory(metadata.category),
        user: { connect: { id: userId } },
      },
    });

    const resDto: AudioResponseDto = {
      audioId: audioFile.id,
      audioName: audioFile.audioName,
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
    audioId: updatedAudio.id,
    audioName: updatedAudio.audioName,
    description: updatedAudio.description,
    category: updatedAudio.category,
    length: formatSeconds(updatedAudio.length),
  };

  return resDto;
};

export const deleteAudioService = async (
  userId: string,
  audioId: string
): Promise<void> => {
  const audioFile = await prisma.audioFile.findUnique({
    where: { id: audioId },
  });

  if (!audioFile) {
    throw new CustomError("Audio file not found", 404);
  }

  if (audioFile.userId !== userId) {
    throw new CustomError("Unauthorized to delete this audio file", 403);
  }

  const absoluteFilePath = path.join(__dirname, "../../", audioFile.filePath);
  // console.log("absoluteFilePath: " + absoluteFilePath);

  if (fs.existsSync(absoluteFilePath)) {
    try {
      fs.unlinkSync(absoluteFilePath);
    } catch (error) {
      throw new CustomError(
        "Failed to delete audio file from system",
        500,
        error
      );
    }
  } else {
    throw new CustomError("Can't find audio file in storage.", 500);
  }

  // Delete from database
  await prisma.audioFile.delete({
    where: { id: audioId },
  });
};
