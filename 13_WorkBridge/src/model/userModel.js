import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        // match: [/\S+@\S+\.\S+/, 'is invalid'] 
    },
    mobile: {
        type: String,  
        required: true,
        // validate: {
        //     validator: function (v) {
        //         return /^\d{10}$/.test(v); 
        //     }
        // }
    },
    category: {
        type: String,
        required: true
    },
    workType: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    cityPin: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
    },
    password: {
        type: String,
    }
});

export default mongoose.model('User', UserSchema);
