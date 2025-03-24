import mongoose from "mongoose";

import { Schema, Types } from "mongoose";

const photoSchema = new Schema({
    image: String,
    title: String,
    likes: Array,
    comments: [{
        comment: String,
        userName: String,
        userImage: String,
        userId: Types.ObjectId
    }],
    userId: {
        type: Types.ObjectId, 
        ref: "User",
      },
    userName: String,
},{
    timestamps: true
})

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;