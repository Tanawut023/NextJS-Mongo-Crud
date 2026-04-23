import { connectMongoDB } from "../../../../../lib/mongodb";
import Post from "../../../../../models/post";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = await params;
    await connectMongoDB();
    const post = await Post.findById(id);
    return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const { newTitle : title, newImage : image, newContent : content } = await request.json();
    await connectMongoDB();
    await Post.findByIdAndUpdate(id, { title, image, content });
    return NextResponse.json({ message: "Post updated successfully" }, { status: 200 });
}