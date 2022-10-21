import axios from "axios";
import convertToRaw from "../converters/rawConverter.js";
import FormData from "form-data";
import fs from "fs";
import { saveSong } from "../models.js/songs.js";

const parseAuddioResponse = async (song, in_reply_to_status_id_str) => {
  try {
    if (song?.status === "success") {
      const formatted = {
        song_name: song?.result?.title,
        song_artist: song?.result?.artist,
        song_url: song?.result?.song_link,
      };
      await saveSong({
        in_reply_to_status_id_str,
        match_payload: song,
        source: "audd.io",
        ...formatted,
      });
      return formatted;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const auddio = async (file_path, in_reply_to_status_id_str) => {
  const file_name = `${file_path.split(".")[0]}temp.mp3`;
  try {
    const formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream(
        await convertToRaw({ file_path, length: 10, format: "binary" })
      )
    );
    formData.append("return", "apple_music, spotify");
    formData.append("api_token", process.env.AUDDIO_API_KEY);
    // send with axios
    const response = await axios.post("https://api.audd.io/", formData, {
      headers: formData.getHeaders(),
    });
    fs.unlinkSync(file_name);
    return await parseAuddioResponse(response.data, in_reply_to_status_id_str);
  } catch (error) {
    console.log(error);
    fs.unlinkSync(file_name);
    throw new Error(error);
  }
};

export default auddio;
