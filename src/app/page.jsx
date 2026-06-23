"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteBTN from "./delete";

export default function Home() {

  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");


  console.log(userData);


  const getUsers = async () => {
    try {
      const q = debouncedQuery ? `&q=${encodeURIComponent(debouncedQuery)}` : "";
      const response = await fetch(
        `http://localhost:3000/api/users?page=${currentPage}&limit=${limit}${q}`,
        { method: "GET", cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUserData(data.users || []);
      if (data.pagination) {
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
      }

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // debounce query input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  // fetch when page or debounced query changes
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedQuery]);

  return (
    <main className="container mx-auto my-3font-sans">
      <h1>NextJS Crud + MongoDB</h1>
      <hr className="my-3" />
      <button className="bg-green-500 p-3 text-white rounded"><Link href="/create">Create User</Link></button>
      <div className="mt-3">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
          placeholder="Search by name or email"
          className="w-[300px] py-2 px-2 rounded bg-gray-200"
        />
      </div>
      <div className="grid grid-cols-4 mt-3 gap-5">
        {userData && userData.length > 0 ? (
          userData.map((user) => (
            <div key={user._id} className="shadow-xl my-10 p-10 rounded-xl">
              <h4 className="text-lg font-semibold">{user.name}</h4>
              {user.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} width={120} height={120} />
              )}
              <p>Age: {user.age}</p>
              <p>Email: {user.email}</p>
              <div className="mt-5">
                <Link className="bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2" href={`/edit/${user._id}`}>Edit </Link>
                <DeleteBTN id={user._id} />
              </div>
            </div>
          ))
        ) : (
          <p className="bg-gray-300 p-3 my-3">No users available.</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </main>
  );
}
