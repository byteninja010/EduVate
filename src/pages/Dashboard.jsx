import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Core/Dashboard/Sidebar';
import { ACCOUNT_TYPE } from '../utils/constants';

const Dashboard = () => {
    const loading = useSelector((state) => state.auth.loading);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        // If user is at the root dashboard path, redirect to appropriate dashboard
        if (location.pathname === '/dashboard') {
            if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
                navigate('/dashboard/instructor');
            } else if (user?.accountType === ACCOUNT_TYPE.STUDENT) {
                navigate('/dashboard/student');
            }
        }
    }, [user, navigate, location.pathname]);
    
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