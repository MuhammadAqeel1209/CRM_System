import connectDatabase from "@/app/libs/mongodb";
import Progress from "@/app/Model/Progress"; 

export const POST = async (request) => {
  try {
    await connectDatabase(); 

    const {
        userId, linkId, time
    } = await request.json();

    // Validate required fields
    if (
        !userId|| !linkId|| !time
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 400,
          error: "Missing required fields",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    try {
        // Find the user's progress in the database
        const userProgress = await db.collection("progress").findOne({ userId, linkId });
  
        if (userProgress) {
          // If the progress exists, update it
          await db.collection("progress").updateOne(
            { userId, linkId },
            { $inc: { timeSpent: time } }
          );
        } else {
          // If the progress does not exist, create a new entry
          await db.collection("progress").insertOne({
            userId,
            linkId,
            timeSpent: time,
          });
        }
  
        res.status(200).json({ message: "Progress updated successfully" });
      } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    return new Response(
      JSON.stringify({
        success: true,
        status: 201, 
        message: "Progress registered successfully",
        data: newProgress,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/Progresss:", error);
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: "Internal Server Error",
        details: error.message, 
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

export const GET = async (request) => {
  try {
    await connectDatabase();
    const data = await Progress.find(); 
    return new Response(
      JSON.stringify({
        success: true,
        status: 200,
        data,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in GET /api/Progresss:", error); 
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: "Internal Server Error",
        details: error.message, 
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};
