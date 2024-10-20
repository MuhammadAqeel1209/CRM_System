import connectDatabase from "@/app/libs/mongodb";
import Contract from "@/app/Model/Contract";
export const POST = async (request) => {
  try {
    await connectDatabase(); // Connect to the database

    const {
      policyNumber,
      companyName,
      contractType,
      status,
      applicationStatus,
      totalPremium,
      startDate,
      expiryDate
    } = await request.json();
  

    // Validate required fields
    if (
      !policyNumber ||
      !companyName ||
      !contractType ||
      !status ||
      !applicationStatus ||
      !totalPremium ||
      !startDate ||
      !expiryDate 
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

    const newContract = await Contract.create({
        policyNumber,
        companyName,
        contractType,
        status,
        applicationStatus,
        totalPremium,
        startDate,
        expiryDate,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 201, // Use 201 for resource creation
        message: "Contract registered successfully",
        data: newContract,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in POST /api/Contracts:", error);
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
    const data = await Contract.find();
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
