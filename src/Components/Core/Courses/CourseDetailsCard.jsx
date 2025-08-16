import React, { useState } from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addItem } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { purchaseCourse } from "../../../services/operations/walletAPI"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [purchasing, setPurchasing] = useState(false)

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleBuyWithWallet = async () => {
    if (!token) {
      setConfirmationModal({
        txt1: "You are not logged in!",
        txt2: "Please login to purchase this course",
        btn1Txt: "Login",
        btn2Txt: "Cancel",
        btn1onClick: () => navigate("/login"),
        btn2onClick: () => setConfirmationModal(null),
      })
      return
    }

    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }

    setPurchasing(true)
    try {
      const response = await purchaseCourse(courseId, token)
      if (response.success) {
        toast.success("Course purchased successfully!")
        // Refresh the page to show "Go To Course" button
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to purchase course:', error)
    } finally {
      setPurchasing(false)
    }
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addItem(course))
      return
    }
    setConfirmationModal({
      txt1: "You are not logged in!",
      txt2: "Please login to add To Cart",
      btn1Txt: "Login",
      btn2Txt: "Cancel",
      btn1onClick: () => navigate("/login"),
      btn2onClick: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyWithWallet
              }
              disabled={purchasing}
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : purchasing ? "Purchasing..." : "Buy with Wallet"}
            </button>
            {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
              <button onClick={handleAddToCart} className="blackButton">
                Add to Cart
              </button>
            )}
          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard