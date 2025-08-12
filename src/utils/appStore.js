import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice"
import profileReducer from "../slices/profileSlice"
import authReducer from "../slices/authSlice"
import courseReducer from "../slices/courseSlice"
const appStore=configureStore({
    reducer:{
        cart:cartReducer,
        auth:authReducer,
        profile:profileReducer,
        course:courseReducer
    }
});
export default appStore;