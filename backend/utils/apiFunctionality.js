class APIFunctionality{

     constructor(query , queryStr){
        this.query = query,
        this.queryStr = queryStr
     }

     search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
                
            }
        }:{};
        this.query = this.query.find({...keyword});

        return this

    
     }

     // Filter by category, price range (price[gte], price[lte]), rating (rating[gte])
     filter(){
        const copyquery = { ...this.queryStr };
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach((key) => delete copyquery[key]);

        // Price range: ?price[gte]=100&price[lte]=1000
        let queryObj = {};
        if (copyquery.category) {
          queryObj.category = copyquery.category;
          delete copyquery.category;
        }
        if (copyquery.price) {
          const priceQuery = {};
          if (copyquery.price.gte != null) priceQuery.$gte = Number(copyquery.price.gte);
          if (copyquery.price.lte != null) priceQuery.$lte = Number(copyquery.price.lte);
          if (Object.keys(priceQuery).length) queryObj.price = priceQuery;
          delete copyquery.price;
        }
        if (copyquery.rating != null) {
          queryObj.ratings = { $gte: Number(copyquery.rating) };
          delete copyquery.rating;
        }
        // Any other top-level fields from query (e.g. category if passed as flat key)
        Object.assign(queryObj, copyquery);
        this.query = this.query.find(queryObj);
        return this;
     }

     pagination(resultperPage){
        const currentpage = this.queryStr.page;
        const skip = resultperPage*(currentpage-1);
        this.query = this.query.limit(resultperPage).skip(skip);
        return this;

     }
}

export default APIFunctionality;