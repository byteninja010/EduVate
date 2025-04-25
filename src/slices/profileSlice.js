import { createSlice } from "@reduxjs/toolkit";
const profileSlice=createSlice({
    name:"profile",
    initialState: {
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ): null,
        loading:false
    },
    reducers:{
        setUser:(state,action)=>{ 
            state.user=action.payload;
        },
        setProfileLoading:(state,action)=>{
            state.loading=action.payload;
        }

    }
})

export default profileSlice.reducer;
export const {setUser,setProfileLoading} = profileSlice.actions;