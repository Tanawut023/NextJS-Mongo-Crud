"use client";

import { useState, React } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


function CreateUserPage() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || age === "") {
            alert("Please fill in all required fields");
            return;
        }
        if (isNaN(Number(age))) {
            alert("Age must be a number");
            return;
        }
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(email)) {
            alert("Invalid email format");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, age, email, avatarUrl })
            });

            if (response.ok) {
                router.push("/");
            } else {
                throw new Error("Failed to create user");
                
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };


    return (
        <div className="container mx-auto py-10 font-sans">
            <h3 className="text-3xl font-bold">Create User</h3>
            <hr className="my-3" />
            <Link href="/" className="bg-gray-500 inline-block text-white border py-2 px-3 rounded my-2">
                Back to Users
            </Link>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder="Age"
                    onChange={(e) => setAge(e.target.value)}
                />
                <input
                    type="email"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder="Avatar URL"
                    onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <button type="submit" className="bg-green-500 p-3 text-white rounded text-lg my-2">
                    Create User
                </button>
            </form>
        </div>
    )
}

export default CreateUserPage