import mongoose, { trusted } from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please Enter Product Name"],
        trim : true
    },
    description:{
        type:String,
        required:[true ,"please Enter Product Description"],
        trim: true
    },
     price:{
        type:Number,
        required:[true ,"please Enter Product price"],
        maxLength:[7,"Price Cannot Exceed 7 digit "],
    },
     ratings:{
        type:Number,
        default:0
    },
    image:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true

            }
        }
    ],
    category:{
         type:String,
         required:[true,"Please Enter Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[5,"Price Cannot Exceed 7 digit "],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
               type:String,
               required:true 
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }

        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
export default mongoose.model("Product",ProductSchema);