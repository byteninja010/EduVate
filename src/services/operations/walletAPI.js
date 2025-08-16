import { toast } from "react-hot-toast"
import { walletEndpoints } from "../apis"
import { apiConnector } from "../apiconnector"

// Get wallet balance and transactions
export const getWallet = async (token) => {
  const toastId = toast.loading("Loading wallet...")
  let result = null
  try {
    const response = await apiConnector("GET", walletEndpoints.GET_WALLET, null, {
      "Authorization": `Bearer ${token}`
    })
    console.log("GET_WALLET_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("GET_WALLET_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to fetch wallet")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// Purchase a course using wallet
export const purchaseCourse = async (courseId, token) => {
  const toastId = toast.loading("Processing purchase...")
  let result = null
  try {
    const response = await apiConnector("POST", walletEndpoints.PURCHASE_COURSE, { courseId }, {
      "Authorization": `Bearer ${token}`
    })
    console.log("PURCHASE_COURSE_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Course purchased successfully!")
    result = response.data
  } catch (error) {
    console.log("PURCHASE_COURSE_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to purchase course")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// Add money to wallet (for testing)
export const addMoney = async (amount, token) => {
  const toastId = toast.loading("Adding money...")
  let result = null
  try {
    const response = await apiConnector("POST", walletEndpoints.ADD_MONEY, { amount }, {
      "Authorization": `Bearer ${token}`
    })
    console.log("ADD_MONEY_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success(`₹${amount} added to wallet successfully!`)
    result = response.data
  } catch (error) {
    console.log("ADD_MONEY_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to add money")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// Get instructor revenue analytics
export const getInstructorRevenue = async (token) => {
  const toastId = toast.loading("Loading analytics...")
  let result = null
  try {
    const response = await apiConnector("GET", walletEndpoints.GET_INSTRUCTOR_REVENUE, null, {
      "Authorization": `Bearer ${token}`
    })
    console.log("GET_INSTRUCTOR_REVENUE_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("GET_INSTRUCTOR_REVENUE_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to fetch revenue analytics")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}
