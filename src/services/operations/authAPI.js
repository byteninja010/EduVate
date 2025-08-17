import toast from "react-hot-toast"
import { setToken,setAuthLoading } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { clearCart } from "../../slices/cartSlice"
import {endpoints} from "../apis"
import { apiConnector } from "../apiconnector"
const {SENDOTP_API,SIGNUP_API,LOGIN_API} = endpoints;
export const otpSender=(navigate,email)=>{
    return async(dispatch)=>{
        dispatch(setAuthLoading(true));
        const toastId=toast.loading("Loading");
        //Now we will call the otp api and send the otp
        try{
            const response=await apiConnector("POST",SENDOTP_API,{
                email
            });
            if(!response.data.success){
                throw new Error(response.data.msg);
            }
            navigate("/verifyOtp");
            toast.success("Otp Send Successfully");
        }catch(er){
            console.log(er);
            toast.dismiss(toastId);
            toast.error(er.message);
            toast.error("Sending otp failed");
        }
        dispatch(setAuthLoading(false));
        toast.dismiss(toastId);
    }
}

export const signup=(firstName,lastName,email,password,confirmPassword,accountType,otp,navigate)=>{
    return async (dispatch)=>{
        dispatch(setAuthLoading(true));
        const toastId=toast.loading("Loading");
        try {
            const response=await apiConnector("POST",SIGNUP_API,{
                firstName,lastName,email,password,confirmPassword,accountType,otp,navigate
            });
            if(!response.data.success){
                throw new Error(response.data.msg);
            }
            toast.dismiss(toastId);
            toast.success("Sign Up Succesfull");
            navigate("/login");

        } catch (er) {
            console.log(er);
            toast.error(er.message);
            toast.error("Sign Up Failed");
        }
        dispatch(setAuthLoading(false));


    }

}


export const login=(email,password,navigate)=>{
    return async(dispatch)=>{
        //Toast shown for the loading
        //Indicating that state is now in loading can be used by any component and will help to show a loading icon in place
        dispatch(setAuthLoading(true));
        const toastId=toast.loading("Loading...");
        //Now trying to post the data
        try{
            const response=await apiConnector("POST",LOGIN_API,{
                email,
                password
            })
            if(!response.data.success){
                throw new Error(response.data.msg);
            }
            toast.dismiss(toastId);
            toast.success("Login Successfull");
            dispatch(setToken(response.data.token));
            localStorage.setItem("token",JSON.stringify(response.data.token));
            dispatch(setUser(response.data.user));
            localStorage.setItem("user",JSON.stringify(response.data.user));
            
            // Check if there's a return URL from protected route
            const location = window.location;
            const searchParams = new URLSearchParams(location.search);
            const returnUrl = searchParams.get('returnUrl') || location.state?.from?.pathname;
            
            // Navigate to return URL if available, otherwise to dashboard
            if (returnUrl && returnUrl !== '/login' && returnUrl !== '/signup') {
                navigate(returnUrl);
            } else {
                navigate("/dashboard");
            }
        }catch(err){
            console.log("Login Api Errrrrror----------",err);
            toast.dismiss(toastId);
            toast.error("Login Failed");
        }
        dispatch(setAuthLoading(false));
        
    }
}

export const logout=(navigate)=>{
    //Logout is not asynchronus as there is no backend call or such a thing like for which you havae to wait for the backend
    return ((dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(clearCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/");
    })
}