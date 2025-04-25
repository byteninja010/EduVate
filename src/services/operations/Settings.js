import toast from "react-hot-toast";
import { settingsEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setUser } from "../../slices/profileSlice";
const {UPDATE_PROFILE_PICTURE,UPDATE_PROFILE,GET_ENROLLED_COURSE}=settingsEndpoints;
export const profilePicUpdater=(fileData,token,dispatch)=>{
    return async()=>{
        const toastId=toast.loading("Loading");
        try{
            const response=await apiConnector("PUT",UPDATE_PROFILE_PICTURE,fileData,{
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            });
            if(!response.data.success){
                throw new Error(response.data.msg);

            }
           // console.log(response);
            dispatch(setUser(response.data.data));
            toast.dismiss(toastId);
            toast.success(response.data.msg);
        }catch(err){
            console.error(err);
            toast.dismiss(toastId);
            toast.error(err.msg);
        }
    }
}

export const updateProfile=(token,data)=>{
    return async(dispatch)=>{
        const toastId=toast.loading("Loading.....");
        try{
            const response=await apiConnector("PUT",UPDATE_PROFILE,data,{
                Authorization: `Bearer ${token}`
            });
            if(!response.data.success){
                throw new Error(response.data.msg);
            }
            dispatch(setUser(response.data.data));
          //  console.log("Repsonse data->",response.data.data); 
            localStorage.setItem("user",JSON.stringify(response.data.data));
            toast.dismiss(toastId);
            toast.success(response.data.msg);
        }catch(err){
            console.error(err);
            toast.dismiss(toastId);
            toast.error(err.msg);
        }
    }
}

export const getEnrolledCourse=async(token)=>{
        try{
            const response=await apiConnector("GET",GET_ENROLLED_COURSE,null,{
                Authorization: `Bearer ${token}`
            });
            console.log(response);
            if(!response.data.success){
                throw new Error(response.data.msg);
            }
            return response;
        }catch(err){
            console.log(err);
        }
    }
