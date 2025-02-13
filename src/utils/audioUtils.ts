import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export const getAudioDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration;
      resolve(duration ? Math.round(duration) : 0);
    });
  });
};


export const convertToMp3 = (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("mp3")
      .on("end", () => {
        fs.unlink(inputPath, (unlinkErr) => {
          if (unlinkErr) return reject(unlinkErr);
          resolve();
        });
      })
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
};
