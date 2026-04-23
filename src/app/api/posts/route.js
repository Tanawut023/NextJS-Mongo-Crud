import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/post";
import { NextResponse } from "next/server";


export async function POST(request) {

    const { title, image, content } = await request.json();
    console.log(title, image, content);
    await connectMongoDB();
    await Post.create({ title, image, content });
    return NextResponse.json({ message: "Post created successfully" }, { status: 201 });

}

export async function GET() {

    await connectMongoDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
}

export async function DELETE(request) {
    const  id  = await request.nextUrl.searchParams.get("id");
    console.log("DELETE ID:", id);
    await connectMongoDB();
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
}