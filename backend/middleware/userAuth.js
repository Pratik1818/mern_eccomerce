import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";

// Supports both cookie (token) and Authorization Bearer token for SPA
export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    return next(
      new HandleError(
        "Authentication is missing, please login to access this resource",
        401
      )
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData.id);

  next();
});

export const roleBasedAccess = (...role)=>{

    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(new HandleError(`You have Not Access to this resource your role is ${req.user.role}`,403));
        }

        next();
    }

    
}
