import  connectDatabase  from "@/app/libs/mongodb";
import Contact from "@/app/Model/Contact"; 
export const POST = async (request) => {
  try {
    await connectDatabase(); // Connect to the database

    const { name, phoneNumber, email, type, leadSource, rating } = await request.json();

    // Validate required fields
    if (!name || !phoneNumber || !email || !type || !leadSource || !rating) {
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


    const newContact = await Contact.create({
      name,
      phoneNumber,
      email,
      type,
      leadSource,
      rating,
    });

    return new Response(
      JSON.stringify({
        success: true,
        status: 201, // Use 201 for resource creation
        message: "Contact registered successfully",
        data: newContact,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error in POST /api/contacts:', error);
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
    await connectDatabase ();
    const data = await Contact.find();
    return new Response(JSON.stringify({
      success: true,
      status: 200,
      data
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      success: false,
      status: 500,
      error: "Internal Server Error"
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
};