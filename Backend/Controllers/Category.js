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
        const course=await categoryModel.find({name:catalogName}).populate({
            path: "course",
            populate: {
                path: "ratingAndReviews",
                select: "rating"
            }
        });

        // Calculate average rating for each course
        const coursesWithRating = course[0].course.map(courseItem => {
            const courseObj = courseItem.toObject();
            if (courseObj.ratingAndReviews && courseObj.ratingAndReviews.length > 0) {
                const totalRating = courseObj.ratingAndReviews.reduce((sum, review) => sum + review.rating, 0);
                courseObj.averageRating = Math.round((totalRating / courseObj.ratingAndReviews.length) * 10) / 10;
            } else {
                courseObj.averageRating = 0;
            }
            return courseObj;
        });

        return res.status(200).json({
            success:true,
            msg:"Course of the following category has been succesfully fetched",
            data:coursesWithRating
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            msg:"Something went wrong while fetching course of this particular category Try later.."
        })
    }
}

// Get all categories (admin route)
exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).select('name description course').populate('course', 'title');
        return res.status(200).json({
            success: true,
            data: categories,
            message: "Categories fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching categories"
        });
    }
};

// Update category (admin route)
exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required"
            });
        }

        // Check if name already exists (excluding current category)
        const existingCategory = await categoryModel.findOne({ 
            name: name, 
            _id: { $ne: categoryId } 
        });
        
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category name already exists"
            });
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedCategory,
            message: "Category updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating category"
        });
    }
};

// Delete category (admin route)
exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Check if category has courses
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (category.course && category.course.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category with existing courses"
                });
        }

        await categoryModel.findByIdAndDelete(categoryId);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting category"
        });
    }
};