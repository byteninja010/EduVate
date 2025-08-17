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
        console.log('Checking enrollment for course:', courseId);
        
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

          console.log('Course progress response:', progressResponse);

          if (progressResponse.data.success) {
            console.log('User is enrolled (found course progress)');
            setIsEnrolled(true);
            setLoading(false);
            return;
          } else {
            console.log('Course progress check failed:', progressResponse.data);
          }
        } catch (progressError) {
          console.log('Course progress check failed:', progressError);
        }

        // Approach 2: Check enrolled courses from profile
        try {
          const enrolledResponse = await apiConnector(
            "GET",
            "http://localhost:4000/api/v1/profile/getEnrolledCourses",
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          console.log('Enrolled courses response:', enrolledResponse);

          if (enrolledResponse.data.success) {
            const enrolledCourses = enrolledResponse.data.data;
            console.log('Enrolled courses found:', enrolledCourses);
            const isEnrolledInCourse = enrolledCourses.some(course => course._id === courseId);
            console.log('Is enrolled in this course:', isEnrolledInCourse);
            
            if (isEnrolledInCourse) {
              console.log('User is enrolled (found in enrolled courses)');
              setIsEnrolled(true);
              setLoading(false);
              return;
            }
          } else {
            console.log('Enrolled courses check failed:', enrolledResponse.data);
          }
        } catch (enrolledError) {
          console.log('Enrolled courses check failed:', enrolledError);
        }

        // If we reach here, user is not enrolled
        console.log('User is not enrolled in course');
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
    // Temporary bypass for development/testing (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Bypassing enrollment check');
      return children;
    }
    
    toast.error('You are not enrolled in this course');
    return <Navigate to={`/course/${courseId}`} replace />;
  }

  // User is enrolled, render the course
  return children;
};

export default EnrolledCourseRoute;
