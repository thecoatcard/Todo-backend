import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/ // Basic email format validation
    },
    password: { type: String, required: true },
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Date, required: false }, // Expiry for the reset token
}, { timestamps: true }); // Automatically add createdAt and updatedAt

// Middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
