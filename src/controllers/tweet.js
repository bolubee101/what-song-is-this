import { hands } from "../index.js";
import { response } from "../utils/response.js";

export const sendTweet = async (req, res) => {
  try {
    // create middleware as PR
    if (!req.headers.authorization) {
      return response(res, 401, "Unauthorized");
    }

    if (req.headers.authorization !== process.env.AUTH_TOKEN) {
      return response(res, 401, "Unauthorized");
    }
    const { tweet } = req.body;

    if (!tweet) {
      return response(res, 400, "tweet is required");
    }

    if (tweet.length > 280) {
      return response(res, 400, "tweet should not be more than 280 characters");
    }

    const tweet_data = await hands.postTweet(tweet);
    return response(res, 200, "tweet sent successfully", tweet_data);
  } catch (error) {
    console.log(error.message);
    response(
      res,
      500,
      "Something went wrong while processing this request!",
      null
    );
  }
};
