import { ratingEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import toast from "react-hot-toast";

// Create a new rating and review
export const createRating = async (ratingData, token) => {
    const toastId = toast.loading("Creating review...");
    let result = null;
    
    try {
        const response = await apiConnector("POST", ratingEndpoints.CREATE_RATING, ratingData, {
            "Authorization": `Bearer ${token}`
        });
        
        if (!response.data.success) {
            throw new Error(response.data.msg);
        }
        
        result = response.data;
        console.log("Rating created successfully:", result);
        toast.success("Review created successfully!");
    } catch (error) {
        console.log("CREATE_RATING_API ERROR:", error);
        toast.error(error.response?.data?.msg || "Failed to create review");
        result = error.response?.data;
    }
    
    toast.dismiss(toastId);
    return result;
};

// Get average rating for a course
export const getAverageRating = async (courseId) => {
    let result = null;
    
    try {
        const response = await apiConnector("GET", `${ratingEndpoints.GET_AVERAGE_RATING}/${courseId}`);
        
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        result = response.data;
    } catch (error) {
        console.log("GET_AVERAGE_RATING_API ERROR:", error);
        result = error.response?.data;
    }
    
    return result;
};

// Get all ratings for a course
export const getCourseRatings = async (courseId) => {
    let result = null;
    
    try {
        const response = await apiConnector("GET", `${ratingEndpoints.GET_COURSE_RATINGS}/${courseId}`);
        
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        result = response.data;
    } catch (error) {
        console.log("GET_COURSE_RATINGS_API ERROR:", error);
        result = error.response?.data;
    }
    
    return result;
};

// Update a rating
export const updateRating = async (ratingId, ratingData, token) => {
    const toastId = toast.loading("Updating review...");
    let result = null;
    
    try {
        const response = await apiConnector("PUT", `${ratingEndpoints.UPDATE_RATING}/${ratingId}`, ratingData, {
            "Authorization": `Bearer ${token}`
        });
        
        if (!response.data.success) {
            throw new Error(response.data.msg);
        }
        
        result = response.data;
        console.log("Rating updated successfully:", result);
        toast.success("Review updated successfully!");
    } catch (error) {
        console.log("UPDATE_RATING_API ERROR:", error);
        toast.error(error.response?.data?.msg || "Failed to update review");
        result = error.response?.data;
    }
    
    toast.dismiss(toastId);
    return result;
};

// Delete a rating
export const deleteRating = async (ratingId, token) => {
    const toastId = toast.loading("Deleting review...");
    let result = null;
    
    try {
        const response = await apiConnector("DELETE", `${ratingEndpoints.DELETE_RATING}/${ratingId}`, null, {
            "Authorization": `Bearer ${token}`
        });
        
        if (!response.data.success) {
            throw new Error(response.data.msg);
        }
        
        result = response.data;
        toast.success("Review deleted successfully!");
    } catch (error) {
        console.log("DELETE_RATING_API ERROR:", error);
        toast.error(error.response?.data?.msg || "Failed to delete review");
        result = error.response?.data;
    }
    
    toast.dismiss(toastId);
    return result;
};
