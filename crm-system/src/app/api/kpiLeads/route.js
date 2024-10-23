import connectDatabase from "@/app/libs/mongodb";
import mongoose from "mongoose";

export async function POST(req) {
  // Connect to MongoDB
  await connectDatabase();

  try {
    const { connection } = mongoose;

    // Parse the URL for query parameters
    const data = await req.json();
    const collectionName = data.collection;
    const fieldName = data.field;
    const values = data.values; // Get the values as an array
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);


    // Check for required parameters
    if (!collectionName || !fieldName || !values) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If only one value is provided, treat it as a single match
    const query = {
      [fieldName]:values ,
    };
    if (startDate && endDate) {
        query.createdAt = { $gte: startDate, $lte: endDate }; // Assuming you have a createdAt field
      }

    // Count documents in the specified collection that match the query
    const count = await connection
      .db.collection(collectionName)
      .countDocuments(query);

    // Respond with the count
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching count:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
