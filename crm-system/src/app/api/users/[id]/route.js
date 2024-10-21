import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDatabase from "@/app/libs/mongodb";
import Users from '@/app/Model/User';

export async function PUT(request, { params }) {
  await connectDatabase();
  const { id } = params;
  const data = await request.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const updatedUser = await Users.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Record updated", data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectDatabase();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const user = await Users.findById(id);
    if (!user) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectDatabase();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const deletedUser = await Users.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
