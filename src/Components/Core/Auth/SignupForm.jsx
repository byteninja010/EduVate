import React from "react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { otpSender } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import toast from "react-hot-toast";
const SignupForm = () => {
  const [selected, setSelected] = useState("Student"); // Track the current selection

  const handleClick = (role) => {
    setSelected(role); // Update the selected state
    setFormData((prev) => ({ ...prev, accountType:role}));
  };
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType:"Student"
  });
  const handleFormData = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleShowCreatePass = () => {
    setShowPass((prev) => !prev);
  };
  const [showConPass, setShowConPass] = useState(false);
  const handleShowConfPass = () => {
    setShowConPass((prev) => !prev);
  };

  const handleFormSubmit=(e)=>{
    e.preventDefault();
    if(formData.confirmPassword!==formData.password){
      return toast.error("Password do not match");
    }
    dispatch(setSignupData(formData));
    dispatch(otpSender(navigate,formData.email))
  }
  
  return (
    <div>
      {/* Tab */}
      <div
      className="flex flex-row text-white text-md px-1 gap-x-3 py-1 rounded-full bg-richblack-800 w-fit"
      style={{
        boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset",
      }}
    >
      <div
        className={`px-4 rounded-full py-2 transition-all duration-200 cursor-pointer ${
          selected === "Student" ? "bg-richblack-900" : ""
        }`}
        onClick={() => handleClick("Student")}
      >
        Student
      </div>
      <div
        className={`px-4 rounded-full py-2 transition-all duration-200 cursor-pointer ${
          selected === "Instructor" ? "bg-richblack-900" : ""
        }`}
        onClick={() => handleClick("Instructor")}
      >
        Instructor
      </div>
    </div>
      <form className="mt-4 flex flex-col w-full gap-y-4"  onSubmit={handleFormSubmit}>
        <div className="flex flex-row gap-x-4">
          <label>
            <p className="text-richblack-100">
              First Name<sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              onChange={handleFormData}
              type="text"
              placeholder="Enter first Name"
              name="firstName"
              className="w-full rounded-md bg-richblack-800 text-richblack-200 p-3 mt-2"
              style={{
                boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset",
              }}
            />
          </label>
          <label>
            <p className="text-richblack-100">
              Last Name<sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              onChange={handleFormData}
              type="text"
              placeholder="Enter last Name"
              name="lastName"
              className="w-full rounded-md bg-richblack-800 text-richblack-200 p-3 mt-2"
              style={{
                boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset",
              }}
            />
          </label>
        </div>
        <label>
          <p className="text-richblack-100">
            Email Address<sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            onChange={handleFormData}
            type="text"
            placeholder="Enter email address"
            name="email"
            className="w-full rounded-md bg-richblack-800 text-richblack-200 p-3 mt-2"
            style={{
              boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset",
            }}
          />
        </label>
        <div className="flex flex-row gap-x-4">
          <label className="relative">
            <p className="text-richblack-100 mt-2">
              Create Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              onChange={handleFormData}
              type={`${showPass ? "text" : "password"}`}
              placeholder="Enter password"
              name="password"
              className="w-full rounded-md bg-richblack-800 text-richblack-200 p-3 mt-2"
              style={{
                boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset",
              }}
            />
            <span onClick={handleShowCreatePass}>
              {showPass ? (
                <AiOutlineEyeInvisible className="text-richblack-5 absolute text-2xl right-3 top-[53px]" />
              ) : (
                <AiOutlineEye className="text-richblack-5 absolute text-2xl right-3 top-[53px]" />
              )}
            </span>
          </label>
          <label className="relative">
            <p className="text-richblack-100 mt-2">
              Confirm Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              onChange={handleFormData}
              type={`${showConPass ? "text" : "password"}`}
              placeholder="Enter password"
              name="confirmPassword"
              className="w-full rounded-md bg-richblack-800 text-richblack-200 p-3 mt-2"
              style={{
                boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset",
              }}
            />
            <span onClick={handleShowConfPass}>
              {showConPass ? (
                <AiOutlineEyeInvisible className="text-richblack-5 absolute text-2xl right-3 top-[53px]" />
              ) : (
                <AiOutlineEye className="text-richblack-5 absolute text-2xl right-3 top-[53px]" />
              )}
            </span>
          </label>
        </div>
        <button
          className="w-full bg-yellow-50 font-semibold rounded-md p-3 mt-6"
          type="submit"
         
        >
          Create Account
        </button>

      </form>
    </div>
  );
};

export default SignupForm;
