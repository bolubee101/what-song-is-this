import mongoose from "mongoose";

const lyricsSchema = new mongoose.Schema({
  artist_name: {
    type: String,
    required: true,
  },
  track_name: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  lyrics: {
    type: String,
    required: true,
  },
});

const lyrics = mongoose.model("lyrics", lyricsSchema);

export const fetchById = async (id) => {
  return await lyrics.findById(id);
};

export const fetchRandomSong = async () => {
  const count = await lyrics.countDocuments();
  const rand = Math.floor(Math.random() * count);
  return await lyrics.findOne().skip(rand);
};

export default lyrics;
