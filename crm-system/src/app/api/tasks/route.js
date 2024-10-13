import connectDatabase from "@/app/libs/mongodb";
import Tasks from "@/app/Model/Task";

export const POST = async (request) => {
  try {
    await connectDatabase();

    const {
      title,
      status,
      linkedType,
      linkedTo,
      assignedType,
      assignedTo,
      priority,
      dueDate,
    } = await request.json();

    // Validate required fields
    if (
      !title ||
      !status ||
      !linkedType ||
      !linkedTo ||
      !assignedType ||
      !assignedTo ||
      !priority ||
      !dueDate
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

    const newTasks = await Tasks.create({
      title,
      status,
      linkedType,
      linkedTo,
      assignedType,
      assignedTo,
      priority,
      dueDate,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 201,
        message: "Tasks registered successfully",
        data: newTasks,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/Tasks:", error);
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
    const data = await Tasks.find();
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
    console.error("Error in GET /api/Tasks:", error);
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
    console.log(data);
  }
};
