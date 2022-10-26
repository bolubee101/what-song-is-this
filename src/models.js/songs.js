// model for songs that have been matched before.
import mongoose from "mongoose";
const songSchema = new mongoose.Schema({
  in_reply_to_status_id_str: {
    type: String,
    required: true,
    unique: true,
  },
  song_name: {
    type: String,
    required: true,
    unique: false,
  },
  song_artist: {
    type: String,
    required: true,
    unique: false,
  },
  song_url: {
    type: String,
    required: true,
    unique: false,
  },
  match_payload: {
    type: Object,
    required: true,
    unique: false,
  },
  source: {
    type: String,
    required: true,
  },
});

const Song = mongoose.model("song", songSchema);

/**
 * save a song to the database
 * @param {*} song the song object
 * @param {string} song.in_reply_to_status_id_str the id of the tweet the mention is replying to
 * @param {string} song.song_name the name of the song
 * @param {string} song.song_artist the artist of the song
 * @param {string} song.song_url the url of the song
 *
 */
export const saveSong = async (song) => {
  const newSong = new Song(song);
  try {
    const song = await newSong.save();
    return song;
  } catch (error) {
    console.log(error.message);
  }
};

/**
 *
 * @param {string} in_reply_to_status_id_str the id of the tweet the mention is replying to
 * @returns
 */
export const getSong = async (in_reply_to_status_id_str) => {
  try {
    const song = await Song.findOne({ in_reply_to_status_id_str });
    return song;
  } catch (error) {
    console.log(error.message);
  }
};
