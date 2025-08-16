import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { VscAdd, VscEdit, VscTrash, VscEye, VscSettings, VscVm } from 'react-icons/vsc'
import { getInstructorCourses, deleteCourse } from '../../../services/operations/courseDetailsApi'
import ConfirmationModal from '../../Common/ConfirmationModal'

const MyCourses = () => {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [token])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await getInstructorCourses(token)
      if (response.success) {
        setCourses(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await deleteCourse(courseId, token)
      if (response.success) {
        fetchCourses() // Refresh the list
      }
    } catch (error) {
      console.error("Failed to delete course:", error)
    }
    setConfirmationModal(null)
  }

  const openDeleteModal = (course) => {
          setConfirmationModal({
        txt1: "Are you sure?",
        txt2: `Do you want to delete "${course.courseName}"? This action cannot be undone.`,
        btn1Txt: "Delete",
        btn2Txt: "Cancel",
        btn1onClick: () => handleDeleteCourse(course._id),
        btn2onClick: () => setConfirmationModal(null),
      })
  }

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5">My Courses</h1>
          <p className="text-richblack-200 mt-2">
            Manage and organize your courses
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="flex items-center gap-2 bg-yellow-25 text-richblack-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
        >
          <VscAdd className="text-lg" />
          Create Course
        </button>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl text-richblack-600 mb-4">
            <VscVm />
          </div>
          <h3 className="text-xl font-semibold text-richblack-200 mb-2">
            No courses created yet
          </h3>
          <p className="text-richblack-300 mb-6">
            Start building your first course and share your knowledge with students.
          </p>
          <button
            onClick={() => navigate("/dashboard/add-course")}
            className="bg-yellow-25 text-richblack-900 px-8 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Course Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Course Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-richblack-5 mb-2">
                        {course.courseName}
                      </h3>
                      <p className="text-richblack-200 text-sm line-clamp-2 mb-3">
                        {course.courseDescription}
                      </p>
                      
                      {/* Course Stats */}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-richblack-300">
                        <span className="flex items-center gap-1">
                          <VscEye className="text-lg" />
                          {course.studentsEnrolled?.length || 0} students
                        </span>
                        <span className="text-yellow-25 font-medium">
                          ₹{course.price}
                        </span>
                        <span>
                          {course.courseContent?.length || 0} sections
                        </span>
                        <span>
                          {course.courseContent?.reduce((acc, section) => 
                            acc + (section.subSection?.length || 0), 0
                          )} lectures
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/course/${course._id}`)}
                        className="flex items-center gap-2 bg-richblue-600 text-richblack-5 px-4 py-2 rounded-lg font-medium hover:bg-richblue-500 transition-all duration-200"
                        title="View Course"
                      >
                        <VscEye className="text-lg" />
                        View
                      </button>
                      
                      <button
                        onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                        className="flex items-center gap-2 bg-yellow-25 text-richblack-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
                        title="Edit Course"
                      >
                        <VscEdit className="text-lg" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => navigate(`/dashboard/manage-course/${course._id}`)}
                        className="flex items-center gap-2 bg-caribbeangreen-600 text-richblack-5 px-4 py-2 rounded-lg font-medium hover:bg-caribbeangreen-500 transition-all duration-200"
                        title="Manage Content"
                      >
                        <VscSettings className="text-lg" />
                        Manage
                      </button>
                      
                      <button
                        onClick={() => openDeleteModal(course)}
                        className="flex items-center gap-2 bg-pink-600 text-richblack-5 px-4 py-2 rounded-lg font-medium hover:bg-pink-500 transition-all duration-200"
                        title="Delete Course"
                      >
                        <VscTrash className="text-lg" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}

export default MyCourses
