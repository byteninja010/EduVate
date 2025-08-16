import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { VscCreditCard, VscAdd, VscArrowDown, VscArrowUp } from 'react-icons/vsc'
import { getWallet, addMoney } from '../../../services/operations/walletAPI'
import ConfirmationModal from '../../Common/ConfirmationModal'

const Wallet = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [amount, setAmount] = useState('')
  const [addingMoney, setAddingMoney] = useState(false)

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

  const handleAddMoney = async (e) => {
    e.preventDefault()
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setAddingMoney(true)
    try {
      const response = await addMoney(parseInt(amount), token)
      if (response.success) {
        setAmount('')
        setShowAddMoney(false)
        fetchWallet() // Refresh wallet data
      }
    } catch (error) {
      console.error('Failed to add money:', error)
    } finally {
      setAddingMoney(false)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5">
          My Wallet
        </h1>
        <p className="text-richblack-200 mt-2">
          Manage your wallet balance and view transaction history
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-25 rounded-full flex items-center justify-center">
              <VscCreditCard className="text-3xl text-richblack-900" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-richblack-5">Wallet Balance</h2>
              <p className="text-3xl font-bold text-yellow-25">₹{wallet?.balance || 0}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddMoney(true)}
            className="flex items-center gap-2 bg-yellow-25 text-richblack-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
          >
            <VscAdd className="text-lg" />
            Add Money
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        
        {wallet?.transactions?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-richblack-200">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallet?.transactions?.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-richblack-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'CREDIT' ? 'bg-caribbeangreen-600' : 'bg-pink-600'
                  }`}>
                    {transaction.type === 'CREDIT' ? (
                      <VscArrowUp className="text-white" />
                    ) : (
                      <VscArrowDown className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-richblack-5">{transaction.description}</p>
                    <p className="text-sm text-richblack-200">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  transaction.type === 'CREDIT' ? 'text-caribbeangreen-400' : 'text-pink-400'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-richblack-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Money to Wallet</h3>
            <form onSubmit={handleAddMoney} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-richblack-200 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  required
                  className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMoney(false)}
                  className="px-4 py-2 text-richblack-200 hover:text-richblack-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingMoney}
                  className="px-4 py-2 bg-yellow-25 text-richblack-900 rounded-lg font-medium disabled:opacity-50"
                >
                  {addingMoney ? 'Adding...' : 'Add Money'}
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
