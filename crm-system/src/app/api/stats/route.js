import connectDatabase from "@/app/libs/mongodb";
import mongoose from "mongoose";

// Named export for the GET method
export async function GET(req) {
  // Connect to MongoDB
  await connectDatabase();

  try {
    // Access the underlying MongoDB connection
    const { connection } = mongoose;

    // List all collections in the database
    const collections = await connection.db.listCollections().toArray();

    const stats = {};

    // Iterate over each collection and count documents
    for (const collection of collections) {
      const name = collection.name;
      const count = await connection.db.collection(name).countDocuments();
      stats[name] = count;
    }

    // Respond with the stats
    return new Response(JSON.stringify({ statistics: stats }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Optional: You can also handle other methods like POST, PUT, DELETE here
