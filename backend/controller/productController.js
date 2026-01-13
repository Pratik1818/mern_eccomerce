import Product from '../models/productModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';
//creating product

export const createProducts = handleAsyncError(async(req,res,next)=>{
   // console.log(req.body);
   req.body.user = req.user.id;
    const product =  await Product.create(req.body); 
    res.status(200).json({
        success:true,
        product
    })
})

export const getAllProducts = handleAsyncError(async(req,res,next)=>{
   //   console.log(req.query);
   const resultperPage = 3;
const featurequery =  
new APIFunctionality(Product.find() , req.query)
.search()
.filter();

  // get filterred query 
   
   const filterquery = featurequery.query.clone();
   const productcount = await filterquery.countDocuments();
   const totalpages = Math.ceil(productcount/resultperPage);
   const page = Number(req.query.page) || 1;
   
if(page>totalpages && productcount>0){
     return next(new HandleError("This Page Not Exist", 404));
}
featurequery.pagination(resultperPage);
const product = await featurequery.query;
if(!product || product.length===0){
    return next(new HandleError("Product Not Found", 401));
}
    res.status(200).json({
        success:true,
        product,
        totalpages,
        productcount,
        resultperPage,
        currentPage:page
    });

})

export const updateProduct = handleAsyncError(async(req,res,next)=>{
    const product = await Product.findByIdAndUpdate(req.params.id , req.body, {
        new:true,
        runValidators:true
    })
    
   //console.log(product);
   if(!product){
     return next(new HandleError("Product Not Found" ,404));
     
   }
  
    

    res.status(200).json({
        success:true,
        product
    })

})

export const deleteProduct = handleAsyncError(async(req,res,next)=>{

    const product = await Product.findByIdAndDelete(req.params.id);
   //console.log(product);
   if(!product){
     return next(new HandleError("Product Not Found" ,404));
   }
  
    

    res.status(200).json({
        success:true,
        msg:"product Deleted SucssesFully"
    })


})

export const getSingleProduct = handleAsyncError(async(req,res,next)=>{

     let product = await Product.findById(req.params.id);
   //console.log(product);
   if(!product){
     return next(new HandleError("Product Not Found" ,404));
   }

    res.status(200).json({
        success:true,
        product
    })


})

export const getAdminProduct = handleAsyncError(async(req,res,next)=>{

     let product = await Product.find();
   //console.log(product);
   if(!product){
     return next(new HandleError("Product Not Found" ,404));
   }

    res.status(200).json({
        success:true,
        product
    })


})

