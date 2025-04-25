const BASE_URL=process.env.REACT_APP_BASE_URL
export const categories={
    CATEGORIES_API:BASE_URL+"/course/showAllCategories"
}
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    // RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    // RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  }

export const contactUsEndpoints={
    CONTACT_US:BASE_URL+"/contact/contactUs"
}

export const settingsEndpoints={
    UPDATE_PROFILE_PICTURE:BASE_URL+"/profile/updateProfilePicture",
    UPDATE_PROFILE:BASE_URL+"/profile/updateProfile",
    GET_ENROLLED_COURSE:BASE_URL+"/profile/getEnrolledCourses"
}

export const courseEndpoints={
    GET_COURSES_BY_CATEGORY:BASE_URL+"/course/coursesByCategory",
}
  