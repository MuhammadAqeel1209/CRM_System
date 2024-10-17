import bcrypt from "bcryptjs";
import db from "@/app/libs/mongodb";
import Users from "@/app/Model/User";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await db();

    // Query the database for the user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User does not exist." }),
        { status: 404 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid password." }),
        { status: 401 }
      );
    }

    // Password is valid, return user data
    return new Response(JSON.stringify({ success: true, data: user }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while logging in. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
