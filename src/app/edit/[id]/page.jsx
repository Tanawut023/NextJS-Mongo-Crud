"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function EditUserPage({ params }) {
    const { id } = use(params);

    const [userData, setUserData] = useState(null);

    //New data states
    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newAvatarUrl, setNewAvatarUrl] = useState("");

    const router = useRouter();
    const getUserById = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: "GET",
                cache: "no-store",
            });

                    if (!response.ok) {
                        throw new Error("Failed to fetch user");
                    }
                    const data = await response.json();
                    console.log("edit user", data.user);
                    setUserData(data.user);
        } catch (error) {
                    console.error("Error fetching user:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newName, newAge, newEmail, newAvatarUrl })
            });
            console.log("response", response);
            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            router.refresh();
            router.push("/");

        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    useEffect(() => {
        getUserById();
    }, [id]);

    return (
        <div className="container mx-auto py-10 font-sans">
            <h3 className="text-3xl font-bold">Edit User</h3>
            <hr className="my-3" />
            <Link href="/" className="bg-gray-500 inline-block text-white border py-2 px-3 rounded my-2">
                Back to Users
            </Link>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder={userData ? userData.name : "Name"}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <input
                    type="text"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder={userData ? String(userData.age) : "Age"}
                    onChange={(e) => setNewAge(e.target.value)}
                />
                <input
                    type="email"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder={userData ? userData.email : "Email"}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <input
                    type="text"
                    className="w-[300px] block py-2 px-2 rounded my-2 bg-gray-200 text-lg"
                    placeholder={userData ? userData.avatarUrl : "Avatar URL"}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                />
                <button type="submit" className="bg-green-500 p-3 text-white rounded text-lg my-2">
                    Update User
                </button>
            </form>
        </div>
    )
}

export default EditUserPage