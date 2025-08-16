import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VscStarEmpty, VscStarFull, VscStarHalf, VscEdit, VscTrash, VscCalendar } from 'react-icons/vsc';
import { createRating, getCourseRatings, updateRating, deleteRating } from '../../../services/operations/ratingAPI';
import ConfirmationModal from '../../Common/ConfirmationModal';
import toast from 'react-hot-toast';

const CourseRatingReview = ({ courseId, courseName, showWriteReview = false }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  
  // Check if user has already rated this course
  const userRating = ratings.find(r => r.user && r.user._id === user?._id);
  const canRate = user && !userRating && user.accountType === 'Student' && showWriteReview;

  useEffect(() => {
    fetchRatings();
  }, [courseId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await getCourseRatings(courseId);
      if (response.success) {
        // Filter out ratings that don't have proper user data
        const validRatings = (response.data || []).filter(rating => 
          rating && rating.user && rating.user._id
        );
        setRatings(validRatings);
        console.log('Fetched ratings:', validRatings);
      } else {
        console.error('Failed to fetch ratings:', response.message);
        setRatings([]);
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    if (!rating || !review.trim()) {
      toast.error('Please provide both rating and review');
      return;
    }

    try {
      const ratingData = {
        rating: parseInt(rating),
        review: review.trim(),
        courseId
      };

      if (editingRating) {
        // Update existing rating
        console.log("Updating rating:", ratingData);
        const response = await updateRating(editingRating._id, ratingData, token);
        console.log("Update response:", response);
        if (response.success) {
          // Ensure the updated rating has user data populated
          const updatedRating = response.data.data;
          if (updatedRating && updatedRating.user) {
            setRatings(prev => prev.map(r => 
              r._id === editingRating._id ? updatedRating : r
            ));
            setEditingRating(null);
            toast.success('Review updated successfully!');
          } else {
            // If user data is not populated, refresh the ratings
            console.log("User data not populated after update, refreshing ratings...");
            await fetchRatings();
            setEditingRating(null);
            toast.success('Review updated successfully!');
          }
        } else {
          console.error("Rating update failed:", response);
        }
      } else {
        // Create new rating
        console.log("Submitting rating:", ratingData);
        const response = await createRating(ratingData, token);
        console.log("Rating response:", response);
        if (response.success) {
          // Add the new rating to the beginning of the list
          // Ensure the rating has user data populated
          const newRating = response.data.data;
          if (newRating && newRating.user) {
            setRatings(prev => [newRating, ...prev]);
            toast.success('Review submitted successfully!');
          } else {
            // If user data is not populated, refresh the ratings
            console.log("User data not populated, refreshing ratings...");
            await fetchRatings();
            toast.success('Review submitted successfully!');
          }
        } else {
          console.error("Rating submission failed:", response);
        }
      }

      // Reset form
      setRating(5);
      setReview('');
      setShowRatingForm(false);
      
      // Always refresh ratings to ensure consistency
      await fetchRatings();
      
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const handleEditRating = (ratingData) => {
    setEditingRating(ratingData);
    setRating(ratingData.rating);
    setReview(ratingData.review);
    setShowRatingForm(true);
  };

  const handleDeleteRating = (ratingId) => {
    setConfirmationModal({
      txt1: "Delete Review",
      txt2: "Are you sure you want to delete your review? This action cannot be undone.",
      btn1Txt: "Delete",
      btn2Txt: "Cancel",
      btn1onClick: async () => {
        try {
          const response = await deleteRating(ratingId, token);
          if (response.success) {
            setRatings(prev => prev.filter(r => r._id !== ratingId));
            toast.success('Review deleted successfully!');
          }
        } catch (error) {
          console.error('Failed to delete rating:', error);
        }
        setConfirmationModal(null);
      },
      btn2onClick: () => setConfirmationModal(null),
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive ? () => onStarClick(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <VscStarFull className="text-yellow-25 text-xl" />
            ) : (
              <VscStarEmpty className="text-richblack-400 text-xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }

  try {
    return (
      <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-richblack-5">Student Reviews</h3>
        {canRate && (
          <button
            onClick={() => setShowRatingForm(true)}
            className="yellowButton"
          >
            Write a Review
          </button>
        )}

      </div>

      {/* Rating Form */}
      {showRatingForm && (
        <div className="bg-richblack-700 rounded-lg p-6 mb-6 border border-richblack-600">
          <h4 className="text-lg font-semibold text-richblack-5 mb-4">
            {editingRating ? 'Edit Your Review' : 'Write a Review'}
          </h4>
          
          <form onSubmit={handleSubmitRating} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium text-richblack-200 mb-2">
                Your Rating
              </label>
              {renderStars(rating, true, setRating)}
              <p className="text-sm text-richblack-400 mt-1">
                {rating} out of 5 stars
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-richblack-200 mb-2">
                Your Review
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 bg-richblack-600 border border-richblack-500 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent"
                placeholder="Share your experience with this course..."
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="yellowButton"
              >
                {editingRating ? 'Update Review' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRatingForm(false);
                  setEditingRating(null);
                  setRating(5);
                  setReview('');
                }}
                className="blackButton"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⭐</div>
            <h4 className="text-xl font-semibold text-richblack-300 mb-2">No reviews yet</h4>
            <p className="text-richblack-400">Be the first to share your experience!</p>
          </div>
        ) : (
          ratings.map((ratingData) => (
            <div
              key={ratingData._id}
              className="bg-richblack-700 rounded-lg p-4 border border-richblack-600"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={ratingData.user?.image || 'https://via.placeholder.com/40x40'}
                    alt={ratingData.user?.firstName || 'User'}
                    className="w-10 h-10 rounded-full object-cover border border-richblack-500"
                  />
                  <div>
                    <h5 className="font-semibold text-richblack-5">
                      {ratingData.user?.firstName || 'Unknown'} {ratingData.user?.lastName || 'User'}
                    </h5>
                    <div className="flex items-center gap-2 text-sm text-richblack-400">
                      <VscCalendar className="text-xs" />
                      {formatDate(ratingData.createdAt)}
                    </div>
                  </div>
                </div>

                {/* User Actions */}
                {user && ratingData.user && ratingData.user._id === user._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRating(ratingData)}
                      className="p-2 text-richblack-400 hover:text-yellow-25 transition-colors"
                      title="Edit review"
                    >
                      <VscEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteRating(ratingData._id)}
                      className="p-2 text-richblack-400 hover:text-pink-400 transition-colors"
                      title="Delete review"
                    >
                      <VscTrash className="text-lg" />
                    </button>
                  </div>
                )}
              </div>

              {/* Rating Stars */}
              <div className="mb-3">
                {renderStars(ratingData.rating)}
              </div>

              {/* Review Text */}
              <p className="text-richblack-200 leading-relaxed">
                {ratingData.review}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
    );
  } catch (error) {
    console.error('Error rendering CourseRatingReview:', error);
    return (
      <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h4 className="text-xl font-semibold text-richblack-300 mb-2">Something went wrong</h4>
          <p className="text-richblack-400 mb-4">There was an error loading the reviews.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="yellowButton"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default CourseRatingReview;
