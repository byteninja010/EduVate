import React from "react";
import { useSelector } from "react-redux";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { signup } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
const OtpVerify = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
  const {loading,signupData} = useSelector((store) => store.auth);
  const [otp, setOtp] = useState("");
  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(signupData);
  const {firstName,lastName,email,password,confirmPassword,accountType}=signupData;
  const handleFormSubmit=(e)=>{
    e.preventDefault();
    dispatch(signup(firstName,lastName,email,password,confirmPassword,accountType,otp,navigate));
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <p className="text-richblack-5 text-3xl font-semibold">
            Verify Email
          </p>
          <p className="text-richblack-200 my-4">
            A verification code has been sent to you. Enter the code below
          </p>
          <form>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="bg-richblack-800 w-[48px] lg:w-[60px] border-0 rounded-md text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 "
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
              }}
            />
            <button className="text-richblack-900 bg-yellow-50 text-center w-full rounded-lg p-3 my-4" onClick={handleFormSubmit}>Verify and Register</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OtpVerify;
