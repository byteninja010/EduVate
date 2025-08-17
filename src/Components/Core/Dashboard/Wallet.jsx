import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { VscCreditCard, VscAdd, VscArrowDown, VscArrowUp, VscHistory, VscCheck, VscClose, VscWarning } from 'react-icons/vsc'
import { getWallet, createMoneyRequest, getMoneyRequests } from '../../../services/operations/walletAPI'
import { toast } from 'react-hot-toast'

const Wallet = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [wallet, setWallet] = useState(null)
  const [moneyRequests, setMoneyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMoneyRequest, setShowMoneyRequest] = useState(false)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [creatingRequest, setCreatingRequest] = useState(false)

  useEffect(() => {
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchWallet(), fetchMoneyRequests()])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWallet = async () => {
    try {
      const response = await getWallet(token)
      if (response.success) {
        setWallet(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error)
    }
  }

  const fetchMoneyRequests = async () => {
    try {
      const response = await getMoneyRequests(token)
      if (response.success) {
        setMoneyRequests(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch money requests:', error)
    }
  }

  const handleCreateMoneyRequest = async (e) => {
    e.preventDefault()
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!reason || reason.trim().length === 0) {
      toast.error('Please provide a reason for the request')
      return
    }

    setCreatingRequest(true)
    try {
      const response = await createMoneyRequest(parseInt(amount), reason.trim(), token)
      if (response.success) {
        setAmount('')
        setReason('')
        setShowMoneyRequest(false)
        fetchMoneyRequests() // Refresh money requests
        toast.success('Money request created successfully! Admin will review it.')
      }
    } catch (error) {
      console.error('Failed to create money request:', error)
    } finally {
      setCreatingRequest(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <VscHistory style={{ color: '#E5C558' }} />
      case 'APPROVED':
        return <VscCheck style={{ color: '#ffffff' }} />
      case 'REJECTED':
        return <VscClose style={{ color: '#ffffff' }} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="text-richblack-5">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-richblack-5">
          My Wallet
        </h1>
        <p className="text-richblack-200 mt-2 text-sm sm:text-base">
          Manage your wallet balance and request money from admin
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-richblack-800 p-4 sm:p-6 rounded-lg border border-richblack-700 mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-25 rounded-full flex items-center justify-center flex-shrink-0">
              <VscCreditCard className="text-2xl sm:text-3xl text-richblack-900" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-richblack-5">Wallet Balance</h2>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-25">₹{wallet?.balance || 0}</p>
            </div>
          </div>
          <button
            onClick={() => setShowMoneyRequest(true)}
            className="flex items-center justify-center gap-2 bg-yellow-25 text-richblack-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200 text-sm sm:text-base"
          >
            <VscAdd className="text-lg" />
            <span className="hidden sm:inline">Request Money</span>
            <span className="sm:hidden">Request</span>
          </button>
        </div>
      </div>

      {/* Money Request Alert */}
      <div className="bg-yellow-25/10 border border-yellow-25/20 rounded-lg p-3 sm:p-4 mb-6 lg:mb-8">
        <div className="flex items-start gap-2 sm:gap-3">
          <VscWarning className="text-yellow-25 text-lg sm:text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-yellow-25 font-semibold mb-2 text-sm sm:text-base">Important Information</h3>
            <p className="text-richblack-200 text-xs sm:text-sm leading-relaxed">
              Before creating a money request, please contact the admin at{' '}
              <span className="text-yellow-25 font-medium">admin@eduvate.in</span> to discuss your request. 
              The admin will review and either approve or reject your request. 
              <span className="text-red-400 font-semibold block mt-2">
                ⚠️ Wrong or excessive requests can lead to account suspension or ban.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Money Requests Section */}
      <div className="bg-richblack-800 p-4 sm:p-6 rounded-lg border border-richblack-700 mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-richblack-5">Money Requests</h2>
        
        {moneyRequests.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-richblack-200 text-sm sm:text-base">No money requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moneyRequests.map((request) => (
              <div key={request._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-richblack-700 rounded-lg hover:bg-richblack-650 transition-all duration-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    request.status === 'PENDING' ? 'bg-yellow-25/20' :
                    request.status === 'APPROVED' ? 'bg-caribbeangreen-600' :
                    'bg-pink-600'
                  }`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-richblack-5">₹{request.amount}</p>
                    <p className="text-xs sm:text-sm text-richblack-200 line-clamp-1">{request.reason}</p>
                    <p className="text-xs text-richblack-300">{formatDate(request.createdAt)}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: request.status === 'PENDING' ? '#E5C558' : 
                                     request.status === 'APPROVED' ? '#10b981' : 
                                     request.status === 'REJECTED' ? '#ef4444' : '#4b5563',
                      color: request.status === 'PENDING' ? '#0F172A' : 
                             request.status === 'APPROVED' ? '#ffffff' : 
                             request.status === 'REJECTED' ? '#ffffff' : '#D1D5DB'
                    }}
                  >
                    {request.status}
                  </span>
                  {request.adminResponse && (
                    <p className="text-xs text-richblack-300 mt-1 max-w-xs line-clamp-2">
                      {request.adminResponse}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-richblack-800 p-4 sm:p-6 rounded-lg border border-richblack-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-richblack-5">Transaction History</h2>
        
        {wallet?.transactions?.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-richblack-200 text-sm sm:text-base">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallet?.transactions?.map((transaction, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-richblack-700 rounded-lg hover:bg-richblack-650 transition-all duration-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'CREDIT' ? 'bg-caribbeangreen-600' : 'bg-pink-600'
                  }`}>
                    {transaction.type === 'CREDIT' ? (
                      <VscArrowUp className="text-white text-sm sm:text-base" />
                    ) : (
                      <VscArrowDown className="text-white text-sm sm:text-base" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-richblack-5 text-sm sm:text-base line-clamp-1">{transaction.description}</p>
                    <p className="text-xs sm:text-sm text-richblack-200">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
                <div className={`text-sm sm:text-base font-bold ${
                  transaction.type === 'CREDIT' ? 'text-caribbeangreen-400' : 'text-pink-400'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Money Request Modal */}
      {showMoneyRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-richblack-800 p-4 sm:p-6 rounded-xl w-full max-w-md border-2 border-yellow-25/20 shadow-2xl shadow-yellow-25/10">
            {/* Header with Icon */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-25/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <VscCreditCard className="text-xl sm:text-2xl text-yellow-25" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-yellow-25">Request Money from Admin</h3>
              <p className="text-richblack-300 mt-1 text-xs sm:text-sm">Fill in the details below</p>
            </div>
            
            {/* Warning Alert */}
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-500/20 rounded-lg p-2 sm:p-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <VscWarning className="text-red-400 text-xs sm:text-sm" />
                </div>
                <div>
                  <p className="text-red-400 font-bold text-xs mb-1">⚠️ Important Notice</p>
                  <p className="text-richblack-200 text-xs leading-relaxed">
                    Contact <span className="text-yellow-25 font-bold">admin@eduvate.in</span> first!
                    <span className="text-red-400 font-bold block mt-1">
                      Wrong requests can lead to account suspension or ban.
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleCreateMoneyRequest} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-yellow-25 mb-2 uppercase tracking-wide">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  required
                  className="w-full px-3 py-2 sm:py-3 bg-richblack-700 border-2 border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-yellow-25/50 placeholder-richblack-400 text-sm sm:text-base font-medium transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-yellow-25 mb-2 uppercase tracking-wide">
                  Reason for Request
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you need this money..."
                  rows="3"
                  required
                  className="w-full px-3 py-2 sm:py-3 bg-richblack-700 border-2 border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:border-yellow-25/50 resize-none placeholder-richblack-400 text-xs sm:text-sm font-medium transition-all duration-200"
                />
              </div>
              <div className="flex gap-2 sm:gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMoneyRequest(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-richblack-300 hover:text-richblack-100 transition-all duration-200 font-bold bg-richblack-700 hover:bg-richblack-600 rounded-lg border-2 border-richblack-600 hover:border-richblack-500 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRequest}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-yellow-25 to-yellow-50 text-richblack-900 rounded-lg font-bold disabled:opacity-50 hover:from-yellow-50 hover:to-yellow-25 hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-25/20 text-xs sm:text-base"
                >
                  {creatingRequest ? 'Creating...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallet
