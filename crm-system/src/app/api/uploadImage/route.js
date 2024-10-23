import { promises as fs } from "fs";
import path from "path";
import connectDatabase from "@/app/libs/mongodb";
import profileimage from "@/app/Model/Uploadfile";

export const POST = async (req) => {
    await connectDatabase();
    try {
        const data = await req.formData();
        const imageFile = data.get("image");

        if (!imageFile) {
            return new Response(
                JSON.stringify({ success: false, message: "No image uploaded" }),
                { status: 400 }
            );
        }

        // Create a directory to store uploaded images (if it doesn't exist)
        const uploadsDir = path.join(process.cwd(), "public/profilePictures");
        await fs.mkdir(uploadsDir, { recursive: true });

        // Generate a unique file name and save the image
        const fileName = `${Date.now()}-${imageFile.name}`;
        const filePath = path.join(uploadsDir, fileName);

        // Convert the image blob to ArrayBuffer and write to disk
        const arrayBuffer = await imageFile.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));

        // Store the file path (relative to the project) in your database
        const imageUrl = `/profilePictures/${fileName}`;  // Update URL to reflect correct path

        const newProfileImage = new profileimage({ imageurl: imageUrl });
        await newProfileImage.save();

        return new Response(
            JSON.stringify({ success: true, imageUrl, message: 'Image uploaded and URL saved to the database', profileImage: newProfileImage }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error saving image:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error saving image" }),
            { status: 500 }
        );
    }
};