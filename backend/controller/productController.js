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

export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const resultperPage = Number(req.query.limit) || 8;
  const featurequery = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  const filterquery = featurequery.query.clone();
  const productcount = await filterquery.countDocuments();
  const totalpages = Math.ceil(productcount / resultperPage) || 1;
  const page = Number(req.query.page) || 1;

  if (page > totalpages && productcount > 0) {
    return next(new HandleError('This page does not exist', 404));
  }
  featurequery.pagination(resultperPage);
  const product = await featurequery.query;
  // Return empty array when no products (valid for new store); only 404 for invalid page
  res.status(200).json({
    success: true,
    product: product || [],
    totalpages,
    productcount,
    resultperPage,
    currentPage: page,
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

