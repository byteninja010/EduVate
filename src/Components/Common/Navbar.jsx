import React from "react";
import logo from "../../assets/Images/Eduvate_logo.png";
import { Link } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TiArrowSortedDown } from "react-icons/ti";
import { useState, useEffect } from "react";
// Removed unused imports
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";
import { ACCOUNT_TYPE } from "../../utils/constants";
// Removed setCategories import since it's no longer used

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
    const navigate=useNavigate();
  const dispatch=useDispatch();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.profile.user);
  const courseState = useSelector((store) => store.course);
  const categories = courseState?.categories || [];
  
  // Ensure we have a safe default for categories
  const safeCategories = Array.isArray(categories) ? categories : [];
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
    setShowMobileMenu(false);
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  }

  const toggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  // Remove duplicate category fetching - let Catalog.jsx handle it
  // const fetchData = async () => {
  //   try {
  //     const result = await apiConnector("GET", categories.CATEGORIES_API);
  //     dispatch(setCategories(result.data.allCategorys));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   // Only fetch if the store is initialized
  //   if (courseState) {
  //     fetchData();
  //   }
  // }, [courseState]);

  // // Refresh categories when they change in Redux store
  // useEffect(() => {
  //   if (courseState && safeCategories.length === 0) {
  //     fetchData();
  //   }
  // }, [courseState, safeCategories.length]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showMobileMenu]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="w-11/12 py-3 px-4 lg:px-28 flex flex-row justify-between items-center">
        {/* Left side - Hamburger menu and logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button - Only show on mobile and when on dashboard */}
          {location.pathname.startsWith('/dashboard') && (
            <button 
              className="lg:hidden text-richblack-25 hover:text-yellow-25 transition-colors duration-200 p-1"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {/* Logo */}
          <div className="mx-auto md:mx-0">
            <Link to="/">
              <img
                src={logo}
                alt=""
                width={"160px"}
                height={"32px"}
                loading="lazy"
                className="w-32 lg:w-40"
              />
            </Link>
          </div>
        </div>
        
        {/* Center - Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-x-6 text-richblack-25">
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
                         {!courseState ? (
                           <div className="text-center py-4">
                             <div className="w-4 h-4 border-2 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                             <p className="text-richblack-300 text-sm">Initializing...</p>
                           </div>
                         ) : !safeCategories || safeCategories.length === 0 ? (
                           <div className="text-center py-4">
                             <div className="w-4 h-4 border-2 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                             <p className="text-richblack-300 text-sm">Loading categories...</p>
                           </div>
                         ) : (
                           safeCategories.map((cat,key) => {
                              return <Link to={`/catalog/${cat.name}`} key={key}><p className="text-richblack-100 my-2 hover:text-yellow-25 hover:scale-105 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-yellow-25/10 hover:bg-gradient-to-r hover:from-yellow-25/5 hover:to-transparent">{cat.name}</p></Link>;
                           })
                         )}
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

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden absolute top-14 left-0 right-0 bg-richblack-900 border-b border-richblack-700 z-50 mobile-menu-container">
            <div className="px-4 py-4 space-y-4">
              {NavbarLinks.map((link, index) => (
                <div key={index}>
                  {link.title === "Catalog" ? (
                    <div className="space-y-2">
                      <p className="text-richblack-300 text-sm font-medium uppercase tracking-wide">
                        {link.title}
                      </p>
                      <div className="pl-4 space-y-2">
                        {!courseState ? (
                          <div className="text-center py-2">
                            <div className="w-4 h-4 border-2 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-richblack-300 text-sm">Loading...</p>
                          </div>
                        ) : !safeCategories || safeCategories.length === 0 ? (
                          <p className="text-richblack-400 text-sm">No categories available</p>
                        ) : (
                          safeCategories.map((cat, key) => (
                            <Link 
                              key={key} 
                              to={`/catalog/${cat.name}`}
                              onClick={() => setShowMobileMenu(false)}
                              className="block text-richblack-100 hover:text-yellow-25 transition-colors duration-200 py-1"
                            >
                              {cat.name}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to={link?.path}
                      onClick={() => setShowMobileMenu(false)}
                      className="block text-richblack-100 hover:text-yellow-25 transition-colors duration-200 py-2"
                    >
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth Buttons */}
              {!token ? (
                <div className="pt-4 border-t border-richblack-700 space-y-2">
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full bg-richblack-800 text-richblack-100 px-4 py-2 rounded-md hover:bg-richblack-700 transition-all duration-200">
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full bg-yellow-25 text-richblack-900 px-4 py-2 rounded-md hover:bg-yellow-50 transition-all duration-200 font-semibold">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-richblack-700 space-y-2">
                  {user?.accountType === 'Admin' && (
                    <Link to="/admin" onClick={() => setShowMobileMenu(false)}>
                      <button className="w-full bg-yellow-25/10 border border-yellow-25/20 rounded-lg px-4 py-2 text-yellow-25 font-semibold hover:bg-yellow-25/20 transition-all duration-200">
                        Admin Panel
                      </button>
                    </Link>
                  )}
                  <Link to="/cart" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full bg-richblack-800 text-richblack-100 px-4 py-2 rounded-md hover:bg-richblack-700 transition-all duration-200 flex items-center justify-center gap-2">
                      <FaShoppingCart className="text-lg" />
                      Cart ({cart.length})
                    </button>
                  </Link>
                  <button 
                    onClick={() => {
                      handleDashboardClick();
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-richblack-800 text-richblack-100 px-4 py-2 rounded-md hover:bg-richblack-700 transition-all duration-200"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      handleLogOut();
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right side - Profile and actions */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button for non-dashboard pages */}
          {!location.pathname.startsWith('/dashboard') && (
            <button 
              className="lg:hidden text-richblack-25 hover:text-yellow-25 transition-colors duration-200"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {token ? (
            <div className="hidden md:flex flex-row gap-4 items-center text-richblack-25">
              {/* Admin Access Link */}
              {user?.accountType === 'Admin' && (
                <Link to="/admin" className="bg-yellow-25/10 border border-yellow-25/20 rounded-lg px-3 py-2 hover:bg-yellow-25/20 transition-all duration-200">
                  <p className="text-yellow-25 text-sm font-semibold">Admin Panel</p>
                </Link>
              )}
              
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
                <button className="w-full bg-richblack-800 text-richblack-100 px-6 py-2 rounded-md hover:scale-95 transition-all duration-200">
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
