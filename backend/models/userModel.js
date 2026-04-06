import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[25,"Name Cannot be  more than 25 Character "],
        minLength:[3, "Name Should Contain more than 3 Character"]
    },
     email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail," Please Enter Valid Email"]
      
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[3, "Password Should be greater than 8 character"],
        select:false
      
    },
    avatar: {
        public_id: { type: String },
        url: { type: String },
      },
      role:{
        type:String,
        default:"user"
      },
      resetPasswordToken:{
        type:String
      },
       resetPasswordExpire:{
        type:Date
      }
},{timestamps:true})

// password Hashing 

userSchema.pre("save", async function () {

  // if password is NOT modified, do nothing
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.getJWTToken = function(){

     return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES
     })
}

userSchema.methods.verifyPassword = async function(UserEnterPassword){

       return  await bcrypt.compare(UserEnterPassword , this.password);
     
}

//genrating password

userSchema.methods.generatePasswordResetToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken)
    .digest('hex');
    this.resetPasswordExpire = Date.now()+30*60*1000 //5 min
  
    return resetToken;
}

export default mongoose.model("User",userSchema);