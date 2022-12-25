// function that takes in an song object and a username and returns a reply string

import { generateText } from "./gpt3.js";

export const generateReplyToVideoTag = async (song, username) => {
  if (!song?.song_name && !song?.track?.title) {
    return `I have failed you @${username}, for I could not find the song in this video.`;
  }

  const song_name = song.song_name;
  const song_artist = song.song_artist;
  const song_url = song.song_url;

  const prompt = `given the username_of_user_that_requested as @${username}, songname as ${song_name}, song artist as ${song_artist}, and song url as ${song_url} generate a tweet similar to "My lord @username_of_user_that_requested I think this song is 'song_name' by 'song_artist' You can check out the song here: song_url"
  If you know the twitter handle of the artist, include it in your response after the artist name, if not ignore. Be creative. Also, if you know a fun fact about the song, find a way to include it in your response.`;

  // return `My lord @${username} I think this song is "${song_name}" by "${song_artist}" You can check out the song here:
  //   ${song_url}`;
  let response = await generateText(prompt);
  return response;
};
