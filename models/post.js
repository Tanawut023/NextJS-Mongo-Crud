import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: String,
        image: String,
        content: String,
    },
    { timestamps: true }
);


const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;