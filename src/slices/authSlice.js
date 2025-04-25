import { createSlice } from "@reduxjs/toolkit";
const authSlice=createSlice({
    name:"auth",
    initialState:{
        signupData:null,
        token:localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,
        loading:false
    },
    reducers:{
        setSignupData:(state,action)=>{
            state.signupData=action.payload
        },
        setToken:(state,action)=>{
            state.token=action.payload;
        },
        setAuthLoading:(state,action)=>{
            state.loading=action.payload
        }
        
    }
})

export default authSlice.reducer;
export const {setToken,setAuthLoading,setSignupData} = authSlice.actions;