"use client "

import React from 'react'

function DeleteBTN({ id }) {

    const handleDelete = async () => {
        const confirmation = confirm("Are you sure you want to delete this post?");
        //console.log("id:", id);
        

        if (confirmation) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts?id=${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    window.location.reload();
                }

            } catch (error) {
                console.error("Error deleting post:", error);
                alert("An error occurred while deleting the post. Please try again.");
            }
        }
        

        
    }

    return (
            <a onClick={handleDelete} className="bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2">
                Delete
            </a>
        )
}

export default DeleteBTN