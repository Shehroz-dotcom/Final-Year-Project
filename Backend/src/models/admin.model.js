import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const adminSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: [true, "FullName is required"],
    trim: true,
    index: true,
  },
  role:{
    type:String,
    default:"admin"
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  refreshToken: {type: String}
});


adminSchema .pre ('save',async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 10);
    next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare (password , this.password)

}

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName,
            role:this.role,
        },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ADMIN_ACCESS_TOKEN_SECRET_EXPIRY}

    ) 
    
}

adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id:this._id
    },
    process.env.ADMIN_REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.ADMIN_REFRESH_TOKEN_SECRET_EXPIRY}
)
}

const adminModel = mongoose.models.Admin || mongoose.model ('Admin', adminSchema)

export default adminModel;