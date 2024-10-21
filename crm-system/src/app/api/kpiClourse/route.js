import connectDatabase from "@/app/libs/mongodb";
import mongoose from "mongoose";

export async function POST(req) {
  // Connect to MongoDB
  await connectDatabase();

  try {
    const { connection } = mongoose;

    const data = await req.json();
    const collectionName = data.collection;
    const fieldName = data.field;
    const values = data.values; // Get the values as an array

    // Check for required parameters
    if (!collectionName || !fieldName || values.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Construct the query to match documents where the field matches any of the values
    const query = {
      [fieldName]: { $in: values },
    };

    // Find all matching documents (you can limit if needed)
    const matchingDocuments = await connection
      .db.collection(collectionName)
      .find(query)
      .toArray(); // Convert the cursor to an array
      
    // Respond with the total number of matching documents
    return new Response(JSON.stringify({ count: matchingDocuments.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
