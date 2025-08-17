import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../services/apiconnector';
import { courseProgressEndpoints } from '../../services/apis';
import toast from 'react-hot-toast';

const EnrolledCourseRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { courseId } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const checkEnrollment = async () => {
      if (!token || !courseId) {
        setIsEnrolled(false);
        setLoading(false);
        return;
      }

      try {
        // Try multiple approaches to check enrollment
        
        // Approach 1: Check course progress
        try {
          const progressResponse = await apiConnector(
            "GET", 
            `${courseProgressEndpoints.GET_COURSE_PROGRESS}/${courseId}`,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (progressResponse.data.success) {
            setIsEnrolled(true);
            setLoading(false);
            return;
          }
        } catch (progressError) {
          // Course progress check failed, try next approach
        }

        // Approach 2: Check enrolled courses from profile
        try {
          const enrolledResponse = await apiConnector(
            "GET",
            `${process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"}/profile/getEnrolledCourses`,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (enrolledResponse.data.success) {
            const enrolledCourses = enrolledResponse.data.data;
            const isEnrolledInCourse = enrolledCourses.some(course => course._id === courseId);
            
            if (isEnrolledInCourse) {
              setIsEnrolled(true);
              setLoading(false);
              return;
            }
          }
        } catch (enrolledError) {
          // Enrolled courses check failed
        }

        // If we reach here, user is not enrolled
        setIsEnrolled(false);
        
      } catch (error) {
        console.error('Error checking enrollment:', error);
        setIsEnrolled(false);
        toast.error('Failed to verify course enrollment');
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, [token, courseId]);

  // Show loading while checking enrollment
  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-25 font-medium">Verifying enrollment...</p>
        </div>
      </div>
    );
  }

  // If not enrolled, redirect to course details
  if (!isEnrolled) {
    toast.error('You are not enrolled in this course');
    return <Navigate to={`/course/${courseId}`} replace />;
  }

  // User is enrolled, render the course
  return children;
};

export default EnrolledCourseRoute;
