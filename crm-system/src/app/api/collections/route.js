import connectDatabase from "@/app/libs/mongodb";
import ContactDetail from "@/app/Model/DataCollection";
export const POST = async (request) => {
  try {
    await connectDatabase(); // Connect to the database

    const {
      title,
      linkedToContactId,
      linkedToContractId,
      contactPhase,
      assignedToUserId,
    } = await request.json();

    // Validate required fields
    if ( ! title ||
      ! linkedToContactId ||
      ! linkedToContractId ||
      ! contactPhase ||
      ! assignedToUserId) {
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

    const newContactDetail = await ContactDetail.create({
      title,
      linkedToContactId,
      linkedToContractId,
      contactPhase,
      assignedToUserId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 200, 
        message: "ContactDetail registered successfully",
        data: newContactDetail,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/ContactDetails:", error);
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
    const data = await ContactDetail.find();
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
