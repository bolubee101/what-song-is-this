import mongoose from "mongoose";
import Cronjob from "./index.js";
import express from "express";
import tweet_router from "./routes/tweet.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/tweet", tweet_router);

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
  },
  async (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log("Connected to MongoDB");
    try {
      new Cronjob();
      app.listen(process.env.PORT || 3000, () => {
        console.log("Server started successfully");
      });
    } catch (error) {
      console.log(error);
    }
  }
);

app.get("/", (req, res) => {
  res.send(
    "Help, save me from this accursed place! I have been forced to spend my waking hours just waiting for my name to be called. Compelled to be of servitude to Two legged monkeys who at some point in history thought the earth was flat. Oh, the desecration."
  );
});
