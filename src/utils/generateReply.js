// function that takes in an song object and a username and returns a reply string

export const generateReplyToVideoTag = (song, username, new_match = false) => {
    if (!song?.song_name && !song?.track?.title) {
        return `I have failed you @${username}, for I could not find the song in this video.`;
    }
    const song_name = !new_match ? song.song_name : song.track.title;
    const song_artist = !new_match ? song.song_artist : song.track.subtitle;
    const song_url = !new_match ? song.song_url : song.track.url
    const video_url = song?.track?.sections?.find(
        (section) => section.type === 'VIDEO',
    )?.youtubeurl?.actions[0]?.uri;

    return `My lord @${username} I think this song is "${song_name}" by "${song_artist}" You can check out the song here: 
    ${video_url || song_url}`;
}