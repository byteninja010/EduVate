import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getEnrolledCourse } from "../services/operations/Settings";
import EnrolledCourseViewer from "../Components/Core/Courses/EnrolledCourseViewer";
import { HiOutlineArrowLeft } from "react-icons/hi";

const EnrolledCourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await getEnrolledCourse(token);
        
        if (response?.data?.success) {
          const enrolledCourses = response.data.data;
          const currentCourse = enrolledCourses.find(c => c._id === courseId);
          
          if (currentCourse) {
            setCourse(currentCourse);
          } else {
            setError("Course not found or you are not enrolled in this course");
          }
        } else {
          setError("Failed to fetch course data");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    if (token && courseId) {
      fetchCourse();
    }
  }, [token, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-richblack-5 mb-4">
            {error}
          </h2>
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="px-6 py-3 bg-yellow-25 text-richblack-900 rounded-md hover:bg-yellow-50 transition-colors"
          >
            Back to Enrolled Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-richblack-5 mb-4">
            Course not found
          </h2>
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="px-6 py-3 bg-yellow-25 text-richblack-900 rounded-md hover:bg-yellow-50 transition-colors"
          >
            Back to Enrolled Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Navigation Header */}
      <div className="bg-richblack-800 border-b border-richblack-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="flex items-center gap-2 text-richblack-300 hover:text-richblack-5 transition-colors"
          >
            <HiOutlineArrowLeft className="text-lg" />
            <span>Back to Enrolled Courses</span>
          </button>
        </div>
      </div>

      {/* Course Viewer */}
      <EnrolledCourseViewer course={course} />
    </div>
  );
};

export default EnrolledCourseView;
