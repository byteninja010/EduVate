import React from 'react'
import { useSelector } from 'react-redux'
import { sidebarLinks } from '../../../data/dashboard-links';
import SidebarLinks from './SidebarLinks';
import { IoIosLogOut } from "react-icons/io";
import { useState } from 'react';
import { logout } from '../../../services/operations/authAPI';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../Common/ConfirmationModal';
const Sidebar = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
        //State to handle confirmation Modal
    const [confirmationModal,setConfirmationModal]=useState(null);
    const handleButton=()=>{
        setConfirmationModal({
            txt1:"Are You Sure?",
            txt2:"You will be logged out of your account!!",
            btn1Txt:"Logout",
            btn2Txt:"Cancel",
            btn1onClick:()=>dispatch(logout(navigate)),
            btn2onClick:()=>setConfirmationModal(null)
        });
    }
    const {user,loading:loading1}=useSelector((state)=>state.profile);
    const {loading:loading2}=useSelector((state)=>state.auth);
    if(loading1 || loading2){
        return <div className='spinner mx-auto flex justify-center items-center'></div>
    }

  return (
    <div className='h-[calc(100vh-3.5rem)]'>
        <div className='flex min-w-[222px] flex-col border-r-[1px] border-richblack-700 bg-richblack-800 h-[100%] py-10 gap-2'>
            {
                sidebarLinks.map((link,index)=>{
                    if(link.type && user?.accountType!==link.type) return null;
                    return(
                        <SidebarLinks link={link} key={index}/>
                    )
                })
            }
            <hr className='my-6 text-richblack-200'/>
            <SidebarLinks link={{name:"Settings",path:"/dashboard/settings",icon:"VscAdd"}}/>
            <button onClick={handleButton}>
               <div className='flex flex-row items-center ml-4 text-richblack-200 gap-x-2'>
               <IoIosLogOut className='text-3xl'/>
               <span className='font-semibold'>Logout</span>
               </div>
            </button>
        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default Sidebar