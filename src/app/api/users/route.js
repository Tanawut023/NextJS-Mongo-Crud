import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { NextResponse } from "next/server";


export async function POST(request) {
    const { name, age, email, avatarUrl } = await request.json();

    await connectMongoDB();

    // Basic server-side validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    if (!name || !email || age === undefined) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    if (isNaN(Number(age))) {
        return NextResponse.json({ message: "Age must be a number" }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    await User.create({ name, age: Number(age), email, avatarUrl });
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

}

export async function GET(request) {
    await connectMongoDB();

    const url = request.nextUrl;
    const pageParam = url.searchParams.get("page") || "1";
    const limitParam = url.searchParams.get("limit") || "8";
    const qParam = url.searchParams.get("q") || "";

    const page = Math.max(parseInt(pageParam, 10) || 1, 1);
    const limit = Math.max(parseInt(limitParam, 10) || 8, 1);
    const skip = (page - 1) * limit;

    // build search filter if query provided
    const filter = qParam
        ? { $or: [{ name: { $regex: qParam, $options: 'i' } }, { email: { $regex: qParam, $options: 'i' } }] }
        : {};

    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json(
        { users, pagination: { totalUsers, totalPages, page, limit } },
        { status: 200 }
    );
}

export async function DELETE(request) {
    const id = await request.nextUrl.searchParams.get("id");
    console.log("DELETE ID:", id);
    await connectMongoDB();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
}
