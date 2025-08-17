import { toast } from "react-hot-toast"
import { adminEndpoints } from "../apis"
import { apiConnector } from "../apiconnector"

// Get all money requests for admin
export const getMoneyRequests = async (token) => {
  const toastId = toast.loading("Loading money requests...")
  let result = null
  try {
    const response = await apiConnector("GET", adminEndpoints.GET_MONEY_REQUESTS, null, {
      "Authorization": `Bearer ${token}`
    })
    console.log("GET_MONEY_REQUESTS_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("GET_MONEY_REQUESTS_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to fetch money requests")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// Approve money request
export const approveMoneyRequest = async (requestId, adminResponse, token) => {
  const toastId = toast.loading("Approving money request...")
  let result = null
  try {
    const response = await apiConnector("PATCH", `${adminEndpoints.APPROVE_MONEY_REQUEST}/${requestId}/approve`, { adminResponse }, {
      "Authorization": `Bearer ${token}`
    })
    console.log("APPROVE_MONEY_REQUEST_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Money request approved successfully!")
    result = response.data
  } catch (error) {
    console.log("APPROVE_MONEY_REQUEST_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to approve money request")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// Reject money request
export const rejectMoneyRequest = async (requestId, adminResponse, token) => {
  const toastId = toast.loading("Rejecting money request...")
  let result = null
  try {
    const response = await apiConnector("PATCH", `${adminEndpoints.REJECT_MONEY_REQUEST}/${requestId}/reject`, { adminResponse }, {
      "Authorization": `Bearer ${token}`
    })
    console.log("REJECT_MONEY_REQUEST_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Money request rejected successfully!")
    result = response.data
  } catch (error) {
    console.log("REJECT_MONEY_REQUEST_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to reject money request")
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}
