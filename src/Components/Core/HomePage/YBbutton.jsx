import React from 'react'
import { Link } from 'react-router-dom'

const YBbutton = ({children,active,linkTo}) => {
  return (
    <Link to={linkTo}>
    <button className={`rounded-lg shadow-lg gap-2 py-3 px-6 text-base text-center
     ${active ? "bg-yellow-50 text-black":"bg-richblack-800 text-white"}
     hover:scale-95 transition-all duration-200 font-semibold `}>{children}</button>
    </Link>
  )
}

export default YBbutton