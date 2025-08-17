import React from 'react'
import * as Icons from "react-icons/vsc"
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { matchPath } from "react-router-dom";

const SidebarLinks = ({link, onClick}) => {
    const Icon=Icons[link.icon]
    const location=useLocation();
    const dispatch=useDispatch();
    const matchRoute=(route)=>{
        return matchPath({path:route},location.pathname);
    }
    
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };
    
    console.log(Icon);
  return (
    <NavLink to={link.path} className={`${ matchRoute(link.path)
      ? "bg-yellow-800 text-yellow-50"
      : "bg-opacity-0 text-richblack-300"}`} onClick={handleClick}>
        <div className='flex flex-row gap-x-3 font-semibold px-3 py-1'>
            <Icon className="text-2xl"/>
            <p>{link.name}</p>
        </div>
    </NavLink>
  )
}

export default SidebarLinks