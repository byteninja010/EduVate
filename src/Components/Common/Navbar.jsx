import React from "react";
import logo from "../../assets/Images/Eduvate_logo.png";
import { Link } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { TiArrowSortedDown } from "react-icons/ti";
import { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";
import { useDispatch } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";

const Navbar = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.profile.user);
 // console.log(user);
  const cart = useSelector((store) => store.cart.items);
  
  const handleLogOut=()=>{
      dispatch(logout(navigate));
  }

  const handleDashboardClick = () => {
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      navigate('/dashboard/instructor');
    } else {
      navigate('/dashboard/student');
    }
    setShowProfileMenu(false);
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  }

  const fetchData = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.allCategorys);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  console.log(subLinks);
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ">
      <div className="w-11/12 py-3 px-28 flex flex-row justify-between items-center">
        <div className="mx-auto md:mx-0">
          <Link to="/">
            <img
              src={logo}
              alt=""
              width={"160px"}
              height={"32px"}
              loading="lazy"
            />
          </Link>
        </div>
        <nav>
          <ul className="hidden lg:flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div className="relative group transition-all duration-200">
                      <Link to={link?.path}>
                        <p
                          className={`${
                            matchRoute(link?.path)
                              ? "text-yellow-25"
                              : "text-richblack-25"
                          } flex items-center`}
                        >
                          {link.title}
                          <TiArrowSortedDown />
                        </p>
                      </Link>
                                             <div className="absolute top-full left-0 bg-richblack-900 rounded-xl px-4 py-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 border border-yellow-25/20 shadow-2xl shadow-yellow-25/10 min-w-[220px] backdrop-blur-sm">
                         {subLinks.map((cat,key) => {
                            return <Link to={`/catalog/${cat.name}`} key={key}><p className="text-richblack-100 my-2 hover:text-yellow-25 hover:scale-105 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-yellow-25/10 hover:bg-gradient-to-r hover:from-yellow-25/5 hover:to-transparent">{cat.name}</p></Link>;
                         })}
                       </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div>
          {token ? (
            <div className="hidden md:flex flex-row gap-4 items-center text-richblack-25">
              <Link to={"/cart"} className="relative"> 
                <FaShoppingCart className="text-2xl relative"/>
                <p className="absolute text-pink-500 top-[-7px] left-4 font-bold">{cart.length}</p>
              </Link> 
              
              {/* Profile Dropdown Menu */}
              <div className="relative profile-menu">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <img 
                    src={user.image} 
                    width={"50px"} 
                    height={"50px"} 
                    className="rounded-full object-cover border-2 border-richblack-600 hover:border-yellow-25 transition-colors duration-200" 
                    alt="Profile"
                  />
                  <TiArrowSortedDown className={`text-sm transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-richblack-800 rounded-lg shadow-lg border border-richblack-600 py-2 z-50">
                    <button
                      onClick={handleDashboardClick}
                      className="w-full text-left px-4 py-3 text-richblack-100 hover:bg-richblack-700 hover:text-yellow-25 transition-all duration-200 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/cart');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-richblack-100 hover:bg-richblack-700 hover:text-blue-400 transition-all duration-200 flex items-center gap-3"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      View Cart ({cart.length})
                    </button>
                    
                    <div className="border-t border-richblack-600 my-1"></div>
                    
                    <button
                      onClick={handleLogOut}
                      className="w-full text-left px-4 py-3 text-richblack-100 hover:bg-richblack-700 hover:text-pink-400 transition-all duration-200 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-row gap-4 items-center">
              <Link to={"/login"}>
                <button className="bg-richblack-800 text-richblack-100 px-6 py-2 rounded-md hover:scale-95 transition-all duration-200">
                  Log In
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="bg-richblack-800 text-richblack-100 px-6 py-2 rounded-md hover:scale-95 transition-all duration-200">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
