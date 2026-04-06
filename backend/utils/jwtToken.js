export const sendToken = (user ,statusCode,res)=>{
   const Token =  user.getJWTToken();

  const options = {
    expires: new Date(Date.now() + (Number(process.env.EXPIRE_COOKIE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

   res.status(statusCode).cookie('token', Token, options).json({
    success: true,
    user,
    token: Token,
  });
}

