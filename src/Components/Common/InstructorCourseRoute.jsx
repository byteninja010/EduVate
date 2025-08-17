import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../services/apiconnector';
import { courseEndpoints, courseProgressEndpoints } from '../../services/apis';
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
        console.log('Checking ownership for course:', courseId);
        console.log('Current user:', user);
        console.log('User ID type:', typeof user._id);
        console.log('User ID value:', user._id);
        
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

          console.log('Course details response:', response);

          if (response.data.success) {
            const course = response.data.data;
            console.log('Course data:', course);
            console.log('Course instructor ID:', course.instructor);
            console.log('User ID:', user._id);
            console.log('Are they equal?', course.instructor === user._id);
            
            // Check if the current user is the instructor of this course
            console.log('Course instructor type:', typeof course.instructor);
            console.log('Course instructor value:', course.instructor);
            
            // Try different ways to compare IDs
            const ownsCourse = (
              course.instructor === user._id ||
              course.instructor === user.id ||
              course.instructor?.toString() === user._id?.toString() ||
              course.instructor?.toString() === user.id?.toString()
            );
            
            console.log('User owns course:', ownsCourse);
            console.log('Comparison details:', {
              'course.instructor === user._id': course.instructor === user._id,
              'course.instructor === user.id': course.instructor === user.id,
              'course.instructor?.toString() === user._id?.toString()': course.instructor?.toString() === user._id?.toString(),
              'course.instructor?.toString() === user.id?.toString()': course.instructor?.toString() === user.id?.toString()
            });
            
            if (ownsCourse) {
              setIsOwner(true);
              setLoading(false);
              return;
            }
          } else {
            console.log('Course details check failed:', response.data);
          }
        } catch (detailsError) {
          console.log('Course details check failed:', detailsError);
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

          console.log('Instructor courses response:', instructorResponse);

          if (instructorResponse.data.success) {
            const instructorCourses = instructorResponse.data.data;
            console.log('Instructor courses found:', instructorCourses);
            console.log('Looking for course ID:', courseId);
            
            // Try different ways to find the course
            const ownsThisCourse = instructorCourses.some(course => {
              const courseMatch = (
                course._id === courseId ||
                course.id === courseId ||
                course._id?.toString() === courseId?.toString() ||
                course.id?.toString() === courseId?.toString()
              );
              console.log(`Course ${course._id || course.id} matches ${courseId}:`, courseMatch);
              return courseMatch;
            });
            
            console.log('Owns this course:', ownsThisCourse);
            
            if (ownsThisCourse) {
              setIsOwner(true);
              setLoading(false);
              return;
            }
          } else {
            console.log('Instructor courses check failed:', instructorResponse.data);
          }
        } catch (instructorError) {
          console.log('Instructor courses check failed:', instructorError);
        }

        // If we reach here, user doesn't own the course
        console.log('User does not own this course');
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
    // Temporary bypass for development/testing (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Bypassing ownership check');
      return children;
    }
    
    toast.error('You can only manage your own courses');
    return <Navigate to="/unauthorized" replace />;
  }

  // User owns the course, render the component
  return children;
};

export default InstructorCourseRoute;
