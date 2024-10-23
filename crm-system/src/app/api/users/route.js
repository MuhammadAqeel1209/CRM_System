import connectDatabase from "@/app/libs/mongodb";
import Users from "@/app/Model/User";
import bcrypt from "bcryptjs";

// POST Request to create a new user
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
      profileImage, // Added profile image handling
    } = await request.json();

    // Validate required fields
    if (
      !role ||
      !firstName ||
      !lastName ||
      !password ||
      !phoneNumber ||
      !email ||
      !dateOfBirth ||
      !position ||
      !location ||
      !profileImage
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

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          status: 409,
          error: "User with this email already exists",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 409,
        }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create a new user
    const newUser = await Users.create({
      role,
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword, // Storing hashed password
      email,
      dateOfBirth,
      position,
      location,
      profileImage,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 201,
        message: "User registered successfully",
        data: newUser,
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

// GET Request to fetch all users
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