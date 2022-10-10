import mongoose from 'mongoose';

const mentionSchema = new mongoose.Schema({
    tweet_id: {
        type: String,
        required: true,
        unique: true,
    },
    tweet_text: {
        type: String,
        required: false,
    },
    tweet_user: {
        type: String,
        required: true,
    },
    match_response: {
        type: String,
        required: false,
    },
    in_reply_to_status_id_str: {
        type: String,
        required: false,
    },
    song_name: {
        type: String,
        required: false,
    },
    song_artist: {
        type: String,
        required: false,
    },
    song_url: {
        type: String,
        required: false,
    },
});

const Mention = mongoose.model('mention', mentionSchema);

/**
 * save a mention to the database
 * @param {*} mention the mention object
 * @param {string} mention.tweet_id the id of the tweet
 * @param {string} mention.tweet_text the text of the tweet
 * @param {string} mention.tweet_user the user who tweeted
 * @param {string} mention.match_response the url of the song in the tweet
 * @param {string} mention.in_reply_to_status_id_str the id of the tweet the mention is replying to
 *  
 */
export const saveMention = async (mention) => {
    return new Promise(async (resolve, reject) => {
        const newMention = new Mention(mention);
        try {
            await newMention.save();
            return resolve(newMention)
        } catch (error) {
            return reject(error)
        }
    })
};

// fetch tweet mention by id
export const getMention = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mention = await Mention.findOne({ tweet_id: id });
            return resolve(mention);
        } catch (error) {
            return reject(error)
        }
    })
};

// fetch all mentions in the array of ids
export const getMentions = async (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mentions = await Mention.find({ in_reply_to_status_id_str: { $in: ids } });
            return resolve(mentions);
        } catch (error) {
            return reject(error)
        }
    })
};

export default Mention;