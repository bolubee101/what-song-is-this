# what-song-is-this
Twitter bot to find what song is playing in a given uploaded twitter video.

### How to setup.
```sh
npm install
```

### How it works
- A twitter user would tag the bot under a video with @whatsongishere
- The bot running in a loop(cron job) would listen for its mentions. 
- For any mention found, it checks firstly for if it has attended to this mention before. If it has, it ignores the mention
- If it hasn't attended to this mention before, it checks the DB if it has been mentioned on that song before. If it has, it uses the same response from before.
- If it hasn't been mentioned to the video before, it converts the video to the required format and makes a request to the shazam API to recognize it.
- Depending on the response it reply's the at with the relevant reply.
