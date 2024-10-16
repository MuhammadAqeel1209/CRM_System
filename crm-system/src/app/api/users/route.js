import connectDatabase from "@/app/libs/mongodb";
import Users from "@/app/Model/User";

export const POST = async (request) => {
  try {
    await connectDatabase();

    const {
      role,
      firstName,
      lastName,
      password,
      phoneNumber,
      email,
      dateOfBirth,
      position,
      location,
    } = await request.json();

    // Validate required fields
    if (
      (!role,
      !firstName ||
        !lastName ||
        !password ||
        !phoneNumber ||
        !email ||
        !dateOfBirth ||
        !position ||
        !location)
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

    const newUsers = await Users.create({
      role,
      firstName,
      lastName,
      phoneNumber,
      password,
      email,
      dateOfBirth,
      position,
      location,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 201,
        message: "Users registered successfully",
        data: newUsers,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/Users:", error);
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
    const data = await Users.find();
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
    console.error("Error in GET /api/Users:", error);
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
