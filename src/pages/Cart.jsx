import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeItem, clearCart } from '../slices/cartSlice';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaWallet } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { purchaseCourse } from '../services/operations/walletAPI';
import ConfirmationModal from '../Components/Common/ConfirmationModal';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [buyingAll, setBuyingAll] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleRemoveItem = (courseId, courseName) => {
    setConfirmationModal({
      txt1: "Remove from Cart",
      txt2: `Are you sure you want to remove "${courseName}" from your cart?`,
      btn1Txt: "Remove",
      btn2Txt: "Cancel",
      btn1onClick: () => {
        dispatch(removeItem(courseId));
        toast.success('Course removed from cart');
        setConfirmationModal(null);
      },
      btn2onClick: () => setConfirmationModal(null),
    });
  };

  const handleClearCart = () => {
    setConfirmationModal({
      txt1: "Clear Cart",
      txt2: `Are you sure you want to remove all ${items.length} course(s) from your cart? This action cannot be undone.`,
      btn1Txt: "Clear Cart",
      btn2Txt: "Cancel",
      btn1onClick: () => {
        dispatch(clearCart());
        toast.success('Cart cleared');
        setConfirmationModal(null);
      },
      btn2onClick: () => setConfirmationModal(null),
    });
  };

  const handleCheckout = () => {
    if (!token) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (user?.accountType === 'Instructor') {
      toast.error('Instructors cannot purchase courses');
      return;
    }

    // Show checkout confirmation modal
    setConfirmationModal({
      txt1: "Confirm Checkout",
      txt2: `Are you sure you want to purchase ${items.length} course(s) for ₹${calculateTotal()}? This will be deducted from your wallet.`,
      btn1Txt: "Confirm Purchase",
      btn2Txt: "Cancel",
      btn1onClick: async () => {
        setConfirmationModal(null);
        await handleBuyAll(); // Reuse the buy all logic
      },
      btn2onClick: () => setConfirmationModal(null),
    });
  };

  const handleBuyAll = async () => {
    if (!token) {
      toast.error('Please login to purchase courses');
      navigate('/login');
      return;
    }

    if (user?.accountType === 'Instructor') {
      toast.error('Instructors cannot purchase courses');
      return;
    }

    setBuyingAll(true);
    try {
      // Purchase all courses one by one
      for (const course of items) {
        await purchaseCourse(course._id, token);
      }
      
      toast.success('All courses purchased successfully!');
      dispatch(clearCart()); // Clear cart after successful purchase
      navigate('/dashboard/student'); // Redirect to student dashboard
    } catch (error) {
      console.error('Failed to purchase courses:', error);
      toast.error('Some courses failed to purchase. Please try again.');
    } finally {
      setBuyingAll(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price || 0), 0);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-richblack-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-richblack-5 mb-2">Your cart is empty</h1>
          <p className="text-richblack-400 mb-6">Add some courses to get started!</p>
          <button
            onClick={() => navigate('/catalog/Development')}
            className="bg-yellow-25 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-all duration-200"
          >
            Explore Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-richblack-400 hover:text-richblack-200 transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-3xl font-bold text-richblack-5">Shopping Cart</h1>
            <span className="text-richblack-400">({items.length} items)</span>
          </div>
          <button
            onClick={handleClearCart}
            className="text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2"
          >
            <FaTrash />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((course) => (
                <div
                  key={course._id}
                  className="bg-richblack-800 rounded-lg p-6 border border-richblack-700 hover:border-richblack-600 transition-all duration-200"
                >
                  <div className="flex gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-richblack-5 mb-2">
                        {course.courseName}
                      </h3>
                      <p className="text-richblack-400 text-sm mb-2 line-clamp-2">
                        {course.courseDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-yellow-25">
                          ₹{course.price}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(course._id, course.courseName)}
                          className="text-pink-400 hover:text-pink-300 transition-colors p-2 hover:bg-richblack-700 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700 sticky top-8">
              <h2 className="text-xl font-semibold text-richblack-5 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-richblack-300">
                  <span>Subtotal ({items.length} courses)</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-richblack-300">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-richblack-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-richblack-5">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-25 text-richblack-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-50 transition-all duration-200 mb-4"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-richblack-400 text-center">
                Secure checkout powered by your wallet system
              </p>
            </div>
          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default Cart;
