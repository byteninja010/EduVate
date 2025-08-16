import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Core/Dashboard/Sidebar';
const Dashboard = () => {
    const loading = useSelector((state) => state.auth.loading);
    
    if(loading){
        return <div className='spinner mx-auto flex justify-center items-center'></div>
    }
    
    return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
        <Sidebar/>
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard