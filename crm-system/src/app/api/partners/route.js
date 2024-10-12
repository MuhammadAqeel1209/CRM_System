import connectDatabase from "@/app/libs/mongodb";
import Patners from "@/app/Model/Patner"; 

export const POST = async (request) => {
  try {
    await connectDatabase(); 

    const {
      name,
      additionalInfo,
      productBrandName,
      phoneNumber,
      email,
      mainContactPersonId,
      website,
    } = await request.json();

    console.log(
      "Name", name,
      "Info",additionalInfo,
      "prod",productBrandName,
      "num",phoneNumber,
      "email",email,
      "pers",mainContactPersonId,
      "web",website
    );

    // Validate required fields
    if (
      !name ||
      !additionalInfo ||
      !productBrandName ||
      !phoneNumber ||
      !email ||
      !mainContactPersonId ||
      !website
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

    const newPartner = await Patners.create({
      name,
      additionalInfo,
      productBrandName,
      phoneNumber,
      email,
      mainContactPersonId,
      website,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 201, 
        message: "Partner registered successfully",
        data: newPartner,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/partners:", error);
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
    const data = await Patners.find(); 
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
    console.error("Error in GET /api/partners:", error); 
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
