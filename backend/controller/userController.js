import handleAsyncError from '../middleware/handleAsyncError.js';
import User from '../models/userModel.js'
import HandleError from "../utils/handleError.js";
import { sendToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

export const registerUser = handleAsyncError(async(req,res, next)=>{
 
    const {name,email,password}= req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"This is Temp id",
            url:"This is Temp id"
        }

    })

    sendToken(user,200,res);

})

export const userLogin = handleAsyncError(async (req,res,next)=>{
     
    const {email , password} = req.body;
   
     if(!email || !password){
        return next(new HandleError("Please Enter Email And Password", 401));
     }

     const user  = await User.findOne({email}).select("+password");

    if(!user){
        return next(new HandleError("Please Enter Valid Email And Password", 401));
     }
     const isPasswordValid = await user.verifyPassword(password);

     if(!isPasswordValid){
        return next(new HandleError("Please Enter Valid Password", 401));

     }
     
     sendToken(user,200,res);
    
})

export const userLogout = handleAsyncError(async (req,res,next)=>{
       res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
       })

       res.status(200).json({
        success:true,
        message:"User Successfully Logout"
       })
})

export const requestPasswordReset = handleAsyncError(async (req,res,next)=>{
      
      const user = await User.findOne({email:req.body.email});

      if(!user){
         return next(new HandleError("Email DOes Not Exist",400));

      }

      let resetToken;
      try{
         resetToken = user.generatePasswordResetToken();
         await user.save({validateBeforeSave:false});
      }
      catch(error){
      // console.log(error);
     return next(new HandleError("Could Not Save Reset Token Please Try Again Later",500));

      }

      const resetPasswordURL = `http://localhost/api/v1/reset/${resetToken}`;

      const message = `Use The Following link to reset your password:
         ${resetPasswordURL}. \n\n This link will expire in 80 minutes .\n\n
         If you didnt request a password resset ,please ignore this massage `;

         try{
            await sendEmail({
                email:user.email,
                subject:"Password Reset Request",
                message
            })

            res.status(200).json({
                success:true,
                message:`Email is Sent to ${user.email} SuccessFully`
            })
         }
         catch(error){
             user.resetPasswordToken = undefined;
             user.resetPasswordExpire = undefined;
             await user.save({validateBeforeSave:false});
            return next(new HandleError("Email Could Not Send Please Try Again Later",500));

         }

        
})  

 export const resetPassword = handleAsyncError(async (req,res,next)=>{
    console.log(req.params.token);
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token)
     .digest('hex');

     const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
     })
      
      if(!user){
        return next(new HandleError("Reset  Password token is invalid or has been expired",400));
      }
       
              const {password , confirmpassword} = req.body;
              if(password!== confirmpassword){
             return next(new HandleError("Password Does Not match",500));

              }
              user.password = password;
              user.resetPasswordToken= undefined;
              user.resetPasswordExpire = undefined;
             await  user.save()
            sendToken(user,200,res);
              
         })

         export const getUserDetails = handleAsyncError(async (req,res,next)=>{

             const user = await User.findById(req.user.id);
             res.status(200).json({
               success:true,
               user
             })

         })


          export const updatePassword = handleAsyncError(async (req,res,next)=>{
               
               const {oldPassword ,newPassword, confirmPassword}= req.body;

               const user = await User.findById(req.user.id).select('+password');

               
               const passwordCheck = await  user.verifyPassword(oldPassword);

               if(!passwordCheck){
                    return next(new HandleError("oldPassword is Incorrect", 400));
               }
               if(newPassword !== confirmPassword){
                    return next(new HandleError(" Password Does Not Match", 400));
               }
               user.password = newPassword;
               await user.save();
               sendToken(user,200,res);

          })

           export const updateProfile = handleAsyncError(async (req,res,next)=>{

              const {name , email} = req.body;

              const userDetails = {
                name,
                email
              }
              const user =  await User.findByIdAndUpdate(req.user.id ,userDetails , {
                  new:true,
                  runValidators: true
              } )

              res.status(200).json({
                success:true,
                message: "User Profile Update Scussefully",
                user
              })

           })

            export const getUserList = handleAsyncError(async (req,res,next)=>{
                const users = await User.find();

                res.status(200).json({
                  success:true,
                  users
                })
           })