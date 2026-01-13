import app from './app.js'
import dotenv from 'dotenv'
import { ConnectMongoDatabase } from './config/db.js';
dotenv.config({path:'backend/config/config.env'});
ConnectMongoDatabase();
//handle uncaught exception error

process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(` server is shuting down due to uncaughtException error`);

        process.exit(1);
   
})

const port = process.env.PORT || 8000;

const server = app.listen(port, (req,res)=>{
    console.log(`server is running on port ${port}`);
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(` server is shuting down due to unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    })
})