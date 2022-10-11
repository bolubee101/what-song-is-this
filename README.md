# what-song-is-this
Twitter bot to find what song is playing in a given uploaded twitter video.

### How to setup.
```sh
npm install
```

### How to run.
- via npm script
```sh
npm start
```

- via node in terminal
```sh
node --experimental-wasm-threads src/app.js
```

This bot makes use of the wasm ffmpeg package for converting between multimedia types. Running webassembly with threads on node js requires the `experimental-wasm-threads` flag when starting.

### Testing
```sh
npm test
```

> Test files should be created with '.test.js' prefix.

### How it works
- A twitter user would tag the bot under a video with @[whatsongishere](https://twitter.com/whatsongishere)
- The bot running in a loop(cron job) would listen for its mentions. 
- For any mention found, it checks firstly for if it has attended to this mention before. If it has, it ignores the mention
- If it hasn't attended to this mention before, it checks the DB if it has been mentioned on that song before. If it has, it uses the same response from before.
- If it hasn't been mentioned to the video before, it converts the video to the required format and makes a request to the shazam API to recognize it.
- Depending on the response from shazam(or whatever service integrated) it replies the at with the relevant reply.

![whatsongishere-in-action](https://user-images.githubusercontent.com/32003376/194798089-b033de58-4885-4ca8-ae8d-132ce02e100a.jpeg)


### Currently receiving contributions for Hacktoberfest. PRs are not limited to the issues created.



