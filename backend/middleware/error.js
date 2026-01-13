import HandleError from "../utils/handleError.js";

export default (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Interal Server Error";
   
     if(err.name === 'CastError'){
        
        const message = `This is invalid resource ${err.path}`;
        err = new HandleError(message,404);
     }
    
    // Duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";
    const message = `${field} already exists. Please login to continue.`;
    err = new HandleError(message, 400);
  }
  
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}