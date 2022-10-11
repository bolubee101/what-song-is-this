import { getAudioDurationInSeconds } from "get-audio-duration";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import moment from "moment";
const ffmpeg = createFFmpeg({ log: false });

const convertToRaw = async (filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
      let audio_format;
      const duration = await getAudioDurationInSeconds(filePath);
      let start = duration > 3 ? duration / 2 - 1.5 : 0;
      start = moment.utc(start * 1000).format("HH:mm:ss");
      let end = duration > 3 ? duration / 2 + 1.5 : duration;
      end = moment.utc(end * 1000).format("HH:mm:ss");
      if (filePath.endsWith(".mp4")) {
        const file = await fetchFile(filePath);
        ffmpeg.FS("writeFile", "input.mp4", file);
        await ffmpeg.run("-i", "input.mp4", "-ac", "1", "output.mp3");
        audio_format = ffmpeg.FS("readFile", "output.mp3");
      } else {
        await ffmpeg.load();
        audio_format = await fetchFile(filePath);
      }
      ffmpeg.FS("writeFile", "input.mp3", audio_format);

      await ffmpeg.run(
        "-i",
        "input.mp3",
        "-ss",
        String(start),
        "-to",
        String(end),
        "-f",
        "s16le",
        "-acodec",
        "pcm_s16le",
        "output.raw"
      );
      const data = ffmpeg.FS("readFile", "output.raw");
      ffmpeg.FS("unlink", "input.mp3");
      ffmpeg.FS("unlink", "output.raw");
      ffmpeg.FS("unlink", "output.mp3");
      ffmpeg.FS("unlink", "input.mp4");
      const base64 = Buffer.from(data.buffer).toString("base64");
      return resolve(base64);
    } catch (error) {
      return reject(error);
    }
  });
};

export default convertToRaw;
