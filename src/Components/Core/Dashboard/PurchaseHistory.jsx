import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { VscHistory, VscEye, VscCalendar, VscCreditCard } from 'react-icons/vsc'
import { getWallet } from '../../../services/operations/walletAPI'

const PurchaseHistory = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, purchases, credits

  useEffect(() => {
    fetchWallet()
  }, [token])

  const fetchWallet = async () => {
    try {
      setLoading(true)
      const response = await getWallet(token)
      if (response.success) {
        setWallet(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error)
    } finally {
      setLoading(false)
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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getFilteredTransactions = () => {
    if (!wallet?.transactions) return []
    
    switch (filter) {
      case 'purchases':
        return wallet.transactions.filter(t => t.type === 'DEBIT')
      case 'credits':
        return wallet.transactions.filter(t => t.type === 'CREDIT')
      default:
        return wallet.transactions
    }
  }

  const getTotalSpent = () => {
    if (!wallet?.transactions) return 0
    return wallet.transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((total, t) => total + t.amount, 0)
  }

  const getTotalCredits = () => {
    if (!wallet?.transactions) return 0
    return wallet.transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((total, t) => total + t.amount, 0)
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const filteredTransactions = getFilteredTransactions()

  return (
    <div className="text-richblack-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5">
          Purchase History
        </h1>
        <p className="text-richblack-200 mt-2">
          View your course purchases and wallet transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
              <VscCreditCard className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-richblack-200 text-sm font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-pink-400">{formatAmount(getTotalSpent())}</p>
            </div>
          </div>
        </div>

        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-caribbeangreen-600 rounded-full flex items-center justify-center">
              <VscCreditCard className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-richblack-200 text-sm font-medium">Total Added</p>
              <p className="text-2xl font-bold text-caribbeangreen-400">{formatAmount(getTotalCredits())}</p>
            </div>
          </div>
        </div>

        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-25 rounded-full flex items-center justify-center">
              <VscHistory className="text-2xl text-richblack-900" />
            </div>
            <div>
              <p className="text-richblack-200 text-sm font-medium">Total Transactions</p>
              <p className="text-2xl font-bold text-yellow-25">{wallet?.transactions?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-yellow-25 text-richblack-900' 
                : 'text-richblack-200 hover:text-richblack-5'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setFilter('purchases')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'purchases' 
                ? 'bg-pink-600 text-white' 
                : 'text-richblack-200 hover:text-richblack-5'
            }`}
          >
            Course Purchases
          </button>
          <button
            onClick={() => setFilter('credits')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'credits' 
                ? 'bg-caribbeangreen-600 text-white' 
                : 'text-richblack-200 hover:text-richblack-5'
            }`}
          >
            Wallet Credits
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-richblack-800 rounded-lg border border-richblack-700">
        <div className="p-6 border-b border-richblack-700">
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <VscHistory className="text-6xl text-richblack-400 mx-auto mb-4" />
            <p className="text-richblack-200 text-lg mb-2">No transactions found</p>
            <p className="text-richblack-300">
              {filter === 'all' && 'You haven\'t made any transactions yet.'}
              {filter === 'purchases' && 'You haven\'t purchased any courses yet.'}
              {filter === 'credits' && 'You haven\'t added any money to your wallet yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-richblack-700">
            {filteredTransactions.map((transaction, index) => (
              <div key={index} className="p-6 hover:bg-richblack-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'CREDIT' ? 'bg-caribbeangreen-600' : 'bg-pink-600'
                    }`}>
                      {transaction.type === 'CREDIT' ? (
                        <VscCreditCard className="text-white text-xl" />
                      ) : (
                        <VscEye className="text-white text-xl" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-richblack-5 text-lg">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-richblack-300">
                        <div className="flex items-center gap-2">
                          <VscCalendar className="text-yellow-25" />
                          <span>{formatDate(transaction.timestamp)}</span>
                        </div>
                        {transaction.courseId && (
                          <div className="flex items-center gap-2">
                            <VscEye className="text-richblack-400" />
                            <span>Course ID: {transaction.courseId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-right`}>
                    <div className={`text-2xl font-bold ${
                      transaction.type === 'CREDIT' ? 'text-caribbeangreen-400' : 'text-pink-400'
                    }`}>
                      {transaction.type === 'CREDIT' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </div>
                    <div className={`text-sm font-medium ${
                      transaction.type === 'CREDIT' ? 'text-caribbeangreen-300' : 'text-pink-300'
                    }`}>
                      {transaction.type === 'CREDIT' ? 'Added' : 'Spent'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PurchaseHistory
