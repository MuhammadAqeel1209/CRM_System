import { NextResponse } from 'next/server';
import  connectDatabase  from "@/app/libs/mongodb";
import Courses from '@/app/Model/Course';

export async function PUT(request, { params }) {
  await connectDatabase();
  const { id } = params;
  const data = await request.json();
  console.log(id)
  try {
    let contract = await Courses.findByIdAndUpdate(id, data);
    return NextResponse.json({ message: "Record updated", data }, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.error(new Error("Failed to update record"), { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectDatabase();
  try {
    const table = await Courses.findOne({ _id: id });
    if (!table) {
      return NextResponse.error(new Error("Record not found"), { status: 404 });
    }
    return NextResponse.json({ table }, { status: 200 });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.error(new Error("Failed to fetch record"), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectDatabase();
  try {
    const deletedRecord = await Courses.findByIdAndDelete(id);
    if (!deletedRecord) {
      return NextResponse.error(new Error("Record not found"), { status: 404 });
    }
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.error(new Error("Failed to delete record"), { status: 500 });
  }
}
