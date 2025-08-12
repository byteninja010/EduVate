import { apiConnector } from "../apiconnector";
import { courseProgressEndpoints } from "../apis";
import toast from "react-hot-toast";

const { UPDATE_COURSE_PROGRESS, GET_COURSE_PROGRESS } = courseProgressEndpoints;

// Mark a video as completed
export const markVideoCompleted = async (courseId, subSectionId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      UPDATE_COURSE_PROGRESS,
      {
        courseId,
        subSectionId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to mark video as completed");
    }

    return response.data;
  } catch (error) {
    console.error("Error marking video as completed:", error);
    throw error;
  }
};

// Get course progress for a specific course
export const getCourseProgress = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_COURSE_PROGRESS}?courseId=${courseId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to get course progress");
    }

    return response.data;
  } catch (error) {
    console.error("Error getting course progress:", error);
    throw error;
  }
};

// Get all course progress for a user
export const getAllCourseProgress = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      courseProgressEndpoints.GET_ALL_COURSE_PROGRESS,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to get all course progress");
    }

    return response.data;
  } catch (error) {
    console.error("Error getting all course progress:", error);
    throw error;
  }
};
