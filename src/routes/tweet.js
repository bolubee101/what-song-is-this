import express from "express";
import { sendTweet } from "../controllers/tweet.js";

const tweet_router = express.Router();

tweet_router.post("/post_tweet", sendTweet);

export default tweet_router;
