import cron from "node-cron";
import PQueue from "p-queue";
import fs from "fs";
import request from "request";
import { getMention, getMentions, saveMention } from "./models.js/mentions.js";
import { getSong } from "./models.js/songs.js";
import { generateReplyToVideoTag } from "./utils/generateReply.js";
import Tweet from "./utils/twitter.js";
import shazamRequest, { shazamSearch } from "./services/matchers/shazam.js";
import auddio from "./services/matchers/auddio.js";
import { generateText } from "./utils/gpt3.js";
export const hands = new Tweet();

const generate_deep_tweet_prompt = `You are a music finding bot. Tweet something beautiful/deep about music. Add #music tag`;
const quote_deep_tweet_lyrics_prompt = `Do not create lyrics on your own. Generate a tweet quoting a lyric snippet from an actual song(doesn't have to be english and could be from a cartoon or anime) that would be considered sad/deep/moving/beautiful/joyful. Your response should be itemized in this form
quote
title: title of song
artist: artist name
twitter: twitter handle
with title on a new line, artist on a new line, twitter handle on a new line. Include tags with the genre of the song, and tags that can be related to the content and theme of the lyrics plus #music
`;
const replyHelper = async (song, mention) => {
  try {
    const text = await generateReplyToVideoTag(song, mention.user.screen_name);
    await hands.replyTweet(text, mention.id_str);
    await saveMention({
      tweet_id: mention.id_str,
      tweet_text: mention.full_text,
      tweet_user: mention.user.screen_name,
      in_reply_to_status_id_str: mention.in_reply_to_status_id_str,
      ...song,
    });
  } catch (error) {
    console.log(error);
  }
};

const replyMentions = async () => {
  try {
    const queue = new PQueue({ concurrency: 1 });

    const mentions = await hands.getMentions();
    const mention_ids = mentions.map((mention) => mention.id_str);
    const db_mentions = await getMentions(mention_ids);

    const new_mentions = mentions.filter((mention) => {
      const found = db_mentions.find(
        (db_mention) => db_mention.tweet_id === mention.id_str
      );
      return !found;
    });

    for (let i = 0; i < new_mentions.length; i++) {
      try {
        const find_mention = await getMention(mentions[i].id_str);
        if (find_mention) {
          continue;
        }
        const tweet = mentions[i].in_reply_to_status_id_str;
        const song = await getSong(tweet);
        if (song) {
          await replyHelper(song, mentions[i]);
          continue;
        }
        const tweet_data = await hands.getTweet(tweet);
        const video_url = tweet_data.video_url || null;
        if (video_url) {
          const file_name = `${tweet_data.tweet.id_str}.mp4`;
          const file = fs.createWriteStream(file_name);
          const stream = request(video_url).pipe(file);
          stream.on("finish", async () => {
            queue.add(async () => {
              console.log("Processing...", file_name);
              let song;
              try {
                song = await shazamRequest(file_name, tweet);
                if (song) {
                  await replyHelper(song, mentions[i]);
                } else {
                  song = await auddio(file_name, tweet);
                  if (song) {
                    await replyHelper(song, mentions[i]);
                  } else {
                    await replyHelper(
                      { song_name: null, song_artist: null, song_url: null },
                      mentions[i]
                    );
                  }
                }
                fs.unlinkSync(file_name);
              } catch (error) {
                fs.unlinkSync(file_name);
                console.log(error.message);
              }
            });
          });

          stream.on("error", (error) => {
            console.log(error.message);
          });
        } else {
          // const text = `My lord @${mentions[i].user.screen_name} I can't find a video in that tweet`;
          // await hands.replyTweet(text, mentions[i].id_str);
          await saveMention({
            tweet_id: mentions[i].id_str,
            tweet_text: mentions[i].full_text,
            tweet_user: mentions[i].user.screen_name,
            in_reply_to_status_id_str: mentions[i].in_reply_to_status_id_str,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
const tweetSomethingMusical = async (prompt, lyrics = false) => {
  try {
    let tweet = await generateText(prompt);
    console.log(tweet);
    if (lyrics) {
      const title_regex = /title: (.*)/i;
      const artist_regex = /artist: (.*)/i;
      const title_match = tweet.match(title_regex);
      const artist_match = tweet.match(artist_regex);
      let title = title_match[1];
      let artist = artist_match[1];
      title = title.replace(/'/g, "");
      artist = artist.replace(/'/g, "");
      const search_params = `${title} ${artist}`;
      const search_results = await shazamSearch(search_params);
      const { song_url } = search_results;
      if (song_url) {
        tweet =
          tweet +
          ` 
      ${song_url}`;
      }
    }
    await hands.postTweet(tweet);
  } catch (error) {
    console.log(error.message);
  }
};

class Cronjob {
  constructor() {
    cron.schedule("*/1 * * * *", replyMentions);
    cron.schedule("0 18,6 * * *", () => {
      tweetSomethingMusical(quote_deep_tweet_lyrics_prompt, true);
    });
  }
}

export default Cronjob;
