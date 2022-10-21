// function that takes in an song object and a username and returns a reply string

export const generateReplyToVideoTag = (song, username) => {
  if (!song?.song_name && !song?.track?.title) {
    return `I have failed you @${username}, for I could not find the song in this video.`;
  }
  const song_name = song.song_name;
  const song_artist = song.song_artist;
  const song_url = song.song_url;

  return `My lord @${username} I think this song is "${song_name}" by "${song_artist}" You can check out the song here: 
    ${song_url}`;
};
