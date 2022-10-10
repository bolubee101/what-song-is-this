import mongoose from 'mongoose';
import fs from 'fs';
import shazamRequest from './matchers/shazam.js';
import request from 'request';
import { getMention, getMentions, saveMention } from './models.js/mentions.js';
import { getSong, saveSong } from './models.js/songs.js';
import { generateReplyToVideoTag } from './utils/generateReply.js';
import Tweet from './utils/twitter.js';

import PQueue from 'p-queue';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
}, async (err) => {
  if (err) {
    console.log(err.message);
    return
  }
  console.log('Connected to MongoDB');
  const queue = new PQueue({ concurrency: 1 });

  const hands = new Tweet();

  const mentions = await hands.getMentions();
  const mention_ids = mentions.map((mention) => mention.id_str);
  const db_mentions = await getMentions(mention_ids);

  const new_mentions = mentions.filter((mention) => {
    const found = db_mentions.find((db_mention) => db_mention.tweet_id === mention.id_str);
    return !found;
  });

  for (let i = 0; i < new_mentions.length; i++) {
    try {
      const find_mention = await getMention(mentions[i].id_str);
      if (find_mention) {
        continue;
      }
      const tweet = mentions[i].in_reply_to_status_id_str;
      const song = await getSong(tweet)
      if (song) {
        const response = generateReplyToVideoTag(song, mentions[i].user.screen_name);
        await hands.replyTweet(mentions[i].id_str, response);
        await saveMention({
          tweet_id: mentions[i].id_str,
          tweet_text: mentions[i].full_text,
          tweet_user: mentions[i].user.screen_name,
          in_reply_to_status_id_str: mentions[i].in_reply_to_status_id_str,
          song_name: song.song_name,
          song_artist: song.song_artist,
          song_url: song.song_url,
        })
        continue;
      }
      const tweet_data = await hands.getTweet(tweet);
      const video_url = tweet_data.video_url || null;
      if (video_url) {
        const file_name = `${tweet_data.tweet.id_str}.mp4`;
        const file = fs.createWriteStream(file_name);
        const stream = request(video_url).pipe(file);
        stream.on('finish', async () => {
          queue.add(async () => {
            console.log('Processing...', file_name);
            try {
              const song = await shazamRequest(file_name);
              if (song?.matches?.length) {
                const song_url = song.track.url;
                const sections = song.track.sections;
                const video_url_match = sections.find(
                  (section) => section.type === 'VIDEO',
                )?.youtubeurl?.actions[0]?.uri;
                const text = generateReplyToVideoTag(song, mentions[i].user.screen_name, true);
                await hands.replyTweet(text, mentions[i].id_str);
                await saveMention({
                  tweet_id: mentions[i].id_str,
                  tweet_text: mentions[i].full_text,
                  tweet_user: mentions[i].user.screen_name,
                  in_reply_to_status_id_str: mentions[i].in_reply_to_status_id_str,
                  song_name: song.track.title,
                  song_artist: song.track.subtitle,
                  song_url: video_url_match || song_url
                })
                await saveSong({
                  in_reply_to_status_id_str: tweet_data.tweet.id_str,
                  song_name: song.track.title,
                  song_artist: song.track.subtitle,
                  song_url: video_url_match || song_url,
                  match_payload: song
                })
              } else {
                const text = generateReplyToVideoTag(null, mentions[i].user.screen_name, false);
                await hands.replyTweet(text, mentions[i].id_str);
                await saveMention({
                  tweet_id: mentions[i].id_str,
                  tweet_text: mentions[i].full_text,
                  tweet_user: mentions[i].user.screen_name,
                  in_reply_to_status_id_str: mentions[i].in_reply_to_status_id_str,
                  song_name: null,
                  song_artist: null,
                  song_url: null,
                })
              }
              fs.unlinkSync(file_name);
            } catch (error) {
              fs.unlinkSync(file_name);
              console.log(error.message);
            }
          });
        });
      } else {
        const text = `My lord @${mentions[i].user.screen_name} I can't find a video in that tweet`;
        await hands.replyTweet(text, mentions[i].id_str);
        await saveMention({
          tweet_id: mentions[i].id_str,
          tweet_text: mentions[i].full_text,
          tweet_user: mentions[i].user.screen_name,
          in_reply_to_status_id_str: mentions[i].in_reply_to_status_id_str,
        })
      }
    } catch (error) {
      console.log(error.message)
    }
  }
});