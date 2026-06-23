import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = await params;
    await connectMongoDB();
    const user = await User.findById(id);
    return NextResponse.json({ user }, { status: 200 });
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const { newName: name, newAge: age, newEmail: email, newAvatarUrl: avatarUrl } = await request.json();
    await connectMongoDB();

    // validation
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

    // check for email uniqueness (exclude current user)
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== id) {
        return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    await User.findByIdAndUpdate(id, { name, age: Number(age), email, avatarUrl });
    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
}
