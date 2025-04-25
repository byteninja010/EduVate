const categoryModel=require("../Models/category");

//Creating a category handeler function

exports.createCategory=async(req,res)=>{
    try{
        //Fetching the data from the api
        const {name,description}=req.body;
        if(!name || !description){
            return res.json({
                success:false,
                msg:"Kindly fill all the details to create the category"
            });
        
       
        }
        //Checking whether the category is unique or not
        const category=await categoryModel.findOne({name:name});
        if(category){
            return res.json({
                success:false,
                msg:"Category is already there Kindly directly use it!",
            });
        }

        const categoryDetails=await categoryModel.create({
            name:name,
            description:description,
        });


        console.log(categoryDetails);
        return res.status(200).json({
            success:true,
            msg:"Category Created Succesfully",
        })

    }catch(err){
        return res.staus(500).json({
            success:false,
            msg:err.message
        })
    }
}



//Show all category

exports.showAllCategories=async(req,res)=>{
    try{
        //Getting all category by ensuring that it atleast have a name and a description
        const allCategorys=await categoryModel.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            msg:"ALL category are given below",
            allCategorys,
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            msg:err.message
        });
    }
}

exports.coursesByCategory=async(req,res)=>{
    try {
        const {catalogName}=req.body;
        if(!catalogName){
            return res.status(400).json({
                success:false,
                msg:"Missing category name"
            })
        }
        const course=await categoryModel.find({name:catalogName}).populate("course");
        return res.status(200).json({
            success:true,
            msg:"Course of the following category has been succesfully fetched",
            data:course[0].course
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            msg:"Something went wrong while fetching course of this particular category Try later.."
        })
    }
   


}