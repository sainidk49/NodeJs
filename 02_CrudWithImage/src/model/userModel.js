import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unque: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    mobile: {
        type: Number,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    }
})

export default mongoose.model("User", userSchema, "users")