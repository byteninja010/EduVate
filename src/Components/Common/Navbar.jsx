import React from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
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
const Navbar = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.profile.user);
 // console.log(user);
  const cart = useSelector((store) => store.cart.items);
  const handleLogOut=()=>{
      dispatch(logout(navigate));
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
                    <div className="realtive group transition-all duration-200">
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
                      <div className="absolute bg-richblack-50 rounded-md px-4 invisible group-hover:visible opacity:0 group-hover:opacity-100">
                        {subLinks.map((cat,key) => {
                           return <Link to={`/catalog/${cat.name}`} key={key}><p className="text-richblack-700 my-2 hover:scale-95 transition-all duration-200">{cat.name}</p></Link>;
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
                <button className="bg-richblack-800 text-richblack-100 px-6 py-2 rounded-md hover:scale-95 transition-all duration-200 cursor-pointer" onClick={handleLogOut}>
                  Log Out
                </button>
                <div>
                <img src={user.image} width={"50px"} height={"50px"} className="rounded-full object-cover" />
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
