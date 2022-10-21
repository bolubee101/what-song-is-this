// send the base64 data to the shazam api
import axios from "axios";
import convertToRaw from "../converters/rawConverter.js";
import { saveSong } from "../models.js/songs.js";

export const parseShazamResponse = async (song, in_reply_to_status_id_str) => {
  try {
    if (song?.matches?.length) {
      const sections = song.track.sections;
      const video_url_match = sections.find(
        (section) => section.type === "VIDEO"
      )?.youtubeurl?.actions[0]?.uri;

      const formatted = {
        song_name: song.track.title,
        song_artist: song.track.subtitle,
        song_url: video_url_match || song.track.url,
      };

      await saveSong({
        in_reply_to_status_id_str,
        match_payload: song,
        source: "shazam",
        ...formatted,
      });
      return formatted;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const shazamRequest = async (file_path, in_reply_to_status_id_str) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: "POST",
        url: "https://shazam.p.rapidapi.com/songs/detect",
        headers: {
          "content-type": "text/plain",
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "shazam.p.rapidapi.com",
        },
        data: await convertToRaw({ file_path }),
      };
      const resp = await axios(options);
      const response = await parseShazamResponse(
        resp.data,
        in_reply_to_status_id_str
      );
      return resolve(response);
    } catch (error) {
      return reject(error);
    }
  });
};

export default shazamRequest;
