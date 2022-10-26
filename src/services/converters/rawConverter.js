import { getAudioDurationInSeconds } from "get-audio-duration";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import moment from "moment";
const ffmpeg = createFFmpeg({ log: false });
import fs from "fs";

const convertToRaw = async ({ file_path, length = 3, format = "base64" }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
      console.log(file_path, length, format);
      let audio_format;
      const duration = await getAudioDurationInSeconds(file_path);
      let start = duration > length ? duration / 2 - length / 2 : 0;
      start = moment.utc(start * 1000).format("HH:mm:ss");
      let end = duration > length ? duration / 2 + length / 2 : duration;
      end = moment.utc(end * 1000).format("HH:mm:ss");
      if (file_path.endsWith(".mp4")) {
        const file = await fetchFile(file_path);
        ffmpeg.FS("writeFile", "input.mp4", file);
        await ffmpeg.run("-i", "input.mp4", "-ac", "1", "output.mp3");
        audio_format = ffmpeg.FS("readFile", "output.mp3");
      } else {
        audio_format = await fetchFile(file_path);
      }
      ffmpeg.FS("writeFile", "input.mp3", audio_format);
      // convert to mp3 between start and end
      if (format === "binary") {
        await ffmpeg.run(
          "-i",
          "input.mp3",
          "-ss",
          String(start),
          "-to",
          String(end),
          "-acodec",
          "copy",
          "temp.mp3"
        );
        const data = ffmpeg.FS("readFile", "temp.mp3");
        const file_name = `${file_path.split(".")[0]}temp.mp3`;
        fs.writeFileSync(file_name, data);
        ffmpeg.exit();
        return resolve(file_name);
      }

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
      const binary = ffmpeg.FS("readFile", "output.raw");
      const base64 = Buffer.from(binary.buffer).toString("base64");
      ffmpeg.exit();
      return resolve(format === "base64" ? base64 : file_path);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

export default convertToRaw;
