"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function EditPostPage({ params }) {
    const { id } = use(params);

    const [postData, setPostData] = useState(null);

    //New data states
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newImage, setNewImage] = useState("");

    const router = useRouter();
    const getPostById = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch post");
            }
            const data = await response.json();
            console.log("edit post", data.post);
            setPostData(data.post);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newTitle, newImage, newContent })
            });
            console.log("response", response);
            if (!response.ok) {
                throw new Error("Failed to update post");
            }

            router.refresh();
            router.push("/");

        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    useEffect(() => {
        getPostById();
    }, [id]);

    return (
        <div className="container mx-auto py-10 font-sans">
            <h3 className="text-3xl font-bold">Edit Post</h3>
            <hr className="my-3" />
            <Link href="/" className="bg-gray-500 inline-block text-white border py-2 px-3 rounded my-2">
                Back to Posts
            </Link>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    className="w-[300px] block  py-2 px-2 rounded my-2 bg-gray-200 text-lg my-2"
                    placeholder={postData ? postData.title : "Post Title"}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <input
                    type="text"
                    className="w-[300px] block  py-2 px-2 rounded my-2 bg-gray-200 text-lg my-2"
                    placeholder={postData ? postData.image : "Image URL"}
                    onChange={(e) => setNewImage(e.target.value)}
                />
                <textarea
                    className="w-[300px] block  py-2 px-2 rounded my-2 bg-gray-200 text-lg my-2"
                    placeholder={postData ? postData.content : "Enter Your Content"}
                    cols="30"
                    rows="10"
                    onChange={(e) => setNewContent(e.target.value)}
                ></textarea>
                <button type="submit" className="bg-green-500 p-3 text-white rounded text-lg my-2">
                    Update Post
                </button>
            </form>
        </div>
    )
}

export default EditPostPage