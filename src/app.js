import mongoose from "mongoose";
import Cronjob from "./index.js";

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
    } catch (error) {
      console.log(error);
    }
  }
);
