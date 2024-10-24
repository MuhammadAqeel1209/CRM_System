import { promises as fs } from "fs";
import path from "path";
import connectDatabase from "@/app/libs/mongodb";
import profileimage from "@/app/Model/Uploadfile";
import mongoose from "mongoose";
import user from "@/app/Model/User";

const saveImageToDisk = async (imageFile) => {
    const uploadsDir = path.join(process.cwd(), "public/profilePictures");
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${imageFile.name}`;
    const filePath = path.join(uploadsDir, fileName);

    // Use a Node.js-compatible method to get the buffer directly
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    await fs.writeFile(filePath, fileBuffer);

    return `/profilePictures/${fileName}`;
};

const handleImageUploadOrUpdate = async (req) => {
    await connectDatabase();
    try {
        const data = await req.formData();
        const imageFile = data.get("image");
        const userId = data.get("userId");

        if (!imageFile || !userId) {
            return new Response(
                JSON.stringify({ success: false, message: "Image or User ID missing" }),
                { status: 400 }
            );
        }

        // Ensure userId is a valid ObjectId string
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid userId format" }),
                { status: 400 }
            );
        }

        // Check if a profile image already exists for this user
        const existingProfileImage = await user.findOne({ _id: userId });
        
        let imageUrl;

        if (existingProfileImage) {
            const oldFilePath = path.join(process.cwd(), "public", existingProfileImage.imageurl);
            await fs.unlink(oldFilePath);

            imageUrl = await saveImageToDisk(imageFile);
            existingProfileImage.imageurl = imageUrl;
            await existingProfileImage.save();

            return new Response(
                JSON.stringify({
                    success: true,
                    imageUrl,
                    message: "Image updated successfully",
                    profileImage: existingProfileImage,
                }),
                { status: 200 }
            );
        } else {
            imageUrl = await saveImageToDisk(imageFile);
            const newProfileImage = new profileimage({ userId, imageurl: imageUrl });
            await newProfileImage.save();

            return new Response(
                JSON.stringify({
                    success: true,
                    imageUrl,
                    message: "Image uploaded successfully",
                    profileImage: newProfileImage,
                }),
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error handling image:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error handling image" }),
            { status: 500 }
        );
    }
};

export const POST = handleImageUploadOrUpdate;
