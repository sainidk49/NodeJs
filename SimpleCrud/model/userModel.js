import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: [/\S+@\S+\.\S+/, 'is invalid'] 
    },
    mobile: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema, "workerData");
