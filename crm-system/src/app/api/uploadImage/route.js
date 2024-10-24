// import { promises as fs } from "fs";
// import path from "path";
// import connectDatabase from "@/app/libs/mongodb";
// import User from "@/app/Model/User";

// // Function to save image to disk
// const saveImageToDisk = async (imageFile) => {
//     const uploadsDir = path.join(process.cwd(), "public/profilePictures");
//     await fs.mkdir(uploadsDir, { recursive: true });

//     const fileName = `${Date.now()}-${imageFile.name}`;
//     const filePath = path.join(uploadsDir, fileName);

//     // Convert the image file to a buffer
//     const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

//     await fs.writeFile(filePath, fileBuffer);

//     return `/profilePictures/${fileName}`;
// };

// // Function to handle image upload or update
// const handleImageUploadOrUpdate = async (req) => {
//     await connectDatabase();

//     try {
//         const data = await req.formData();
//         const imageFile = data.get("image");

//         // Validate input
//         if (!imageFile ) {
//             return new Response(
//                 JSON.stringify({ success: false, message: "Image or User ID missing" }),
//                 { status: 400 }
//             );
//         }

//         // // Check if a user with the given userId exists
//         // const existingUser = await User.findById(userId);

//         // if (!existingUser) {
//         //     return new Response(
//         //         JSON.stringify({ success: false, message: "User not found" }),
//         //         { status: 404 }
//         //     );
//         // }

//         // If user already has a profile image, remove the old image file
//         // if (existingUser.profileImage) {
//         //     try {
//         //         const oldFilePath = path.join(process.cwd(), "public", existingUser.profileImage);
//         //         await fs.unlink(oldFilePath);
//         //     } catch (error) {
//         //         console.error("Error removing old image:", error);
//         //     }
//         // }

//         // Save new image to disk
//         const imageUrl = await saveImageToDisk(imageFile);
//         console.log(imageUrl)
//         existingUser.profileImage = imageUrl;
//         await existingUser.save();

//         return new Response(
//             JSON.stringify({
//                 success: true,
//                 imageUrl,
//                 message: "Image uploaded/updated successfully",
//                 profileImage: existingUser,
//             }),
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error handling image:", error);
//         return new Response(
//             JSON.stringify({ success: false, message: "Error handling image" }),
//             { status: 500 }
//         );
//     }
// };

// // Exporting the POST function for handling requests
// export const POST = handleImageUploadOrUpdate;
