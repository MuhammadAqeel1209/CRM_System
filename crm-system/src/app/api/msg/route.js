import connectDatabase from "@/app/libs/mongodb";
import Message from "@/app/Model/Msj";
export const POST = async (request) => {
  try {
    await connectDatabase(); // Connect to the database

    const { advisorName, message } = await request.json();

    // Validate required fields
    if (!advisorName|| !message) {
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

    const newMessage = await Message.create({
        advisorName, message
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 201, // Use 201 for resource creation
        message: "Message registered successfully",
        data: newMessage,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/Messages:", error);
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: "Internal Server Error",
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
    const data = await Message.find();
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
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        error: "Internal Server Error",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};
