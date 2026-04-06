import app from './app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConnectMongoDatabase } from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load env from backend/config/config.env or root .env
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
dotenv.config({ path: path.join(process.cwd(), '.env') });
ConnectMongoDatabase();
//handle uncaught exception error

process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(` server is shuting down due to uncaughtException error`);

        process.exit(1);
   
})

const port = process.env.PORT || 8005;

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