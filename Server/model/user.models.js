import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        maxlength: 50 
    },
    lastName: {
        type: String,
        maxlength: 50 
    },
    phoneNumber: {
        type: String,
        maxlength: 15 
    },
    isAdmin: {
        type: Boolean,
        default: false 
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
