import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { VscAdd, VscVm, VscEye, VscGraph } from 'react-icons/vsc'
import { getInstructorCourses } from '../../../services/operations/courseDetailsApi'
import { getInstructorRevenue } from '../../../services/operations/walletAPI'

const InstructorDashboard = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, revenueResponse] = await Promise.all([
          getInstructorCourses(token),
          getInstructorRevenue(token)
        ])
        
        if (coursesResponse.success) {
          setCourses(coursesResponse.data)
        }
        
        if (revenueResponse.success) {
          setRevenueData(revenueResponse.data)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchData()
    }
  }, [token])

  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      icon: VscVm,
      color: "text-yellow-25"
    },
    {
      title: "Total Students",
      value: revenueData?.totalStudents || 0,
      icon: VscEye,
      color: "text-caribbeangreen-25"
    },
    {
      title: "Total Revenue",
      value: `₹${revenueData?.totalRevenue || 0}`,
      icon: VscGraph,
      color: "text-richblue-25"
    }
  ]

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="text-richblack-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-richblack-200 mt-2">
          Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-richblack-200 text-sm font-medium">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color}`}>
                <stat.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard/add-course")}
            className="flex items-center gap-2 bg-yellow-25 text-richblack-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
          >
            <VscAdd className="text-lg" />
            Create New Course
          </button>
          <button
            onClick={() => navigate("/dashboard/my-courses")}
            className="flex items-center gap-2 bg-richblue-600 text-richblack-5 px-4 py-2 rounded-lg font-medium hover:bg-richblue-500 transition-all duration-200"
          >
            <VscVm className="text-lg" />
            View All Courses
          </button>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <button
            onClick={() => navigate("/dashboard/my-courses")}
            className="text-yellow-25 hover:text-yellow-50 transition-colors duration-200"
          >
            View All
          </button>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-richblack-200 mb-4">You haven't created any courses yet.</p>
            <button
              onClick={() => navigate("/dashboard/add-course")}
              className="bg-yellow-25 text-richblack-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <div key={course._id} className="flex items-center justify-between p-4 bg-richblack-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-richblack-5">{course.courseName}</h3>
                    <p className="text-sm text-richblack-200">
                      {course.studentsEnrolled?.length || 0} students enrolled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-25 font-medium">₹{course.price}</span>
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="text-richblue-400 hover:text-richblue-300 transition-colors duration-200"
                  >
                    <VscEye className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
