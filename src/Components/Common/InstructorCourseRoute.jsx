import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../services/apiconnector';
import { courseEndpoints } from '../../services/apis';
import toast from 'react-hot-toast';

const InstructorCourseRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { courseId } = useParams();
  const [isOwner, setIsOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!token || !courseId || !user) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      try {
        // Try multiple approaches to check ownership
        
        // Approach 1: Check course details
        try {
          const response = await apiConnector(
            "GET", 
            `${courseEndpoints.GET_COURSE_DETAILS}/${courseId}`,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (response.data.success) {
            const course = response.data.data;
            
            // Check if the current user is the instructor of this course
            const ownsCourse = (
              course.instructor === user._id ||
              course.instructor === user.id ||
              course.instructor?.toString() === user._id?.toString() ||
              course.instructor?.toString() === user.id?.toString()
            );
            
            if (ownsCourse) {
              setIsOwner(true);
              setLoading(false);
              return;
            }
          }
        } catch (detailsError) {
          // Course details check failed, try next approach
        }

        // Approach 2: Check instructor's courses
        try {
          const instructorResponse = await apiConnector(
            "GET",
            `${courseEndpoints.GET_INSTRUCTOR_COURSES}`,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (instructorResponse.data.success) {
            const instructorCourses = instructorResponse.data.data;
            
            // Try different ways to find the course
            const ownsThisCourse = instructorCourses.some(course => {
              const courseMatch = (
                course._id === courseId ||
                course.id === courseId ||
                course._id?.toString() === courseId?.toString() ||
                course.id?.toString() === courseId?.toString()
              );
              return courseMatch;
            });
            
            if (ownsThisCourse) {
              setIsOwner(true);
              setLoading(false);
              return;
            }
          }
        } catch (instructorError) {
          // Instructor courses check failed
        }

        // If we reach here, user doesn't own the course
        setIsOwner(false);
      } catch (error) {
        console.error('Error checking course ownership:', error);
        setIsOwner(false);
        toast.error('Failed to verify course ownership');
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [token, courseId, user]);

  // Show loading while checking ownership
  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-25 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-25 font-medium">Verifying course ownership...</p>
        </div>
      </div>
    );
  }

  // If not the owner, redirect to unauthorized
  if (!isOwner) {
    toast.error('You can only manage your own courses');
    return <Navigate to="/unauthorized" replace />;
  }

  // User owns the course, render the component
  return children;
};

export default InstructorCourseRoute;
