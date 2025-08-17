const BASE_URL="http://localhost:4000/api/v1"
export const categories={
    CATEGORIES_API:BASE_URL+"/course/showAllCategories",
    SHOW_ALL_CATEGORIES:BASE_URL+"/course/showAllCategories"
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
    GET_COURSE_DETAILS:BASE_URL+"/course/getCourseDetails",
    CREATE_COURSE:BASE_URL+"/course/createCourse",
    EDIT_COURSE:BASE_URL+"/course/editCourse",
    DELETE_COURSE:BASE_URL+"/course/deleteCourse",
    GET_INSTRUCTOR_COURSES:BASE_URL+"/course/getInstructorCourses",
    CREATE_SECTION:BASE_URL+"/course/addSection",
    UPDATE_SECTION:BASE_URL+"/course/updateSection",
    DELETE_SECTION:BASE_URL+"/course/deleteSection",
    CREATE_SUBSECTION:BASE_URL+"/course/createSubSection",
    UPDATE_SUBSECTION:BASE_URL+"/course/updateSubSection",
    DELETE_SUBSECTION:BASE_URL+"/course/deleteSubSection"
}

export const courseProgressEndpoints={
    UPDATE_COURSE_PROGRESS:BASE_URL+"/courseProgress/updateCourseProgress",
    GET_COURSE_PROGRESS:BASE_URL+"/courseProgress/getCourseProgress"
}

export const walletEndpoints = {
    GET_WALLET: BASE_URL + "/wallet/getWallet",
    PURCHASE_COURSE: BASE_URL + "/wallet/purchaseCourse",
    ADD_MONEY: BASE_URL + "/wallet/addMoney",
    GET_INSTRUCTOR_REVENUE: BASE_URL + "/wallet/getInstructorRevenue",
    CREATE_MONEY_REQUEST: BASE_URL + "/wallet/createMoneyRequest",
    GET_MONEY_REQUESTS: BASE_URL + "/wallet/getMoneyRequests",
    UPDATE_MONEY_REQUEST: BASE_URL + "/wallet/updateMoneyRequest"
}

export const ratingEndpoints = {
    CREATE_RATING: BASE_URL + "/rating/createRating",
    GET_AVERAGE_RATING: BASE_URL + "/rating/getAverageRating",
    GET_COURSE_RATINGS: BASE_URL + "/rating/getCourseRatings",
    UPDATE_RATING: BASE_URL + "/rating/updateRating",
    DELETE_RATING: BASE_URL + "/rating/deleteRating",
    GET_ALL_RATINGS: BASE_URL + "/rating/getAllRatings"
}

export const adminEndpoints = {
    GET_DASHBOARD_STATS: BASE_URL + "/admin/dashboard-stats",
    GET_ALL_USERS: BASE_URL + "/admin/users",
    GET_USER_DETAILS: BASE_URL + "/admin/users",
    TOGGLE_USER_BAN: BASE_URL + "/admin/users",
    DELETE_USER: BASE_URL + "/admin/users",
    GET_MONEY_REQUESTS: BASE_URL + "/admin/money-requests",
    APPROVE_MONEY_REQUEST: BASE_URL + "/admin/money-requests",
    REJECT_MONEY_REQUEST: BASE_URL + "/admin/money-requests",
    GET_CATEGORIES: BASE_URL + "/admin/categories",
    CREATE_CATEGORY: BASE_URL + "/admin/categories",
    UPDATE_CATEGORY: BASE_URL + "/admin/categories",
    DELETE_CATEGORY: BASE_URL + "/admin/categories"
}
  