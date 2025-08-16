import {toast} from "react-hot-toast"
import { courseEndpoints } from "../apis"
import { apiConnector } from "../apiconnector"

const {GET_COURSE_DETAILS, CREATE_COURSE, EDIT_COURSE, DELETE_COURSE, GET_INSTRUCTOR_COURSES, CREATE_SECTION, UPDATE_SECTION, DELETE_SECTION, CREATE_SUBSECTION, UPDATE_SUBSECTION, DELETE_SUBSECTION}=courseEndpoints

export const fetchCourseDetails = async (courseId) => {
    const toastId = toast.loading("Loading...")
    //   dispatch(setLoading(true));
    let result = null
    try {
      const response = await apiConnector("POST", GET_COURSE_DETAILS, {
        courseId,
      })
      console.log("COURSE_DETAILS_API API RESPONSE............", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response.data
    } catch (error) {
      console.log("COURSE_DETAILS_API API ERROR............", error)
      result = error.response.data
      // toast.error(error.response.data.message);
    }
    toast.dismiss(toastId)
    //   dispatch(setLoading(false));
    return result
  }
  
// Instructor Course Management APIs
export const createCourse = async (data, token) => {
  const toastId = toast.loading("Creating course...")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_COURSE, data, {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    })
    console.log("CREATE_COURSE_API RESPONSE............", response)
    console.log("Response data:", response.data)

    // Check if response has data and success property (including typo 'sucess')
    if (response.data && (response.data.success || response.data.sucess)) {
      toast.success("Course created successfully")
      result = response.data
    } else {
      // If no success property or success is false, treat as error
      console.log("API response indicates failure:", response.data)
      result = {
        success: false,
        message: response.data?.message || response.data?.msg || "Course creation failed"
      }
    }
  } catch (error) {
    console.log("CREATE_COURSE_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to create course")
    result = {
      success: false,
      message: error.response?.data?.message || "Failed to create course"
    }
  }
  toast.dismiss(toastId)
  return result
}

export const editCourse = async (data, token) => {
  const toastId = toast.loading("Updating course...")
  let result = null
  try {
    const response = await apiConnector("POST", EDIT_COURSE, data, {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    })
    console.log("EDIT_COURSE_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Course updated successfully")
    result = response.data
  } catch (error) {
    console.log("EDIT_COURSE_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to update course")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const deleteCourse = async (courseId, token) => {
  const toastId = toast.loading("Deleting course...")
  let result = null
  try {
    const response = await apiConnector("POST", DELETE_COURSE, { courseId }, {
      "Authorization": `Bearer ${token}`
    })
    console.log("DELETE_COURSE_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Course deleted successfully")
    result = response.data
  } catch (error) {
    console.log("DELETE_COURSE_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to delete course")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const getInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading courses...")
  let result = null
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_COURSES, null, {
      "Authorization": `Bearer ${token}`
    })
    console.log("GET_INSTRUCTOR_COURSES_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("GET_INSTRUCTOR_COURSES_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to fetch courses")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const createSection = async (data, token) => {
  const toastId = toast.loading("Creating section...")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_SECTION, data, {
      "Authorization": `Bearer ${token}`
    })
    console.log("CREATE_SECTION_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Section created successfully")
    result = response.data
  } catch (error) {
    console.log("CREATE_SECTION_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to create section")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const updateSection = async (data, token) => {
  const toastId = toast.loading("Updating section...")
  let result = null
  try {
    const response = await apiConnector("POST", UPDATE_SECTION, data, {
      "Authorization": `Bearer ${token}`
    })
    console.log("UPDATE_SECTION_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Section updated successfully")
    result = response.data
  } catch (error) {
    console.log("UPDATE_SECTION_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to update section")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const deleteSection = async (sectionId, token) => {
  const toastId = toast.loading("Deleting section...")
  let result = null
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION, { sectionId }, {
      "Authorization": `Bearer ${token}`
    })
    console.log("DELETE_SECTION_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Section deleted successfully")
    result = response.data
  } catch (error) {
    console.log("DELETE_SECTION_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to delete section")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const createSubSection = async (data, token) => {
  const toastId = toast.loading("Creating subsection...")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION, data, {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    })
    console.log("CREATE_SUBSECTION_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Subsection created successfully")
    result = response.data
  } catch (error) {
    console.log("CREATE_SUBSECTION_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to create subsection")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const updateSubSection = async (data, token) => {
  const toastId = toast.loading("Updating subsection...")
  let result = null
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION, data, {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    })
    console.log("UPDATE_SUBSECTION_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Subsection updated successfully")
    result = response.data
  } catch (error) {
    console.log("UPDATE_SUBSECTION_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to update subsection")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const deleteSubSection = async (subSectionId, token) => {
  const toastId = toast.loading("Deleting subsection...")
  let result = null
  try {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION, { subSectionId }, {
      "Authorization": `Bearer ${token}`
    })
    console.log("DELETE_SUBSECTION_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Subsection deleted successfully")
    result = response.data
  } catch (error) {
    console.log("DELETE_SUBSECTION_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to delete subsection")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}
  