import connectDatabase from "@/app/libs/mongodb";
import ContactDetailModel from "@/app/Model/DataCollection";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  await connectDatabase();
  try {
    const contactDetail = await ContactDetailModel.findById(id);
    if (!contactDetail) {
      return NextResponse.error(new Error("Record not found"), { status: 404 });
    }
    return NextResponse.json({ success: true, status: 200, data: contactDetail }, { status: 200 });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.error(new Error("Failed to fetch record"), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  await connectDatabase();
  const data = await request.json();
  try {
    const updatedContactDetail = await ContactDetailModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedContactDetail) {
      return NextResponse.error(new Error("Record not found"), { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Record updated", data: updatedContactDetail }, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.error(new Error("Failed to update record"), { status: 500 });
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
    return NextResponse.json({ success: true, message: "Record deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.error(new Error("Failed to delete record"), { status: 500 });
  }
}
