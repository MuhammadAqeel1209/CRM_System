import connectDatabase from "@/app/libs/mongodb";
import Users from "@/app/Model/User";

export const POST = async (request) => {
  try {
    await connectDatabase();

    const {
      role,
      firstName,
      lastName,
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


// // utils/verifyRole.js
// const verifyRole = (roles) => {
//     return (req, res, next) => {
//       const userRole = req.user.role; // Assuming req.user is set by authentication middleware
  
//       if (roles.includes(userRole)) {
//         next(); // User has the required role
//       } else {
//         return res.status(403).json({ success: false, message: 'Access denied.' });
//       }
//     };
//   };
  
//   export default verifyRole;
//   import dbConnect from '../../../utils/dbConnect'; // Adjust the path to your database connection utility
//   import User from '../../../models/User'; // Adjust path as necessary
//   import verifyRole from '../../../utils/verifyRole'; // Import the verifyRole middleware
  
//   export default async function handler(req, res) {
//     await dbConnect(); // Ensure you connect to your database
  
//     const { method } = req;
  
//     switch (method) {
//       case 'GET':
//         // Role verification
//         const verify = verifyRole(['Admin']);
        
//         // Simulate middleware calling
//         const next = () => {}; // No-op function
//         verify(req, res, next);
  
//         if (req.headers.role !== 'Admin') { // Check role here
//           return res.status(403).json({ success: false, message: 'Access denied.' });
//         }
  
//         // Fetch all users
//         try {
//           const users = await User.find().populate('contacts');
//           return res.status(200).json({ success: true, users });
//         } catch (error) {
//           return res.status(500).json({ success: false, message: 'Failed to retrieve users.', error: error.message });
//         }
  
//       // Other cases for POST and PUT...
  
//       default:
//         return res.status(405).json({ success: false, message: 'Method not allowed.' });
//     }
//   }
    