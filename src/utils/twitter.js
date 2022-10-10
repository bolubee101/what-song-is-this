import Twit from 'twit';
import { twitConfig } from '../config/twitConfig.js';
const T = new Twit(twitConfig);

class Tweet {
  constructor() {
    this.tweet = 'Hello World';
  }

  /**
   *
   * @param {*} id This is the id of the tweet whose data you want to get
   * @returns the data of the tweet as an object with the following properties: tweet, video_url
   */
  async getTweet(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const tweet = await T.get('statuses/show', {
          id,
          tweet_mode: 'extended',
        });
        const video_url = tweet.data.extended_entities
          ? tweet.data.extended_entities.media[0].video_info.variants[0].url
          : null;
        return resolve({ tweet: tweet.data, video_url });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *
   * @param {*} text This is the text you want to tweet
   * @returns the tweet data as an object
   */
  async postTweet(text) {
    return new Promise(async (resolve, reject) => {
      try {
        const tweet = await T.post('statuses/update', { status: text });
        return resolve(tweet.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *
   * @param {*} text This is the text you want to tweet
   * @param {*} id The id of the tweet you want to reply to
   * @returns the tweet data as an object
   */
  async replyTweet(text, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const tweet = await T.post('statuses/update', {
          status: text,
          in_reply_to_status_id: id,
        });
        return resolve(tweet.data);
      } catch (error) {
        console.log(error.message);
        reject(error);
      }
    });
  }

  /**
   *
   * @returns the tweet data of all mentions as an array of objects
   */
  async getMentions() {
    return new Promise(async (resolve, reject) => {
      try {
        const tweets = await T.get('statuses/mentions_timeline', {
          count: 5,
          tweet_mode: 'extended',
        });
        const mentions = tweets.data.filter(
          (tweet) => tweet.in_reply_to_status_id_str,
        );
        return resolve(mentions);
      } catch (error) {
        console.log(error.message);
        reject(error);
      }
    });
  }
}

export default Tweet;