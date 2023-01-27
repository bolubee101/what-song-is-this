import axios from "axios";
import cheerio from "cheerio";

export const parseHtmlLyrics = async (lyrics) => {
  // Load the lyricsHtml into cheerio
  const $ = cheerio.load(lyrics);

  // Replace <br>\n with new line characters
  $("br").replaceWith("\n");

  // Remove all html tags and attributes within the <p> tags
  $("p").children().remove();

  // Get the cleaned lyrics
  lyrics = $("p").text();

  return lyrics;
};

export const fetchLyricsById = async (id) => {
  try {
    const options = {
      method: "GET",
      url: "https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/",
      params: { id },
      headers: {
        "X-RapidAPI-Key": "919a7b42e4mshb418f091f6edaf6p1f83c7jsna2e0b1b00336",
        "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
      },
    };

    const resp = await axios(options);
    const lyrics = parseHtmlLyrics(resp.data.lyrics.lyrics.body.html);
    return lyrics;
  } catch (error) {
    console.log(error.message);
  }
};

export const findLyrics = async (keyword) => {
  try {
    const options = {
      method: "GET",
      url: "https://genius-song-lyrics1.p.rapidapi.com/search/",
      params: { q: keyword, per_page: "10", page: "1" },
      headers: {
        "X-RapidAPI-Key": "919a7b42e4mshb418f091f6edaf6p1f83c7jsna2e0b1b00336",
        "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
      },
    };
    const resp = await axios(options);
    const lyrics = await fetchLyricsById(resp.data.hits[0].result.id);
    return lyrics;
  } catch (error) {
    console.log("error finding lyrics");
  }
};
