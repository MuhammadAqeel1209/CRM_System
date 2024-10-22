import { Clerk } from "@clerk/clerk-sdk-node";
import db from "@/app/libs/mongodb";
import Users from "@/app/Model/User";

const clerk = new Clerk({ apiKey: process.env.CLERK_API_KEY }); // Set your Clerk API key

export async function POST(req) {
  const { email, password } = await req.json();
  console.log(email, password);

  try {
    await db();

    // Authenticate the user with Clerk
    const session = await clerk.authenticate({
      identifier: email,
      password,
    });

    // If authentication succeeds, find the user in your database
    const user = await Users.findOne({ clerkUserId: session.userId }); // Assuming you store Clerk user IDs
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User does not exist." }),
        { status: 404 }
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
        message: "Invalid email or password.",
      }),
      { status: 401 }
    );
  }
}
