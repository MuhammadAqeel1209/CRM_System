import connectDatabase from "@/app/libs/mongodb";
import Courses from "@/app/Model/Course";

export const POST = async (request) => {
  try {
    await connectDatabase();

    const { title, description, objectives, duration, levels, price } =
      await request.json();

    // Validate required fields
    if (
      !title ||
      !description ||
      !objectives ||
      !duration ||
      !levels ||
      !price
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

    const newCourse = await Courses.create({
        title,
        description,
        duration,
        levels,
        objectives,
        price,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 200,
        message: "Course registered successfully",
        data: newCourse,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/Courses:", error);
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
    const data = await Courses.find();
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
    console.error("Error in GET /api/Courses:", error);
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
