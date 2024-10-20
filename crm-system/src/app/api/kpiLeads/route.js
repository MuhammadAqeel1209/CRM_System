import connectDatabase from "@/app/libs/mongodb";
import mongoose from "mongoose";

export async function GET(req) {
  // Connect to MongoDB
  await connectDatabase();

  try {
    const { connection } = mongoose;

    // Parse the URL for query parameters
    const url = new URL(req.url);
    const collectionName = url.searchParams.get("collection"); 
    const fieldName = url.searchParams.get("field"); 
    const values = url.searchParams.get("values"); 
    const startDate = new Date(url.searchParams.get("startDate"));
    const endDate = new Date(url.searchParams.get("endDate"));


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
