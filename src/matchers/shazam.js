// send the base64 data to the shazam api
import axios from "axios";
import convertToRaw from "../converters/rawConverter.js";
const shazamRequest = async (file_path) => {
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
        data: await convertToRaw(file_path),
      };
      const resp = await axios(options);
      return resolve(resp.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export default shazamRequest;
