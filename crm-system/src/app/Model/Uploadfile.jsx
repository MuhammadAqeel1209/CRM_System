import mongoose,{Schema} from "mongoose";

const imageUploadSchema = new Schema({
    imageurl : {type:String},
})

const profileimage = mongoose.models.profileimage || mongoose.model("profileimage",imageUploadSchema)
export default profileimage;