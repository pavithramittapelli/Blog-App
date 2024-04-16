const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const PostSchema = new Schema({
    title: { type: String, unique: true },
    summary: String,
    content: String,
    file: String,
    cover: String,
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
},
    {
        timestamps: true
    }

)
const PostModel = model('Post', PostSchema);
module.exports = PostModel;