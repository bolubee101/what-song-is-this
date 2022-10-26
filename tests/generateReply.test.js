import { generateReplyToVideoTag } from "../src/utils/generateReply";

describe("test cases for generateReplyToVideoTag function", () => {
  it("should be defined", () => {
    expect(generateReplyToVideoTag).toBeDefined();
  });

  it("should return an error response when song not found", () => {
    const song = undefined;

    const username = "xavier577";

    const result = generateReplyToVideoTag(song, username);

    const expectedResult = `I have failed you @${username}, for I could not find the song in this video.`;

    expect(result).toEqual(expectedResult);
  });

  it("should generate video tag when a song is found", () => {
    const song = {
      song_name: "joha",
      song_artist: "Asake",
      song_url:
        "https://open.spotify.com/track/5UwxpuGHkwiojKDaPC5ZNu?si=b6da9edeed8d4a97",
      track: {
        title: "joha",
      },
    };

    const username = "xavier577";

    const result = generateReplyToVideoTag(song, username);

    const expectedResult = `My lord @${username} I think this song is "${song.song_name}" by "${song.song_artist}" You can check out the song here: 
    ${song.song_url}`;

    expect(result).toEqual(expectedResult);
  });
});
