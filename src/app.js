import mongoose from "mongoose";
import Cronjob from "./index.js";
import express from "express";
const app = express();

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
