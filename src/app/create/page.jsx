"use client";

import { useState, React } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


function CreatePostPage() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Title:", title);
        console.log("Image:", image);
        console.log("Content:", content);

        if (!title || !content || !image) {
            alert("Please fill in all fields");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, image, content })
            });

            if (response.ok) {
                router.push("/");
            }else {
                throw new Error("Failed to create post");
                
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };


    return (
        <div className="container mx-auto py-10 font-sans">
            <h3 className="text-3xl font-bold">Create Post</h3>
            <hr className="my-3" />
            <Link href="/" className="bg-gray-500 inline-block text-white border py-2 px-3 rounded my-2">
                Back to Posts
            </Link>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    className="w-[300px] block  py-2 px-2 rounded my-2 bg-gray-200 text-lg my-2"
                    placeholder="Post Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    className="w-[300px] block  py-2 px-2 rounded my-2 bg-gray-200 text-lg my-2"
                    placeholder="Image URL"
                    onChange={(e) => setImage(e.target.value)}
                />
                <textarea
                    className="w-[300px] block  py-2 px-2 rounded my-2 bg-gray-200 text-lg my-2"
                    placeholder="Enter Your Content"
                    cols="30"
                    rows="10"
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button type="submit" className="bg-green-500 p-3 text-white rounded text-lg my-2">
                    Create Post
                </button>
            </form>
        </div>
    )
}

export default CreatePostPage