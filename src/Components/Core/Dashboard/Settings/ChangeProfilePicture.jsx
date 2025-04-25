import React from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { useState } from 'react';
import IconBtn from "../../../Common/IconBtn"
import { FiUpload } from "react-icons/fi"
import { useDispatch} from 'react-redux';
import { profilePicUpdater } from '../../../../services/operations/Settings';
import toast from 'react-hot-toast';
const ChangeProfilePicture = () => {
  const dispatch=useDispatch();
    const [loading,setLoading]=useState(false);
    //As we will previewTheFile user is trying to upload
    //Also having a imagefile variable to store the real file
    //File uploaded via input can't be directly previewed hence making this
    const [previewSource,setPreviewSource]=useState(null);
    const [imageFile ,setImageFile]=useState(null);
    const user=useSelector((state)=>state.profile.user);
    const token=useSelector((state)=>state.auth.token);
    const fileInputref=useRef(null);
    /*Why do this when we can have simple file input and it will automatically redirect??
    In simple file input we can't change things according to our will hence what we do here is
    We created a function handleClick which does nothing is it is like with the input tag
    and whenever the select(our custom button) is hit handlecClick trigger the bydefault input action
    */
    const handleClick=()=>{
      fileInputref.current.click();
    }
    const handleFileChange=(e)=>{
      //Normal file input comes in this form
      const file=e.target.files[0];
      if(file){
        setImageFile(file);
        previewFile(file);
      }
    }

    const previewFile = (file) => {
      const reader = new FileReader()  // Create a new FileReader instance
    
      reader.readAsDataURL(file)  // Read the file and convert it to a Base64 URL
    
      reader.onloadend = () => {  // When reading is finished
        setPreviewSource(reader.result)  // Store the Base64 data in state
      }
    }
    const handleFileUplaod=()=>{
      try{
        if (!imageFile) {
          toast.error("Please select a file before uploading.");
          return;
        }
        console.log("uploading");
        setLoading(true);
       const formData = new FormData();
        formData.append("displayPicture", imageFile);
        dispatch(profilePicUpdater(formData,token,dispatch)).then(()=>{
          setLoading(false);
        })

      }catch(err){
        console.log(err);
      }
    }
  return (
    <div className='flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5'>
        <div className='flex flex-row gap-x-4'>
            <img src={previewSource ?? user.image} alt="User" className='aspect-square w-[78px] rounded-full object-cover'/>
            <div className='space-y-2'>
              <p>Change Profile Picture</p>
              <div className='flex flex-row gap-x-4'>
              <input type="file" ref={fileInputref} className='hidden' onChange={handleFileChange}/>
              <button className='rounded-md py-2 px-5 bg-richblack-700 font-semibold text-richblack-200' onClick={handleClick} disabled={loading}>
                Select
              </button>
              <IconBtn text={loading ? "Uploading...." : "Upload"} onclick={handleFileUplaod}>
              {!loading && (
                  <FiUpload className="text-lg text-richblack-900" />
              )}
              </IconBtn>
              </div>             
            </div>
        </div>
    </div>
  )
}

export default ChangeProfilePicture