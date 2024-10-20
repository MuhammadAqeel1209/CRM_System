import { NextResponse } from 'next/server';
import connectDatabase from "@/app/libs/mongodb";
import ContactDetailModel from "@/app/Model/DataCollection"; 

export async function PUT(request, { params }) {
  await connectDatabase();
  const { id } = params;
  const data = await request.json();
  try {
    // Use the renamed import
    const updatedContactDetail = await ContactDetailModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedContactDetail) {
      return NextResponse.error(new Error("Record not found"), { status: 404 });
    }
    return NextResponse.json({ message: "Record updated", data: updatedContactDetail }, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.error(new Error("Failed to update record"), { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectDatabase();
  try {
    const table = await ContactDetailModel.findOne({ _id: id });
    console.log(table)
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
    const deletedRecord = await ContactDetailModel.findByIdAndDelete(id);
    if (!deletedRecord) {
      return NextResponse.error(new Error("Record not found"), { status: 404 });
    }
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.error(new Error("Failed to delete record"), { status: 500 });
  }
}
