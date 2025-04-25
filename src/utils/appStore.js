import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice"
import profileReducer from "../slices/profileSlice"
import authReducer from "../slices/authSlice"
const appStore=configureStore({
    reducer:{
        cart:cartReducer,
        auth:authReducer,
        profile:profileReducer
    }
});
export default appStore;