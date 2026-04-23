"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteBTN from "./delete";

export default function Home() {

  const [postData, setPostData] = useState([]);


  console.log(postData);


  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPostData(data);

    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <main className="container mx-auto my-3font-sans">
      <h1>NextJS Crud + MongoDB</h1>
      <hr className="my-3" />
      <button className="bg-green-500 p-3 text-white rounded"><Link href="/create">Create Post</Link></button>
      <div className="grid grid-cols-4 mt-3 gap-5">
        {postData && postData.length > 0 ? (
          postData.map((post) => (
            <div key={post._id} className="shadow-xl my-10 p-10 rounded-xl">
              <h4>{post.title}</h4>
              <img src={post.image} alt={post.title} width={300} height={0} />
              <p>{post.content}</p>
              <div className="mt-5">
                <Link className="bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2" href={`/edit/${post._id}`}>Edit </Link>
                <DeleteBTN id={post._id} />
              </div>
            </div>
          ))
        ) : (
          <p className="bg-gray-300 p-3 my-3">No posts available.</p>
        )}
      </div>
    </main>
  );
}
