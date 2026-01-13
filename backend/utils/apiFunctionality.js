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

     filter(){
        const copyquery = {...this.queryStr};
       // console.log(copyquery);
        const removeFilds = ["keyword", "limit","page"];
        removeFilds.forEach((key)=> delete copyquery[key] );
        this.query = this.query.find(copyquery);

        return this;
       // console.log(copyquery);
     }

     pagination(resultperPage){
        const currentpage = this.queryStr.page;
        const skip = resultperPage*(currentpage-1);
        this.query = this.query.limit(resultperPage).skip(skip);
        return this;

     }
}

export default APIFunctionality;